// src/components/TabContentRenderer.tsx
'use client'

import React from "react"
import { Box, Typography } from '@mui/material'
import { useTabs } from "@/context/TabsContext"

export default function TabContentRenderer() {
    const tabs = useTabs()
    const active = tabs.activeTab

    if (!active) {
        return <Box sx={{ p: 4 }}><Typography variant="h6">No tab open</Typography></Box>
    }

    switch (active.type) {
        case 'editor':
            return (
                <Box sx={{ p: 3 }}>
                    <Typography variant="h6">{active.title}</Typography>
                    <Typography variant="body2" color="text.secondary">Editor content placeholder</Typography>
                </Box>
            )
        case 'settings':
            return <Box sx={{ p: 3 }}><Typography>Settings</Typography></Box>
        case 'history':
            return <Box sx={{ p: 3 }}><Typography>History</Typography></Box>
        default:
            return <Box sx={{ p: 3 }}><Typography>Unknown tab type</Typography></Box>
    }
}
