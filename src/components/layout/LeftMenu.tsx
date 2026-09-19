// src/components/LeftMenu.tsx
'use client'

import React, { useState } from 'react'
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
} from '@mui/material'
import CreateNewFolderTwoToneIcon from '@mui/icons-material/CreateNewFolderTwoTone';
import FolderOpenTwoToneIcon from '@mui/icons-material/FolderOpenTwoTone';
import SaveTwoToneIcon from '@mui/icons-material/SaveTwoTone'
import SettingsTwoToneIcon from '@mui/icons-material/SettingsTwoTone'
import HistoryTwoToneIcon from '@mui/icons-material/HistoryTwoTone'
import MusicNoteTwoToneIcon from '@mui/icons-material/MusicNoteTwoTone'
import { usePathname } from 'next/navigation'
import { useTabs } from '@/context/TabsContext'
import { useMusic } from '@/context/MusicContext'
import { useAuthContext } from '@/context/AuthProvider'
import { CompositionSnapshot } from '@/types/music'
import { createBackendTab, updateBackendTab, listBackendTabs, deserializeComposition, BackendTab } from '@/lib/api/tabs'
import toast from 'react-hot-toast'

export default function LeftMenu({ onClose }: { onClose?: () => void }) {
    const pathname = usePathname()
    const isWorkspace = pathname === '/workspace'

    const tabs = useTabs()
    const { user } = useAuthContext()
    const {
        measures, selectedInstrument, selectedGenre, selectedTuning, tuning, tempo, selectedNoteRefs,
        loadComposition,
    } = useMusic()

    const [saving, setSaving] = useState(false)
    const [openDialogVisible, setOpenDialogVisible] = useState(false)
    const [openDialogLoading, setOpenDialogLoading] = useState(false)
    const [savedTabs, setSavedTabs] = useState<BackendTab[]>([])

    if (!tabs) return null

    const handleSave = async () => {
        const activeTab = tabs.activeTab
        if (!activeTab || !user) return

        setSaving(true)
        try {
            const composition: CompositionSnapshot = {
                measures, selectedInstrument, selectedGenre, selectedTuning, tuning, tempo, selectedNoteRefs,
            }
            const input = {
                title: activeTab.title,
                userId: user.id,
                instrument: selectedInstrument,
                tuning: selectedTuning.name,
                genre: selectedGenre,
                composition,
            }

            const backendId = (activeTab.payload as { backendId?: string } | undefined)?.backendId
            const saved = backendId
                ? await updateBackendTab(backendId, input)
                : await createBackendTab(input)

            if (!backendId) {
                tabs.updateTabPayload(activeTab.id, { backendId: saved.id })
            }
            toast.success(`Saved "${activeTab.title}"`)
        } catch {
            toast.error('Could not save — is the backend running?')
        } finally {
            setSaving(false)
            onClose?.()
        }
    }

    const openFilePicker = async () => {
        if (!user) return
        setOpenDialogVisible(true)
        setOpenDialogLoading(true)
        try {
            const list = await listBackendTabs(user.id)
            setSavedTabs(list)
        } catch {
            toast.error('Could not load saved tabs — is the backend running?')
        } finally {
            setOpenDialogLoading(false)
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
            {isWorkspace && <ListItemButton onClick={handleSave} disabled={saving}>
                <ListItemIcon>{saving ? <CircularProgress size={20} /> : <SaveTwoToneIcon />}</ListItemIcon>
                <ListItemText primary={saving ? 'Saving…' : 'Save'} />
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

            <Dialog open={openDialogVisible} onClose={() => setOpenDialogVisible(false)} fullWidth maxWidth="xs">
                <DialogTitle>Open a saved tab</DialogTitle>
                <DialogContent dividers>
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
                                <ListItemButton key={t.id} onClick={() => handleOpenTab(t)}>
                                    <ListItemIcon><MusicNoteTwoToneIcon /></ListItemIcon>
                                    <ListItemText
                                        primary={t.title || 'Untitled'}
                                        secondary={[t.instrument, t.tuning, t.genre].filter(Boolean).join(' · ')}
                                    />
                                </ListItemButton>
                            ))}
                        </List>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialogVisible(false)}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </List>
    )
}
