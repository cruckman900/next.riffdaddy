'use client'

import { useState } from "react"
import { ToolTemplate } from "./ToolTemplate"
import { useMusic } from '@/context/MusicContext'
import { Button, Typography, Stack, Grid, Divider } from '@mui/material'
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

    return (
        <ToolTemplate title="Score and Measure" shortcut="2">
            <Typography variant="body1" mb={2}>
                Select a clef for this measure.
            </Typography>

            <Stack direction="row" spacing={3}>
                {CLEFS.map(clef => (
                    <Typography
                        key={clef}
                        variant="caption"
                        sx={{
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            ":hover": { color: 'primary.main' },
                        }}
                        onClick={() => handleChangeClef(clef)}
                    >
                        {clef}
                    </Typography>
                ))}
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Typography variant="body1" mb={2}>
                Change time signature for this measure.
            </Typography>

            <Stack direction="row" spacing={3}>
                {TIME_SIGNATURES.map(ts => (
                    <Typography
                        key={ts}
                        variant="caption"
                        sx={{
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            ":hover": { color: 'primary.main' },
                        }}
                        onClick={() => handleChangeTimeSignature(ts)}
                    >
                        {ts}
                    </Typography>
                ))}
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Typography variant="body1" mb={2}>
                Manage measures in your score.
            </Typography>

            <Typography variant="subtitle1">
                Current Settings:
            </Typography>

            <Typography variant="subtitle2" mb={2} px={2}>
                ({selectedClef} | {selectedTimeSignature} | {KEYS.find(k => k.sig === selectedKeySignature)?.label})
            </Typography>

            <Button fullWidth variant="contained" onClick={() => {
                console.log('addMeasure', selectedClef, selectedTimeSignature, selectedKeySignature)
                addMeasure(selectedClef || 'treble', selectedTimeSignature || '4/4', selectedKeySignature || 'C')
            }}>
                Add Measure
            </Button>

            <Divider sx={{ my: 2 }} />

            <Typography variant="body1" mb={2}>
                Select a key signature for this measure.
            </Typography>

            <Grid container spacing={2}>
                {KEYS.map((key, i) => (
                    <Grid item xs={6} key={key.sig}>
                        <Typography
                            variant="caption"
                            sx={{
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                textAlign: i % 2 === 0 ? 'left' : 'right',
                                ":hover": { color: 'primary.main' },
                                display: 'block',
                            }}
                            onClick={() => handleChangeKeySignature(key.sig)}
                        >
                            {key.label}
                        </Typography>
                    </Grid>
                ))}
            </Grid>

        </ToolTemplate>
    )
}
