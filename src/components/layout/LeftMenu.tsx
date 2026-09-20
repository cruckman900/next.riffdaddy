// src/components/LeftMenu.tsx
'use client'

import React, { useRef, useState } from 'react'
import {
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    CircularProgress,
    Typography,
    Box,
    TextField,
    ToggleButtonGroup,
    ToggleButton,
    IconButton,
    Tooltip,
    FormControlLabel,
    Switch,
} from '@mui/material'
import CreateNewFolderTwoToneIcon from '@mui/icons-material/CreateNewFolderTwoTone';
import FolderOpenTwoToneIcon from '@mui/icons-material/FolderOpenTwoTone';
import SaveTwoToneIcon from '@mui/icons-material/SaveTwoTone'
import SaveAsTwoToneIcon from '@mui/icons-material/SaveAsTwoTone'
import SettingsTwoToneIcon from '@mui/icons-material/SettingsTwoTone'
import HistoryTwoToneIcon from '@mui/icons-material/HistoryTwoTone'
import MusicNoteTwoToneIcon from '@mui/icons-material/MusicNoteTwoTone'
import StorageTwoToneIcon from '@mui/icons-material/StorageTwoTone'
import ComputerTwoToneIcon from '@mui/icons-material/ComputerTwoTone'
import ArchiveTwoToneIcon from '@mui/icons-material/ArchiveTwoTone'
import UnarchiveTwoToneIcon from '@mui/icons-material/UnarchiveTwoTone'
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone'
import { usePathname } from 'next/navigation'
import { useTabs, uniqueTitle } from '@/context/TabsContext'
import { useMusic } from '@/context/MusicContext'
import { useAuthContext } from '@/context/AuthProvider'
import { CompositionSnapshot } from '@/types/music'
import {
    createBackendTab, updateBackendTab, listBackendTabs, deserializeComposition, BackendTab,
    deleteBackendTab, setBackendTabArchived,
} from '@/lib/api/tabs'
import { downloadLocalFile, parseLocalFile, readFileAsText } from '@/lib/localFile'
import toast from 'react-hot-toast'

type SaveLocation = 'database' | 'local'

export default function LeftMenu({ onClose }: { onClose?: () => void }) {
    const pathname = usePathname()
    const isWorkspace = pathname === '/workspace'

    const tabs = useTabs()
    const { user } = useAuthContext()
    const {
        measures, selectedInstrument, selectedGenre, selectedTuning, tuning, tempo, selectedNoteRefs,
        selectedVoice, metadata, loadComposition,
    } = useMusic()

    const [saving, setSaving] = useState(false)
    const [openDialogVisible, setOpenDialogVisible] = useState(false)
    const [openDialogLoading, setOpenDialogLoading] = useState(false)
    const [openLocation, setOpenLocation] = useState<SaveLocation>('database')
    const [savedTabs, setSavedTabs] = useState<BackendTab[]>([])
    const [showArchived, setShowArchived] = useState(false)
    const [saveAsOpen, setSaveAsOpen] = useState(false)
    const [saveAsName, setSaveAsName] = useState('')
    const [saveLocation, setSaveLocation] = useState<SaveLocation>('database')
    const localFileInputRef = useRef<HTMLInputElement>(null)

    if (!tabs) return null

    const currentComposition = (): CompositionSnapshot => ({
        measures, selectedInstrument, selectedGenre, selectedTuning, tuning, tempo, selectedNoteRefs, selectedVoice, metadata,
    })

    // Shared by both Save and Save As, for the Database location only.
    // `titleOverride` renames the tab first (deduped against other open
    // tabs); `forceNew` ignores any existing backendId so a brand-new
    // backend record is created instead of overwriting the one the tab was
    // opened/last-saved as — that's the whole point of "Save As".
    const doSaveToDatabase = async (titleOverride?: string, forceNew?: boolean) => {
        const activeTab = tabs.activeTab
        if (!activeTab || !user) return

        setSaving(true)
        try {
            const title = titleOverride ?? activeTab.title
            const input = {
                title,
                userId: user.id,
                instrument: selectedInstrument,
                tuning: selectedTuning.name,
                genre: selectedGenre,
                composition: currentComposition(),
            }

            const backendId = forceNew ? undefined : (activeTab.payload as { backendId?: string } | undefined)?.backendId
            const saved = backendId
                ? await updateBackendTab(backendId, input)
                : await createBackendTab(input)

            if (titleOverride && titleOverride !== activeTab.title) {
                tabs.renameTab(activeTab.id, titleOverride)
            }
            tabs.updateTabPayload(activeTab.id, { backendId: saved.id })
            toast.success(`Saved "${title}" to the database`)
        } catch {
            toast.error('Could not save — is the backend running?')
        } finally {
            setSaving(false)
            onClose?.()
        }
    }

    // Local Disk has no "update the same file" concept in a plain web app
    // (that needs the File System Access API, which isn't universally
    // supported yet) — every save is a fresh download, same as any other
    // site's export button.
    const saveToLocalDisk = (title: string) => {
        const activeTab = tabs.activeTab
        if (!activeTab) return
        try {
            downloadLocalFile(title, currentComposition())
            if (title !== activeTab.title) tabs.renameTab(activeTab.id, title)
            toast.success(`Downloaded "${title}.nriff.json"`)
        } catch {
            toast.error('Could not create the file for download')
        } finally {
            onClose?.()
        }
    }

    // Plain "Save": once a tab already has a database record, keep quietly
    // updating that same record. Otherwise (a brand-new tab, or one that was
    // only ever downloaded to local disk) there's no "the same place" to
    // silently resave to, so fall back to Save As and let the user pick.
    const handleSave = () => {
        const activeTab = tabs.activeTab
        const backendId = (activeTab?.payload as { backendId?: string } | undefined)?.backendId
        if (backendId) {
            doSaveToDatabase()
        } else {
            openSaveAsDialog()
        }
    }

    const openSaveAsDialog = () => {
        const activeTab = tabs.activeTab
        if (!activeTab) return
        setSaveAsName(activeTab.title)
        setSaveLocation('database')
        setSaveAsOpen(true)
    }

    const confirmSaveAs = async () => {
        const activeTab = tabs.activeTab
        if (!activeTab) return
        const otherTitles = tabs.tabs.filter(t => t.id !== activeTab.id).map(t => t.title)
        const finalTitle = uniqueTitle(saveAsName.trim() || 'Untitled', otherTitles)
        setSaveAsOpen(false)
        if (saveLocation === 'local') {
            saveToLocalDisk(finalTitle)
        } else {
            await doSaveToDatabase(finalTitle, true)
        }
    }

    // Refetches the database list every time the dialog opens on the
    // Database tab (either right away, since that's the default, or when
    // switching to it) so it always reflects the latest saves — a stale
    // "no tabs yet" would be confusing right after just saving one.
    const loadDatabaseTabList = async (includeArchived = showArchived) => {
        if (!user) return
        setOpenDialogLoading(true)
        try {
            const list = await listBackendTabs(user.id, includeArchived)
            setSavedTabs(list)
        } catch {
            toast.error('Could not load saved tabs — is the backend running?')
        } finally {
            setOpenDialogLoading(false)
        }
    }

    const handleToggleShowArchived = (next: boolean) => {
        setShowArchived(next)
        loadDatabaseTabList(next)
    }

    // Soft-delete: hides the tab from the default list but keeps it
    // recoverable — flips right back with the same action once shown via
    // "Show archived".
    const handleToggleArchived = async (e: React.MouseEvent, backendTab: BackendTab) => {
        e.stopPropagation()
        try {
            await setBackendTabArchived(backendTab.id, !backendTab.archived)
            toast.success(backendTab.archived ? `Restored "${backendTab.title}"` : `Archived "${backendTab.title}"`)
            loadDatabaseTabList()
        } catch {
            toast.error('Could not update that tab — is the backend running?')
        }
    }

    // Hard delete — permanent, so confirm first. window.confirm is a plain
    // blocking native dialog, which is exactly the friction we want before
    // an unrecoverable action (as opposed to the non-destructive Cancel/
    // Save dialogs elsewhere in this menu).
    const handleDeleteTab = async (e: React.MouseEvent, backendTab: BackendTab) => {
        e.stopPropagation()
        const ok = window.confirm(`Permanently delete "${backendTab.title || 'Untitled'}"? This can't be undone.`)
        if (!ok) return
        try {
            await deleteBackendTab(backendTab.id)
            toast.success(`Deleted "${backendTab.title}"`)
            loadDatabaseTabList()
        } catch {
            toast.error('Could not delete that tab — is the backend running?')
        }
    }

    const openFilePicker = () => {
        setOpenLocation('database')
        setOpenDialogVisible(true)
        loadDatabaseTabList()
    }

    const handleOpenLocationChange = (next: SaveLocation) => {
        setOpenLocation(next)
        if (next === 'database') {
            loadDatabaseTabList()
        }
    }

    const handleOpenTab = (backendTab: BackendTab) => {
        const composition = backendTab.content
            ? deserializeComposition(backendTab.content)
            : undefined
        const newTab = tabs.newTab({
            title: backendTab.title || 'Untitled',
            type: 'editor',
            payload: { backendId: backendTab.id },
        })
        if (composition) {
            loadComposition(newTab.id, composition)
        }
        setOpenDialogVisible(false)
        onClose?.()
    }

    const handleLocalFileChosen = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        e.target.value = '' // allow picking the exact same file again later
        if (!file) return
        try {
            const raw = await readFileAsText(file)
            const { title, composition } = parseLocalFile(raw)
            const otherTitles = tabs.tabs.map(t => t.title)
            const newTab = tabs.newTab({
                title: uniqueTitle(title, otherTitles),
                type: 'editor',
                payload: {},
            })
            loadComposition(newTab.id, composition)
            toast.success(`Opened "${title}" from local disk`)
        } catch {
            toast.error('That file isn\'t a valid NEXTRiff tab (or is corrupted)')
        } finally {
            setOpenDialogVisible(false)
            onClose?.()
        }
    }

    return (
        <List>
            {/* File New */}
            {isWorkspace && <ListItemButton
                onClick={() => {
                    tabs.newTab({ title: 'Untitled', type: 'editor', payload: { content: '' } })
                    onClose?.()
                }}
            >
                <ListItemIcon><CreateNewFolderTwoToneIcon /></ListItemIcon>
                <ListItemText primary="File New" />
            </ListItemButton>}

            {/* File Open */}
            {isWorkspace && <ListItemButton onClick={openFilePicker}>
                <ListItemIcon><FolderOpenTwoToneIcon /></ListItemIcon>
                <ListItemText primary="File Open" />
            </ListItemButton>}

            {/* Save */}
            {isWorkspace && <ListItemButton onClick={handleSave} disabled={saving || !tabs.activeTab}>
                <ListItemIcon>{saving ? <CircularProgress size={20} /> : <SaveTwoToneIcon />}</ListItemIcon>
                <ListItemText primary={saving ? 'Saving…' : 'Save'} />
            </ListItemButton>}

            {/* Save As */}
            {isWorkspace && <ListItemButton onClick={openSaveAsDialog} disabled={saving || !tabs.activeTab}>
                <ListItemIcon><SaveAsTwoToneIcon /></ListItemIcon>
                <ListItemText primary="Save As" />
            </ListItemButton>}

            {isWorkspace && <Divider sx={{ my: 1 }} />}

            {/* Settings */}
            <ListItemButton
                onClick={() => {
                    tabs.newTab({ title: 'Settings', type: 'settings' })
                    onClose?.()
                }}
            >
                <ListItemIcon><SettingsTwoToneIcon /></ListItemIcon>
                <ListItemText primary="Settings" />
            </ListItemButton>

            {/* History */}
            {isWorkspace && <ListItemButton
                onClick={() => {
                    tabs.newTab({ title: 'History', type: 'history' })
                    onClose?.()
                }}
            >
                <ListItemIcon><HistoryTwoToneIcon /></ListItemIcon>
                <ListItemText primary="History" />
            </ListItemButton>}

            {/* Hidden input driving the "Local Disk" branch of File Open —
                kept outside the Dialog so it survives the dialog's own
                conditional rendering. */}
            <input
                ref={localFileInputRef}
                type="file"
                accept="application/json,.json,.nriff"
                style={{ display: 'none' }}
                onChange={handleLocalFileChosen}
            />

            <Dialog open={openDialogVisible} onClose={() => setOpenDialogVisible(false)} fullWidth maxWidth="xs">
                <DialogTitle>Open a Tab</DialogTitle>
                <DialogContent dividers>
                    <ToggleButtonGroup
                        exclusive
                        fullWidth
                        size="small"
                        value={openLocation}
                        onChange={(_, next) => next && handleOpenLocationChange(next)}
                        sx={{ mb: 2 }}
                    >
                        <ToggleButton value="database">
                            <StorageTwoToneIcon fontSize="small" sx={{ mr: 1 }} /> Database
                        </ToggleButton>
                        <ToggleButton value="local">
                            <ComputerTwoToneIcon fontSize="small" sx={{ mr: 1 }} /> Local Disk
                        </ToggleButton>
                    </ToggleButtonGroup>

                    {openLocation === 'database' && (
                        <>
                            <FormControlLabel
                                sx={{ mb: 1 }}
                                control={
                                    <Switch
                                        size="small"
                                        checked={showArchived}
                                        onChange={(e) => handleToggleShowArchived(e.target.checked)}
                                    />
                                }
                                label={<Typography variant="body2" color="text.secondary">Show archived</Typography>}
                            />

                            {openDialogLoading && (
                                <Box display="flex" justifyContent="center" py={3}>
                                    <CircularProgress size={28} />
                                </Box>
                            )}
                            {!openDialogLoading && savedTabs.length === 0 && (
                                <Typography color="text.secondary" variant="body2">
                                    No saved tabs yet — use Save to store your first one.
                                </Typography>
                            )}
                            {!openDialogLoading && savedTabs.length > 0 && (
                                <List disablePadding>
                                    {savedTabs.map(t => (
                                        <ListItemButton key={t.id} onClick={() => handleOpenTab(t)} sx={{ opacity: t.archived ? 0.6 : 1 }}>
                                            <ListItemIcon><MusicNoteTwoToneIcon /></ListItemIcon>
                                            <ListItemText
                                                primary={`${t.title || 'Untitled'}${t.archived ? '  (Archived)' : ''}`}
                                                secondary={[t.instrument, t.tuning, t.genre].filter(Boolean).join(' · ')}
                                            />
                                            <Tooltip title={t.archived ? 'Restore' : 'Archive'}>
                                                <IconButton size="small" onClick={(e) => handleToggleArchived(e, t)}>
                                                    {t.archived ? <UnarchiveTwoToneIcon fontSize="small" /> : <ArchiveTwoToneIcon fontSize="small" />}
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete permanently">
                                                <IconButton size="small" onClick={(e) => handleDeleteTab(e, t)}>
                                                    <DeleteTwoToneIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </ListItemButton>
                                    ))}
                                </List>
                            )}
                        </>
                    )}

                    {openLocation === 'local' && (
                        <Box display="flex" flexDirection="column" alignItems="center" gap={2} py={2}>
                            <Typography color="text.secondary" variant="body2" textAlign="center">
                                Pick a .nriff.json file previously saved to your computer.
                            </Typography>
                            <Button
                                variant="outlined"
                                startIcon={<ComputerTwoToneIcon />}
                                onClick={() => localFileInputRef.current?.click()}
                            >
                                Choose File…
                            </Button>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialogVisible(false)}>Cancel</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={saveAsOpen} onClose={() => setSaveAsOpen(false)} fullWidth maxWidth="xs">
                <DialogTitle>Save As</DialogTitle>
                <DialogContent dividers>
                    <ToggleButtonGroup
                        exclusive
                        fullWidth
                        size="small"
                        value={saveLocation}
                        onChange={(_, next) => next && setSaveLocation(next)}
                        sx={{ mb: 2 }}
                    >
                        <ToggleButton value="database">
                            <StorageTwoToneIcon fontSize="small" sx={{ mr: 1 }} /> Database
                        </ToggleButton>
                        <ToggleButton value="local">
                            <ComputerTwoToneIcon fontSize="small" sx={{ mr: 1 }} /> Local Disk
                        </ToggleButton>
                    </ToggleButtonGroup>

                    <TextField
                        autoFocus
                        fullWidth
                        label="File name"
                        value={saveAsName}
                        onChange={(e) => setSaveAsName(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') confirmSaveAs()
                        }}
                        helperText={
                            saveLocation === 'database'
                                ? 'If another open tab already uses this name, a (1), (2), … will be appended automatically.'
                                : 'Downloads a .nriff.json file you can reopen later via File Open → Local Disk.'
                        }
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSaveAsOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={confirmSaveAs} disabled={!saveAsName.trim()}>
                        {saveLocation === 'database' ? 'Save As New File' : 'Download File'}
                    </Button>
                </DialogActions>
            </Dialog>
        </List>
    )
}
