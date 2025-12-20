'use client'

import { useState } from 'react'
import { Typography, Link, Stack, Box } from '@mui/material'
import { useTheme } from "@mui/material"

export function RhythmPalette({ onSelect }: { onSelect: (duration: string) => void }) {
    const theme = useTheme()

    const [dur, setDur] = useState<string>('q')

    const durations = [
        { label: 'W', value: 'w' },
        { label: 'H', value: 'h' },
        { label: 'Q', value: 'q' },
        { label: '8', value: '8' },
        { label: '16', value: '16' },
        { label: '32', value: '32' },
        { label: '64', value: '64' },
    ]

    return (
        <Box display="flex" flexDirection="column" sx={{ p: 2, mb: 1, bgcolor: theme.palette.background.paper, borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Rhythm Palette
            </Typography>

            {/* Duration links */}
            <Stack direction="row" spacing={3} flexWrap="wrap">
                {durations.map(d => (
                    <Link
                        key={d.value}
                        component="button"
                        variant="body2"
                        underline="hover"
                        onClick={() => { onSelect(d.value); setDur(d.value); }}
                        fontWeight={dur == d.value ? 600 : 400}
                        fontSize={dur == d.value ? '1rem' : '0.8rem'}
                        sx={{ cursor: 'pointer' }}
                    >
                        {d.label}
                    </Link>
                ))}
            </Stack>
        </Box>
    )
}
