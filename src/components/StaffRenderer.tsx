'use client'

import { useEffect, useRef } from 'react'
import { useMusic } from '@/context/MusicContext'
import { Renderer, Stave, StaveNote, Voice, Formatter, Beam, Barline } from 'vexflow'
import { computeMeasureWidths, MEASURE_PADDING } from '@/tools/computeMeasureWidths'

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
    const staffBaseHeight = 180

    const widths = computeMeasureWidths(measures)
    const renderer = new Renderer(containerRef.current, Renderer.Backends.SVG)
    renderer.resize(rendererWidth, Math.max(staffBaseHeight, lineHeight * measures.length))
    const context = renderer.getContext()

    let y = marginTop
    let rowMeasures: typeof measures = []
    let rowWidths: number[] = []

    let lastClef: string | undefined
    let lastTime: string | undefined
    let lastKey: string | undefined

    const flushRow = (isLastRow: boolean) => {
      if (!rowMeasures.length) return
      const rowTotal = rowWidths.reduce((a, b) => a + b, 0)
      const scale = rendererWidth / rowTotal
      let x = marginLeft

      rowMeasures.forEach((measure, idx) => {
        const scaledWidth = rowWidths[idx] * scale - MEASURE_PADDING
        const { numBeats, beatValue } = parseTimeSignature(measure.timeSignature)

        // ✅ Build tickables with chord support
        const tickables = [
          ...measure.notes.map(n =>
            new StaveNote({
              keys: Array.isArray(n.pitch)
                ? n.pitch.map(formatPitch)
                : [formatPitch(n.pitch)],
              duration: n.duration || 'q'
            })
          ),
          ...measure.rests.map(r =>
            new StaveNote({ keys: ['b/4'], duration: (r.duration || 'q') + 'r' })
          ),
        ]

        const stave = new Stave(x, y, scaledWidth)

        // ✅ Deduplication logic
        if (measure.clef && measure.clef !== lastClef) {
          stave.addClef(measure.clef)
        }
        if (measure.timeSignature && measure.timeSignature !== lastTime) {
          stave.addTimeSignature(measure.timeSignature)
        }
        if (measure.keySignature && measure.keySignature !== lastKey) {
          stave.addKeySignature(measure.keySignature)
        }

        // ✅ End barline logic
        if (isLastRow && idx === rowMeasures.length - 1) {
          stave.setEndBarType(Barline.type.DOUBLE)   // double barline at end of piece
        } else if (idx === rowMeasures.length - 1) {
          stave.setEndBarType(Barline.type.SINGLE)   // normal system end
        } else {
          stave.setEndBarType(Barline.type.NONE)     // internal measures
        }

        stave.setContext(context).draw()

        if (tickables.length > 0) {
          const voice = new Voice({ numBeats, beatValue }).setStrict(false)
          voice.addTickables(tickables)
          new Formatter().joinVoices([voice]).format([voice], scaledWidth - 40)
          voice.draw(context, stave)
          Beam.generateBeams(tickables).forEach(b => b.setContext(context).draw())
        }

        x += scaledWidth

        // ✅ Update trackers
        lastClef = measure.clef || lastClef
        lastTime = measure.timeSignature || lastTime
        lastKey = measure.keySignature || lastKey
      })
      y += lineHeight
      rowMeasures = []
      rowWidths = []
    }

    measures.forEach((measure, idx) => {
      const width = widths[idx]
      const currentRowTotal = rowWidths.reduce((a, b) => a + b, 0)
      if (currentRowTotal + width > rendererWidth) {
        flushRow(false)
      }
      rowMeasures.push(measure)
      rowWidths.push(width)
    })

    flushRow(true)
  }, [measures])

  return <div ref={containerRef}></div>
}
