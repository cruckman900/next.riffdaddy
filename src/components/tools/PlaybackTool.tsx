'use client'

import { ToolTemplate } from "./ToolTemplate"
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Slider from '@mui/material/Slider'
import Box from '@mui/material/Box'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import StopIcon from '@mui/icons-material/Stop'
import PauseIcon from '@mui/icons-material/Pause'

export function PlaybackTool() {
    return (
        <ToolTemplate title="Playback" shortcut="5">
            <Typography variant="body1" mb={2}>
                Control playback of your composition.
            </Typography>

            <Grid container spacing={2} mb={3}>
                <Grid item xs={4}><Button fullWidth variant="contained"><StopIcon /></Button></Grid>
                <Grid item xs={4}><Button fullWidth variant="contained"><PauseIcon /></Button></Grid>
                <Grid item xs={4}><Button fullWidth variant="contained"><PlayArrowIcon /></Button></Grid>
            </Grid>

            <Box>
                <Typography variant="body2" gutterBottom>
                    Tempo
                </Typography>
                <Box sx={{ px: 1 }}>
                    <Slider
                        defaultValue={120}
                        min={40}
                        max={240}
                        step={1}
                        valueLabelDisplay="auto"
                    />
                </Box>
            </Box>
        </ToolTemplate>
    )
}
