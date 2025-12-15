// app/workspace/page.tsx
'use client'
import { TabsProvider, useTabs } from '@/context/TabsContext'
// import Navbar from '@/components/Navbar'
import TabBar from '@/components/TabBar'
import TabContentRenderer from '@/components/TabContentRenderer'
import { Box, Typography, Button } from '@mui/material'

function WorkspaceContent() {
    const tabs = useTabs()
    const activeTab = tabs?.activeTab

    if (!activeTab) {
        return (
            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    p: 4,
                    bgcolor: 'background.paper',
                }}
            >
                <Typography variant="h6" color="text.secondary" gutterBottom>
                    No tabs open
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    Use the left menu or press Ctrl/Cmd+T to create a new tab.
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => tabs?.newTab({ title: 'Untitled', type: 'editor', payload: { content: '' } })}
                >
                    New Tab
                </Button>
            </Box>
        )
    }

    return (
        <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
            <TabContentRenderer />
        </Box>
    )
}

export default function Workspace() {
    return (
        <TabsProvider>
            {/* <Navbar /> */}
            <Box sx={{ display: 'flex', height: '100vh', pt: '64px' }}>
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <TabBar />
                    <WorkspaceContent />
                </Box>
            </Box>
        </TabsProvider>
    )
}
