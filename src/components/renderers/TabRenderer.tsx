'use client'

import { useEffect, useRef } from 'react'
import { useMusic } from '@/context/MusicContext'
import { Renderer, TabStave, Voice, Formatter, Beam, Barline } from 'vexflow'
import { computeMeasureLayoutWidths, buildTabTickables, highlightNoteElement, parseTimeSignature, MEASURE_PADDING } from '@/tools/notation'
import Box from '@mui/material/Box'

interface CombinedRendererProps {
  activeMeasureId?: string | null
}

export default function TabRenderer({ activeMeasureId }: CombinedRendererProps) {
  const { measures, measuresPerRow, scoreFixedWidth, selectedNoteRefs, toggleNoteSelection } = useMusic()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    containerRef.current.innerHTML = ''

    const isNoteSelected = (measureId: string, noteId: string) =>
      selectedNoteRefs.some(r => r.measureId === measureId && r.noteId === noteId)

    const rendererWidth = scoreFixedWidth
      ? 800
      : (containerRef.current?.clientWidth || window.innerWidth)

    const marginLeft = 10
    const marginTop = 20
    const lineHeight = 120
    const tabBaseHeight = 200

    const widths = computeMeasureLayoutWidths(measures, 'tab')
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

      // Determine row defaults from the first measure
      const rowClef = rowMeasures[0]?.clef
      const rowTime = rowMeasures[0]?.timeSignature
      const rowKey = rowMeasures[0]?.keySignature

      lastClef = rowClef
      lastTime = rowTime
      lastKey = rowKey

      const rowTotal = rowWidths.reduce((a, b) => a + b, 0)
      // Justify every row except the last to fill the available width — like
      // text justification, this keeps rows visually consistent regardless of
      // whether a row was cut short by the measuresPerRow cap or simply ran
      // out of room for another measure.
      const scale = isLastRow ? 1 : rendererWidth / rowTotal
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
        if (idx === 0) {
          // Always add clef/time/key at the start of the row
          if (measure.clef) {
            stave.addClef('tab')   // or use measure.clef if you want non-tab clefs
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
        const tickables = buildTabTickables(measure)

        if (tickables.length > 0) {
          const voice = new Voice({ numBeats, beatValue }).setStrict(false)
          voice.addTickables(tickables)
          new Formatter().joinVoices([voice]).format([voice], scaledWidth - 40)

          const beforeCount = containerRef.current?.querySelectorAll('.vf-tabnote').length ?? 0
          voice.draw(context, stave)
          Beam.generateBeams(tickables).forEach(b => b.setContext(context).draw())

          // Make each note clickable so it can be selected for the notation
          // toolbar (accents, ornaments, dotted notes, techniques), and
          // highlight it if already selected. We match rendered SVG note
          // groups to MusicNote objects by draw order, since
          // tickable.getSVGElement() isn't reliably populated for every
          // VexFlow element type.
          const newNoteEls = Array.from(containerRef.current?.querySelectorAll('.vf-tabnote') ?? []).slice(beforeCount)
          newNoteEls.forEach((el, i) => {
            const note = measure.notes[i]
            if (!note) return
            const svgEl = el as unknown as SVGGraphicsElement & HTMLElement
            svgEl.style.cursor = 'pointer'
            if (isNoteSelected(measure.id, note.id)) {
              highlightNoteElement(svgEl)
            }
            svgEl.addEventListener('click', (e) => {
              e.stopPropagation()
              toggleNoteSelection(measure.id, note.id)
            })
          })
        }

        x += scaledWidth
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
  }, [measures, activeMeasureId, measuresPerRow, scoreFixedWidth, selectedNoteRefs, toggleNoteSelection])

  return (
    <Box sx={{ width: '100%', overflowX: 'auto', padding: 2 }}>
      <div style={{ backgroundColor: '#ffffff' }} ref={containerRef}></div>
    </Box>
  )
}
