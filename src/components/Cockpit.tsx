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
    const [selectedGenre, setSelectedGenre] = useState('All')

    const rawOptions = useAlternate
        ? alternateTunings[instrument] || []
        : [{ name: 'Standard', notes: tuningPresets[instrument] || [] }]

    const tuningOptions = useAlternate
        ? rawOptions
        : rawOptions.filter((t) => t.genre == selectedGenre)

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
                    <FormControlLabel
                        control={<Switch checked={showArcs} onChange={()=> setShowArcs(!showArcs)} /> }
                        label="Show Harmonic Arcs"
                    />
                    <FormControlLabel
                        control={<Switch checked={useAlternate} onChange={() => setUseAlternate(!useAlternate)} />}
                        label="Use Alternate Tuning"
                    />
                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel id="genre-label">Genre</InputLabel>
                        <Select
                            labelId="genre-label"
                            value={selectedGenre}
                            label="Genre"
                            onChange={(e) => setSelectedGenre(e.target.value)}
                        >
                            <MenuItem value="All">All</MenuItem>
                            <MenuItem value="Rock/Metal">Rock/Metal</MenuItem>
                            <MenuItem value="Blues">Blues</MenuItem>
                            <MenuItem value="Celtic/Fingerstyle">Celtic/Fingerstyle</MenuItem>
                            <MenuItem value="Folk">Folk</MenuItem>
                            <MenuItem value="Experimental">Experimental</MenuItem>
                        </Select>
                    </FormControl>
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
                    <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
                        <Typography variant="subtitle1">{selectedTuning.name}</Typography>
                        <Typography variant='body2' color="text.secondary">
                            {selectedTuning.description}
                        </Typography>
                        <Typography variant='body2' sx={{ mt: 1 }}>
                            Notes: {selectedTuning.notes.join(' - ')}
                        </Typography>
                    </Box>
                   <RadarDial tuning={selectedTuning?.notes ?? []} showArcs={showArcs} />
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
