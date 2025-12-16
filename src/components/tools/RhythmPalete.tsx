'use client'

import { useState } from 'react'
import { Typography, Link, Stack } from '@mui/material'

export function RhythmPalette({ onSelect }: { onSelect: (duration: string, mode: 'note' | 'rest') => void }) {
    const [mode, setMode] = useState<'note' | 'rest'>('note')

    const durations = [
        { label: 'W', value: 'w' },
        { label: 'H', value: 'h' },
        { label: 'Q', value: 'q' },
        { label: '8', value: '8' },
        { label: '16', value: '16' },
    ]

    return (
        <Stack spacing={1}>
            <Typography variant="subtitle2" sx={{ opacity: 0.7 }}>
                Rhythm Palette ({mode} mode)
            </Typography>

            {/* Duration links */}
            <Stack direction="row" spacing={3} flexWrap="wrap">
                {durations.map(d => (
                    <Link
                        key={d.value}
                        component="button"
                        variant="body2"
                        underline="hover"
                        onClick={() => onSelect(d.value, mode)}
                        sx={{ cursor: 'pointer' }}
                    >
                        {d.label}
                    </Link>
                ))}
            </Stack>

            {/* Mode toggle */}
            <Stack direction="row" spacing={2}>
                <Link
                    component="button"
                    variant="caption"
                    underline="hover"
                    onClick={() => setMode('note')}
                    sx={{ fontWeight: mode === 'note' ? 600 : 400 }}
                >
                    Note
                </Link>
                <Link
                    component="button"
                    variant="caption"
                    underline="hover"
                    onClick={() => setMode('rest')}
                    sx={{ fontWeight: mode === 'rest' ? 600 : 400 }}
                >
                    Rest
                </Link>
            </Stack>
        </Stack>
    )
}
