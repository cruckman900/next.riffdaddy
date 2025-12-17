'use client'

import { ToolTemplate } from "./ToolTemplate"
import { useMusic } from '@/context/MusicContext'
import { Typography, Box, Button, Stack } from '@mui/material'
import { ToolProps } from '@/types/tooling'
import { useState, useRef } from 'react'

type Natural = 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B'
type SharpKey = 'C' | 'D' | 'F' | 'G' | 'A'

function toVexflowKey(pitch: string): string {
    // "C4" -> "c/4"
    const match = pitch.match(/^([A-Ga-g])(#?)(\d)$/)
    if (!match) return 'c/4'
    const [, letter, accidental, octave] = match
    return `${letter}${accidental}${octave}`
}

export function KeyboardTool({ measureId, duration }: ToolProps) {
    const { addNote } = useMusic()
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

    const toggleKey = (pitch: string) => {
        if (selectedKeys.includes(pitch)) {
            setSelectedKeys(selectedKeys.filter(p => p !== pitch))
        } else {
            setSelectedKeys([...selectedKeys, pitch])
        }
    }

    const commitChord = () => {
        if (!mid || selectedKeys.length === 0) return
        addNote(mid, { pitch: selectedKeys.map(toVexflowKey), duration: dur })
        console.log('Committed keys:', selectedKeys.map(toVexflowKey))
        setSelectedKeys([])
    }

    const isSelected = (pitch: string) => selectedKeys.includes(pitch)

    return (
        <ToolTemplate title="Keyboard" shortcut="4">
            <Typography variant="body2" mb={2}>
                Click keys to select notes. Commit them as a chord or single note.
            </Typography>

            {/* Octave selector */}
            <Stack direction="row" spacing={2} mb={2}>
                {[1, 2, 3, 4, 5].map(count => (
                    <Typography
                        key={count}
                        variant="caption"
                        sx={{
                            cursor: 'pointer',
                            fontWeight: octaves === count ? 600 : 400,
                        }}
                        onClick={() => setOctaves(count)}
                    >
                        {count} octave{count > 1 ? 's' : ''}
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
                                const selected = isSelected(pitch)
                                return (
                                    <Box key={pitch} position="relative" display="inline-block">
                                        {/* White key */}
                                        <Button
                                            size="small"
                                            variant={selected ? 'contained' : 'outlined'}
                                            sx={{
                                                minWidth: 40,
                                                height: 100,
                                                bgcolor: selected ? '#1976d2' : 'white',
                                                color: selected ? '#fff' : 'black',
                                                padding: 0,
                                                display: 'flex',
                                                alignItems: 'flex-end',
                                                justifyContent: 'center',
                                                fontSize: '0.7rem',
                                                pb: 0.5,
                                            }}
                                            onClick={() => toggleKey(pitch)}
                                        >
                                            {pitch}
                                        </Button>

                                        {/* Black key overlay */}
                                        {note in sharps && (
                                            (() => {
                                                const sharpPitch = `${sharps[note as SharpKey]}${2 + oIdx}`
                                                const sharpSelected = isSelected(sharpPitch)
                                                return (
                                                    <Button
                                                        size="small"
                                                        variant={sharpSelected ? 'contained' : 'outlined'}
                                                        sx={{
                                                            position: 'absolute',
                                                            top: 0,
                                                            left: '105%',
                                                            transform: 'translateX(-50%)',
                                                            minWidth: 28,
                                                            height: 60,
                                                            bgcolor: sharpSelected ? '#1976d2' : 'black',
                                                            color: 'white',
                                                            padding: 0,
                                                            zIndex: 1,
                                                        }}
                                                        onClick={() => toggleKey(sharpPitch)}
                                                    >
                                                        ♯
                                                    </Button>
                                                )
                                            })()
                                        )}
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
