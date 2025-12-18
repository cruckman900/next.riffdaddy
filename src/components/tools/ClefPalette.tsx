'use client'

import { useState } from "react"
import { ToolTemplate } from "./ToolTemplate"
import { useMusic } from '@/context/MusicContext'
import { Button, Typography, Stack, Box, Divider } from '@mui/material'
import { ToolProps } from '@/types/tooling'

const CLEFS = ['treble', 'bass', 'alto', 'tenor']
const TIME_SIGNATURES = ['2/4', '3/4', '6/8', '4/4']

export function ClefPalette({ measureId }: ToolProps) {
    const [selectedTimeSignature, setSelectedTimeSignature] = useState<string | null>('4/4')
    const { addMeasure } = useMusic()
    const { updateMeasure } = useMusic()

    const handleClick = (clef: string) => {
        if (!measureId) return
        updateMeasure(measureId, { clef })
    }

    const { measures } = useMusic()
    const mid = measureId ?? ''

    const measure = measures.find(m => m.id === mid)

    const handleChangeTS = (ts: string) => {
        if (!measure) return
        measure.timeSignature = ts
        setSelectedTimeSignature(ts)
    }

    return (
        <ToolTemplate title="Score and Measure" shortcut="C">
            <Typography variant="body2" mb={2}>
                Select a clef for this measure. Current: {measure?.clef}
            </Typography>

            <Stack direction="row" spacing={3}>
                {CLEFS.map(clef => (
                    <Typography
                        key={clef}
                        variant="caption"
                        sx={{
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            textDecoration: 'underline',
                        }}
                        onClick={() => handleClick(clef)}
                    >
                        {clef}
                    </Typography>
                ))}
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Typography variant="body2" mb={2}>
                Change time signature for this measure. Current: {measure?.timeSignature}
            </Typography>

            <Stack direction="row" spacing={3}>
                {TIME_SIGNATURES.map(ts => (
                    <Typography
                        key={ts}
                        variant="caption"
                        sx={{
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            textDecoration: 'underline',
                        }}
                        onClick={() => handleChangeTS(ts)}
                    >
                        {ts}
                    </Typography>
                ))}
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Typography variant="body2" mb={2}>
                Manage measures in your score.
            </Typography>

            <Button fullWidth variant="contained" onClick={() => addMeasure(selectedTimeSignature || '4/4')}>
                Add Measure ({selectedTimeSignature})
            </Button>

        </ToolTemplate>
    )
}
