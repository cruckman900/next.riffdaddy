// src/components/renderers/NotationToolbar.tsx
'use client'

import { Box, Stack, Typography, Chip, Button, Tooltip } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import CloseTwoToneIcon from '@mui/icons-material/CloseTwoTone'
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone'
import KeyboardArrowLeftTwoToneIcon from '@mui/icons-material/KeyboardArrowLeftTwoTone'
import KeyboardArrowRightTwoToneIcon from '@mui/icons-material/KeyboardArrowRightTwoTone'
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone'
import { useMusic } from '@/context/MusicContext'
import { NOTE_MODIFIERS, NOTE_MODIFIER_CATEGORIES } from '@/tools/noteModifiers'

// Contextual toolbar that appears above the score preview whenever one or
// more notes are selected (click a note in Tab/Staff/Combined view to toggle
// its selection). Offers categorized notation modifiers — duration, accents,
// ornaments, and single-note techniques — applied to every selected note,
// plus (for a single selection) actions to delete, insert a note before/
// after it, or edit it in place via the Fretboard/Keyboard tool.
export default function NotationToolbar() {
    const theme = useTheme()
    const {
        measures, selectedNoteRefs, clearNoteSelection, toggleModifierOnSelection,
        deleteSelectedNotes, setPendingNoteAction, setActiveTool,
    } = useMusic()

    if (selectedNoteRefs.length === 0) return null

    const selectedNotes = selectedNoteRefs
        .map(ref => measures.find(m => m.id === ref.measureId)?.notes.find(n => n.id === ref.noteId))
        .filter((n): n is NonNullable<typeof n> => !!n)

    const isModifierActive = (modifierId: string) =>
        selectedNotes.length > 0 && selectedNotes.every(n => n.modifiers?.includes(modifierId))

    const singleRef = selectedNoteRefs.length === 1 ? selectedNoteRefs[0] : null

    const startPendingAction = (mode: 'edit' | 'insert-before' | 'insert-after') => {
        if (!singleRef) return
        setPendingNoteAction({ mode, measureId: singleRef.measureId, noteId: singleRef.noteId })
        // Fretboard is the most common input tool — jump straight there so
        // the user doesn't have to navigate to it manually.
        setActiveTool('fretboard')
    }

    return (
        <Box
            className="print:hidden"
            sx={{
                mb: 2,
                p: 2,
                borderRadius: 2,
                border: '1px solid',
                borderColor: `${theme.palette.accent.main}55`,
                bgcolor: `${theme.palette.accent.main}0f`,
                boxShadow: `0 0 16px ${theme.palette.accent.main}33`,
            }}
        >
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={1} sx={{ mb: 1.5 }}>
                <Typography variant="subtitle2" sx={{ color: theme.palette.accent.main, fontWeight: 700 }}>
                    {selectedNoteRefs.length} note{selectedNoteRefs.length > 1 ? 's' : ''} selected
                </Typography>

                <Stack direction="row" spacing={1} flexWrap="wrap">
                    {singleRef && (
                        <>
                            <Tooltip title="Insert a new note before this one">
                                <Button size="small" onClick={() => startPendingAction('insert-before')} startIcon={<KeyboardArrowLeftTwoToneIcon fontSize="small" />}>
                                    Insert Before
                                </Button>
                            </Tooltip>
                            <Tooltip title="Insert a new note after this one">
                                <Button size="small" onClick={() => startPendingAction('insert-after')} endIcon={<KeyboardArrowRightTwoToneIcon fontSize="small" />}>
                                    Insert After
                                </Button>
                            </Tooltip>
                            <Tooltip title="Replace this note's pitch/fret using Fretboard or Keyboard Input">
                                <Button size="small" onClick={() => startPendingAction('edit')} startIcon={<EditTwoToneIcon fontSize="small" />}>
                                    Edit
                                </Button>
                            </Tooltip>
                        </>
                    )}
                    <Button size="small" color="error" onClick={deleteSelectedNotes} startIcon={<DeleteTwoToneIcon fontSize="small" />}>
                        Delete
                    </Button>
                    <Button size="small" onClick={clearNoteSelection} startIcon={<CloseTwoToneIcon fontSize="small" />}>
                        Clear
                    </Button>
                </Stack>
            </Stack>

            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: 2,
                }}
            >
                {NOTE_MODIFIER_CATEGORIES.map(category => (
                    <Box key={category}>
                        <Typography
                            variant="caption"
                            sx={{ color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                        >
                            {category}
                        </Typography>
                        <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 0.5 }}>
                            {NOTE_MODIFIERS.filter(m => m.category === category).map(m => {
                                const active = isModifierActive(m.id)
                                return (
                                    <Chip
                                        key={m.id}
                                        label={m.label}
                                        onClick={() => toggleModifierOnSelection(m.id)}
                                        variant="outlined"
                                        sx={{
                                            borderColor: active ? theme.palette.accent.main : 'divider',
                                            color: active ? theme.palette.accent.main : 'text.secondary',
                                            bgcolor: active ? `${theme.palette.accent.main}1a` : 'transparent',
                                            boxShadow: active ? `0 0 8px ${theme.palette.accent.main}66` : 'none',
                                            fontWeight: active ? 700 : 500,
                                        }}
                                    />
                                )
                            })}
                        </Stack>
                    </Box>
                ))}
            </Box>
        </Box>
    )
}
