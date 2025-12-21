'use client'

import { useState } from "react"
import { useTheme } from "@mui/material/styles"

export function Tooltip({ label, children }: { label: string, children: React.ReactNode }) {
    const [hovered, setHovered] = useState(false)

    const theme = useTheme()

    return (
        <div
            style={{ position: "relative", display: "inline-block" }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {children}

            {hovered && (
                <div
                    style={{
                        position: "absolute",
                        left: "110%",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: theme.palette.background.default,
                        color: theme.palette.text.primary,
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "12px",
                        whiteSpace: "nowrap",
                        pointerEvents: "none",
                        zIndex: 10,
                    }}
                >
                    {label}
                </div>
            )}
        </div>
    )
}