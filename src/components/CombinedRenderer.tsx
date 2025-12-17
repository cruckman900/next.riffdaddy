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
    const { measures } = useMusic()
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!containerRef.current) return
        containerRef.current.innerHTML = ''

        const rendererWidth = 800
        const marginLeft = 10
        const marginTop = 20
        const lineHeight = 120
        const staffOffset = 150

        const widths = computeMeasureWidths(measures)
        const renderer = new Renderer(containerRef.current, Renderer.Backends.SVG)
        renderer.resize(rendererWidth, 2000)
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

            const tabStaves: TabStave[] = []
            const staffStaves: Stave[] = []

            rowMeasures.forEach((measure, idx) => {
                const scaledWidth = rowWidths[idx] * scale - MEASURE_PADDING
                const { numBeats, beatValue } = parseTimeSignature(measure.timeSignature)

                // Highlight active measure
                if (measure.id === activeMeasureId) {
                    context.save()
                    context.setFillStyle('#e0f7fa')
                    context.fillRect(x - 2, y - 10, scaledWidth + 4, staffOffset + 110)
                    context.restore()
                }

                // --- Tab stave ---
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
                            : [{
                                str: n.string ?? 1,
                                fret: (typeof n.fret === 'number' || typeof n.fret === 'string') ? n.fret : 0
                            }],
                        duration: n.duration || 'q'
                    })
                )

                const tabStave = new TabStave(x, y, scaledWidth)
                if (measure.timeSignature && measure.timeSignature !== lastTime) {
                    tabStave.addTimeSignature(measure.timeSignature)
                }
                if (measure.keySignature && measure.keySignature !== lastKey) {
                    tabStave.addKeySignature(measure.keySignature)
                }

                if (isLastRow && idx === rowMeasures.length - 1) {
                    tabStave.setEndBarType(Barline.type.DOUBLE)
                } else if (idx === rowMeasures.length - 1) {
                    tabStave.setEndBarType(Barline.type.SINGLE)
                } else {
                    tabStave.setEndBarType(Barline.type.NONE)
                }

                tabStave.setContext(context).draw()
                tabStaves.push(tabStave)

                if (tabTickables.length > 0) {
                    const voice = new Voice({ numBeats, beatValue }).setStrict(false)
                    voice.addTickables(tabTickables)
                    new Formatter().joinVoices([voice]).format([voice], scaledWidth - 50)
                    voice.draw(context, tabStave)
                    Beam.generateBeams(tabTickables).forEach(b => b.setContext(context).draw())
                }

                // --- Staff stave ---
                const staffTickables = [
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

                const staffStave = new Stave(x, y + staffOffset, scaledWidth)
                if (measure.clef && measure.clef !== lastClef) {
                    staffStave.addClef(measure.clef)
                }
                if (measure.timeSignature && measure.timeSignature !== lastTime) {
                    staffStave.addTimeSignature(measure.timeSignature)
                }
                if (measure.keySignature && measure.keySignature !== lastKey) {
                    staffStave.addKeySignature(measure.keySignature)
                }

                if (isLastRow && idx === rowMeasures.length - 1) {
                    staffStave.setEndBarType(Barline.type.DOUBLE)
                } else if (idx === rowMeasures.length - 1) {
                    staffStave.setEndBarType(Barline.type.SINGLE)
                } else {
                    staffStave.setEndBarType(Barline.type.NONE)
                }

                staffStave.setContext(context).draw()
                staffStaves.push(staffStave)

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

            // System connectors
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

            y += staffOffset + lineHeight
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
    }, [measures, activeMeasureId])

    return (
        <Box sx={{ width: '100%', overflowX: 'auto', padding: 2 }}>
            <div style={{ backgroundColor: '#ffffff', width: '800px' }} ref={containerRef}></div>
        </Box>
    )
}
