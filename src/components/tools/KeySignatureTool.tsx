'use client'

import { ToolTemplate } from "./ToolTemplate"
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

export function KeySignatureTool() {
    return (
        <ToolTemplate title="Key Signature" shortcut="5">
            <Typography variant="body1" mb={2}>
                Select a key signature.
            </Typography>

            <Grid container spacing={2}>
                <Grid item xs={12}><Button fullWidth variant="contained">C Major / A Minor</Button></Grid>
                <Grid item xs={12}><Button fullWidth variant="contained">G Major / E Minor</Button></Grid>
                <Grid item xs={12}><Button fullWidth variant="contained">D Major / B Minor</Button></Grid>
                <Grid item xs={12}><Button fullWidth variant="contained">A Major / F# Minor</Button></Grid>
                <Grid item xs={12}><Button fullWidth variant="contained">E Major / C# Minor</Button></Grid>
                <Grid item xs={12}><Button fullWidth variant="contained">B Major / G# Minor</Button></Grid>
                <Grid item xs={12}><Button fullWidth variant="contained">F# Major / D# Minor</Button></Grid>
                <Grid item xs={12}><Button fullWidth variant="contained">F Major / D Minor</Button></Grid>
            </Grid>
        </ToolTemplate>
    )
}
