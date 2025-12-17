'use client'

import { ToolTemplate } from "./ToolTemplate"
import { useMusic } from '@/context/MusicContext'
import { Typography, Stack } from '@mui/material'
import { ToolProps } from '@/types/tooling'

const CLEFS = ['treble', 'bass', 'alto', 'tenor']

export function ClefPalette({ measureId }: ToolProps) {
    const { updateMeasure } = useMusic()

    const handleClick = (clef: string) => {
        if (!measureId) return
        updateMeasure(measureId, { clef })
    }

    return (
        <ToolTemplate title="Clef Palette" shortcut="C">
            <Typography variant="body2" mb={2}>
                Select a clef for this measure.
            </Typography>

            <Stack direction="row" spacing={2}>
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
        </ToolTemplate>
    )
}
