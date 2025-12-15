'use client'

import { TOOL_REGISTRY } from "@/tools/registry"

interface ToolPanelManagerProps {
    activeTool: string
}

export function ToolPanelManager({ activeTool }: ToolPanelManagerProps) {
    const tool = TOOL_REGISTRY[activeTool]
    const ActiveToolComponent = tool.component

    return (
        <div
            style={{
                flex: 1,
                height: "100%",
                overflowY: "auto",
                padding: "20px",
                background: "#0f1114",
                color: "#e5e7eb",
            }}
        >
            <ActiveToolComponent />
        </div>
    )
}
