'use client'

import { useEffect, useRef } from 'react'
import { useMusic } from '@/context/MusicContext'
import {
    Renderer,
    TabStave,
    Stave,
    Voice,
    Formatter,
    StaveConnector,
    Barline,
} from 'vexflow'
import { computeMeasureLayoutWidths, buildTabTickables, buildStaffTickables, buildTabNoteIndex, buildStaffNoteIndex, buildBeamsFromGroups, buildTiesFromGroups, addToRowNoteLookup, highlightNoteElement, parseTimeSignature, MEASURE_PADDING } from '@/tools/notation'
import { getOrderedMeasureItems } from '@/tools/duration'
import { MusicNote } from '@/types/music'
import Box from '@mui/material/Box'
import type { TabNote, StaveNote } from 'vexflow'

interface CombinedRendererProps {
    activeMeasureId?: string | null
}

export default function CombinedRenderer({ activeMeasureId }: CombinedRendererProps) {
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
        const staffOffset = 150
        // Height budget for a single row's own small SVG (tab stave + staff
        // stave stacked, plus breathing room) — see the matching comment in
        // TabRenderer.tsx for why each row now gets its own Renderer/SVG
        // instead of sharing one canvas for the whole score.
        const rowHeight = staffOffset * 2 + 60

        const widths = computeMeasureLayoutWidths(measures, 'combined', noteSpacing)

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
            // Justify every row except the last to fill the available width —
            // like text justification, this keeps rows visually consistent
            // regardless of whether a row was cut short by the measuresPerRow
            // cap or simply ran out of room for another measure.
            const scale = isLastRow ? 1 : rendererWidth / rowTotal
            let x = marginLeft
            const y = marginTop

            // Each row gets its own wrapper + VexFlow Renderer/SVG — see the
            // matching comment in TabRenderer.tsx for why (lets print CSS
            // keep a whole tab+staff system on one page via
            // .score-print-row's break-inside: avoid).
            const rowEl = document.createElement('div')
            rowEl.className = 'score-print-row'
            containerRef.current!.appendChild(rowEl)
            const renderer = new Renderer(rowEl, Renderer.Backends.SVG)
            renderer.resize(rendererWidth, rowHeight)
            const context = renderer.getContext()

            const tabStaves: TabStave[] = []
            const staffStaves: Stave[] = []
            // See the matching comment in TabRenderer.tsx — one combined
            // lookup per clef, populated per measure, resolved once the
            // whole row is drawn so a tie can cross into the next measure.
            const tabNoteLookup = new Map<string, TabNote>()
            const staffNoteLookup = new Map<string, StaveNote>()

            rowMeasures.forEach((measure, idx) => {
                const scaledWidth = rowWidths[idx] * scale - MEASURE_PADDING
                const { numBeats, beatValue } = parseTimeSignature(measure.timeSignature)

                // Line count must follow the current tuning's string count —
                // without this, TabStave always defaults to 6 lines
                // regardless of the selected instrument/tuning.
                const tabStave = new TabStave(x, y, scaledWidth, { numLines: tuning.length })
                const staffStave = new Stave(x, y + staffOffset, scaledWidth)

                // Highlight active measure
                if (measure.id === activeMeasureId) {
                    const tabBB = tabStave.getBoundingBox()
                    const staffBB = staffStave.getBoundingBox()
                    const highlightX = Math.min(tabBB.getX(), staffBB.getX()) - 2
                    const highlightY = Math.min(tabBB.getY(), staffBB.getY()) - 2
                    const highlightW = Math.max(tabBB.getW(), staffBB.getW()) + 4
                    const highlightH =
                        Math.max(tabBB.getY() + tabBB.getH(), staffBB.getY() + staffBB.getH()) -
                        highlightY + 4

                    context.save()
                    context.setFillStyle('#e0f7fa')
                    context.fillRect(highlightX, highlightY, highlightW, highlightH)
                    context.restore()
                }

                // ✅ Deduplication logic
                if (idx === 0) {
                    // Always add clef/time/key at the start of the row
                    if (measure.clef) {
                        tabStave.addClef('tab')
                        staffStave.addClef(measure.clef)
                        lastClef = measure.clef
                    }
                    if (measure.timeSignature) {
                        tabStave.addTimeSignature(measure.timeSignature)
                        staffStave.addTimeSignature(measure.timeSignature)
                        lastTime = measure.timeSignature
                    }
                    if (measure.keySignature) {
                        tabStave.addKeySignature(measure.keySignature)
                        staffStave.addKeySignature(measure.keySignature)
                        lastKey = measure.keySignature
                    }
                } else {
                    // Only add if changed mid‑row
                    if (measure.clef && measure.clef !== lastClef) {
                        tabStave.addClef('tab')
                        staffStave.addClef(measure.clef)
                        lastClef = measure.clef
                    }
                    if (measure.timeSignature && measure.timeSignature !== lastTime) {
                        tabStave.addTimeSignature(measure.timeSignature)
                        staffStave.addTimeSignature(measure.timeSignature)
                        lastTime = measure.timeSignature
                    }
                    if (measure.keySignature && measure.keySignature !== lastKey) {
                        tabStave.addKeySignature(measure.keySignature)
                        staffStave.addKeySignature(measure.keySignature)
                        lastKey = measure.keySignature
                    }
                }

                // End barlines
                if (isLastRow && idx === rowMeasures.length - 1) {
                    tabStave.setEndBarType(Barline.type.DOUBLE)
                    staffStave.setEndBarType(Barline.type.DOUBLE)
                } else if (idx === rowMeasures.length - 1) {
                    tabStave.setEndBarType(Barline.type.SINGLE)
                    staffStave.setEndBarType(Barline.type.SINGLE)
                } else {
                    tabStave.setEndBarType(Barline.type.NONE)
                    staffStave.setEndBarType(Barline.type.NONE)
                }

                tabStave.setContext(context).draw()
                staffStave.setContext(context).draw()
                tabStaves.push(tabStave)
                staffStaves.push(staffStave)

                // Tab notes
                const tabTickables = buildTabTickables(measure)

                if (tabTickables.length > 0) {
                    const voice = new Voice({ numBeats, beatValue }).setStrict(false)
                    voice.addTickables(tabTickables)
                    // formatToStave asks the stave how much space its own
                    // clef/time/key actually consumed instead of a fudge
                    // factor — see the matching comment in TabRenderer.tsx.
                    new Formatter().joinVoices([voice]).formatToStave([voice], tabStave)

                    // Beams must be constructed BEFORE voice.draw() — see the
                    // matching comment in TabRenderer.tsx for why.
                    const tabBeams = buildBeamsFromGroups(measure, tabTickables, buildTabNoteIndex(measure))

                    const beforeCount = rowEl.querySelectorAll('.vf-tabnote').length
                    voice.draw(context, tabStave)
                    tabBeams.forEach(b => b.setContext(context).draw())
                    addToRowNoteLookup(tabNoteLookup, measure, tabTickables, buildTabNoteIndex(measure))

                    const newNoteEls = Array.from(rowEl.querySelectorAll('.vf-tabnote')).slice(beforeCount)
                    newNoteEls.forEach((el, i) => {
                        const note = measure.notes[i]
                        if (!note) return
                        const svgEl = el as unknown as SVGGraphicsElement & HTMLElement
                        svgEl.style.cursor = 'pointer'
                        // See the matching comment in TabRenderer.tsx —
                        // VexFlow's SVG root disables pointer-events by
                        // default, inherited by every child unless overridden.
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

                // Staff notes
                const staffTickables = buildStaffTickables(measure)
                if (staffTickables.length > 0) {
                    const voice = new Voice({ numBeats, beatValue }).setStrict(false)
                    voice.addTickables(staffTickables)
                    // formatToStave asks the stave how much space its own
                    // clef/time/key actually consumed instead of a fudge
                    // factor — see the matching comment in TabRenderer.tsx.
                    new Formatter().joinVoices([voice]).formatToStave([voice], staffStave)

                    // Beams must be constructed BEFORE voice.draw() — see the
                    // matching comment in TabRenderer.tsx for why.
                    const staffBeams = buildBeamsFromGroups(measure, staffTickables, buildStaffNoteIndex(measure))

                    const beforeCount = rowEl.querySelectorAll('.vf-stavenote').length
                    voice.draw(context, staffStave)
                    staffBeams.forEach(b => b.setContext(context).draw())
                    addToRowNoteLookup(staffNoteLookup, measure, staffTickables, buildStaffNoteIndex(measure))

                    const newNoteEls = Array.from(rowEl.querySelectorAll('.vf-stavenote')).slice(beforeCount)
                    const orderedItems = getOrderedMeasureItems(measure)
                    newNoteEls.forEach((el, i) => {
                        const entry = orderedItems[i]
                        if (!entry || entry.type !== 'note') return
                        const note = entry.item as MusicNote
                        const svgEl = el as unknown as SVGGraphicsElement & HTMLElement
                        svgEl.style.cursor = 'pointer'
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
                lastClef = measure.clef || lastClef
                lastTime = measure.timeSignature || lastTime
                lastKey = measure.keySignature || lastKey
            })

            // See the matching comment in TabRenderer.tsx — drawn once per
            // row, separately for each clef's own lookup.
            const tabTies = buildTiesFromGroups(tieGroups, tabNoteLookup, 'tab')
            tabTies.forEach(t => t.setContext(context).draw())
            const staffTies = buildTiesFromGroups(tieGroups, staffNoteLookup, 'staff')
            staffTies.forEach(t => t.setContext(context).draw())

            // Connectors
            if (tabStaves.length && staffStaves.length) {
                new StaveConnector(tabStaves[0], staffStaves[0])
                    .setType(StaveConnector.type.SINGLE)
                    .setContext(context)
                    .draw()
                new StaveConnector(tabStaves[0], staffStaves[0])
                    .setType(StaveConnector.type.BRACE)
                    .setContext(context)
                    .draw()
                new StaveConnector(
                    tabStaves[tabStaves.length - 1],
                    staffStaves[staffStaves.length - 1]
                )
                    .setType(StaveConnector.type.SINGLE_RIGHT)
                    .setContext(context)
                    .draw()
            }

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
