'use client'

import { useEffect, useRef } from 'react'
import { useMusic } from '@/context/MusicContext'
import { Renderer, TabStave, TabNote, Voice, Formatter, Beam } from 'vexflow'
import { computeMeasureWidths } from '@/tools/computeMeasureWidths'

function parseTimeSignature(ts?: string) {
  const [beats, value] = ts?.split('/')?.map(Number) ?? []
  return { numBeats: beats || 4, beatValue: value || 4 }
}

export default function TabRenderer() {
  const { measures, tuning } = useMusic()   // ✅ bring tuning in
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    containerRef.current.innerHTML = ''

    const rendererWidth = 800
    const marginLeft = 10
    const marginTop = 20
    const lineHeight = 120
    const tabBaseHeight = 200

    const widths = computeMeasureWidths(measures)
    const renderer = new Renderer(containerRef.current, Renderer.Backends.SVG)
    renderer.resize(rendererWidth, Math.max(tabBaseHeight, lineHeight * measures.length))
    const context = renderer.getContext()

    let x = marginLeft
    let y = marginTop
    let lastTime: string | undefined
    let lastKey: string | undefined

    measures.forEach((measure, idx) => {
      const { numBeats, beatValue } = parseTimeSignature(measure.timeSignature)

      // ✅ use tuning-aware string numbers
      const tickables = measure.notes.map(n => {
        const stringNum = n.string ?? 1
        const fretNum = n.fret ?? 0
        return new TabNote({
          positions: [{ str: stringNum, fret: fretNum }],
          duration: n.duration || 'q',
        })
      })

      const staveWidth = widths[idx]
      if (x + staveWidth > rendererWidth) {
        x = marginLeft
        y += lineHeight
      }

      const stave = new TabStave(x, y, staveWidth)
      stave.addClef('tab')

      if (measure.timeSignature && measure.timeSignature !== lastTime) {
        stave.addTimeSignature(measure.timeSignature)
        lastTime = measure.timeSignature
      }
      if (measure.keySignature && measure.keySignature !== lastKey) {
        stave.addKeySignature(measure.keySignature)
        lastKey = measure.keySignature
      }
      stave.setEndBarType(idx === measures.length - 1 ? 2 : 1)
      stave.setContext(context).draw()

      if (tickables.length > 0) {
        const voice = new Voice({ numBeats, beatValue }).setStrict(false)
        voice.addTickables(tickables)

        const formatter = new Formatter()
        formatter.joinVoices([voice])
        formatter.format([voice], staveWidth - 40)

        voice.draw(context, stave)
        Beam.generateBeams(tickables).forEach(b => b.setContext(context).draw())
      }

      x += staveWidth
    })
  }, [measures, tuning])   // ✅ re-render if tuning changes

  return <div ref={containerRef}></div>
}
