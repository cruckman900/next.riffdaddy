'use client'

import Cockpit from "@/components/tools/widgets/Cockpit"
import { ToolTemplate } from "./ToolTemplate"

export function CockpitTool() {
    return (
        <ToolTemplate title="Instrument & Tuning" shortcut="1">
            <Cockpit />
        </ToolTemplate>
    )
}
