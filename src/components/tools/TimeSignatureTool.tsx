'use client'

import { ToolTemplate } from "./ToolTemplate"
import { useMusic } from '@/context/MusicContext'
import { Button, Typography } from '@mui/material'
import { ToolProps } from "@/types/tooling"

export function TimeSignatureTool({ measureId }: ToolProps) {
    const { measures } = useMusic()
    const mid = measureId ?? ''

    const measure = measures.find(m => m.id === mid)

    const handleChangeTS = (ts: string) => {
        if (!measure) return
        measure.timeSignature = ts
    }

    return (
        <ToolTemplate title="Time Signature Tool" shortcut="6">
            <Typography variant="body1" mb={2}>Change time signature for this measure.</Typography>
            <Button onClick={() => handleChangeTS('3/4')}>3/4</Button>
            <Button onClick={() => handleChangeTS('6/8')}>6/8</Button>
            <Button onClick={() => handleChangeTS('4/4')}>4/4</Button>
        </ToolTemplate>
    )
}
