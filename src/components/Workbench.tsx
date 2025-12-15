'use client'

import { useState } from "react"
import { ToolRail } from "./tooling/ToolRail"
import { TOOL_REGISTRY } from "@/tools/registry"

export default function Workbench() {
    const [activeTool, setActiveTool] = useState("cockpit")
    const ActiveToolComponent = TOOL_REGISTRY[activeTool].component

    return (
        <div style={{ display: "flex", height: "100vh" }}>
            <ToolRail activeToolId={activeTool} setActiveTool={setActiveTool} />

            <div style={{ flex: 1, marginLeft: "60px", padding: "16px" }}>
                <ActiveToolComponent />
            </div>
        </div>
    )
}
