'use client'

import { useState, useEffect } from "react"
import { ToolRail } from "./tooling/ToolRail"
import { ToolPanelManager } from "./tooling/ToolPanelManager"
import { TOOL_REGISTRY } from "@/tools/registry"
import ScorePreview from "./ScorePreview"
import useMediaQuery from "@mui/material/useMediaQuery"
import { useTheme } from "@mui/material/styles"
import { useMusic } from '@/context/MusicContext'

export default function Workbench() {
    const [activeTool, setActiveTool] = useState("cockpit")
    const [activeMeasureId, setActiveMeasureId] = useState<string | null>(null)
    const { measures } = useMusic()

    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

    // Default to first measure
    useEffect(() => {
        if (!activeMeasureId && measures.length > 0) {
            setActiveMeasureId(measures[0].id)
        }
    }, [measures, activeMeasureId])

    useEffect(() => {
        function handleKey(e: KeyboardEvent) {
            const entry = Object.values(TOOL_REGISTRY).find(t => t.shortcut === e.key)
            if (entry) setActiveTool(entry.id)
        }
        window.addEventListener("keydown", handleKey)
        return () => window.removeEventListener("keydown", handleKey)
    }, [])

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%", width: "100%" }}>
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                    height: isMobile ? "100%" : 'calc(100vh - 13.55rem)',
                    minHeight: isMobile ? 0 : "100%",
                    flexShrink: 0,
                    borderBottom: "1px solid #2a2f35",
                }}
            >
                {/* ToolRail */}
                <div style={{ flexShrink: 0, borderRight: "1px solid #2a2f35" }}>
                    <ToolRail activeToolId={activeTool} setActiveTool={setActiveTool} />
                </div>

                {/* ToolPanel */}
                <div
                    style={{
                        flexShrink: 0,
                        width: isMobile ? "calc(100vw - 60px)" : "30%",
                        minWidth: isMobile ? 0 : 320,
                        maxWidth: 480,
                        overflowY: "auto",
                        borderRight: "1px solid #2a2f35",
                    }}
                >
                    <ToolPanelManager activeTool={activeTool} measureId={activeMeasureId ?? undefined} />
                </div>

                {/* Desktop ScorePreview */}
                {!isMobile && (
                    <div style={{ flex: 1, overflow: "auto", background: "#0f1114" }}>
                        <ScorePreview setActiveMeasureId={setActiveMeasureId} activeMeasureId={activeMeasureId} />
                    </div>
                )}
            </div>

            {/* Mobile ScorePreview */}
            {isMobile && (
                <div
                    style={{
                        width: "100%",
                        background: "#0f1114",
                        borderTop: "1px solid #2a2f35",
                        overflow: "visible",
                        display: "block",
                    }}
                >
                    <ScorePreview setActiveMeasureId={setActiveMeasureId} activeMeasureId={activeMeasureId} />
                </div>
            )}
        </div>
    )
}
