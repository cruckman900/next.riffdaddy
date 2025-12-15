// src/app/landing/page.tsx
'use client'

import React, { useEffect } from 'react'
import { Box, Button, List, ListItemButton, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'
import { useTabsStrict } from '@/context/TabsContext'

export default function Landing() {
    const router = useRouter()
    const tabs = useTabsStrict()

    // Example: if user is authenticated, redirect to workspace automatically
    useEffect(() => {
        // Replace with real auth check
        const isLoggedIn = true
        if (isLoggedIn) {
            router.push('/workspace')
        }
    }, [router])

    // if you want a landing UI before redirect, show quick actions:
    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" sx={{ mb: 2 }}>Welcome</Typography>
            <Button variant="contained" onClick={() => { tabs.newTab({ title: 'Untitled', type: 'editor' }); router.push('/workspace') }}>Create New Tab</Button>

            <Typography variant="h6" sx={{ mt: 3 }}>Recent</Typography>
            <List>
                {tabs.history.map(h => (
                    <ListItemButton key={h.id} onClick={() => { tabs.reopenFromHistory(h.id); router.push('/workspace') }}>
                        {h.title}
                    </ListItemButton>
                ))}
            </List>
        </Box>
    )
}
