'use client'

import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Collapse from '@mui/material/Collapse'
import Typography from '@mui/material/Typography'
import InstrumentSelector from './InstrumentSelector'
import { tuningPresets, alternateTunings, Tuning } from '@/utils/tunings'
import { Button, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Switch, TextField } from '@mui/material'
import { useMusic } from '@/context/MusicContext'

export default function Cockpit() {
    const RadarDial = dynamic(() => import('@/components/tools/widgets/RadarDial'), {
        ssr: false,
    })

    // --- UI state
    const [instrument, setInstrument] = useState('guitar')

    // selectedTuningName may be set by user or auto-chosen
    const [selectedTuningName, setSelectedTuningName] = useState('Standard')
    const [userSelectedTuning, setUserSelectedTuning] = useState(false) // <-- track manual selection

    const [newTuningName, setNewTuningName] = useState('')
    const [newTuningNotes, setNewTuningNotes] = useState('')
    const [newTuningGenre, setNewTuningGenre] = useState('')

    const [showCustomTuningForm, setShowCustomTuningForm] = useState(false)
    const [userTunings, setUserTunings] = useState<Tuning[]>([])
    const [playedNotes, setPlayedNotes] = useState<string[]>([])

    const {
        selectedInstrument, setSelectedInstrument,
        selectedGenre, setSelectedGenre,
        selectedTuning, setSelectedTuning,
        showArcs, setShowArcs,
        useAlternate, setUseAlternate,
        customTunings, addCustomTuning,
        tuning, setTuning,
    } = useMusic()

    // compute available tunings
    const tuningOptions = React.useMemo(() => {
        const options: Tuning[] = []

        // always include standard
        options.push({
            name: "Standard",
            notes: tuningPresets[selectedInstrument],
            description: "Default tuning",
        })

        // include alternate tunings
        const alts = alternateTunings[selectedInstrument] ?? []
        const filtered = selectedGenre === "All"
            ? alts
            : alts.filter(t => t.genre === selectedGenre)
        options.push(...filtered)

        // include custom tunings for this instrument
        const customs = customTunings.filter(
            t => t.genre === selectedGenre || selectedGenre === "All"
        )
        options.push(...customs)

        return options
    }, [selectedInstrument, selectedGenre, customTunings])

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

    return (
        <Grid spacing={4} height="88%">
            <Grid item xs={12} md={4} height="100%">
                <Box className="print:hidden" height="100%" sx={{ bgcolor: 'background.paper', borderRadius: 2, overflowY: 'auto' }}>
                    <Box sx={{ mb: 2 }}>
                        {/* pass value so InstrumentSelector can show current instrument */}
                        <InstrumentSelector value={selectedInstrument} onChange={(val) => {
                            setSelectedInstrument(val)
                            setUserSelectedTuning(false) // allow auto-defaulting after instrument change
                        }} />
                    </Box>

                    <FormControlLabel
                        sx={{ color: 'text.primary' }}
                        control={<Switch checked={showArcs} onChange={() => setShowArcs(!showArcs)} />}
                        label="Show Harmonic Arcs"
                    />

                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel id="genre-label">Genre</InputLabel>
                        <Select
                            labelId="genre-label"
                            value={selectedGenre}
                            label="Genre"
                            onChange={(e) => { setSelectedGenre(e.target.value) }}
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
                            value={selectedTuning.name}
                            label="Tuning"
                            onChange={(e) => {
                                const tuning = tuningOptions.find(t => t.name === e.target.value)
                                if (tuning) setSelectedTuning(tuning)
                            }}
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

                    <Box sx={{ p: 1, bgcolor: 'background.paper', borderRadius: 2 }}>
                        <Typography variant="subtitle1">{selectedTuning.name}</Typography>
                        <Typography variant='body2' color="text.secondary">
                            {selectedTuning.description}
                        </Typography>
                        <Typography variant='body2' sx={{ mt: 1, color: 'GrayText' }}>
                            Notes: {selectedTuning.notes.join(' - ')}
                        </Typography>
                    </Box>

                    <Box sx={{ mt: 2 }}>
                        <RadarDial
                            tuning={selectedTuning?.notes ?? []}
                            showArcs={showArcs}
                            genre={selectedTuning.genre || ''}
                            playedNotes={playedNotes}
                        />
                    </Box>
                </Box>
            </Grid>
        </Grid>
    )
}
