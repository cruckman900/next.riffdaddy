'use client'

import { ToolTemplate } from "./ToolTemplate"
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

export function NoteEntryTool() {
    return (
        <ToolTemplate title="Note Entry" shortcut="2">
            <Typography variant="body1" mb={2}>
                Note entry controls will go here.
            </Typography>

            <Grid container spacing={2}>
                <Grid item>
                    <Button variant="contained">Quarter Note</Button>
                </Grid>
                <Grid item>
                    <Button variant="contained">Eighth Note</Button>
                </Grid>
                <Grid item>
                    <Button variant="contained">Sixteenth Note</Button>
                </Grid>
            </Grid>
        </ToolTemplate>
    )
}
