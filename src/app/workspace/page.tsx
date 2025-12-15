// app/workspace/page.tsx
'use client'
import { TabsProvider } from '@/context/TabsContext'
// import Navbar from '@/components/Navbar'
import TabBar from '@/components/TabBar'
import TabContentRenderer from '@/components/TabContentRenderer'
import { Box } from '@mui/material'

export default function Workspace() {
    return (
        <TabsProvider>
            {/* <Navbar /> */}
            <Box sx={{ display: 'flex', height: '100vh', pt: '64px' }}>
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
