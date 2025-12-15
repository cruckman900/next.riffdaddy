'use client'

import { useState } from "react"
import { ToolRail } from "./tooling/ToolRail"
import { ToolPanelManager } from "./tooling/ToolPanelManager"

export default function Workbench() {
    const [activeTool, setActiveTool] = useState("cockpit")

    return (
        <div style={{ display: "flex", height: "100%", width: "100%" }}>
            <ToolRail activeToolId={activeTool} setActiveTool={setActiveTool} />
            <ToolPanelManager activeTool={activeTool} />
        </div>
    )
}
