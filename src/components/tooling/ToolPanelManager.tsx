'use client'

import { useState } from 'react'
import { TOOL_REGISTRY } from "@/tools/registry"
import { RhythmPalette } from '../tools/RhythmPalete'
interface ToolPanelManagerProps {
    activeTool: string
    measureId?: string
}

export function ToolPanelManager({ activeTool, measureId }: ToolPanelManagerProps) {
    const tool = TOOL_REGISTRY[activeTool]
    const ActiveToolComponent = tool.component

    const [duration, setDuration] = useState<string>('q')
    const [mode, setMode] = useState<'note' | 'rest'>('note')

    return (
        <div style={{ flex: 1, height: "100%", overflowY: "auto", padding: "10px", background: "#0f1114", color: "#e5e7eb" }}>
            <RhythmPalette onSelect={(d, m) => { setDuration(d); setMode(m) }} />
            <ActiveToolComponent measureId={measureId} duration={duration} mode={mode} />
        </div>
    )
}
