// src/components/renderers/NotationToolbar.tsx
'use client'

import { useState } from 'react'
import { Box, Stack, Typography, Chip, Button, Tooltip, Menu, MenuItem } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import CloseTwoToneIcon from '@mui/icons-material/CloseTwoTone'
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone'
import KeyboardArrowLeftTwoToneIcon from '@mui/icons-material/KeyboardArrowLeftTwoTone'
import KeyboardArrowRightTwoToneIcon from '@mui/icons-material/KeyboardArrowRightTwoTone'
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone'
import GestureTwoToneIcon from '@mui/icons-material/GestureTwoTone'
import ArrowDropDownTwoToneIcon from '@mui/icons-material/ArrowDropDownTwoTone'
import { useMusic } from '@/context/MusicContext'
import { NOTE_MODIFIERS, NOTE_MODIFIER_CATEGORIES, NoteModifierDef } from '@/tools/noteModifiers'

// A family of mutually-exclusive modifier variants (currently just Bend's
// 1/4 / 1/2 / Full / … amounts) collapsed into one chip that opens a menu of
// options, instead of showing every variant as its own permanently-visible
// chip — see setExclusiveModifierOnSelection in MusicContext.
function ModifierGroupChip({
    label, options, activeId, onSelect,
}: {
    label: string
    options: NoteModifierDef[]
    activeId?: string
    onSelect: (id: string) => void
}) {
    const theme = useTheme()
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
    const activeOption = options.find(o => o.id === activeId)

    return (
        <>
            <Chip
                label={
                    <Stack direction="row" alignItems="center" spacing={0.25}>
                        <span>{activeOption ? `${label}: ${activeOption.label}` : label}</span>
                        <ArrowDropDownTwoToneIcon fontSize="small" />
                    </Stack>
                }
                onClick={(e) => setAnchorEl(e.currentTarget)}
                variant="outlined"
                sx={{
                    borderColor: activeOption ? theme.palette.accent.main : 'divider',
                    color: activeOption ? theme.palette.accent.main : 'text.secondary',
                    bgcolor: activeOption ? `${theme.palette.accent.main}1a` : 'transparent',
                    boxShadow: activeOption ? `0 0 8px ${theme.palette.accent.main}66` : 'none',
                    fontWeight: activeOption ? 700 : 500,
                }}
            />
            <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={() => setAnchorEl(null)}>
                {options.map(opt => (
                    <MenuItem
                        key={opt.id}
                        selected={opt.id === activeId}
                        onClick={() => {
                            onSelect(opt.id)
                            setAnchorEl(null)
                        }}
                    >
                        {opt.label}
                    </MenuItem>
                ))}
            </Menu>
        </>
    )
}

// Contextual toolbar that appears above the score preview whenever one or
// more notes are selected (click a note in Tab/Staff/Combined view to toggle
// its selection). Offers categorized notation modifiers — duration, accents,
// ornaments, and single-note techniques — applied to every selected note,
// plus (for a single selection) actions to delete, insert a note before/
// after it, or edit it in place via the Fretboard/Keyboard tool.
export default function NotationToolbar() {
    const theme = useTheme()
    const {
        measures, tieGroups, selectedNoteRefs, clearNoteSelection, toggleModifierOnSelection,
        setExclusiveModifierOnSelection, toggleTieOnSelection, deleteSelectedNotes,
        setPendingNoteAction, setActiveTool,
    } = useMusic()

    if (selectedNoteRefs.length === 0) return null

    const selectedNotes = selectedNoteRefs
        .map(ref => measures.find(m => m.id === ref.measureId)?.notes.find(n => n.id === ref.noteId))
        .filter((n): n is NonNullable<typeof n> => !!n)

    const isModifierActive = (modifierId: string) =>
        selectedNotes.length > 0 && selectedNotes.every(n => n.modifiers?.includes(modifierId))

    // Which variant (if any) of a group is active on every selected note —
    // undefined if the selection has none, or a mix of different variants.
    const activeGroupVariant = (groupIds: string[]): string | undefined =>
        groupIds.find(id => isModifierActive(id))

    const singleRef = selectedNoteRefs.length === 1 ? selectedNoteRefs[0] : null

    // Ties connect two or more note endpoints rather than decorating one at
    // a time — since they're now tracked at the composition level (not
    // per-measure), a selection can span any number of different measures.
    const orderedSelectedRefs = (() => {
        const selectedKeys = new Set(selectedNoteRefs.map(r => `${r.measureId}:${r.noteId}`))
        const ordered: { measureId: string; noteId: string }[] = []
        measures.forEach(m => {
            m.notes.forEach(n => {
                if (selectedKeys.has(`${m.id}:${n.id}`)) ordered.push({ measureId: m.id, noteId: n.id })
            })
        })
        return ordered
    })()
    const canTie = orderedSelectedRefs.length >= 2
    const isTieActive = canTie && tieGroups.some(
        g => g.length === orderedSelectedRefs.length
            && g.every((r, i) => r.measureId === orderedSelectedRefs[i].measureId && r.noteId === orderedSelectedRefs[i].noteId)
    )

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
                    {selectedNoteRefs.length >= 2 && (
                        <Tooltip
                            title={
                                canTie
                                    ? (isTieActive ? 'Remove the tie connecting these notes' : 'Tie these notes together (in their left-to-right order) — can cross into the next measure')
                                    : 'Select 2 or more notes to tie them'
                            }
                        >
                            <span>
                                <Button
                                    size="small"
                                    disabled={!canTie}
                                    onClick={toggleTieOnSelection}
                                    startIcon={<GestureTwoToneIcon fontSize="small" />}
                                    sx={isTieActive ? {
                                        color: theme.palette.accent.main,
                                        borderColor: theme.palette.accent.main,
                                    } : undefined}
                                    variant={isTieActive ? 'outlined' : 'text'}
                                >
                                    {isTieActive ? 'Untie' : 'Tie'}
                                </Button>
                            </span>
                        </Tooltip>
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
                {NOTE_MODIFIER_CATEGORIES.map(category => {
                    const categoryModifiers = NOTE_MODIFIERS.filter(m => m.category === category)
                    const seenGroups = new Set<string>()

                    return (
                        <Box key={category}>
                            <Typography
                                variant="caption"
                                sx={{ color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                            >
                                {category}
                            </Typography>
                            <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 0.5 }}>
                                {categoryModifiers.map(m => {
                                    if (m.group) {
                                        if (seenGroups.has(m.group)) return null
                                        seenGroups.add(m.group)
                                        const groupOptions = categoryModifiers.filter(x => x.group === m.group)
                                        const groupLabel = m.group.charAt(0).toUpperCase() + m.group.slice(1)
                                        return (
                                            <ModifierGroupChip
                                                key={m.group}
                                                label={groupLabel}
                                                options={groupOptions}
                                                activeId={activeGroupVariant(groupOptions.map(o => o.id))}
                                                onSelect={(id) => setExclusiveModifierOnSelection(groupOptions.map(o => o.id), id)}
                                            />
                                        )
                                    }

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
                    )
                })}
            </Box>
        </Box>
    )
}
