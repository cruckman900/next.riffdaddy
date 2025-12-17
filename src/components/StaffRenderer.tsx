'use client'

import { useEffect, useRef } from 'react'
import { useMusic } from '@/context/MusicContext'
import { Renderer, Stave, StaveNote, Voice, Formatter, Beam } from 'vexflow'
import { computeMeasureWidths } from '@/tools/computeMeasureWidths'

function formatPitch(pitch: string): string {
  const match = pitch?.match(/^([A-Ga-g])([#b]?)(\d)$/)
  return match ? `${match[1].toLowerCase()}${match[2]}/${match[3]}` : 'b/4'
}

function parseTimeSignature(ts?: string) {
  const [beats, value] = ts?.split('/')?.map(Number) ?? []
  return { numBeats: beats || 4, beatValue: value || 4 }
}

export default function StaffRenderer() {
  const { measures } = useMusic()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    containerRef.current.innerHTML = ''

    const rendererWidth = 800
    const marginLeft = 10
    const marginTop = 20
    const lineHeight = 150
    const staffBaseHeight = 180 // ensure full staff shows even if empty

    const widths = computeMeasureWidths(measures)
    const renderer = new Renderer(containerRef.current, Renderer.Backends.SVG)
    renderer.resize(rendererWidth, Math.max(staffBaseHeight, lineHeight * measures.length))
    const context = renderer.getContext()

    let x = marginLeft
    let y = marginTop
    let lastClef: string | undefined
    let lastTime: string | undefined
    let lastKey: string | undefined

    measures.forEach((measure, idx) => {
      console.log('Rendering measure:', measure)
      const { numBeats, beatValue } = parseTimeSignature(measure.timeSignature)
      const tickables = [
        ...measure.notes.map(n =>
          new StaveNote({ keys: [formatPitch(n.pitch)], duration: n.duration || 'q' })
        ),
        ...measure.rests.map(r =>
          new StaveNote({ keys: ['b/4'], duration: (r.duration || 'q') + 'r' })
        ),
      ]

      const staveWidth = widths[idx]
      if (x + staveWidth > rendererWidth) {
        x = marginLeft
        y += lineHeight
      }

      const stave = new Stave(x, y, staveWidth)
      if (measure.clef && measure.clef !== lastClef) {
        stave.addClef(measure.clef)
        lastClef = measure.clef
      }
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
  }, [measures])

  return <div ref={containerRef}></div>
}
