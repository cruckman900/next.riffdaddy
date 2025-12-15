// src/components/TabContentRenderer.tsx
'use client'
import { useTabs } from '@/context/TabsContext'
import { Box, Typography } from '@mui/material'

export default function TabContentRenderer() {
    const tabs = useTabs()
    const active = tabs?.activeTab

    if (!active) {
        return null
    }

    switch (active.type) {
        case 'editor':
            return (
                <Box sx={{ p: 2 }}>
                    {/* Replace this with your real editor */}
                    <Typography variant="body1" color="text.secondary">
                        Editor goes here…
                    </Typography>
                </Box>
            )
        case 'settings':
            return <Box sx={{ p: 2 }}>Settings panel</Box>
        case 'history':
            return <Box sx={{ p: 2 }}>History view</Box>
        default:
            return <Box sx={{ p: 2 }}>Unknown tab type</Box>
    }
}
