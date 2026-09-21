'use client'

import { ToolTemplate } from "./ToolTemplate"
import { useMusic } from '@/context/MusicContext'
import { Typography, Box, Button, Divider } from '@mui/material'
import { ToolProps } from '@/types/tooling'
import { useState, useEffect } from 'react'
import React from "react"
import { useTheme } from '@mui/material/styles'
import { DRUM_PIECES, DrumPieceId } from '@/utils/drumKits'

// Relative position (percent of the pad area) for every possible piece,
// arranged to roughly match how a drummer actually sees their kit from the
// throne: cymbals/hi-hat up top, toms arranged left-to-right by pitch,
// snare front-and-center-left, kick dead center, floor tom(s) to the right.
const PAD_LAYOUT: Record<DrumPieceId, { x: number; y: number }> = {
    hihat_closed: { x: 12, y: 26 },
    hihat_open: { x: 12, y: 10 },
    crash: { x: 6, y: -4 },
    rack1: { x: 34, y: 6 },
    rack2: { x: 52, y: 10 },
    rack3: { x: 68, y: 16 },
    china: { x: 90, y: -2 },
    ride: { x: 88, y: 14 },
    snare: { x: 28, y: 48 },
    kick: { x: 50, y: 80 },
    floor1: { x: 70, y: 56 },
    floor2: { x: 86, y: 64 },
    hihat_pedal: { x: 12, y: 80 },
}

export function DrumTool({ measureId, duration }: ToolProps) {
    const theme = useTheme()
    const {
        addNote, addRest, tuning, measures, pendingNoteAction, setPendingNoteAction,
        insertNoteRelative, updateNote,
    } = useMusic()
    const dur = duration ?? 'q'
    const mid = measureId ?? ''

    // The current kit's piece list, in DRUM_KIT_SIZES/Kit Style order — see
    // MusicContext's setStringCount/selectTuning special-casing for drums,
    // where `tuning` holds DrumPieceId strings instead of real pitches.
    const kitPieces = tuning as DrumPieceId[]

    const [selectedPieces, setSelectedPieces] = useState<DrumPieceId[]>([])

    // When the notation toolbar's Edit action targets a note, pre-populate
    // this tool's selection with that note's existing pieces so the user
    // sees (and can tweak) what's already there instead of starting blank —
    // same pattern as FretboardTool/KeyboardTool.
    const pendingKey = pendingNoteAction ? `${pendingNoteAction.measureId}:${pendingNoteAction.noteId}:${pendingNoteAction.mode}` : null
    useEffect(() => {
        if (!pendingNoteAction || pendingNoteAction.mode !== 'edit') return
        const anchor = measures
            .find(m => m.id === pendingNoteAction.measureId)
            ?.notes.find(n => n.id === pendingNoteAction.noteId)
        if (!anchor) return
        const pieces = Array.isArray(anchor.pitch) ? anchor.pitch : anchor.pitch ? [anchor.pitch] : []
        setSelectedPieces(pieces as DrumPieceId[])
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pendingKey])

    const togglePiece = (piece: DrumPieceId) => {
        setSelectedPieces(prev =>
            prev.includes(piece) ? prev.filter(p => p !== piece) : [...prev, piece]
        )
    }

    const commitHit = () => {
        if (selectedPieces.length === 0) return
        const payload = {
            pitch: selectedPieces as unknown as string[],
            string: selectedPieces.map(p => kitPieces.indexOf(p) + 1),
            fret: selectedPieces.map(() => 0),
            duration: dur,
        }

        if (pendingNoteAction) {
            const { mode, measureId: targetMeasureId, noteId } = pendingNoteAction
            if (mode === 'edit') {
                updateNote(targetMeasureId, noteId, payload)
            } else {
                insertNoteRelative(targetMeasureId, noteId, mode === 'insert-before' ? 'before' : 'after', payload)
            }
            setPendingNoteAction(null)
            setSelectedPieces([])
            return
        }

        if (!mid) return
        addNote(mid, payload)
        setSelectedPieces([])
    }

    const cancelPendingAction = () => {
        setPendingNoteAction(null)
        setSelectedPieces([])
    }

    const handleAddRest = () => {
        addRest(mid, { duration: dur })
    }

    return (
        <ToolTemplate title="Drum Input" shortcut="7">
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
                        {pendingNoteAction.mode === 'edit' && 'Editing selected hit'}
                        {pendingNoteAction.mode === 'insert-before' && 'Inserting a hit before the selected one'}
                        {pendingNoteAction.mode === 'insert-after' && 'Inserting a hit after the selected one'}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                        Pick pieces below, then Commit — or Cancel to go back to normal input.
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
                Click one or more pieces to build a hit.
            </Typography>
            <Typography variant="body2" mb={2}>
                Commit them together — kick + hi-hat, for example — just like a chord.
            </Typography>

            {/* Drum kit pad layout — absolutely positioned circles inside a
                fixed-aspect-ratio box, roughly matching a real kit's layout. */}
            <Box
                sx={{
                    position: 'relative',
                    width: '100%',
                    pt: '75%', // aspect ratio box
                    mb: 2,
                }}
            >
                <Box sx={{ position: 'absolute', inset: 0 }}>
                    {kitPieces.filter((p): p is DrumPieceId => !!PAD_LAYOUT[p]).map(piece => {
                        const pos = PAD_LAYOUT[piece]
                        const def = DRUM_PIECES[piece]
                        const selected = selectedPieces.includes(piece)
                        return (
                            <Box
                                key={piece}
                                component="button"
                                onClick={() => togglePiece(piece)}
                                sx={{
                                    position: 'absolute',
                                    left: `${pos.x}%`,
                                    top: `${Math.max(pos.y, 0)}%`,
                                    transform: 'translate(-50%, 0)',
                                    cursor: 'pointer',
                                    width: 56,
                                    height: 56,
                                    borderRadius: '50%',
                                    border: '2px solid',
                                    borderColor: selected ? theme.palette.accent.main : theme.palette.divider,
                                    bgcolor: selected ? `${theme.palette.accent.main}26` : 'rgba(255,255,255,0.03)',
                                    color: selected ? theme.palette.accent.main : theme.palette.text.secondary,
                                    boxShadow: selected ? `0 0 14px ${theme.palette.accent.main}88` : 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    textAlign: 'center',
                                    fontSize: '0.62rem',
                                    fontWeight: selected ? 700 : 500,
                                    lineHeight: 1.1,
                                    padding: '2px',
                                    transition: 'all 0.15s ease',
                                    '&:hover': { transform: 'translate(-50%, 0) scale(1.06)' },
                                }}
                            >
                                {def?.label}
                            </Box>
                        )
                    })}
                </Box>
            </Box>

            {/* Commit hit button */}
            <Box display="flex" justifyContent="center" mt={2}>
                <Button
                    variant="contained"
                    disabled={selectedPieces.length === 0}
                    onClick={commitHit}
                    sx={{
                        boxShadow: selectedPieces.length > 0 ? `0 0 14px ${theme.palette.primary.main}77` : 'none',
                    }}
                >
                    {pendingNoteAction?.mode === 'edit' ? 'Save Changes' : `Commit ${selectedPieces.length > 1 ? 'Hit' : 'Note'}`}
                </Button>
            </Box>
        </ToolTemplate>
    )
}
