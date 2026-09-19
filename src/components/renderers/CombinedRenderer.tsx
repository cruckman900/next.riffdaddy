'use client'

import { useEffect, useRef } from 'react'
import { useMusic } from '@/context/MusicContext'
import {
    Renderer,
    TabStave,
    Stave,
    Voice,
    Formatter,
    Beam,
    StaveConnector,
    Barline,
} from 'vexflow'
import { computeMeasureLayoutWidths, buildTabTickables, buildStaffTickables, highlightNoteElement, parseTimeSignature, MEASURE_PADDING } from '@/tools/notation'
import { getOrderedMeasureItems } from '@/tools/duration'
import { MusicNote } from '@/types/music'
import Box from '@mui/material/Box'

interface CombinedRendererProps {
    activeMeasureId?: string | null
}

export default function CombinedRenderer({ activeMeasureId }: CombinedRendererProps) {
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
        const staffOffset = 150
        const linePadding = 40

        const widths = computeMeasureLayoutWidths(measures, 'combined')

        // Estimate number of systems and height
        const numSystems = Math.ceil(measures.length / (measuresPerRow || measures.length))
        const estimatedSystemHeight = staffOffset * 2
        const rendererHeight = marginTop + numSystems * (estimatedSystemHeight + linePadding)

        const renderer = new Renderer(containerRef.current, Renderer.Backends.SVG)
        renderer.resize(rendererWidth, rendererHeight)
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
            // Justify every row except the last to fill the available width —
            // like text justification, this keeps rows visually consistent
            // regardless of whether a row was cut short by the measuresPerRow
            // cap or simply ran out of room for another measure.
            const scale = isLastRow ? 1 : rendererWidth / rowTotal
            let x = marginLeft

            const tabStaves: TabStave[] = []
            const staffStaves: Stave[] = []

            rowMeasures.forEach((measure, idx) => {
                const scaledWidth = rowWidths[idx] * scale - MEASURE_PADDING
                const { numBeats, beatValue } = parseTimeSignature(measure.timeSignature)

                const tabStave = new TabStave(x, y, scaledWidth)
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
                    new Formatter().joinVoices([voice]).format([voice], scaledWidth - 50)

                    const beforeCount = containerRef.current?.querySelectorAll('.vf-tabnote').length ?? 0
                    voice.draw(context, tabStave)
                    Beam.generateBeams(tabTickables).forEach(b => b.setContext(context).draw())

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

                // Staff notes
                const staffTickables = buildStaffTickables(measure)
                if (staffTickables.length > 0) {
                    const voice = new Voice({ numBeats, beatValue }).setStrict(false)
                    voice.addTickables(staffTickables)
                    new Formatter().joinVoices([voice]).format([voice], scaledWidth - 50)

                    const beforeCount = containerRef.current?.querySelectorAll('.vf-stavenote').length ?? 0
                    voice.draw(context, staffStave)
                    Beam.generateBeams(staffTickables).forEach(b => b.setContext(context).draw())

                    const newNoteEls = Array.from(containerRef.current?.querySelectorAll('.vf-stavenote') ?? []).slice(beforeCount)
                    const orderedItems = getOrderedMeasureItems(measure)
                    newNoteEls.forEach((el, i) => {
                        const entry = orderedItems[i]
                        if (!entry || entry.type !== 'note') return
                        const note = entry.item as MusicNote
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
                lastClef = measure.clef || lastClef
                lastTime = measure.timeSignature || lastTime
                lastKey = measure.keySignature || lastKey
            })

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

            // Advance y by actual system height
            const tabBB = tabStaves[0].getBoundingBox()
            const staffBB = staffStaves[0].getBoundingBox()
            const systemHeight = (staffBB.getY() + staffBB.getH()) - tabBB.getY()
            y += systemHeight + linePadding

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
    }, [measures, activeMeasureId, measuresPerRow, scoreFixedWidth, selectedNoteRefs, toggleNoteSelection])

    return (
        <Box sx={{ width: '100%', overflowX: 'auto', padding: 2 }}>
            <div style={{ backgroundColor: '#ffffff' }} ref={containerRef}></div>
        </Box>
    )
}
