'use client'

import { useEffect, useRef } from 'react'
import { useMusic } from '@/context/MusicContext'
import { Renderer, Stave, Voice, Formatter, Barline } from 'vexflow'
import { computeMeasureLayoutWidths, buildStaffTickables, buildStaffNoteIndex, buildBeamsFromGroups, buildTiesFromGroups, addToRowNoteLookup, highlightNoteElement, parseTimeSignature, MEASURE_PADDING } from '@/tools/notation'
import { getOrderedMeasureItems } from '@/tools/duration'
import { MusicNote } from '@/types/music'
import Box from '@mui/material/Box'
import type { StaveNote } from 'vexflow'

interface CombinedRendererProps {
  activeMeasureId?: string | null
}

export default function StaffRenderer({ activeMeasureId }: CombinedRendererProps) {
  const { measures, measuresPerRow, scoreFixedWidth, noteSpacing, selectedNoteRefs, toggleNoteSelection, tieGroups } = useMusic()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    containerRef.current.innerHTML = ''

    const isNoteSelected = (measureId: string, noteId: string) =>
      selectedNoteRefs.some(r => r.measureId === measureId && r.noteId === noteId)

    const rendererWidth = scoreFixedWidth ? 800 : (containerRef.current?.clientWidth || window.innerWidth)
    const marginLeft = 10
    const marginTop = 20
    // Height budget for a single row's own small SVG — see the matching
    // comment in TabRenderer.tsx for why each row now gets its own
    // Renderer/SVG instead of sharing one canvas for the whole score.
    const rowHeight = 180

    const widths = computeMeasureLayoutWidths(measures, 'staff', noteSpacing)

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
      const y = marginTop

      // Each row gets its own wrapper + VexFlow Renderer/SVG — see the
      // matching comment in TabRenderer.tsx for why (lets print CSS keep a
      // whole stave on one page via .score-print-row's break-inside: avoid).
      const rowEl = document.createElement('div')
      rowEl.className = 'score-print-row'
      containerRef.current!.appendChild(rowEl)
      const renderer = new Renderer(rowEl, Renderer.Backends.SVG)
      renderer.resize(rendererWidth, rowHeight)
      const context = renderer.getContext()

      // See the matching comment in TabRenderer.tsx — populated per measure,
      // used once after the whole row is drawn to resolve tie endpoints that
      // may cross into the next measure.
      const rowNoteLookup = new Map<string, StaveNote>()

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
        const tickables = buildStaffTickables(measure)

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
          // formatToStave asks the stave itself how much space its clef/
          // time/key signature actually consumed (getNoteStartX()) instead
          // of a hand-picked fudge factor — see the matching comment in
          // TabRenderer.tsx for why a fixed number silently overflowed
          // notes past the barline for busier signatures.
          new Formatter().joinVoices([voice]).formatToStave([voice], stave)

          // Beams must be constructed BEFORE voice.draw() — see the matching
          // comment in TabRenderer.tsx for why (flag-suppression is decided
          // inside each note's draw() by checking `this.beam`, which the
          // Beam constructor sets synchronously via note.setBeam()).
          const beams = buildBeamsFromGroups(measure, tickables, buildStaffNoteIndex(measure))

          const beforeCount = rowEl.querySelectorAll('.vf-stavenote').length
          voice.draw(context, stave)
          beams.forEach(b => b.setContext(context).draw())
          addToRowNoteLookup(rowNoteLookup, measure, tickables, buildStaffNoteIndex(measure))

          // Make each note clickable so it can be selected for the notation
          // toolbar (accents, ornaments, dotted notes, techniques), and
          // highlight it if already selected. We match rendered SVG note
          // groups to MusicNote objects by draw order (the same
          // chronological note+rest order buildStaffTickables used — see
          // getOrderedMeasureItems), since tickable.getSVGElement() isn't
          // reliably populated for every VexFlow element type.
          const orderedItems = getOrderedMeasureItems(measure)
          const newNoteEls = Array.from(rowEl.querySelectorAll('.vf-stavenote')).slice(beforeCount)
          newNoteEls.forEach((el, i) => {
            const entry = orderedItems[i]
            if (!entry || entry.type !== 'note') return
            const note = entry.item as MusicNote
            const svgEl = el as unknown as SVGGraphicsElement & HTMLElement
            svgEl.style.cursor = 'pointer'
            // See the matching comment in TabRenderer.tsx — VexFlow's SVG
            // root disables pointer-events by default, which every child
            // (including this note) inherits unless overridden.
            svgEl.style.pointerEvents = 'auto'
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

        // ✅ Update trackers
        lastClef = measure.clef || lastClef
        lastTime = measure.timeSignature || lastTime
        lastKey = measure.keySignature || lastKey
      })

      // See the matching comment in TabRenderer.tsx — drawn once per row.
      const ties = buildTiesFromGroups(tieGroups, rowNoteLookup, 'staff')
      ties.forEach(t => t.setContext(context).draw())

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

      // break row when we hit the measuresPerRow cap
      if (measuresPerRow && rowMeasures.length === measuresPerRow) {
        flushRow(false)
      }
    })

    flushRow(true)
  }, [measures, activeMeasureId, measuresPerRow, scoreFixedWidth, noteSpacing, selectedNoteRefs, toggleNoteSelection, tieGroups])

  return (
    <Box sx={{ width: '100%', overflowX: 'auto', padding: 2 }}>
      <div style={{ backgroundColor: '#ffffff' }} ref={containerRef}></div>
    </Box>
  )
}
