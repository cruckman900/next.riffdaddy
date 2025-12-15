'use client'

import { ToolTemplate } from "./ToolTemplate"
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

export function TimeSignatureTool() {
    return (
        <ToolTemplate title="Time Signature" shortcut="4">
            <Typography variant="body1" mb={2}>
                Choose a time signature for your composition.
            </Typography>

            <Grid container spacing={2}>
                <Grid item xs={12}><Button fullWidth variant="contained">4 / 4</Button></Grid>
                <Grid item xs={12}><Button fullWidth variant="contained">3 / 4</Button></Grid>
                <Grid item xs={12}><Button fullWidth variant="contained">2 / 4</Button></Grid>
                <Grid item xs={12}><Button fullWidth variant="contained">6 / 8</Button></Grid>
                <Grid item xs={12}><Button fullWidth variant="contained">5 / 4</Button></Grid>
                <Grid item xs={12}><Button fullWidth variant="contained">7 / 8</Button></Grid>
            </Grid>
        </ToolTemplate>
    )
}
