// src/components/TabBar.tsx
'use client'

import React from 'react'
import { Box, IconButton, Tab as MuiTab, Tabs } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useTabs } from '@/context/TabsContext'

export default function TabBar() {
    const tabs = useTabs()
    const value = tabs.activeTab?.id ?? false

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: 'background.default', borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} variant="scrollable" scrollButtons="auto" sx={{ flex: 1 }}>
                {tabs.tabs.map(t => (
                    <MuiTab
                        key={t.id}
                        value={t.id}
                        label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <span>{t.title}</span>
                                <IconButton size="small" onClick={(e) => { e.stopPropagation(); tabs.closeTab(t.id) }}>
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        }
                        onClick={() => tabs.switchTab(t.id)}
                        sx={{ textTransform: 'none', minWidth: 120 }}
                    />
                ))}
            </Tabs>
            {/* optional actions on the right of the tab bar */}
        </Box>
    )
}
