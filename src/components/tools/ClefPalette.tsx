'use client'

import { useState } from "react"
import { ToolTemplate } from "./ToolTemplate"
import { useMusic } from '@/context/MusicContext'
import { Button, Typography, Stack, Box, Divider, Chip } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { ToolProps } from '@/types/tooling'

const CLEFS = ['treble', 'bass', 'alto', 'tenor']
const TIME_SIGNATURES = ['2/4', '3/4', '6/8', '4/4']

const KEYS = [
    { sig: 'C', label: 'C Major / A Minor' },
    { sig: 'G', label: 'G Major / E Minor' },
    { sig: 'D', label: 'D Major / B Minor' },
    { sig: 'A', label: 'A Major / F# Minor' },
    { sig: 'E', label: 'E Major / C# Minor' },
    { sig: 'B', label: 'B Major / G# Minor' },
    { sig: 'F#', label: 'F# Major / D# Minor' },
    { sig: 'C#', label: 'C# Major / A# Minor' },
    { sig: 'F', label: 'F Major / D Minor' },
    { sig: 'Bb', label: 'Bb Major / G Minor' },
    { sig: 'Eb', label: 'Eb Major / C Minor' },
    { sig: 'Ab', label: 'Ab Major / F Minor' },
    { sig: 'Db', label: 'Db Major / Bb Minor' },
    { sig: 'Gb', label: 'Gb Major / Eb Minor' },
    { sig: 'Cb', label: 'Cb Major / Ab Minor' },
]

export function ClefPalette({ measureId }: ToolProps) {
    const theme = useTheme()

    const [selectedClef, setSelectedClef] = useState<string | null>('treble')
    const [selectedTimeSignature, setSelectedTimeSignature] = useState<string | null>('4/4')
    const [selectedKeySignature, setSelectedKeySignature] = useState<string | null>('C')

    const { addMeasure } = useMusic()
    const { updateMeasure } = useMusic()

    const { measures } = useMusic()
    const mid = measureId ?? ''

    const measure = measures.find(m => m.id === mid)

    const handleChangeClef = (clef: string) => {
        if (!measureId) return
        updateMeasure(measureId, { clef })
        setSelectedClef(clef)
    }

    const handleChangeTimeSignature = (ts: string) => {
        if (!measure) return
        measure.timeSignature = ts
        if (!measureId) return
        updateMeasure(measureId, { timeSignature: ts })
        setSelectedTimeSignature(ts)
    }

    const handleChangeKeySignature = (keySignature: string) => {
        if (!measureId) return
        updateMeasure(measureId, { keySignature })
        setSelectedKeySignature(keySignature)
    }

    const chipSx = (active: boolean) => ({
        fontWeight: active ? 700 : 500,
        borderColor: active ? theme.palette.accent.main : 'divider',
        color: active ? theme.palette.accent.main : theme.palette.text.secondary,
        bgcolor: active ? `${theme.palette.accent.main}1a` : 'transparent',
        boxShadow: active ? `0 0 8px ${theme.palette.accent.main}66` : 'none',
        transition: 'all 0.15s ease',
    })

    return (
        <ToolTemplate title="Score and Measure" shortcut="2">
            <Typography variant="body1" mb={1.5}>
                Select a clef for this measure.
            </Typography>

            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {CLEFS.map(clef => (
                    <Chip
                        key={clef}
                        label={clef}
                        variant="outlined"
                        onClick={() => handleChangeClef(clef)}
                        sx={chipSx(selectedClef === clef)}
                    />
                ))}
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Typography variant="body1" mb={1.5}>
                Change time signature for this measure.
            </Typography>

            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {TIME_SIGNATURES.map(ts => (
                    <Chip
                        key={ts}
                        label={ts}
                        variant="outlined"
                        onClick={() => handleChangeTimeSignature(ts)}
                        sx={chipSx(selectedTimeSignature === ts)}
                    />
                ))}
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Typography variant="body1" mb={1}>
                Manage measures in your score.
            </Typography>

            <Box
                sx={{
                    p: 1.5,
                    mb: 2,
                    borderRadius: 2,
                    bgcolor: `${theme.palette.accent.main}0f`,
                    border: '1px solid',
                    borderColor: `${theme.palette.accent.main}44`,
                }}
            >
                <Typography variant="subtitle2" sx={{ color: theme.palette.accent.main, fontWeight: 700 }}>
                    Current Settings
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {selectedClef} · {selectedTimeSignature} · {KEYS.find(k => k.sig === selectedKeySignature)?.label}
                </Typography>
            </Box>

            <Button
                fullWidth
                variant="contained"
                onClick={() => {
                    addMeasure(selectedClef || 'treble', selectedTimeSignature || '4/4', selectedKeySignature || 'C')
                }}
                sx={{ boxShadow: `0 0 14px ${theme.palette.primary.main}77` }}
            >
                Add Measure
            </Button>

            <Divider sx={{ my: 2 }} />

            <Typography variant="body1" mb={1.5}>
                Select a key signature for this measure.
            </Typography>

            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {KEYS.map((key) => (
                    <Chip
                        key={key.sig}
                        label={key.label}
                        variant="outlined"
                        onClick={() => handleChangeKeySignature(key.sig)}
                        sx={chipSx(selectedKeySignature === key.sig)}
                    />
                ))}
            </Stack>

        </ToolTemplate>
    )
}
