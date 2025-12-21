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
import CreateNewFolderTwoToneIcon from '@mui/icons-material/CreateNewFolderTwoTone';
import FolderOpenTwoToneIcon from '@mui/icons-material/FolderOpenTwoTone';
import SaveTwoToneIcon from '@mui/icons-material/SaveTwoTone'
import SettingsTwoToneIcon from '@mui/icons-material/SettingsTwoTone'
import HistoryTwoToneIcon from '@mui/icons-material/HistoryTwoTone'
import { usePathname } from 'next/navigation'
import { useTabs } from '@/context/TabsContext'

export default function LeftMenu({ onClose }: { onClose?: () => void }) {
    const pathname = usePathname()
    const isWorkspace = pathname === '/workspace'

    const tabs = useTabs()
    if (!tabs) return null

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
            {isWorkspace && <ListItemButton
                onClick={() => {
                    tabs.newTab({ title: 'Open File', type: 'editor', payload: { content: '' } })
                    onClose?.()
                }}
            >
                <ListItemIcon><FolderOpenTwoToneIcon /></ListItemIcon>
                <ListItemText primary="File Open" />
            </ListItemButton>}

            {/* Save */}
            {isWorkspace && <ListItemButton
                onClick={() => {
                    // TODO: implement save logic
                    onClose?.()
                }}
            >
                <ListItemIcon><SaveTwoToneIcon /></ListItemIcon>
                <ListItemText primary="Save" />
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
        </List>
    )
}
