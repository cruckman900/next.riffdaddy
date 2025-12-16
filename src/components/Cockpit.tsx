'use client'

import { useEffect, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Collapse from '@mui/material/Collapse'
import Typography from '@mui/material/Typography'
import InstrumentSelector from './InstrumentSelector'
import { tuningPresets, alternateTunings, Tuning } from '@/utils/tunings'
import { Button, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Switch, TextField } from '@mui/material'

export default function Cockpit() {
    const RadarDial = dynamic(() => import('@/components/RadarDial'), {
        ssr: false,
    })

    // --- UI state
    const [instrument, setInstrument] = useState('guitar')
    const [showArcs, setShowArcs] = useState(true)
    const [useAlternate, setUseAlternate] = useState(false)

    // selectedTuningName may be set by user or auto-chosen
    const [selectedTuningName, setSelectedTuningName] = useState('Standard')
    const [userSelectedTuning, setUserSelectedTuning] = useState(false) // <-- track manual selection

    const [newTuningName, setNewTuningName] = useState('')
    const [newTuningNotes, setNewTuningNotes] = useState('')
    const [newTuningGenre, setNewTuningGenre] = useState('')

    const [selectedGenre, setSelectedGenre] = useState('All')
    const [showCustomTuningForm, setShowCustomTuningForm] = useState(false)
    const [userTunings, setUserTunings] = useState<Tuning[]>([])
    const [playedNotes, setPlayedNotes] = useState<string[]>([])

    // --- compute raw options and filtered options
    const rawOptions = useMemo(() => [
        ...(useAlternate ? (alternateTunings[instrument] || []) : [{ name: 'Standard', notes: tuningPresets[instrument] || [], genre: 'Standard' }]),
        ...userTunings,
    ], [instrument, useAlternate, userTunings])

    const tuningOptions = useMemo(() => {
        return selectedGenre === 'All' ? rawOptions : rawOptions.filter(t => t.genre === selectedGenre)
    }, [rawOptions, selectedGenre])

    // --- helper: choose a default tuning name from available options
    function getDefaultTuningName(options: Tuning[], instrumentName: string) {
        if (!options || options.length === 0) return ''
        // Prefer common names if present
        const preferred = ['Drop D', 'Standard', 'Open G', 'DADGAD']
        for (const p of preferred) {
            const found = options.find(o => o.name.toLowerCase() === p.toLowerCase())
            if (found) return found.name
        }
        // fallback: if there's an option whose notes match the preset, prefer it
        const presetNotes = tuningPresets[instrumentName] || []
        const matchPreset = options.find(o => JSON.stringify(o.notes) === JSON.stringify(presetNotes))
        if (matchPreset) return matchPreset.name
        // otherwise return the first available option
        return options[0].name
    }

    // --- keep selectedTuningName valid when options change
    useEffect(() => {
        // if current selection is missing from options, pick a default
        const exists = tuningOptions.some(t => t.name === selectedTuningName)
        if (!exists) {
            const defaultName = getDefaultTuningName(tuningOptions, instrument)
            setSelectedTuningName(defaultName)
            setUserSelectedTuning(false) // we auto-picked it
        }
        // otherwise do nothing (keep user's selection)
    }, [tuningOptions, selectedTuningName, instrument])

    // --- when instrument / useAlternate / genre change, re-evaluate default if user hasn't chosen manually
    useEffect(() => {
        if (userSelectedTuning) return // respect user's explicit choice
        const defaultName = getDefaultTuningName(tuningOptions, instrument)
        if (defaultName && defaultName !== selectedTuningName) {
            setSelectedTuningName(defaultName)
        }
    }, [instrument, useAlternate, selectedGenre, tuningOptions, userSelectedTuning, selectedTuningName])

    // --- when user picks a tuning from the Select, mark it as user-selected
    const handleTuningSelect = (value: string) => {
        setSelectedTuningName(value)
        setUserSelectedTuning(true)
    }

    // --- add custom tuning
    const handleAddTuning = () => {
        const notes = newTuningNotes.split(',').map(n => n.trim()).filter(Boolean)
        const newTuning: Tuning = {
            name: newTuningName || `Tuning ${userTunings.length + 1}`,
            notes,
            genre: newTuningGenre || 'User',
            description: 'User-defined tuning',
        }
        setUserTunings(prev => [...prev, newTuning])
        setSelectedTuningName(newTuning.name)
        setUserSelectedTuning(true)
        setNewTuningName('')
        setNewTuningNotes('')
        setNewTuningGenre('')
    }

    // --- optional: reset defaults (clears manual selection)
    const resetToDefaults = () => {
        setInstrument('guitar')
        setShowArcs(true)
        setUseAlternate(false)
        setSelectedGenre('All')
        setUserTunings([])
        setUserSelectedTuning(false)
        // compute default for the default instrument
        const defaultName = getDefaultTuningName([
            { name: 'Standard', notes: tuningPresets['guitar'] || [], genre: 'Standard' }
        ], 'guitar')
        setSelectedTuningName(defaultName)
    }

    const selectedTuning = tuningOptions.find(t => t.name === selectedTuningName) || tuningOptions[0] || { name: 'Unknown', notes: [], description: 'No tuning available' }

    return (
        <Grid spacing={4} height="100%">
            <Grid item xs={12} md={4} height="100%">
                <Box className="print:hidden" height="100%" sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3 }}>
                    <Box sx={{ mb: 2 }}>
                        {/* pass value so InstrumentSelector can show current instrument */}
                        <InstrumentSelector value={instrument} onChange={(val) => {
                            setInstrument(val)
                            setUserSelectedTuning(false) // allow auto-defaulting after instrument change
                        }} />
                    </Box>

                    <FormControlLabel
                        sx={{ color: 'text.primary' }}
                        control={<Switch checked={showArcs} onChange={() => setShowArcs(s => !s)} />}
                        label="Show Harmonic Arcs"
                    />
                    <FormControlLabel
                        sx={{ color: 'text.primary' }}
                        control={<Switch checked={useAlternate} onChange={() => {
                            setUseAlternate(s => !s)
                            setUserSelectedTuning(false) // re-evaluate default when toggling alternate
                        }} />}
                        label="Use Alternate Tuning"
                    />

                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel id="genre-label">Genre</InputLabel>
                        <Select
                            labelId="genre-label"
                            value={selectedGenre}
                            label="Genre"
                            onChange={(e) => {
                                setSelectedGenre(e.target.value as string)
                                setUserSelectedTuning(false) // re-evaluate default when genre changes
                            }}
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
                            onChange={(e) => handleTuningSelect(e.target.value as string)}
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
                        <Button variant="outlined" onClick={() => setShowCustomTuningForm(s => !s)} sx={{ mb: 1 }}>
                            {showCustomTuningForm ? 'Hide Custom Tuning Form' : 'Add Custom Tuning'}
                        </Button>
                        <Button variant="text" onClick={resetToDefaults} sx={{ ml: 2, mb: 1 }}>Reset Defaults</Button>
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
        </Grid>
    )
}
