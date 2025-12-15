'use client'

import { useState } from "react"

export function Tooltip({ label, children }: { label: string, children: React.ReactNode }) {
    const [hovered, setHovered] = useState(false)

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
                        background: "#111",
                        color: "#fff",
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