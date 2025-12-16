// src/components/LeftMenu.tsx
'use client'

import React from 'react'
import {
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider,
} from '@mui/material'
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder'
import FolderOpenIcon from '@mui/icons-material/FolderOpen'
import SaveIcon from '@mui/icons-material/Save'
import SettingsIcon from '@mui/icons-material/Settings'
import HistoryIcon from '@mui/icons-material/History'
import { useTabs } from '@/context/TabsContext'

export default function LeftMenu({ onClose }: { onClose?: () => void }) {
    const tabs = useTabs()
    if (!tabs) return null

    return (
        <List>
            {/* File New */}
            <ListItemButton
                onClick={() => {
                    tabs.newTab({ title: 'Untitled', type: 'editor', payload: { content: '' } })
                    onClose?.()
                }}
            >
                <ListItemIcon><CreateNewFolderIcon /></ListItemIcon>
                <ListItemText primary="File New" />
            </ListItemButton>

            {/* File Open */}
            <ListItemButton
                onClick={() => {
                    tabs.newTab({ title: 'Open File', type: 'editor', payload: { content: '' } })
                    onClose?.()
                }}
            >
                <ListItemIcon><FolderOpenIcon /></ListItemIcon>
                <ListItemText primary="File Open" />
            </ListItemButton>

            {/* Save */}
            <ListItemButton
                onClick={() => {
                    // TODO: implement save logic
                    onClose?.()
                }}
            >
                <ListItemIcon><SaveIcon /></ListItemIcon>
                <ListItemText primary="Save" />
            </ListItemButton>

            <Divider sx={{ my: 1 }} />

            {/* Settings */}
            <ListItemButton
                onClick={() => {
                    tabs.newTab({ title: 'Settings', type: 'settings' })
                    onClose?.()
                }}
            >
                <ListItemIcon><SettingsIcon /></ListItemIcon>
                <ListItemText primary="Settings" />
            </ListItemButton>

            {/* History */}
            <ListItemButton
                onClick={() => {
                    tabs.newTab({ title: 'History', type: 'history' })
                    onClose?.()
                }}
            >
                <ListItemIcon><HistoryIcon /></ListItemIcon>
                <ListItemText primary="History" />
            </ListItemButton>
        </List>
    )
}
