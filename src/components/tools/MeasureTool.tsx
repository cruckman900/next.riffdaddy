'use client'

import { ToolTemplate } from "./ToolTemplate"
import { useMusic } from '@/context/MusicContext'
import { Button, Typography } from '@mui/material'

export function MeasureTool() {
    const { addMeasure } = useMusic()

    return (
        <ToolTemplate title="Measure Tool" shortcut="4">
            <Typography variant="body1" mb={2}>Manage measures in your score.</Typography>
            <Button fullWidth variant="contained" onClick={() => addMeasure('4/4')}>
                Add Measure (4/4)
            </Button>
        </ToolTemplate>
    )
}
