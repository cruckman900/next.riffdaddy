'use client'

import React, { useState, useEffect } from 'react'
import { Box, IconButton, Tab as MuiTab, Tabs, TextField } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useTabsStrict } from '@/context/TabsContext'

export default function TabBar() {
    const tabs = useTabsStrict()
    const activeId = tabs.activeTab?.id ?? false
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        const raf = requestAnimationFrame(() => setMounted(true))
        return () => cancelAnimationFrame(raf)
    }, [])

    if (tabs.tabs.length === 0 || !mounted) return null

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: 'background.default', borderBottom: 1, borderColor: 'divider', width: "100%" }}>
            <Tabs value={activeId} variant="scrollable" scrollButtons="auto" sx={{ flex: 1 }} aria-label="open tabs">
                {tabs.tabs.map((t) => (
                    <MuiTab
                        key={t.id}
                        value={t.id}
                        label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <TextField
                                    variant="standard"
                                    value={t.title}
                                    onChange={(e) => tabs.renameTab(t.id, e.target.value)}
                                    onClick={(e) => e.stopPropagation()}
                                    InputProps={{ disableUnderline: true }}
                                    sx={{ width: 100 }}
                                />
                                <IconButton
                                    component="span"
                                    size="small"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        tabs.closeTab(t.id)
                                    }}
                                    aria-label={`Close ${t.title}`}
                                    sx={{ ml: 0.5 }}
                                >
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        }
                        onClick={() => tabs.switchTab(t.id)}
                        sx={{ textTransform: 'none', minWidth: 120 }}
                    />
                ))}
            </Tabs>
        </Box>
    )
}
