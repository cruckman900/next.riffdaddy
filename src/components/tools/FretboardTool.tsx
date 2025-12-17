'use client'

import { ToolTemplate } from "./ToolTemplate"
import { useMusic } from '@/context/MusicContext'
import { Typography, Box, Button, Grid, Stack } from '@mui/material'
import { ToolProps } from '@/types/tooling'
import { useState } from 'react'

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

function noteToMidi(note: string): number {
    const match = note.match(/^([A-G]#?)(\d+)$/)
    if (!match) return 0
    const [, pitch, octaveStr] = match
    const octave = parseInt(octaveStr, 10)
    const semitone = NOTES.indexOf(pitch)
    return (octave + 1) * 12 + semitone
}

function midiToNote(midi: number): string {
    const pitch = NOTES[midi % 12]
    const octave = Math.floor(midi / 12) - 1
    return `${pitch}${octave}`
}

export function FretboardTool({ measureId, duration }: ToolProps) {
    const { addNote, tuning } = useMusic()
    const dur = duration ?? 'q'
    const mid = measureId ?? ''

    const [fretCount, setFretCount] = useState(12)
    const [showOctave, setShowOctave] = useState(false)

    const handleClick = (string: number, fret: number, pitch: string) => {
        console.log(`Adding note: Measure ${mid}, String ${string}, Fret ${fret}, Pitch ${pitch}, Duration ${dur}`)
        if (!mid) return
        addNote(mid, { string, fret, pitch, duration: dur })
    }

    return (
        <ToolTemplate title="Fretboard" shortcut="3">
            <Typography variant="body2" mb={2}>
                Click a fret to insert a {dur} note.
            </Typography>

            {/* Toggles */}
            <Stack direction="row" spacing={2} mb={2}>
                <Typography variant="caption" sx={{ opacity: 0.7 }}>Frets:</Typography>
                {[12, 21, 24].map(count => (
                    <Typography
                        key={count}
                        variant="caption"
                        sx={{
                            cursor: 'pointer',
                            fontWeight: fretCount === count ? 600 : 400,
                        }}
                        onClick={() => setFretCount(count)}
                    >
                        {count}
                    </Typography>
                ))}
                <Typography
                    variant="caption"
                    sx={{
                        px: 3,
                        cursor: 'pointer',
                        fontWeight: showOctave ? 600 : 400,
                    }}
                    onClick={() => setShowOctave(!showOctave)}
                >
                    {showOctave ? 'Octaves On' : 'Octaves Off'}
                </Typography>
            </Stack>

            {/* Top tuning labels */}
            <Box display="flex" justifyContent="center" gap={0.5} mb={1}>
                <Typography variant="caption" sx={{ width: 32 }} /> {/* spacer for left fret numbers */}
                {tuning.map((openNote, sIdx) => (
                    <Typography
                        key={sIdx}
                        variant="caption"
                        sx={{ width: 32, textAlign: 'center' }}
                    >
                        {openNote}
                    </Typography>
                ))}
                <Typography variant="caption" sx={{ width: 32 }} /> {/* spacer for right fret numbers */}
            </Box>

            {/* Fretboard grid */}
            <Grid container spacing={0.5}>
                {Array.from({ length: fretCount + 1 }).map((_, fIdx) => (
                    <Grid item xs={12} key={fIdx}>
                        <Box display="flex" gap={0.5} justifyContent="center" alignItems="center">
                            <Typography variant="caption" sx={{ width: 32, textAlign: 'right' }}>
                                {fIdx}
                            </Typography>
                            {tuning.map((openNote, sIdx) => {
                                const midi = noteToMidi(openNote) + fIdx
                                const pitch = midiToNote(midi)
                                return (
                                    <Button
                                        key={sIdx}
                                        size="small"
                                        variant="outlined"
                                        sx={{ minWidth: 32, height: 28, padding: 0, fontSize: '0.7rem' }}
                                        onClick={() => handleClick(tuning.length - sIdx, fIdx, pitch)}
                                    >
                                        {showOctave ? pitch : pitch.replace(/\d+$/, '')}
                                    </Button>
                                )
                            })}
                            <Typography variant="caption" sx={{ width: 32, textAlign: 'left' }}>
                                {fIdx}
                            </Typography>
                        </Box>
                    </Grid>
                ))}
            </Grid>

            {/* Bottom tuning labels */}
            <Box display="flex" justifyContent="center" gap={0.5} mt={1}>
                <Typography variant="caption" sx={{ width: 32 }} /> {/* spacer */}
                {tuning.map((openNote, sIdx) => (
                    <Typography
                        key={sIdx}
                        variant="caption"
                        sx={{ width: 32, textAlign: 'center' }}
                    >
                        {openNote}
                    </Typography>
                ))}
                <Typography variant="caption" sx={{ width: 32 }} /> {/* spacer */}
            </Box>
        </ToolTemplate>
    )
}
