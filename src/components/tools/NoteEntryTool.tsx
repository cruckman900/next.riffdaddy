'use client'

import { ToolTemplate } from "./ToolTemplate"
import { useMusic } from '@/context/MusicContext'
import { Button, Typography } from '@mui/material'
import { ToolProps } from '@/types/tooling'

export function NoteEntryTool({ measureId, duration }: ToolProps) {
    const { addNote } = useMusic()
    const dur = duration ?? 'q'
    const mid = measureId ?? ''

    const handleAddNote = (string: number, fret: number) => {
        console.log('NoteEntryTool handleAddNote:', 'measureId:', mid, 'string:', string, 'fret:', fret, 'duration:', dur)
        if (!mid) return
        addNote(mid, { string, fret, duration: dur })
    }

    return (
        <ToolTemplate title="Note Entry" shortcut="2">
            <Typography variant="body1" mb={2}>Click a fret/string to insert a {dur} note.</Typography>
            {/* Demo buttons — replace with fretboard UI */}
            <Button onClick={() => handleAddNote(1, 3)}>String 1, Fret 3</Button>
            <Button onClick={() => handleAddNote(2, 5)}>String 2, Fret 5</Button>
        </ToolTemplate>
    )
}
