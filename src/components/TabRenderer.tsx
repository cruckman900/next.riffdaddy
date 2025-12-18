'use client'

import { useEffect, useRef } from 'react'
import { useMusic } from '@/context/MusicContext'
import { Renderer, TabStave, TabNote, Voice, Formatter, Beam, Barline } from 'vexflow'
import { computeMeasureWidths, MEASURE_PADDING } from '@/tools/computeMeasureWidths'
import Box from '@mui/material/Box'

function parseTimeSignature(ts?: string) {
  const [beats, value] = ts?.split('/')?.map(Number) ?? []
  return { numBeats: beats || 4, beatValue: value || 4 }
}

interface CombinedRendererProps {
  activeMeasureId?: string | null
}

export default function TabRenderer({ activeMeasureId }: CombinedRendererProps) {
  const { measures, measuresPerRow, scoreFixedWidth } = useMusic()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    containerRef.current.innerHTML = ''

    const rendererWidth = scoreFixedWidth
      ? 800
      : (containerRef.current?.clientWidth || window.innerWidth)

    const marginLeft = 10
    const marginTop = 20
    const lineHeight = 120
    const tabBaseHeight = 200

    const widths = computeMeasureWidths(measures)
    const renderer = new Renderer(containerRef.current, Renderer.Backends.SVG)
    renderer.resize(rendererWidth, Math.max(tabBaseHeight, lineHeight * measures.length))
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
      const scale = (rowMeasures.length === measuresPerRow || isLastRow)
        ? rendererWidth / rowTotal
        : 1
      let x = marginLeft

      rowMeasures.forEach((measure, idx) => {
        const scaledWidth = rowWidths[idx] * scale - MEASURE_PADDING
        const { numBeats, beatValue } = parseTimeSignature(measure.timeSignature)

        const stave = new TabStave(x, y, scaledWidth)

        // Highlight active measure using stave bounding box
        if (measure.id === activeMeasureId) {
          const bb = stave.getBoundingBox()
          context.save()
          context.setFillStyle('#e0f7fa')
          context.fillRect(bb.getX() - 2, bb.getY() - 2, bb.getW() + 4, bb.getH() + 4)
          context.restore()
        }

        // Deduplication logic
        if (measure.clef && measure.clef !== lastClef) {
          stave.addClef('tab')
        }
        if (measure.timeSignature && measure.timeSignature !== lastTime) {
          stave.addTimeSignature(measure.timeSignature)
        }
        if (measure.keySignature && measure.keySignature !== lastKey) {
          stave.addKeySignature(measure.keySignature)
        }

        // End barline logic
        if (isLastRow && idx === rowMeasures.length - 1) {
          stave.setEndBarType(Barline.type.DOUBLE)
        } else if (idx === rowMeasures.length - 1) {
          stave.setEndBarType(Barline.type.SINGLE)
        } else {
          stave.setEndBarType(Barline.type.NONE)
        }

        stave.setContext(context).draw()

        // Build tickables with chord support
        const tickables = measure.notes.map(n =>
          new TabNote({
            positions: Array.isArray(n.string)
              ? n.string.map((s, i) => {
                let fretValue: number | string = 0
                if (Array.isArray(n.fret)) {
                  fretValue = n.fret[i] ?? 0
                } else if (typeof n.fret === 'number' || typeof n.fret === 'string') {
                  fretValue = n.fret
                }
                return { str: s, fret: fretValue }
              })
              : [
                {
                  str: n.string ?? 1,
                  fret:
                    typeof n.fret === 'number' || typeof n.fret === 'string'
                      ? n.fret
                      : 0,
                },
              ],
            duration: n.duration || 'q',
          })
        )

        if (tickables.length > 0) {
          const voice = new Voice({ numBeats, beatValue }).setStrict(false)
          voice.addTickables(tickables)
          new Formatter().joinVoices([voice]).format([voice], scaledWidth - 40)
          voice.draw(context, stave)
          Beam.generateBeams(tickables).forEach(b => b.setContext(context).draw())
        }

        x += scaledWidth

        // Update trackers
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

      // Optional: break row when hitting measuresPerRow
      if (measuresPerRow && rowMeasures.length === measuresPerRow) {
        flushRow(false)
      }
    })

    flushRow(true)
  }, [measures, activeMeasureId, measuresPerRow, scoreFixedWidth])

  return (
    <Box sx={{ width: '100%', overflowX: 'auto', padding: 2 }}>
      <div style={{ backgroundColor: '#ffffff' }} ref={containerRef}></div>
    </Box>
  )
}
