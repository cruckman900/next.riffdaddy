// src/components/Navbar.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthContext } from '@/context/AuthProvider'
import { AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItemButton, ListItemText, Box, Stack, Button } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import MusicNoteIcon from '@mui/icons-material/MusicNote'
import InfoIcon from '@mui/icons-material/Info'
import HomeIcon from '@mui/icons-material/Home'
import DesignServicesIcon from '@mui/icons-material/DesignServices'
import LockOpenIcon from '@mui/icons-material/LockOpen';
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import LeftMenu from '@/components/LeftMenu'
import NextLinkComposed from '@/components/NextLinkComposed'
import Link from 'next/link'

const Navbar = () => {
    const { user, logout } = useAuthContext()
    const [rightOpen, setRightOpen] = useState(false)
    const [leftOpen, setLeftOpen] = useState(false)
    const router = useRouter()

    const navItems = [
        { label: 'Home', path: '/', icon: <HomeIcon sx={{ scale: 1.5 }} /> },
        { label: 'About', path: '/about', icon: <InfoIcon sx={{ scale: 1.5 }} /> },
        ...(!user ? [
            { label: 'Login', path: '/login', icon: <LockOpenIcon sx={{ scale: 1.5 }} /> },
            { label: 'Register', path: '/register', icon: <LockOpenIcon sx={{ scale: 1.5 }} /> },
        ] : []),
        ...(user ? [
            { label: 'Workspace', path: '/workspace', icon: <DesignServicesIcon sx={{ scale: 1.5 }} /> },
        ] : [])
    ]

    function handleLogout() {
        logout()
        router.push('/')
    }

    return (
        <>
            <AppBar position="static" color="primary" sx={{ '@media print': { display: 'none' } }}>
                <Toolbar>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" width="100%">
                        <Box>
                            <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => setLeftOpen(true)} sx={{ mr: 1 }}>
                                <MenuIcon sx={{ scale: 1.5 }} />
                            </IconButton>

                            <IconButton href='/help' edge="start" color='inherit' aria-label="logo" sx={{ ml: 2 }}>
                                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                                    <Stack direction="row" gap={1} justifyContent="space-between" alignItems="center">
                                        <MusicNoteIcon sx={{ scale: 1.5 }} /> Help
                                    </Stack>
                                </Typography>
                            </IconButton>
                        </Box>

                        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                            <Stack direction="row" spacing={2}>
                                {navItems.map(({ label, path, icon }) => (
                                    <Link key={label} href={path} color='inherit' aria-label={label}>
                                        <Button>
                                            <Typography variant="h6" sx={{ flexGrow: 1, fontVariant: 'small-caps' }}>
                                                <Stack direction="row" gap={2} justifyContent="space-between" alignItems="center">
                                                    {icon} {label}
                                                </Stack>
                                            </Typography>
                                        </Button>
                                    </Link>
                                ))}
                                {user && (
                                    <Link href="" color='inherit' aria-label="logout" onClick={handleLogout}>
                                        <Button>
                                            <Typography variant="h6" sx={{ flexGrow: 1, fontVariant: 'small-caps' }}>
                                                <Stack direction="row" gap={2} justifyContent="space-between" alignItems="center">
                                                    <ExitToAppIcon sx={{ scale: 1.5 }} /> Log out
                                                </Stack>
                                            </Typography>
                                        </Button>
                                    </Link>
                                )}
                            </Stack>
                        </Box>

                        <IconButton edge="end" color="inherit" aria-label="open-nav" sx={{ display: { sm: 'none' } }} onClick={() => setRightOpen(true)}>
                            <MenuIcon />
                        </IconButton>
                    </Stack>
                </Toolbar>
            </AppBar>

            <Drawer anchor="left" open={leftOpen} onClose={() => setLeftOpen(false)}>
                <Box sx={{ width: 260 }} role="presentation">
                    <LeftMenu onClose={() => setLeftOpen(false)} />
                </Box>
            </Drawer>

            <Drawer anchor="right" open={rightOpen} onClose={() => setRightOpen(false)}>
                <Box sx={{ width: 250 }} role="presentation" onClick={() => setRightOpen(false)}>
                    <List>
                        {navItems.map(({ label, path }) => (
                            <ListItemButton key={label} component={NextLinkComposed} to={path}>
                                <ListItemText primary={label} />
                            </ListItemButton>
                        ))}
                        {user && (
                            <Typography
                                variant='button'
                                sx={{ mx: 2.15, mt: 1.5, color: 'white', textDecoration: 'none', cursor: 'pointer', display: 'inline-block' }}
                                onClick={handleLogout}
                            >
                                Log out
                            </Typography>
                        )}
                    </List>
                </Box>
            </Drawer>
        </>
    )
}

export default Navbar
