import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import InstrumentSelector from './InstrumentSelector'

export default function Cockpit() {
    return (
        <Grid container spacing={4}>
            {/* Control Panel */}
            <Grid item xs={12} md={4}>
                <Box sx={{ bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Control Panel
                    </Typography>
                    {/* TODO: Add Instrument, Tuning, View Mode, Radar*/}
                    <Box sx={{ mb: 2 }}>
                        <InstrumentSelector />
                    </Box>
                </Box>
            </Grid>

            {/* Renderer Slab */}
            <Grid item xs={12} md={8}>
                <Box sx={{ p: 2, bgcolor: 'Background.default', borderRadius: 2, boxShadow: 1 }}>
                    <Typography variant="h6" gutterBottom>
                        Renderer Slab
                    </Typography>
                    {/* TODO: Add Tab/Staff/Both view */}
                </Box>
            </Grid>
        </Grid>
    )
}
