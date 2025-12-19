'use client'

import { ToolTemplate } from "./ToolTemplate"
import { useMusic } from '@/context/MusicContext'
import { Typography, Box, Button, Grid, Stack, Divider } from '@mui/material'
import { ToolProps } from '@/types/tooling'
import { useState } from 'react'
import React from "react"

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const DIVISIONS = [0, 3, 5, 7, 9, 12, 15, 17, 19, 21, 24]

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
    const [selectedNotes, setSelectedNotes] = useState<
        { string: number; fret: number; pitch: string }[]
    >([])

    const toggleSelect = (string: number, fret: number, pitch: string) => {
        const exists = selectedNotes.find(n => n.string === string && n.fret === fret)
        if (exists) {
            setSelectedNotes(selectedNotes.filter(n => !(n.string === string && n.fret === fret)))
        } else {
            setSelectedNotes([...selectedNotes, { string, fret, pitch }])
        }
    }

    const commitChord = () => {
        if (!mid || selectedNotes.length === 0) return
        addNote(mid, {
            string: selectedNotes.map(n => n.string),
            fret: selectedNotes.map(n => n.fret),
            pitch: selectedNotes.map(n => n.pitch),
            duration: dur,
        })
        setSelectedNotes([])
    }

    const isSelected = (string: number, fret: number) =>
        selectedNotes.some(n => n.string === string && n.fret === fret)

    const { addRest } = useMusic()
    const handleAddRest = () => {
        console.log('RestEntryTool measureId:', mid, 'duration:', dur)
        addRest(mid, { duration: dur })
    }

    return (
        <ToolTemplate title="Fretboard Input" shortcut="3">
            <Button fullWidth variant="contained" onClick={handleAddRest}>
                Insert a {dur} rest.
            </Button>

            <Divider sx={{ my: 2 }} />

            <Typography variant="body1">
                Click frets to select notes.
            </Typography>

            <Typography variant="body2" mb={2}>
                Commit them as a chord or single note.
            </Typography>

            {/* Toggles */}
            <Stack direction="row" spacing={2} mb={2}>
                <Typography variant="caption" sx={{ opacity: 0.7 }}>
                    Frets:
                </Typography>
                {[12, 21, 24].map(count => (
                    <Typography
                        key={count}
                        variant="caption"
                        sx={{
                            cursor: 'pointer',
                            fontWeight: fretCount === count ? 600 : 400,
                            fontSize: fretCount === count ? '1rem' : '0.8rem',
                            ":hover": { color: 'primary.main' },
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
                        ":hover": { color: 'primary.main' },
                    }}
                    onClick={() => setShowOctave(!showOctave)}
                >
                    {showOctave ? 'Octaves On' : 'Octaves Off'}
                </Typography>
            </Stack>

            {/* Top tuning labels */}
            <Box display="flex" justifyContent="center" gap={0.5} mb={1}>
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

            {/* Fretboard grid */}
            <Grid container spacing={0.5}>
                {Array.from({ length: fretCount + 1 }).map((_, fIdx) => (
                    <React.Fragment key={fIdx}>
                        {DIVISIONS.includes(fIdx) && (
                            <Divider sx={{ width: '100%', my: 0.2, opacity: 0 }} />
                        )}
                        <Grid item xs={12} key={fIdx}>
                            <Box display="flex" gap={0.5} justifyContent="center" alignItems="center">
                                <Typography variant={DIVISIONS.includes(fIdx) ? 'subtitle2' : 'caption'} sx={{ width: 32, textAlign: 'right' }}>
                                    {fIdx}
                                </Typography>
                                {tuning.map((openNote, sIdx) => {
                                    const midi = noteToMidi(openNote) + fIdx
                                    const pitch = midiToNote(midi)
                                    const stringNum = tuning.length - sIdx
                                    const selected = isSelected(stringNum, fIdx)
                                    return (
                                        <Button
                                            key={sIdx}
                                            size="small"
                                            variant={selected ? 'contained' : 'outlined'}
                                            sx={{
                                                minWidth: 32,
                                                height: DIVISIONS.includes(fIdx) ? 26 : 24,
                                                padding: 0,
                                                fontSize: '0.7rem',
                                                backgroundColor: selected ? '#1976d2' : undefined,
                                                color: selected ? '#fff' : undefined,
                                            }}
                                            onClick={() => toggleSelect(stringNum, fIdx, pitch)}
                                        >
                                            {showOctave ? pitch : pitch.replace(/\d+$/, '')}
                                        </Button>
                                    )
                                })}
                                <Typography variant={DIVISIONS.includes(fIdx) ? 'subtitle2' : 'caption'} sx={{ width: 32, textAlign: 'left' }}>
                                    {fIdx}
                                </Typography>
                            </Box>
                        </Grid>
                        {DIVISIONS.includes(fIdx) && (
                            <Divider sx={{ width: '100%', my: 0.2, opacity: 0 }} />
                        )}
                    </React.Fragment>
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

            {/* Commit chord button */}
            <Box display="flex" justifyContent="center" mt={2}>
                <Button
                    variant="contained"
                    disabled={selectedNotes.length === 0}
                    onClick={commitChord}
                >
                    Commit {selectedNotes.length > 1 ? 'Chord' : 'Note'}
                </Button>
            </Box>
        </ToolTemplate>
    )
}
