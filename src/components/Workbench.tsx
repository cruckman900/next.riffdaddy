'use client'

import { useState, useEffect } from "react"
import { ToolRail } from "./tooling/ToolRail"
import { ToolPanelManager } from "./tooling/ToolPanelManager"
import { TOOL_REGISTRY } from "@/tools/registry"
import ScorePreview from "./renderers/ScorePreview"
import useMediaQuery from "@mui/material/useMediaQuery"
import { useTheme } from "@mui/material/styles"
import { useMusic } from '@/context/MusicContext'

export default function Workbench() {
    // const [activeTool, setActiveTool] = useState("cockpit")
    const { activeTool, setActiveTool } = useMusic()
    const [activeMeasureId, setActiveMeasureId] = useState<string | null>(null)
    const { measures } = useMusic()

    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

    // Default to first measure — also re-anchors when the current
    // activeMeasureId no longer exists in `measures` at all (not just when
    // it's unset), since switching workspace tabs replaces the whole
    // measures array wholesale (see MusicContext's per-tab composition
    // state) and the previously active measure id would otherwise point at
    // nothing, silently breaking note entry.
    useEffect(() => {
        if (measures.length === 0) {
            if (activeMeasureId !== null) setActiveMeasureId(null)
            return
        }
        const stillExists = activeMeasureId != null && measures.some(m => m.id === activeMeasureId)
        if (!stillExists) {
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
    }, [setActiveTool])

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%", width: "100%" }}>
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    minWidth: "100%",
                    height: isMobile ? "100%" : 'calc(100vh - 13.55rem)',
                    minHeight: isMobile ? 0 : "100%",
                    flexShrink: 0,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                }}
            >
                {/* ToolRail */}
                <div style={{ flexShrink: 0, borderRight: `1px solid ${theme.palette.divider}` }}>
                    <ToolRail activeToolId={activeTool} setActiveTool={setActiveTool} />
                </div>

                {/* ToolPanel */}
                <div
                    style={{
                        flexShrink: 0,
                        width: isMobile ? "calc(100vw - 60px)" : "30%",
                        minWidth: isMobile ? 0 : 320,
                        maxWidth: 380,
                        overflowY: "auto",
                        backgroundColor: theme.palette.muted.main,
                        borderRight: `1px solid ${theme.palette.divider}`,
                    }}
                >
                    <ToolPanelManager activeTool={activeTool} measureId={activeMeasureId ?? undefined} />
                </div>

                {/* Desktop ScorePreview */}
                {!isMobile && (
                    <div style={{ flex: 1, width: "100%", overflow: "auto", backgroundColor: theme.palette.background.default }}>
                        <ScorePreview setActiveMeasureId={setActiveMeasureId} activeMeasureId={activeMeasureId} />
                    </div>
                )}
            </div>

            {/* Mobile ScorePreview */}
            {isMobile && (
                <div
                    style={{
                        width: "100%",
                        borderTop: `1px solid ${theme.palette.divider}`,
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
