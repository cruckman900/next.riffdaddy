'use client'

import { useState } from 'react'
import { Typography, Stack, Box, Tooltip } from '@mui/material'
import { useTheme } from "@mui/material"

export function RhythmPalette({ onSelect }: { onSelect: (duration: string) => void }) {
    const theme = useTheme()

    const [dur, setDur] = useState<string>('q')

    const durations = [
        { label: 'W', value: 'w', name: 'Whole note' },
        { label: 'H', value: 'h', name: 'Half note' },
        { label: 'Q', value: 'q', name: 'Quarter note' },
        { label: '8', value: '8', name: 'Eighth note' },
        { label: '16', value: '16', name: 'Sixteenth note' },
        { label: '32', value: '32', name: 'Thirty-second note' },
        { label: '64', value: '64', name: 'Sixty-fourth note' },
    ]

    return (
        <Box
            display="flex"
            flexDirection="column"
            gap={1}
            sx={{
                p: 2,
                mb: 1,
                bgcolor: 'background.default',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: `0 0 14px ${theme.palette.accent.main}22`,
            }}
        >
            <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.accent.main }}>
                Rhythm Palette
            </Typography>

            {/* Duration selector */}
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {durations.map(d => {
                    const active = dur === d.value
                    return (
                        <Tooltip key={d.value} title={d.name} arrow>
                            <Box
                                component="button"
                                onClick={() => { onSelect(d.value); setDur(d.value); }}
                                sx={{
                                    cursor: 'pointer',
                                    minWidth: 34,
                                    height: 34,
                                    borderRadius: '50%',
                                    border: '1px solid',
                                    borderColor: active ? theme.palette.accent.main : 'divider',
                                    color: active ? theme.palette.accent.main : theme.palette.text.secondary,
                                    bgcolor: active ? `${theme.palette.accent.main}1f` : 'transparent',
                                    boxShadow: active ? `0 0 10px ${theme.palette.accent.main}77` : 'none',
                                    fontWeight: active ? 700 : 400,
                                    fontSize: '0.85rem',
                                    transition: 'all 0.15s ease',
                                }}
                            >
                                {d.label}
                            </Box>
                        </Tooltip>
                    )
                })}
            </Stack>
        </Box>
    )
}
