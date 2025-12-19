'use client'

import { useEffect, useRef } from 'react'
import { useMusic } from '@/context/MusicContext'
import { Renderer, Stave, StaveNote, Voice, Formatter, Beam, Barline } from 'vexflow'
import { computeMeasureWidths, MEASURE_PADDING } from '@/tools/computeMeasureWidths'
import Box from '@mui/material/Box'

function formatPitch(pitch: string): string {
  const match = pitch?.match(/^([A-Ga-g])([#b]?)(\d)$/)
  return match ? `${match[1].toLowerCase()}${match[2]}/${match[3]}` : 'b/4'
}

function parseTimeSignature(ts?: string) {
  const [beats, value] = ts?.split('/')?.map(Number) ?? []
  return { numBeats: beats || 4, beatValue: value || 4 }
}

interface CombinedRendererProps {
  activeMeasureId?: string | null
}

export default function StaffRenderer({ activeMeasureId }: CombinedRendererProps) {
  const { measures, measuresPerRow, scoreFixedWidth } = useMusic()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    containerRef.current.innerHTML = ''

    const rendererWidth = scoreFixedWidth ? 800 : (containerRef.current?.clientWidth || window.innerWidth)
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

      // Determine row defaults from the first measure
      const rowClef = rowMeasures[0]?.clef
      const rowTime = rowMeasures[0]?.timeSignature
      const rowKey = rowMeasures[0]?.keySignature

      lastClef = rowClef
      lastTime = rowTime
      lastKey = rowKey

      const rowTotal = rowWidths.reduce((a, b) => a + b, 0)
      const scale = (rowMeasures.length === measuresPerRow || isLastRow)
        ? rendererWidth / rowTotal
        : 1
      let x = marginLeft

      rowMeasures.forEach((measure, idx) => {
        const scaledWidth = rowWidths[idx] * scale - MEASURE_PADDING
        const { numBeats, beatValue } = parseTimeSignature(measure.timeSignature)

        const stave = new Stave(x, y, scaledWidth)

        // Highlight active measure
        if (measure.id === activeMeasureId) {
          const bb = stave.getBoundingBox()
          context.save()
          context.setFillStyle('#e0f7fa')
          context.fillRect(bb.getX() - 2, bb.getY() - 2, bb.getW() + 4, bb.getH() + 4)
          context.restore()
        }

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

        // ✅ Deduplication logic
        if (idx === 0) {
          // Always add clef/time/key at the start of the row
          if (measure.clef) {
            stave.addClef(measure.clef)   // or use measure.clef if you want non-tab clefs
            lastClef = measure.clef
          }
          if (measure.timeSignature) {
            stave.addTimeSignature(measure.timeSignature)
            lastTime = measure.timeSignature
          }
          if (measure.keySignature) {
            stave.addKeySignature(measure.keySignature)
            lastKey = measure.keySignature
          }
        } else {
          // Only add if changed mid‑row
          if (measure.clef && measure.clef !== lastClef) {
            stave.addClef('tab')
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

          // ✅ Beam all 8th/16th groups so flags disappear
          const beams = Beam.generateBeams(tickables, {
            beamRests: false,   // don’t beam rests
            maintainStemDirections: true,
          })
          beams.forEach(b => b.setContext(context).draw())
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

      // break row when we hit the slider count
      // if (rowMeasures.length === measuresPerRow) {
      //   flushRow(false)
      // }
    })

    flushRow(true)
  }, [measures, activeMeasureId, measuresPerRow, scoreFixedWidth])

  return (
    <Box sx={{ width: '100%', overflowX: 'auto', padding: 2 }}>
      <div style={{ backgroundColor: '#ffffff' }} ref={containerRef}></div>
    </Box>
  )
}
