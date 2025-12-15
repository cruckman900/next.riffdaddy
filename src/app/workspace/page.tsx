// src/app/workspace/page.tsx
'use client'

import React from 'react'
import { Box } from '@mui/material'
import { TabsProvider } from '@/context/TabsContext'
import LeftMenu from '@/components/LeftMenu'
import TabBar from '@/components/TabBar'
import TabContentRenderer from '@/components/TabContentRenderer'

export default function Workspace() {
    return (
        <TabsProvider>
            <Box sx={{ display: 'flex', height: '100vh' }}>
                <LeftMenu />
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <TabBar />
                    <Box sx={{ flex: 1, overflow: 'auto' }}>
                        <TabContentRenderer />
                    </Box>
                </Box>
            </Box>
        </TabsProvider>
    )
}
