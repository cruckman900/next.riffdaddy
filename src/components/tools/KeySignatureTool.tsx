'use client'

import { ToolTemplate } from "./ToolTemplate"
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

export function KeySignatureTool() {
    const keys = [
        "C Major / A Minor",
        "G Major / E Minor",
        "D Major / B Minor",
        "A Major / F# Minor",
        "E Major / C# Minor",
        "B Major / G# Minor",
        "F# Major / D# Minor",
        "F Major / D Minor",
    ]

    return (
        <ToolTemplate title="Key Signature" shortcut="5">
            <Typography variant="body2" sx={{ mb: 2 }}>
                Select a key signature:
            </Typography>

            <Box>
                <Grid container spacing={2}>
                    {keys.map((label, i) => (
                        <Grid item xs={12} key={i}>
                            <Button
                                fullWidth
                                variant="contained"
                                size="small"
                                sx={{ textTransform: 'none' }}
                            >
                                {label}
                            </Button>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </ToolTemplate>
    )
}
