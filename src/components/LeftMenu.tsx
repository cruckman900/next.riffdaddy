// src/components/LeftMenu.tsx
'use client'

import React from "react"
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Divider } from '@mui/material'
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder'
import FolderOpenIcon from '@mui/icons-material/FolderOpen'
import SaveIcon from '@mui/icons-material/Save'
import HistoryIcon from '@mui/icons-material/History'
import SettingsIcon from '@mui/icons-material/Settings'
import { useTabs } from '@/context/TabsContext'

export default function LeftMenu({ open = true }: { open?: boolean }) {
    const tabs = useTabs()

    return (
        <Drawer variant="permanent" anchor="left" open={open} sx={{ width: 220, '& .MuiDrawer-paper': { width: 220, boxSizing: 'border-box' } }}>
            <List>
                <ListItemButton onClick={() => tabs.newTab({ title: 'Untitled', type: 'editor', payload: { content: '' } })}>
                    <ListItemIcon><CreateNewFolderIcon /></ListItemIcon>
                    <ListItemText primary="File New" />
                </ListItemButton>

                <ListItemButton onClick={() => tabs.newTab({ title: 'Open File', type: 'editor', payload: { content: '' } })}>
                    <ListItemIcon><FolderOpenIcon /></ListItemIcon>
                    <ListItemText primary="File Open" />
                </ListItemButton>

                <ListItemButton onClick={() => { /* implement save logic */ }}>
                    <ListItemIcon><SaveIcon /></ListItemIcon>
                    <ListItemText primary="Save" />
                </ListItemButton>

                <Divider sx={{ my: 1 }} />

                <ListItemButton onClick={() => tabs.newTab({ title: 'Settings', type: 'settings' })}>
                    <ListItemIcon><SettingsIcon /></ListItemIcon>
                    <ListItemText primary="Settings" />
                </ListItemButton>

                <ListItemButton onClick={() => tabs.newTab({ title: 'History', type: 'history' })}>
                    <ListItemIcon><HistoryIcon /></ListItemIcon>
                    <ListItemText primary="History" />
                </ListItemButton>
            </List>
        </Drawer>
    )
}
