// src/components/TabBar.tsx
'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Box, IconButton, Tab as MuiTab, Tabs, TextField } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useTabsStrict } from '@/context/TabsContext'

export default function TabBar() {
    const tabs = useTabsStrict()
    const activeId = tabs.activeTab?.id ?? false

    const containerRef = useRef<HTMLDivElement | null>(null)
    const [ready, setReady] = useState(false)

    useEffect(() => {
        let raf = 0
        let cancelled = false
        function check() {
            if (cancelled) return
            const el = containerRef.current
            if (el && el.offsetHeight > 0 && el.offsetWidth > 0) {
                setReady(true)
                return
            }
            raf = requestAnimationFrame(check)
        }
        raf = requestAnimationFrame(check)
        return () => {
            cancelled = true
            cancelAnimationFrame(raf)
        }
    }, [])

    if (tabs.tabs.length === 0 || !ready) {
        return null
    }

    return (
        <Box ref={containerRef} sx={{ display: 'flex', alignItems: 'center', bgcolor: 'background.default', borderBottom: 1, borderColor: 'divider' }}>
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
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault()
                                            e.currentTarget.blur()
                                        }
                                    }}
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
