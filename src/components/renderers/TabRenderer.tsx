'use client'

import { useEffect, useRef } from 'react'
import { useMusic } from '@/context/MusicContext'
import { Renderer, TabStave, Voice, Formatter, Barline } from 'vexflow'
import { computeMeasureLayoutWidths, buildTabTickables, buildTabNoteIndex, buildBeamsFromGroups, buildTiesFromGroups, addToRowNoteLookup, highlightNoteElement, parseTimeSignature, MEASURE_PADDING } from '@/tools/notation'
import Box from '@mui/material/Box'
import type { TabNote } from 'vexflow'

interface CombinedRendererProps {
  activeMeasureId?: string | null
}

export default function TabRenderer({ activeMeasureId }: CombinedRendererProps) {
  const { measures, measuresPerRow, scoreFixedWidth, noteSpacing, selectedNoteRefs, toggleNoteSelection, tuning, tieGroups } = useMusic()
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
    // Height budget for a single row's own small SVG — matches the vertical
    // band each row used to occupy inside one shared canvas (rows advanced
    // by `lineHeight` there), just now as an actual per-row element instead
    // of a slice of one big canvas.
    const rowHeight = 200

    const widths = computeMeasureLayoutWidths(measures, 'tab', noteSpacing)

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

      // Each row gets its own wrapper + VexFlow Renderer/SVG (rather than
      // sharing one canvas across the whole score) so `break-inside: avoid`
      // (see .score-print-row in globals.css) can actually keep a printed
      // page from splitting a stave in half — a single monolithic SVG has
      // no DOM boundary a browser's print pagination could respect.
      const rowEl = document.createElement('div')
      rowEl.className = 'score-print-row'
      containerRef.current!.appendChild(rowEl)
      const renderer = new Renderer(rowEl, Renderer.Backends.SVG)
      renderer.resize(rendererWidth, rowHeight)
      const context = renderer.getContext()

      // Populated as each measure below is built, then used once after the
      // whole row is drawn to resolve tie endpoints — a tie can cross a
      // barline into the next measure, which might still be in this same
      // row (see buildTiesFromGroups in notation.ts).
      const rowNoteLookup = new Map<string, TabNote>()

      rowMeasures.forEach((measure, idx) => {
        const scaledWidth = rowWidths[idx] * scale - MEASURE_PADDING
        const { numBeats, beatValue } = parseTimeSignature(measure.timeSignature)

        // Line count must follow the current tuning's string count (bass = 4,
        // guitar = 6, etc.) — without this, TabStave always defaults to 6
        // lines regardless of the selected instrument/tuning.
        const stave = new TabStave(x, y, scaledWidth, { numLines: tuning.length })

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
          // formatToStave (rather than a hand-picked `scaledWidth - N` fudge
          // factor) asks the stave itself how much space its clef/time/key
          // signature actually consumed (stave.getNoteStartX()) and lays
          // notes out in whatever's left — a fixed fudge factor was tuned
          // for a bare treble/tab clef + 4/4 + no accidentals, and silently
          // let notes overflow past the barline for anything busier (a key
          // signature with several sharps/flats, etc).
          new Formatter().joinVoices([voice]).formatToStave([voice], stave)

          // Beams must be constructed BEFORE voice.draw() — StaveNote/TabNote
          // decide whether to render their own flag glyph by checking
          // `this.beam` at the exact moment draw() runs (not at some later
          // reconciliation step), and the Beam constructor is what sets that
          // flag via note.setBeam(). Building beams after voice.draw() (the
          // previous order here) meant every flagged note had already drawn
          // its own flag by the time a beam tried to suppress it — hence
          // flags visibly sticking around on beamed notes.
          const beams = buildBeamsFromGroups(measure, tickables, buildTabNoteIndex(measure))

          const beforeCount = rowEl.querySelectorAll('.vf-tabnote').length
          voice.draw(context, stave)
          beams.forEach(b => b.setContext(context).draw())
          addToRowNoteLookup(rowNoteLookup, measure, tickables, buildTabNoteIndex(measure))

          // Make each note clickable so it can be selected for the notation
          // toolbar (accents, ornaments, dotted notes, techniques), and
          // highlight it if already selected. We match rendered SVG note
          // groups to MusicNote objects by draw order, since
          // tickable.getSVGElement() isn't reliably populated for every
          // VexFlow element type.
          const newNoteEls = Array.from(rowEl.querySelectorAll('.vf-tabnote')).slice(beforeCount)
          newNoteEls.forEach((el, i) => {
            const note = measure.notes[i]
            if (!note) return
            const svgEl = el as unknown as SVGGraphicsElement & HTMLElement
            svgEl.style.cursor = 'pointer'
            // VexFlow's SVG root always sets pointer-events="none" (it's not
            // meant to be interactive out of the box), which is inherited by
            // every child including this note — without overriding it here,
            // real mouse clicks pass straight through to whatever's behind
            // the SVG (the row's wrapper div) instead of ever reaching this
            // element, even though its own click listener is attached fine.
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
      })

      // Drawn once per row (not per measure) so a tie chain can resolve an
      // endpoint sitting in whichever measure comes right after it, as long
      // as both ended up on this same printed row — see buildTiesFromGroups.
      const ties = buildTiesFromGroups(tieGroups, rowNoteLookup, 'tab')
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

      // Optional: break row when hitting measuresPerRow
      if (measuresPerRow && rowMeasures.length === measuresPerRow) {
        flushRow(false)
      }
    })

    flushRow(true)
  }, [measures, activeMeasureId, measuresPerRow, scoreFixedWidth, noteSpacing, selectedNoteRefs, toggleNoteSelection, tuning, tieGroups])

  return (
    <Box sx={{ width: '100%', overflowX: 'auto', padding: 2 }}>
      <div style={{ backgroundColor: '#ffffff' }} ref={containerRef}></div>
    </Box>
  )
}
