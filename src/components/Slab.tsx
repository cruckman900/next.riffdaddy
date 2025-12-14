// /components/slab.tsx
'use client'

import { useState } from "react"
import { Grid, Box, Divider, Paper, Typography } from "@mui/material"
import InstrumentSelector from "./InstrumentSelector"
import TuningEditor from "./TuningEditor"
import ViewToggle from "./ViewToggle"
import TabRenderer from "./TabRenderer"
import StaffRenderer from "./StaffRenderer"

const Slab = () => {
    const [viewMode, setViewMode] = useState<"tab" | "staff" | "both">("tab")

    return (
        <>
            <Grid container spacing={4}>
                {/* Left Panel: Controls */}
                <Grid item xs={12} md={4}>
                    <Paper elevation={2} className="p-4 space-y-4 bg-white rounded print:hidden">
                        <Typography variant="h6">Control Panel</Typography>
                        <Divider />
                        <Box>
                            <Typography variant="subtitle2">Instrument</Typography>
                            <InstrumentSelector onChange={function (value: string): void {
                                console.log(value);
                                throw new Error("Function not implemented.")
                            }} />
                        </Box>
                        <Box>
                            <Typography variant="subtitle2">Tuning</Typography>
                            <TuningEditor />
                        </Box>
                        <Box>
                            <Typography variant="subtitle2">View Mode</Typography>
                            <ViewToggle onChange={setViewMode} />
                        </Box>
                        {/* Future: Dials, Buttons, Radar */}
                    </Paper>
                </Grid>

                {/* Right Panel: Bean Footage */}
                <Grid item xs={12} md={8}>
                    <Box
                        className="print:hidden"
                        sx={{
                            backgroundColor: '#fef3c7', // soft yellow
                            color: '#92400e',
                            padding: '8px 16px',
                            borderRadius: 1,
                            fontSize: '0.875rem',
                            marginBottom: 2,
                        }}
                    >
                        🖨️ Heads up: For best results when printing, set margins to “none” and scale to “100%” in your printer settings.
                    </Box>
                    <Box
                        id="slab-box"
                        className="bg-white rounded shadow"
                        sx={{
                            width: '100%',
                            padding: 2,
                            margin: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            '@media print': {
                                width: '100%',
                                maxWidth: 'none',
                                margin: 0,
                                padding: 0,
                                boxShadow: 'none',
                                borderRadius: 0,
                            },
                        }}
                    >
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
                </Grid>
            </Grid>
        </>
    )
}

export default Slab