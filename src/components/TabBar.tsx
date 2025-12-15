// src/components/TabBar.tsx
'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Box, IconButton, Tab as MuiTab, Tabs } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useTabsStrict } from '@/context/TabsContext'

export default function TabBar() {
    const tabs = useTabsStrict()
    const activeId = tabs.activeTab?.id ?? false

    // container ref so we can check layout/visibility
    const containerRef = useRef<HTMLDivElement | null>(null)
    const [ready, setReady] = useState(false)

    useEffect(() => {
        let raf = 0
        let cancelled = false

        function check() {
            // stop if unmounted
            if (cancelled) return
            const el = containerRef.current
            // if element exists and has layout, we're ready
            if (el && el.offsetHeight > 0 && el.offsetWidth > 0) {
                setReady(true)
                return
            }
            // otherwise try again on next frame
            raf = requestAnimationFrame(check)
        }

        // start checking on next frame to give parent layout a chance
        raf = requestAnimationFrame(check)

        return () => {
            cancelled = true
            cancelAnimationFrame(raf)
        }
    }, [])

    // If there are no tabs, show a simple placeholder bar
    if (tabs.tabs.length === 0) {
        return (
            <Box
                ref={containerRef}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    bgcolor: 'background.default',
                    borderBottom: 1,
                    borderColor: 'divider',
                    px: 2,
                    height: 48,
                }}
            >
                <Box sx={{ color: 'text.secondary' }}>No tabs open</Box>
            </Box>
        )
    }

    // If not ready yet, render a placeholder with same height to avoid layout shift
    if (!ready) {
        return (
            <Box
                ref={containerRef}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    bgcolor: 'background.default',
                    borderBottom: 1,
                    borderColor: 'divider',
                    px: 2,
                    height: 48,
                }}
            >
                <Box sx={{ color: 'text.secondary' }}>Loading tabs…</Box>
            </Box>
        )
    }

    // ready && tabs exist -> render Tabs safely
    return (
        <Box ref={containerRef} sx={{ display: 'flex', alignItems: 'center', bgcolor: 'background.default', borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={activeId} variant="scrollable" scrollButtons="auto" sx={{ flex: 1 }} aria-label="open tabs">
                {tabs.tabs.map((t) => (
                    <MuiTab
                        key={t.id}
                        value={t.id}
                        label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <span style={{ pointerEvents: 'none' }}>{t.title}</span>

                                {/* Close control rendered as a non-button to avoid nested buttons */}
                                <IconButton
                                    component="span"
                                    size="small"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        tabs.closeTab(t.id)
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault()
                                            e.stopPropagation()
                                            tabs.closeTab(t.id)
                                        }
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
