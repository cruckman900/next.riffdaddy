'use client'

import { useEffect, useRef } from 'react'
import { useMusic } from '@/context/MusicContext'
import {
    Renderer,
    TabStave,
    Stave,
    TabNote,
    StaveNote,
    Voice,
    Formatter,
    Beam,
    StaveConnector,
    Barline,
} from 'vexflow'
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

export default function CombinedRenderer({ activeMeasureId }: CombinedRendererProps) {
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
        const staffOffset = 150
        const linePadding = 40

        const widths = computeMeasureWidths(measures)

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
            // Only scale when row is complete or last row
            const scale = (rowMeasures.length === measuresPerRow || isLastRow)
                ? rendererWidth / rowTotal
                : 1
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

                // Clefs, time, key signatures
                if (measure.clef && measure.clef !== lastClef) {
                    tabStave.addClef('tab')
                    staffStave.addClef(measure.clef)
                }
                if (measure.timeSignature && measure.timeSignature !== lastTime) {
                    tabStave.addTimeSignature(measure.timeSignature)
                    staffStave.addTimeSignature(measure.timeSignature)
                }
                if (measure.keySignature && measure.keySignature !== lastKey) {
                    tabStave.addKeySignature(measure.keySignature)
                    staffStave.addKeySignature(measure.keySignature)
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
                const tabTickables = measure.notes.map(n =>
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

                if (tabTickables.length > 0) {
                    const voice = new Voice({ numBeats, beatValue }).setStrict(false)
                    voice.addTickables(tabTickables)
                    new Formatter().joinVoices([voice]).format([voice], scaledWidth - 50)
                    voice.draw(context, tabStave)
                    Beam.generateBeams(tabTickables).forEach(b => b.setContext(context).draw())
                }

                // Staff notes
                const staffTickables = [
                    ...measure.notes.map(n =>
                        new StaveNote({
                            keys: Array.isArray(n.pitch)
                                ? n.pitch.map(formatPitch)
                                : [formatPitch(n.pitch)],
                            duration: n.duration || 'q',
                        })
                    ),
                    ...measure.rests.map(r =>
                        new StaveNote({ keys: ['b/4'], duration: (r.duration || 'q') + 'r' })
                    ),
                ]
                if (staffTickables.length > 0) {
                    const voice = new Voice({ numBeats, beatValue }).setStrict(false)
                    voice.addTickables(staffTickables)
                    new Formatter().joinVoices([voice]).format([voice], scaledWidth - 50)
                    voice.draw(context, staffStave)
                    Beam.generateBeams(staffTickables).forEach(b => b.setContext(context).draw())
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
    }, [measures, activeMeasureId, measuresPerRow, scoreFixedWidth])

    return (
        <Box sx={{ width: '100%', overflowX: 'auto', padding: 2 }}>
            <div style={{ backgroundColor: '#ffffff' }} ref={containerRef}></div>
        </Box>
    )
}
