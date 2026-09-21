'use client'

import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import Box from '@mui/material/Box'
import Collapse from '@mui/material/Collapse'
import Typography from '@mui/material/Typography'
import InstrumentSelector from './InstrumentSelector'
import { tuningPresets, alternateTunings, Tuning } from '@/utils/tunings'
import { DRUM_KIT_STYLE_PRESETS, DRUM_PIECES, DrumPieceId, getKitSizeForPieces } from '@/utils/drumKits'
import { getVoiceOptions } from '@/tools/playback'
import { Button, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Switch, TextField } from '@mui/material'
import { useMusic } from '@/context/MusicContext'
import { useTheme } from "@mui/material/styles"

export default function Cockpit() {
    const theme = useTheme()

    const RadarDial = dynamic(() => import('@/components/tools/widgets/RadarDial'), {
        ssr: false,
    })

    // --- UI-only state (form inputs for the custom tuning builder)
    const [newTuningName, setNewTuningName] = useState('')
    const [newTuningNotes, setNewTuningNotes] = useState('')
    const [newTuningGenre, setNewTuningGenre] = useState('')
    const [showCustomTuningForm, setShowCustomTuningForm] = useState(false)
    const [playedNotes] = useState<string[]>([])

    const {
        selectedInstrument, selectInstrument,
        selectedGenre, setSelectedGenre,
        selectedTuning, selectTuning,
        showArcs, setShowArcs,
        setUseAlternate,
        customTunings, addCustomTuning,
        tuning, setStringCount,
        selectedVoice, setSelectedVoice,
    } = useMusic()

    const isDrums = selectedInstrument === 'drums'

    // Available playback timbres for the current instrument (e.g. guitar's
    // Acoustic/Clean/Overdrive/Distortion, or drums' Acoustic/Electronic Kit)
    // — see src/tools/playback.ts.
    const voiceOptions = React.useMemo(() => getVoiceOptions(selectedInstrument), [selectedInstrument])

    // compute available tunings for the current instrument/genre filter.
    // Drums repurpose this same slot as "Kit Style" — see DRUM_KIT_STYLE_PRESETS
    // in drumKits.ts, whose `pieces` maps onto the Tuning shape's `notes`.
    const tuningOptions = React.useMemo(() => {
        if (isDrums) {
            return DRUM_KIT_STYLE_PRESETS
                .filter(s => selectedGenre === 'All' || s.genre === selectedGenre || !s.genre)
                .map((s): Tuning => ({ name: s.name, notes: s.pieces, description: s.description, genre: s.genre }))
        }

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
    }, [selectedInstrument, selectedGenre, customTunings, isDrums])

    // --- add custom tuning: persists to context (so it actually shows up in
    // the dropdown and survives reloads) and selects it immediately.
    const handleAddTuning = () => {
        const notes = newTuningNotes.split(',').map(n => n.trim()).filter(Boolean)
        if (notes.length === 0) return

        const newTuning: Tuning = {
            name: newTuningName || `Tuning ${customTunings.length + 1}`,
            notes,
            genre: newTuningGenre || 'User',
            description: 'User-defined tuning',
        }
        addCustomTuning(newTuning)
        selectTuning(newTuning)
        setNewTuningName('')
        setNewTuningNotes('')
        setNewTuningGenre('')
        setShowCustomTuningForm(false)
    }

    const resetToDefaults = () => {
        selectInstrument('guitar')
        setSelectedGenre('All')
        setShowArcs(false)
        setUseAlternate(false)
    }

    return (
        <Box height="88%" className="print:hidden">
            <Box height="100%" sx={{ bgcolor: theme.palette.background.default, borderRadius: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                    {/* pass value so InstrumentSelector can show current instrument */}
                    <InstrumentSelector
                        value={selectedInstrument}
                        stringsValue={isDrums ? getKitSizeForPieces(tuning as DrumPieceId[]) : tuning.length}
                        onChange={(val, strings) => {
                            if (val !== selectedInstrument) {
                                // Switching instrument resets to that instrument's
                                // default preset/string count.
                                selectInstrument(val)
                            } else if (isDrums ? strings !== getKitSizeForPieces(tuning as DrumPieceId[]) : strings !== tuning.length) {
                                // Same instrument, different string/piece count
                                // picked (e.g. 6 -> 7-string guitar, or 5 -> 7-piece
                                // kit) — apply it instead of silently ignoring it.
                                setStringCount(strings)
                            }
                        }}
                    />
                </Box>

                {!isDrums && (
                    <FormControlLabel
                        sx={{ color: theme.palette.text.primary, m: 0 }}
                        control={
                            <Switch
                                checked={showArcs}
                                onChange={() => setShowArcs(!showArcs)}
                                sx={{
                                    '& .MuiSwitch-switchBase.Mui-checked': { color: theme.palette.accent.main },
                                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: theme.palette.accent.main },
                                }}
                            />
                        }
                        label="Show Harmonic Arcs"
                    />
                )}

                <FormControl fullWidth>
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
                        {isDrums && <MenuItem value="Jazz">Jazz</MenuItem>}
                    </Select>
                </FormControl>

                <FormControl fullWidth>
                    <InputLabel id="tuning-label">{isDrums ? 'Kit Style' : 'Tuning'}</InputLabel>
                    <Select
                        labelId="tuning-label"
                        value={selectedTuning.name}
                        label={isDrums ? 'Kit Style' : 'Tuning'}
                        onChange={(e) => {
                            const t = tuningOptions.find(t => t.name === e.target.value)
                            if (t) selectTuning(t)
                        }}
                    >
                        {tuningOptions.length === 0 ? (
                            <MenuItem disabled>No {isDrums ? 'kit styles' : 'tunings'} available</MenuItem>
                        ) : (
                            tuningOptions.map((t) => (
                                <MenuItem key={t.name} value={t.name}>
                                    {t.name}
                                </MenuItem>
                            ))
                        )}
                    </Select>
                </FormControl>

                <FormControl fullWidth>
                    <InputLabel id="voice-label">Voice</InputLabel>
                    <Select
                        labelId="voice-label"
                        value={voiceOptions.some(v => v.id === selectedVoice) ? selectedVoice : (voiceOptions[0]?.id ?? '')}
                        label="Voice"
                        onChange={(e) => setSelectedVoice(e.target.value)}
                    >
                        {voiceOptions.map((v) => (
                            <MenuItem key={v.id} value={v.id}>
                                {v.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {!isDrums && (
                    <>
                        <Box display="flex" gap={2} flexWrap="wrap">
                            <Button variant="outlined" onClick={() => setShowCustomTuningForm(s => !s)}>
                                {showCustomTuningForm ? 'Hide Custom Tuning Form' : 'Add Custom Tuning'}
                            </Button>
                            <Button variant="text" onClick={resetToDefaults}>Reset Defaults</Button>
                        </Box>

                        <Collapse in={showCustomTuningForm}>
                            <Box
                                sx={{
                                    p: 1.5,
                                    borderRadius: 2,
                                    border: '1px solid',
                                    borderColor: 'divider',
                                }}
                            >
                                <Typography variant="subtitle2" sx={{ mb: 1 }}>Add Your Own Tuning</Typography>
                                <TextField label="Name" value={newTuningName} onChange={(e) => setNewTuningName(e.target.value)} fullWidth sx={{ mb: 1 }} />
                                <TextField label="Notes (comma-separated)" value={newTuningNotes} onChange={(e) => setNewTuningNotes(e.target.value)} fullWidth sx={{ mb: 1 }} />
                                <TextField label="Genre" value={newTuningGenre} onChange={(e) => setNewTuningGenre(e.target.value)} fullWidth sx={{ mb: 1 }} />
                                <Button variant="contained" onClick={handleAddTuning}>Add Tuning</Button>
                            </Box>
                        </Collapse>
                    </>
                )}

                {isDrums && (
                    <Box display="flex" gap={2} flexWrap="wrap">
                        <Button variant="text" onClick={resetToDefaults}>Reset Defaults</Button>
                    </Box>
                )}

                <Box
                    sx={{
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: `${theme.palette.accent.main}0f`,
                        border: '1px solid',
                        borderColor: `${theme.palette.accent.main}44`,
                    }}
                >
                    <Typography variant="subtitle1" sx={{ color: theme.palette.accent.main, fontWeight: 700 }}>{selectedTuning.name}</Typography>
                    <Typography variant='body2' color="text.secondary">
                        {selectedTuning.description}
                    </Typography>
                    <Typography variant='body2' sx={{ mt: 1 }} color="text.secondary">
                        {isDrums ? 'Pieces: ' : 'Notes: '}
                        {isDrums
                            ? selectedTuning.notes.map(id => DRUM_PIECES[id as DrumPieceId]?.label ?? id).join(' - ')
                            : selectedTuning.notes.join(' - ')}
                    </Typography>
                </Box>

                {/* The RadarDial visualizes tuning pitches around a circle of
                    fifths-style dial — meaningless for drums, which have no
                    pitches, so it's hidden entirely rather than showing a
                    dial full of nonsense positions. */}
                {!isDrums && (
                    <Box>
                        <RadarDial
                            tuning={selectedTuning?.notes ?? []}
                            showArcs={showArcs}
                            genre={selectedTuning.genre || ''}
                            playedNotes={playedNotes}
                        />
                    </Box>
                )}
            </Box>
        </Box>
    )
}
