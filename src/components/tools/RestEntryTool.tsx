'use client'

import { ToolTemplate } from "./ToolTemplate"
import { useMusic } from '@/context/MusicContext'
import { Button, Typography } from '@mui/material'
import { ToolProps } from '@/types/tooling'

export function RestEntryTool({ measureId, duration }: ToolProps) {
    const { addNote } = useMusic()
    const dur = duration ?? 'q'
    const mid = measureId ?? ''

    const handleAddRest = () => {
        addNote(mid, { duration: dur })
    }

    return (
        <ToolTemplate title="Rest Entry" shortcut="3">
            <Typography variant="body1" mb={2}>Insert a {dur} rest.</Typography>
            <Button fullWidth variant="contained" onClick={handleAddRest}>
                Add Rest
            </Button>
        </ToolTemplate>
    )
}
