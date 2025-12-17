'use client'

import { ToolTemplate } from "./ToolTemplate"
import { useMusic } from '@/context/MusicContext'
import { Typography, Box, Button, Stack } from '@mui/material'
import { ToolProps } from '@/types/tooling'
import { useState, useRef } from 'react'

type Natural = 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B'
type SharpKey = 'C' | 'D' | 'F' | 'G' | 'A'

export function KeyboardTool({ measureId, duration }: ToolProps) {
    const { addNote } = useMusic()

    const scrollRef = useRef<HTMLDivElement>(null)

    const dur = duration ?? 'q'
    const mid = measureId ?? ''

    const [octaves, setOctaves] = useState(2)

    const naturals: Natural[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
    const sharps: Record<SharpKey, string> = {
        C: 'C#',
        D: 'D#',
        F: 'F#',
        G: 'G#',
        A: 'A#',
    }

    const handleClick = (pitch: string) => {
        if (!mid) return
        addNote(mid, { pitch, duration: dur })
    }

    return (
        <ToolTemplate title="Keyboard" shortcut="4">
            <Typography variant="body2" mb={2}>
                Click a key to insert a {dur} note.
            </Typography>

            {/* Octave selector */}
            <Stack direction="row" spacing={2} mb={2}>
                {[1, 2, 3].map(count => (
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
                        '&::-webkit-scrollbar': { height: 2 }, // optional styling
                    }}
                    onWheel={(e) => {
                        e.preventDefault()
                        const target = e.currentTarget
                        target.scrollLeft += e.deltaY // translate vertical wheel into horizontal scroll
                    }}
                >
                    {Array.from({ length: octaves }).map((_, oIdx) => (
                        <Box key={oIdx} display="flex" flexDirection="row" gap={0.5}>
                            {naturals.map(note => {
                                const pitch = `${note}${4 + oIdx}`
                                return (
                                    <Box key={pitch} position="relative" display="inline-block">
                                        {/* White key */}
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            sx={{
                                                minWidth: 40,
                                                height: 100,
                                                bgcolor: 'white',
                                                color: 'black',
                                                padding: 0,
                                                display: 'flex',
                                                alignItems: 'flex-end',
                                                justifyContent: 'center',
                                                fontSize: '0.7rem',
                                                pb: 0.5,
                                            }}
                                            onClick={() => handleClick(pitch)}
                                        >
                                            {pitch}
                                        </Button>

                                        {/* Black key overlay */}
                                        {note in sharps && (
                                            <Button
                                                size="small"
                                                variant="contained"
                                                sx={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: '50%',
                                                    transform: 'translateX(-50%)',
                                                    minWidth: 28,
                                                    height: 60,
                                                    bgcolor: 'black',
                                                    color: 'white',
                                                    padding: 0,
                                                    zIndex: 1,
                                                }}
                                                onClick={() => handleClick(`${sharps[note as SharpKey]}${4 + oIdx}`)}
                                            >
                                                ♯
                                            </Button>
                                        )}
                                    </Box>
                                )
                            })}
                        </Box>
                    ))}
                </Box>
            </Box>
        </ToolTemplate>
    )
}
