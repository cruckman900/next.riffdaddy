'use client'

import { useState, useEffect } from "react"
import { ToolRail } from "./tooling/ToolRail"
import { ToolPanelManager } from "./tooling/ToolPanelManager"
import { TOOL_REGISTRY } from "@/tools/registry"

export default function Workbench() {
    const [activeTool, setActiveTool] = useState("cockpit")

    useEffect(() => {
        function handleKey(e: KeyboardEvent) {
            const entry = Object.values(TOOL_REGISTRY).find(t => t.shortcut === e.key)
            if (entry) setActiveTool(entry.id)
        }

        window.addEventListener("keydown", handleKey)
        return () => window.removeEventListener("keydown", handleKey)
    }, [])

    return (
        <div style={{ display: "flex", height: "100%", width: "100%" }}>
            <ToolRail activeToolId={activeTool} setActiveTool={setActiveTool} />
            <ToolPanelManager activeTool={activeTool} />
        </div>
    )
}
