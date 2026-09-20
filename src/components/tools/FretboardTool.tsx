'use client'

import { ToolTemplate } from "./ToolTemplate"
import { useMusic } from '@/context/MusicContext'
import { Typography, Box, Button, Grid, Stack, Divider } from '@mui/material'
import { ToolProps } from '@/types/tooling'
import { useState } from 'react'
import React from "react"
import { useTheme } from '@mui/material/styles'

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const DIVISIONS = [0, 3, 5, 7, 9, 12, 15, 17, 19, 21, 24]

function noteToMidi(note: string): number {
    const match = note.match(/^([A-G]#?)(\d+)$/)
    if (!match) return 0
    const [, pitch, octaveStr] = match
    const octave = parseInt(octaveStr, 10)
    const semitone = NOTES.indexOf(pitch)
    return (octave + 1) * 12 + semitone
}

function midiToNote(midi: number): string {
    const pitch = NOTES[midi % 12]
    const octave = Math.floor(midi / 12) - 1
    return `${pitch}${octave}`
}

export function FretboardTool({ measureId, duration }: ToolProps) {
    const theme = useTheme()
    const { addNote, tuning, measures, pendingNoteAction, setPendingNoteAction, insertNoteRelative, updateNote } = useMusic()
    const dur = duration ?? 'q'
    const mid = measureId ?? ''

    const [fretCount, setFretCount] = useState(12)
    const [showOctave, setShowOctave] = useState(false)
    const [selectedNotes, setSelectedNotes] = useState<
        { string: number; fret: number; pitch: string }[]
    >([])

    // When the notation toolbar's Edit action targets a note, pre-populate
    // this tool's selection with that note's existing pitches so the user
    // sees (and can tweak) what's already there instead of starting blank.
    const pendingKey = pendingNoteAction ? `${pendingNoteAction.measureId}:${pendingNoteAction.noteId}:${pendingNoteAction.mode}` : null
    React.useEffect(() => {
        if (!pendingNoteAction || pendingNoteAction.mode !== 'edit') return
        const anchor = measures
            .find(m => m.id === pendingNoteAction.measureId)
            ?.notes.find(n => n.id === pendingNoteAction.noteId)
        if (!anchor) return
        const strings = Array.isArray(anchor.string) ? anchor.string : anchor.string != null ? [anchor.string] : []
        const frets = Array.isArray(anchor.fret) ? anchor.fret : anchor.fret != null ? [anchor.fret] : []
        const pitches = Array.isArray(anchor.pitch) ? anchor.pitch : anchor.pitch ? [anchor.pitch] : []
        setSelectedNotes(strings.map((s, i) => ({ string: s, fret: frets[i] ?? 0, pitch: pitches[i] ?? '' })))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pendingKey])

    const toggleSelect = (string: number, fret: number, pitch: string) => {
        const exists = selectedNotes.find(n => n.string === string && n.fret === fret)
        if (exists) {
            setSelectedNotes(selectedNotes.filter(n => !(n.string === string && n.fret === fret)))
        } else {
            setSelectedNotes([...selectedNotes, { string, fret, pitch }])
        }
    }

    const commitChord = () => {
        if (selectedNotes.length === 0) return

        if (pendingNoteAction) {
            const { mode, measureId: targetMeasureId, noteId } = pendingNoteAction
            const payload = {
                string: selectedNotes.map(n => n.string),
                fret: selectedNotes.map(n => n.fret),
                pitch: selectedNotes.map(n => n.pitch),
                duration: dur,
            }
            if (mode === 'edit') {
                updateNote(targetMeasureId, noteId, payload)
            } else {
                insertNoteRelative(targetMeasureId, noteId, mode === 'insert-before' ? 'before' : 'after', payload)
            }
            setPendingNoteAction(null)
            setSelectedNotes([])
            return
        }

        if (!mid) return
        addNote(mid, {
            string: selectedNotes.map(n => n.string),
            fret: selectedNotes.map(n => n.fret),
            pitch: selectedNotes.map(n => n.pitch),
            duration: dur,
        })
        setSelectedNotes([])
    }

    const cancelPendingAction = () => {
        setPendingNoteAction(null)
        setSelectedNotes([])
    }

    const isSelected = (string: number, fret: number) =>
        selectedNotes.some(n => n.string === string && n.fret === fret)

    const { addRest } = useMusic()
    const handleAddRest = () => {
        addRest(mid, { duration: dur })
    }

    return (
        <ToolTemplate title="Fretboard Input" shortcut="3">
            {pendingNoteAction && (
                <Box
                    sx={{
                        mb: 2,
                        p: 1.5,
                        borderRadius: 1.5,
                        border: '1px solid',
                        borderColor: theme.palette.accent.main,
                        bgcolor: `${theme.palette.accent.main}1a`,
                    }}
                >
                    <Typography variant="body2" sx={{ fontWeight: 700, color: theme.palette.accent.main }}>
                        {pendingNoteAction.mode === 'edit' && 'Editing selected note'}
                        {pendingNoteAction.mode === 'insert-before' && 'Inserting a note before the selected one'}
                        {pendingNoteAction.mode === 'insert-after' && 'Inserting a note after the selected one'}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                        Pick frets below, then Commit — or Cancel to go back to normal input.
                    </Typography>
                    <Box mt={1}>
                        <Button size="small" onClick={cancelPendingAction}>Cancel</Button>
                    </Box>
                </Box>
            )}

            <Button fullWidth variant="contained" onClick={handleAddRest} disabled={!!pendingNoteAction}>
                Insert a {dur} rest.
            </Button>

            <Divider sx={{ my: 2 }} />

            <Typography variant="body1">
                Click frets to select notes.
            </Typography>

            <Typography variant="body2" mb={2}>
                Commit them as a chord or single note.
            </Typography>

            {/* Toggles */}
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" gap={1} mb={2}>
                <Typography variant="caption" sx={{ opacity: 0.7, mr: 0.5 }}>
                    Frets:
                </Typography>
                {[12, 21, 24].map(count => {
                    const active = fretCount === count
                    return (
                        <Box
                            key={count}
                            component="button"
                            onClick={() => setFretCount(count)}
                            sx={{
                                cursor: 'pointer',
                                border: '1px solid',
                                borderColor: active ? theme.palette.accent.main : 'divider',
                                borderRadius: 999,
                                px: 1.5,
                                py: 0.25,
                                fontSize: '0.8rem',
                                fontWeight: active ? 700 : 400,
                                color: active ? theme.palette.accent.main : theme.palette.text.secondary,
                                bgcolor: active ? `${theme.palette.accent.main}1a` : 'transparent',
                                boxShadow: active ? `0 0 8px ${theme.palette.accent.main}66` : 'none',
                                transition: 'all 0.15s ease',
                            }}
                        >
                            {count}
                        </Box>
                    )
                })}
                <Box
                    component="button"
                    onClick={() => setShowOctave(!showOctave)}
                    sx={{
                        cursor: 'pointer',
                        border: '1px solid',
                        borderColor: showOctave ? theme.palette.accent.main : 'divider',
                        borderRadius: 999,
                        px: 1.5,
                        py: 0.25,
                        ml: 1,
                        fontSize: '0.8rem',
                        fontWeight: showOctave ? 700 : 400,
                        color: showOctave ? theme.palette.accent.main : theme.palette.text.secondary,
                        bgcolor: showOctave ? `${theme.palette.accent.main}1a` : 'transparent',
                        boxShadow: showOctave ? `0 0 8px ${theme.palette.accent.main}66` : 'none',
                        transition: 'all 0.15s ease',
                    }}
                >
                    {showOctave ? 'Octaves On' : 'Octaves Off'}
                </Box>
            </Stack>

            {/* Top tuning labels */}
            <Box display="flex" justifyContent="center" gap={0.5} mb={1}>
                <Typography variant="caption" sx={{ width: 32 }} /> {/* spacer */}
                {tuning.map((openNote, sIdx) => (
                    <Typography
                        key={sIdx}
                        variant="caption"
                        sx={{ width: 32, textAlign: 'center' }}
                    >
                        {openNote}
                    </Typography>
                ))}
                <Typography variant="caption" sx={{ width: 32 }} /> {/* spacer */}
            </Box>

            {/* Fretboard grid */}
            <Grid container spacing={0.5}>
                {Array.from({ length: fretCount + 1 }).map((_, fIdx) => (
                    <React.Fragment key={fIdx}>
                        {DIVISIONS.includes(fIdx) && (
                            <Divider sx={{ width: '100%', my: 0.2, opacity: 0 }} />
                        )}
                        <Grid item xs={12} key={fIdx}>
                            <Box display="flex" gap={0.5} justifyContent="center" alignItems="center">
                                <Typography variant={DIVISIONS.includes(fIdx) ? 'subtitle2' : 'caption'} sx={{ width: 32, textAlign: 'right' }}>
                                    {fIdx}
                                </Typography>
                                {tuning.map((openNote, sIdx) => {
                                    const midi = noteToMidi(openNote) + fIdx
                                    const pitch = midiToNote(midi)
                                    const stringNum = tuning.length - sIdx
                                    const selected = isSelected(stringNum, fIdx)
                                    return (
                                        <Button
                                            key={sIdx}
                                            size="small"
                                            variant={selected ? 'contained' : 'outlined'}
                                            sx={{
                                                minWidth: 32,
                                                height: DIVISIONS.includes(fIdx) ? 26 : 24,
                                                padding: 0,
                                                fontSize: '0.7rem',
                                                transition: 'box-shadow 0.15s ease, transform 0.15s ease',
                                                backgroundColor: selected ? theme.palette.accent.main : undefined,
                                                borderColor: selected ? theme.palette.accent.main : undefined,
                                                color: selected ? theme.palette.getContrastText(theme.palette.accent.main) : undefined,
                                                boxShadow: selected ? `0 0 10px ${theme.palette.accent.main}88` : 'none',
                                                '&:hover': {
                                                    transform: 'scale(1.05)',
                                                },
                                            }}
                                            onClick={() => toggleSelect(stringNum, fIdx, pitch)}
                                        >
                                            {showOctave ? pitch : pitch.replace(/\d+$/, '')}
                                        </Button>
                                    )
                                })}
                                <Typography variant={DIVISIONS.includes(fIdx) ? 'subtitle2' : 'caption'} sx={{ width: 32, textAlign: 'left' }}>
                                    {fIdx}
                                </Typography>
                            </Box>
                        </Grid>
                        {DIVISIONS.includes(fIdx) && (
                            <Divider sx={{ width: '100%', my: 0.2, opacity: 0 }} />
                        )}
                    </React.Fragment>
                ))}
            </Grid>

            {/* Bottom tuning labels */}
            <Box display="flex" justifyContent="center" gap={0.5} mt={1}>
                <Typography variant="caption" sx={{ width: 32 }} /> {/* spacer */}
                {tuning.map((openNote, sIdx) => (
                    <Typography
                        key={sIdx}
                        variant="caption"
                        sx={{ width: 32, textAlign: 'center' }}
                    >
                        {openNote}
                    </Typography>
                ))}
                <Typography variant="caption" sx={{ width: 32 }} /> {/* spacer */}
            </Box>

            {/* Commit chord button */}
            <Box display="flex" justifyContent="center" mt={2}>
                <Button
                    variant="contained"
                    disabled={selectedNotes.length === 0}
                    onClick={commitChord}
                    sx={{
                        boxShadow: selectedNotes.length > 0 ? `0 0 14px ${theme.palette.primary.main}77` : 'none',
                    }}
                >
                    {pendingNoteAction?.mode === 'edit' ? 'Save Changes' : `Commit ${selectedNotes.length > 1 ? 'Chord' : 'Note'}`}
                </Button>
            </Box>
        </ToolTemplate>
    )
}
