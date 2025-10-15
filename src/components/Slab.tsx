// /components/slab.tsx
'use client'

import { useState } from "react"
import { Box } from "@mui/material"
import InstrumentSelector from "./InstrumentSelector"
import TuningEditor from "./TuningEditor"
import ViewToggle from "./ViewToggle"
import TabRenderer from "./TabRenderer"
import StaffRenderer from "./StaffRenderer"

const Slab = () => {
    const [viewMode, setViewMode] = useState<"tab" | "staff" | "both">("tab")

    return (
        <Box className="bg-white rounded shadow p-4 sm:p-6 space-y-4 max-w-3xl mx-auto">
            <div className="flex flex-wrap items-center gap-2 mb-4 text-sm">
                <InstrumentSelector />
                <ViewToggle onChange={setViewMode} />
            </div>

            <TuningEditor />

            {viewMode == "tab" &&
                <TabRenderer
                    tuning={["E4", "B3", "G3", "D3", "A2", "E2"]}
                    notes={[
                        { str: 1, fret: 3, duration: "q" },
                        { str: 2, fret: 0, duration: "q" },
                        { str: 3, fret: 0, duration: "q" },
                        { str: 4, fret: 2, duration: "q" },
                    ]} />
            }
            {viewMode == "staff" &&
                <StaffRenderer
                    notes={["C4", "E4", "C5", "C5"]} // 4 quarter notes
                    timeSignature={"4/4"}
                />
            }
            {viewMode == "both" && (
                <>
                    <TabRenderer
                        tuning={["E4", "B3", "G3", "D3", "A2", "E2"]}
                        notes={[
                            { str: 1, fret: 3, duration: "q" },
                            { str: 2, fret: 0, duration: "q" },
                            { str: 3, fret: 0, duration: "q" },
                            { str: 4, fret: 2, duration: "q" },
                        ]}
                    />
                    <StaffRenderer
                        notes={["C4", "E4", "C5", "C5"]} // 4 quarter notes
                        timeSignature={"4/4"}
                    />
                </>
            )}
        </Box>
    )
}

export default Slab