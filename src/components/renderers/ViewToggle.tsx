'use client'

import { useState, useEffect } from "react";

export default function ViewToggle({
    onChange,
}: {
    onChange: (mode: "tab" | "staff" | "combined") => void
}) {
    const [viewMode, setViewMode] = useState<"tab" | "staff" | "combined">("tab")

    useEffect(() => {
        onChange(viewMode)
    }, [viewMode, onChange])

    return (
        <div className="flex gap-2 print:hidden">
            <button onClick={() => setViewMode("tab")} className="px-2 py-1 border rounded">Tab</button>
            <button onClick={() => setViewMode("staff")} className="px-2 py-1 border rounded">Staff</button>
            <button onClick={() => setViewMode("combined")} className="px-2 py-1 border rounded">Combined</button>
        </div>
    );
}