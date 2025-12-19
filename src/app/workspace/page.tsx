// app/workspace/page.tsx
'use client'

import { useTabs } from '@/context/TabsContext'
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
                    Use the left menu to create a new tab.
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() =>
                        tabs?.newTab({
                            title: 'Untitled',
                            type: 'editor',
                            payload: { content: '' },
                        })
                    }
                >
                    New Tab
                </Button>
            </Box>
        )
    }

    return (
        <Box sx={{ flex: 1, overflow: 'auto' }}>
            <TabContentRenderer />
        </Box>
    )
}

export default function Workspace() {
    return (
        <Box width="100%" sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
            {/* Toolbar: top on xs, left on md+ */}
            <TabBar />

            {/* Main content */}
            <WorkspaceContent />
        </Box>
    )
}
