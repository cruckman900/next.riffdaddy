// src/components/Navbar.tsx
'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuthContext } from '@/context/AuthProvider'
import { useTheme, AppBar, Toolbar, Typography, Drawer, List, Box, Stack, Button } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import MusicNoteIcon from '@mui/icons-material/MusicNote'
import InfoIcon from '@mui/icons-material/Info'
import HomeIcon from '@mui/icons-material/Home'
import DesignServicesIcon from '@mui/icons-material/DesignServices'
import AppRegistrationIcon from '@mui/icons-material/AppRegistration'
import LockOpenIcon from '@mui/icons-material/LockOpen';
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import LeftMenu from '@/components/layout/LeftMenu'

const Navbar = () => {
    const { user, logout } = useAuthContext()
    const [rightOpen, setRightOpen] = useState(false)
    const [leftOpen, setLeftOpen] = useState(false)

    const pathname = usePathname()

    const isWorkspace = pathname === '/workspace'
    const currentPathname = pathname

    const navItems = [
        { label: 'Home', path: '/', icon: <HomeIcon sx={{ scale: 1.5 }} /> },
        { label: 'About', path: '/about', icon: <InfoIcon sx={{ scale: 1.5 }} /> },
        ...(!user ? [
            { label: 'Login', path: '/login', icon: <LockOpenIcon sx={{ scale: 1.5 }} /> },
            { label: 'Register', path: '/register', icon: <AppRegistrationIcon sx={{ scale: 1.5 }} /> },
        ] : []),
        ...(user ? [
            { label: 'Workspace', path: '/workspace', icon: <DesignServicesIcon sx={{ scale: 1.5 }} /> },
        ] : [])
    ]

    function handleLogout() {
        logout()
    }

    const theme = useTheme()

    return (
        <React.Fragment>
            <AppBar position="static" color="primary" sx={{ '@media print': { display: 'none' } }}>
                <Toolbar>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" width="100%">
                        <Box>
                            {isWorkspace && <Link href="" color='inherit' aria-label="help" onClick={() => setLeftOpen(true)}>
                                <Button>
                                    <Typography variant="h6" sx={{ flexGrow: 1, color: theme.palette.text.primary }}>
                                        <MenuIcon sx={{ scale: 1.5 }} />
                                    </Typography>
                                </Button>
                            </Link>}

                            <Link href="/help" color='inherit' aria-label="help">
                                <Button>
                                    <Typography variant="h6" sx={{ flexGrow: 1, fontVariant: 'small-caps', fontSize: '1.15rem', color: currentPathname == '/help' ? '#00ff00' : theme.palette.text.primary }}>
                                        <Stack direction="row" gap={1} justifyContent="space-between" alignItems="center">
                                            <MusicNoteIcon sx={{ scale: 1.5 }} /> Help
                                        </Stack>
                                    </Typography>
                                </Button>
                            </Link>

                        </Box>

                        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                            <Stack direction="row" spacing={2}>
                                {navItems.map(({ label, path, icon }) => (
                                    <Link key={label} href={path} color='inherit' aria-label={label}>
                                        <Button>
                                            <Typography variant="h6" sx={{ flexGrow: 1, fontVariant: 'small-caps', fontSize: '1.15rem', color: currentPathname == path ? '#00ff00' : theme.palette.text.primary }}>
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
                                            <Typography variant="h6" sx={{ flexGrow: 1, fontVariant: 'small-caps', fontSize: '1.15rem', color: theme.palette.text.primary }}>
                                                <Stack direction="row" gap={2} justifyContent="space-between" alignItems="center">
                                                    <ExitToAppIcon sx={{ scale: 1.5 }} /> Log out
                                                </Stack>
                                            </Typography>
                                        </Button>
                                    </Link>
                                )}
                            </Stack>
                        </Box>

                        <Box sx={{ display: { sm: 'none' } }}>
                            <Link href="" aria-label="open-nav" onClick={() => setRightOpen(true)}>
                                <Button>
                                    <Typography sx={{ color: theme.palette.text.primary }}>
                                        <MenuIcon sx={{ scale: 1.5 }} />
                                    </Typography>
                                </Button>
                            </Link>
                        </Box>
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
                        <Stack direction="column">
                            {navItems.map(({ label, path }) => (
                                <Link key={label} href={path} color='inherit' aria-label={label}>
                                    <Button>
                                        <Typography variant="h6" sx={{ flexGrow: 1, fontVariant: 'small-caps', color: currentPathname == path ? '#00ff00' : theme.palette.text.primary }}>
                                            {label}
                                        </Typography>
                                    </Button>
                                </Link>

                            ))}
                        </Stack>
                        {user && (
                            <Link href="" color='inherit' aria-label="logout" onClick={handleLogout}>
                                <Button>
                                    <Typography variant="h6" sx={{ flexGrow: 1, fontVariant: 'small-caps', color: theme.palette.text.primary }}>
                                        Log out
                                    </Typography>
                                </Button>
                            </Link>
                        )}
                    </List>
                </Box>
            </Drawer>
        </React.Fragment>
    )
}

export default Navbar
