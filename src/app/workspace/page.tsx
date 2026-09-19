// app/workspace/page.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuthContext } from '@/context/AuthProvider'

import { useTabs } from '@/context/TabsContext'
import TabBar from '@/components/file/TabBar'
import TabContentRenderer from '@/components/file/TabContentRenderer'
import { useTheme, Box, Typography, Button } from '@mui/material'
import LibraryMusicTwoToneIcon from '@mui/icons-material/LibraryMusicTwoTone'
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone'

function WorkspaceContent() {
    const router = useRouter()
    const { user, loading } = useAuthContext()
    const theme = useTheme()

    const tabs = useTabs()
    const activeTab = tabs?.activeTab

    useEffect(() => {
        if (!loading && !user) {
            router.push('/')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, loading])

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
                    position: 'relative',
                    overflow: 'hidden',
                    bgcolor: theme.palette.background.paper,
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        inset: 0,
                        pointerEvents: 'none',
                        background: `radial-gradient(circle at 50% 40%, ${theme.palette.accent.main}1f, transparent 60%)`,
                    }}
                />

                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{ position: 'relative', textAlign: 'center' }}
                >
                    <Box
                        sx={{
                            display: 'inline-flex',
                            p: 2,
                            mb: 2,
                            borderRadius: '50%',
                            bgcolor: `${theme.palette.accent.main}1a`,
                            boxShadow: `0 0 24px ${theme.palette.accent.main}55`,
                        }}
                    >
                        <LibraryMusicTwoToneIcon sx={{ fontSize: 40, color: theme.palette.accent.main }} />
                    </Box>

                    <Typography variant="h6" color="text.primary" gutterBottom sx={{ fontWeight: 700 }}>
                        No tabs open
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
                        Spin up a fresh tab and start riffing.
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddTwoToneIcon />}
                        onClick={() =>
                            tabs?.newTab({
                                title: 'Untitled',
                                type: 'editor',
                                payload: { content: '' },
                            })
                        }
                        sx={{
                            bgcolor: theme.palette.accent.main,
                            color: theme.palette.getContrastText(theme.palette.accent.main),
                            boxShadow: `0 0 18px ${theme.palette.accent.main}77`,
                            '&:hover': {
                                bgcolor: theme.palette.accent.main,
                                boxShadow: `0 0 28px ${theme.palette.accent.main}`,
                            },
                        }}
                    >
                        New Tab
                    </Button>
                </motion.div>
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
