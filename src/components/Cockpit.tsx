import { useState } from 'react'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import InstrumentSelector from './InstrumentSelector'
import RadarDial from './RadarDial'
import { tuningPresets, alternateTunings } from '@/utils/tunings'
import { FormControl, FormControlLabel, InputLabel, MenuItem, Select, Switch } from '@mui/material'

export default function Cockpit() {
    const [instrument, setInstrument] = useState("guitar")
    const [showArcs, setShowArcs] = useState(true)
    const [useAlternate, setUseAlternate] = useState(false)
    const [selectedTuningName, setSelectedTuningName] = useState('Drop D')

    const tuningOptions = useAlternate
        ? alternateTunings[instrument] || []
        : [{ name: 'Standard', notes: tuningPresets[instrument] || [] }]

    const selectedTuning = tuningOptions.find((t) => t.name == selectedTuningName) || tuningOptions[0]

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
                        <InstrumentSelector onChange={setInstrument} />
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
                    <FormControlLabel
                        control={<Switch checked={showArcs} onChange={()=> setShowArcs(!showArcs)} /> }
                        label="Show Harmonic Arcs"
                    />
                    <FormControlLabel
                        control={<Switch checked={useAlternate} onChange={() => setUseAlternate(!useAlternate)} />}
                        label="Use Alternate Tuning"
                    />
                    <FormControl fullWidth>
                        <InputLabel id="tuning-label">Tuning</InputLabel>
                        <Select
                            labelId="tuning-label"
                            value={selectedTuningName}
                            label="Tuning"
                            onChange={(e) => setSelectedTuningName(e.target.value)}
                        >
                            {tuningOptions.map((tuning) => (
                                <MenuItem key={tuning.name} value={tuning.name}>
                                    {tuning.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                   <RadarDial tuning={selectedTuning?.notes ?? []} showArcs={showArcs} />
                </Box>
            </Grid>
        </Grid>
    )
}
