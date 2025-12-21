'use client'

import { useState } from 'react'
import { TOOL_REGISTRY } from "@/tools/registry"
import { RhythmPalette } from '../tools/RhythmPalete'
import { useTheme } from "@mui/material"

interface ToolPanelManagerProps {
    activeTool: string
    measureId?: string
}

export function ToolPanelManager({ activeTool, measureId }: ToolPanelManagerProps) {
    const tool = TOOL_REGISTRY[activeTool]

    const theme = useTheme()

    const [duration, setDuration] = useState<string>('q')

    if (!tool) {
        return <div style={{ padding: '10px', color: '#888' }}>No tool selected.</div>
    }

    const ActiveToolComponent = tool.component

    return (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflowY: "auto", padding: "10px", background: theme.palette.muted.main, color: theme.palette.text.primary }}>
            {(activeTool == 'fretboard' || activeTool == 'keyboard') && <RhythmPalette onSelect={(d) => { setDuration(d) }} />}
            <ActiveToolComponent measureId={measureId} duration={duration} />
        </div>
    )
}
