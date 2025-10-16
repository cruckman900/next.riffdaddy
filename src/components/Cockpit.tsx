'use client'

import { useState } from 'react'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Collapse from '@mui/material/Collapse'
import Typography from '@mui/material/Typography'

import InstrumentSelector from './InstrumentSelector'
import RadarDial from './RadarDial'
import { tuningPresets, alternateTunings, Tuning } from '@/utils/tunings'
import { Button, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Switch, TextField } from '@mui/material'

import TabRenderer from './TabRenderer'
import StaffRenderer from './StaffRenderer'

export default function Cockpit() {
    const [instrument, setInstrument] = useState("guitar")
    const [showArcs, setShowArcs] = useState(true)
    const [useAlternate, setUseAlternate] = useState(false)
    const [selectedTuningName, setSelectedTuningName] = useState('Drop D')

    const [newTuningName, setNewTuningName] = useState('')
    const [newTuningNotes, setNewTuningNotes] = useState('')
    const [newTuningGenre, setNewTuningGenre] = useState('')

    const [selectedGenre, setSelectedGenre] = useState('All')

    const [showCustomTuningForm, setShowCustomTuningForm] = useState(false);
    const [userTunings, setUserTunings] = useState<Tuning[]>([])

    const rawOptions = [
        ...(useAlternate ? alternateTunings[instrument] || [] : [{ name: 'Standard', notes: tuningPresets[instrument] || [] }]),
        ...userTunings,
    ];

    const tuningOptions =
        selectedGenre === 'All'
            ? rawOptions
            : rawOptions.filter((t) => t.genre === selectedGenre);

    const selectedTuning =
        tuningOptions.find((t) => t.name === selectedTuningName) || tuningOptions[0] || {
            name: 'Unknown',
            notes: [],
            description: 'No tuning available',
        };

    const handleAddTuning = () => {
        const notes = newTuningNotes.split(',')
        const newTuning: Tuning = {
            name: newTuningName,
            notes,
            genre: newTuningGenre,
            description: 'User-defined tuning',
        }
        setUserTunings([...userTunings, newTuning])
        setSelectedTuningName(newTuning.name)
        setNewTuningName('')
        setNewTuningNotes('')
        setNewTuningGenre('')
    }

    const [playedNotes, setPlayedNotes] = useState<string[]>([])

    const [viewMode, setViewMode] = useState<'tab' | 'staff' | 'both'>('tab')

    return (
        <Grid container spacing={4}>
            {/* Control Panel (non-printable) */}
            <Grid item xs={12} md={4}>
                <Box className="print:hidden" sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3 }}>
                    <Box sx={{ mb: 2 }}>
                        <InstrumentSelector onChange={setInstrument} />
                    </Box>

                    <FormControlLabel
                        sx={{ color: 'text.primary' }}
                        control={<Switch checked={showArcs} onChange={() => setShowArcs(!showArcs)} />}
                        label="Show Harmonic Arcs"
                    />
                    <FormControlLabel
                        sx={{ color: 'text.primary' }}
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
                            {tuningOptions.length === 0 ? (
                                <MenuItem disabled>No tunings available</MenuItem>
                            ) : (
                                tuningOptions.map((tuning) => (
                                    <MenuItem key={tuning.name} value={tuning.name}>
                                        {tuning.name}
                                    </MenuItem>
                                ))
                            )}
                        </Select>
                    </FormControl>

                    <Box sx={{ mt: 2 }}>
                        <Button
                            variant="outlined"
                            onClick={() => setShowCustomTuningForm(!showCustomTuningForm)}
                            sx={{ mb: 1 }}
                        >
                            {showCustomTuningForm ? 'Hide Custom Tuning Form' : 'Add Custom Tuning'}
                        </Button>
                    </Box>

                    <Collapse in={showCustomTuningForm}>
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle2">Add Your Own Tuning</Typography>
                            <TextField label="Name" value={newTuningName} onChange={(e) => setNewTuningName(e.target.value)} fullWidth sx={{ mb: 1 }} />
                            <TextField label="Notes (comma-separated)" value={newTuningNotes} onChange={(e) => setNewTuningNotes(e.target.value)} fullWidth sx={{ mb: 1 }} />
                            <TextField label="Genre" value={newTuningGenre} onChange={(e) => setNewTuningGenre(e.target.value)} fullWidth sx={{ mb: 1 }} />
                            <Button variant="contained" onClick={handleAddTuning}>Add Tuning</Button>
                        </Box>
                    </Collapse>

                    <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
                        <Typography variant="subtitle1">{selectedTuning.name}</Typography>
                        <Typography variant='body2' color="text.secondary">
                            {selectedTuning.description}
                        </Typography>
                        <Typography variant='body2' sx={{ mt: 1, color: 'GrayText' }}>
                            Notes: {selectedTuning.notes.join(' - ')}
                        </Typography>
                    </Box>

                    <RadarDial
                        tuning={selectedTuning?.notes ?? []}
                        showArcs={showArcs}
                        genre={selectedTuning.genre || ''}
                        playedNotes={playedNotes}
                    />
                </Box>
            </Grid>

            {/* Renderer Slab (printable) */}
            <Grid item xs={12} md={8}>
                <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 2, boxShadow: 1 }}>
                    <FormControl fullWidth className="print:hidden">
                        <InputLabel id="view-mode-label" sx={{ color: 'WindowText' }}>View Mode</InputLabel>
                        <Select
                            labelId="view-mode-label"
                            value={viewMode}
                            label="View Mode"
                            onChange={(e) => setViewMode(e.target.value as 'tab' | 'staff' | 'both')}
                            sx={{
                                color: 'GrayText',
                                '.MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'GrayText',
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'primary.main',
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'primary.light',
                                },
                                '.MuiSvgIcon-root': {
                                    color: 'GrayText',
                                },
                            }}
                        >
                            <MenuItem value="tab">Tab</MenuItem>
                            <MenuItem value="staff">Staff</MenuItem>
                            <MenuItem value="both">Both</MenuItem>
                        </Select>
                </FormControl>

                <Box
                    className="print:hidden"
                    sx={{
                        backgroundColor: '#fef3c7',
                        color: '#92400e',
                        padding: '8px 16px',
                        borderRadius: 1,
                        fontSize: '0.875rem',
                        marginBottom: 2,
                    }}
                >
                    🖨️ Heads up: For best results when printing, set margins to “none” and scale to “100%” in your printer settings.
                </Box>

                {/* Printable Renderers */}
                {viewMode === 'tab' && (
                    <TabRenderer
                        tuning={["E4", "B3", "G3", "D3", "A2", "E2"]}
                        notes={[
                            { str: 1, fret: 3, duration: "q" },
                            { str: 2, fret: 0, duration: "q" },
                            { str: 3, fret: 0, duration: "q" },
                            { str: 4, fret: 2, duration: "q" },
                        ]}
                    />
                )}
                {viewMode === 'staff' && (
                    <StaffRenderer
                        notes={["C4", "E4", "C5", "C5"]}
                        timeSignature={"4/4"}
                    />
                )}
                {viewMode === 'both' && (
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
                            notes={["C4", "E4", "C5", "C5"]}
                            timeSignature={"4/4"}
                        />
                    </>
                )}
            </Box>
        </Grid>
        </Grid >
    )
}
