'use client'

import { ToolTemplate } from "./ToolTemplate"
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

export function RestEntryTool() {
    return (
        <ToolTemplate title="Rest Entry" shortcut="3">
            <Typography variant="body1" mb={2}>
                Select a rest duration to insert into the score.
            </Typography>

            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Button fullWidth variant="contained">Whole Rest</Button>
                </Grid>
                <Grid item xs={12}>
                    <Button fullWidth variant="contained">Half Rest</Button>
                </Grid>
                <Grid item xs={12}>
                    <Button fullWidth variant="contained">Quarter Rest</Button>
                </Grid>
                <Grid item xs={12}>
                    <Button fullWidth variant="contained">Eighth Rest</Button>
                </Grid>
                <Grid item xs={12}>
                    <Button fullWidth variant="contained">Sixteenth Rest</Button>
                </Grid>
            </Grid>
        </ToolTemplate>
    )
}
