// app/workspace/page.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthContext } from '@/context/AuthProvider'

import { useTabs } from '@/context/TabsContext'
import TabBar from '@/components/file/TabBar'
import TabContentRenderer from '@/components/file/TabContentRenderer'
import { useTheme, Box, Typography, Button } from '@mui/material'

function WorkspaceContent() {
    const router = useRouter()
    const { user } = useAuthContext()
    const theme = useTheme()

    const tabs = useTabs()
    const activeTab = tabs?.activeTab

    useEffect(() => {
        if (!user) {
            router.push('/')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])

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
                    bgcolor: theme.palette.background.paper,
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
