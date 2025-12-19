'use client'

import { ToolTemplate } from "./ToolTemplate"
import { useMusic } from '@/context/MusicContext'
import { Typography, Box, Button, Stack, Divider } from '@mui/material'
import { ToolProps } from '@/types/tooling'
import { useState, useRef } from 'react'

type Natural = 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B'
type SharpKey = 'C' | 'D' | 'F' | 'G' | 'A'

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

function noteToMidi(note: string): number {
    const match = note.match(/^([A-G]#?)(\d+)$/)
    if (!match) return 0
    const [, pitch, octaveStr] = match
    const octave = parseInt(octaveStr, 10)
    const semitone = NOTES.indexOf(pitch)
    return (octave + 1) * 12 + semitone
}

export function KeyboardTool({ measureId, duration }: ToolProps) {
    const { addNote, tuning } = useMusic()
    const scrollRef = useRef<HTMLDivElement>(null)

    const dur = duration ?? 'q'
    const mid = measureId ?? ''

    const [octaves, setOctaves] = useState(2)
    const [selectedKeys, setSelectedKeys] = useState<string[]>([])

    const naturals: Natural[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
    const sharps: Record<SharpKey, string> = {
        C: 'C#',
        D: 'D#',
        F: 'F#',
        G: 'G#',
        A: 'A#',
    }

    // lowest guitar string (usually E2)
    const lowestMidi = noteToMidi(tuning[0]) // tuning[0] = low E in standard tuning

    const toggleKey = (pitch: string) => {
        if (selectedKeys.includes(pitch)) {
            setSelectedKeys(selectedKeys.filter(p => p !== pitch))
        } else {
            setSelectedKeys([...selectedKeys, pitch])
        }
    }

    const commitChord = () => {
        if (!mid || selectedKeys.length === 0) return
        addNote(mid, { pitch: selectedKeys, duration: dur })
        setSelectedKeys([])
    }

    const isSelected = (pitch: string) => selectedKeys.includes(pitch)

    const { addRest } = useMusic()
    const handleAddRest = () => {
        console.log('RestEntryTool measureId:', mid, 'duration:', dur)
        addRest(mid, { duration: dur })
    }

    return (
        <ToolTemplate title="Keyboard Input" shortcut="4">
            <Button fullWidth variant="contained" onClick={handleAddRest}>
                Insert a {dur} rest.
            </Button>

            <Divider sx={{ my: 2 }} />

            <Typography variant="body1">
                Click keys to select notes.
            </Typography>

            <Typography variant="body2" mb={2}>
                Commit them as a chord or single note.
            </Typography>

            {/* Octave selector */}
            <Stack direction="row" spacing={2} mb={2}>
                <Typography variant="caption" sx={{ opacity: 0.7 }}>
                    Octaves:
                </Typography>
                {[1, 2, 3, 4, 5].map(count => (
                    <Typography
                        key={count}
                        variant="caption"
                        sx={{
                            cursor: 'pointer',
                            fontWeight: octaves === count ? 600 : 400,
                            fontSize: octaves === count ? '1rem' : '0.8rem',
                            ":hover": { color: 'primary.main' },
                        }}
                        onClick={() => setOctaves(count)}
                    >
                        {count}
                    </Typography>
                ))}
            </Stack>

            {/* Keyboard grid */}
            <Box display="flex" flexDirection="row" gap={0.5}>
                <Box
                    ref={scrollRef}
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 0.5,
                        overflowX: 'auto',
                        overflowY: 'hidden',
                        whiteSpace: 'nowrap',
                        '&::-webkit-scrollbar': { height: 2 },
                    }}
                    onWheel={(e) => {
                        e.preventDefault()
                        const target = e.currentTarget
                        target.scrollLeft += e.deltaY
                    }}
                >
                    {Array.from({ length: octaves }).map((_, oIdx) => (
                        <Box key={oIdx} display="flex" flexDirection="row" gap={0.5}>
                            {naturals.map(note => {
                                const pitch = `${note}${2 + oIdx}`
                                const midi = noteToMidi(pitch)
                                const disabled = midi < lowestMidi
                                const selected = isSelected(pitch)

                                return (
                                    <Box key={pitch} position="relative" display="inline-block">
                                        {/* White key */}
                                        <Button
                                            size="small"
                                            variant={selected ? 'contained' : 'outlined'}
                                            disabled={disabled}
                                            sx={{
                                                minWidth: 40,
                                                height: 100,
                                                bgcolor: disabled
                                                    ? '#444'
                                                    : selected
                                                        ? '#1976d2'
                                                        : 'white',
                                                color: disabled
                                                    ? '#999'
                                                    : selected
                                                        ? '#fff'
                                                        : 'black',
                                                padding: 0,
                                                display: 'flex',
                                                alignItems: 'flex-end',
                                                justifyContent: 'center',
                                                fontSize: '0.7rem',
                                                pb: 0.5,
                                            }}
                                            onClick={() => !disabled && toggleKey(pitch)}
                                        >
                                            {pitch}
                                        </Button>

                                        {/* Black key overlay */}
                                        {note in sharps && (() => {
                                            const sharpPitch = `${sharps[note as SharpKey]}${2 + oIdx}`
                                            const sharpMidi = noteToMidi(sharpPitch)
                                            const sharpDisabled = sharpMidi < lowestMidi
                                            const sharpSelected = isSelected(sharpPitch)

                                            return (
                                                <Button
                                                    size="small"
                                                    variant={sharpSelected ? 'contained' : 'outlined'}
                                                    disabled={sharpDisabled}
                                                    sx={{
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: '105%',
                                                        transform: 'translateX(-50%)',
                                                        minWidth: 28,
                                                        height: 60,
                                                        bgcolor: sharpDisabled
                                                            ? '#222'
                                                            : sharpSelected
                                                                ? '#1976d2'
                                                                : 'black',
                                                        color: 'white',
                                                        opacity: sharpDisabled ? 0.4 : 1,
                                                        padding: 0,
                                                        zIndex: 1,
                                                    }}
                                                    onClick={() => !sharpDisabled && toggleKey(sharpPitch)}
                                                >
                                                    ♯
                                                </Button>
                                            )
                                        })()}
                                    </Box>
                                )
                            })}
                        </Box>
                    ))}
                </Box>
            </Box>

            {/* Commit chord button */}
            <Box display="flex" justifyContent="center" mt={2}>
                <Button
                    variant="contained"
                    disabled={selectedKeys.length === 0}
                    onClick={commitChord}
                >
                    Commit {selectedKeys.length > 1 ? 'Chord' : 'Note'}
                </Button>
            </Box>
        </ToolTemplate>
    )
}
