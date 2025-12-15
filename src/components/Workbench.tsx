'use client'

import { useState, useEffect } from "react"
import { ToolRail } from "./tooling/ToolRail"
import { ToolPanelManager } from "./tooling/ToolPanelManager"
import { TOOL_REGISTRY } from "@/tools/registry"
import ScorePreview from "./ScorePreview"
import useMediaQuery from "@mui/material/useMediaQuery"
import { useTheme } from "@mui/material/styles"

export default function Workbench() {
    const [activeTool, setActiveTool] = useState("cockpit")

    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

    useEffect(() => {
        function handleKey(e: KeyboardEvent) {
            const entry = Object.values(TOOL_REGISTRY).find(t => t.shortcut === e.key)
            if (entry) setActiveTool(entry.id)
        }

        window.addEventListener("keydown", handleKey)
        return () => window.removeEventListener("keydown", handleKey)
    }, [])

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                minHeight: isMobile ? 0 : "100%",
                width: "100%",
            }}
        >

            {/* ✅ TOP ROW — ALWAYS SIDE BY SIDE */}
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                    height: "100%",
                    flexShrink: 0,
                    borderBottom: "1px solid #2a2f35",
                }}
            >
                {/* ToolRail */}
                <div
                    style={{
                        flexShrink: 0,
                        borderRight: "1px solid #2a2f35",
                    }}
                >
                    <ToolRail activeToolId={activeTool} setActiveTool={setActiveTool} />
                </div>

                {/* ToolPanel */}
                <div
                    style={{
                        flexShrink: 0,
                        width: isMobile ? "calc(100vw - 60px)" : "30%",  // ✅ responsive width
                        minWidth: isMobile ? 0 : 320,                    // ✅ mobile-safe minWidth
                        maxWidth: 520,
                        overflowY: "auto",
                        borderRight: "1px solid #2a2f35",
                    }}
                >
                    <ToolPanelManager activeTool={activeTool} />
                </div>

                {/* ✅ Desktop ScorePreview */}
                {!isMobile && (
                    <div
                        style={{
                            flex: 1,
                            overflow: "auto",
                            background: "#0f1114",
                        }}
                    >
                        <ScorePreview />
                    </div>
                )}
            </div>

            {/* ✅ Mobile ScorePreview — NATURAL HEIGHT */}
            {isMobile && (
                <div
                    style={{
                        width: "100%",
                        background: "#0f1114",
                        borderTop: "1px solid #2a2f35",
                        overflow: "visible",   // ✅ allow natural height
                        display: "block",       // ✅ NOT flex
                    }}
                >
                    <ScorePreview />
                </div>
            )}
        </div>
    )
}
