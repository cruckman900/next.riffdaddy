// src/components/Navbar.tsx
'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuthContext } from '@/context/AuthProvider'
import { AppBar, Toolbar, Typography, Drawer, List, Box, Stack, Button } from '@mui/material'
import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone'
import MusicNoteTwoToneIcon from '@mui/icons-material/MusicNoteTwoTone'
import InfoTwoToneIcon from '@mui/icons-material/InfoTwoTone'
import HomeTwoToneIcon from '@mui/icons-material/HomeTwoTone'
import DesignServicesTwoToneIcon from '@mui/icons-material/DesignServicesTwoTone'
import AppRegistrationTwoToneIcon from '@mui/icons-material/AppRegistrationTwoTone'
import LockOpenTwoToneIcon from '@mui/icons-material/LockOpenTwoTone'
import ExitToAppTwoToneIcon from '@mui/icons-material/ExitToAppTwoTone'
import LeftMenu from '@/components/layout/LeftMenu'
import { useTheme } from '@mui/material/styles'

const Navbar = () => {
    const theme = useTheme()
    const { user, logout } = useAuthContext()
    const [rightOpen, setRightOpen] = useState(false)
    const [leftOpen, setLeftOpen] = useState(false)

    const pathname = usePathname()
    const currentPathname = pathname

    const navItems = [
        { label: 'Home', path: '/', icon: <HomeTwoToneIcon sx={{ scale: 1.5 }} /> },
        { label: 'About', path: '/about', icon: <InfoTwoToneIcon sx={{ scale: 1.5 }} /> },
        ...(!user ? [
            { label: 'Login', path: '/login', icon: <LockOpenTwoToneIcon sx={{ scale: 1.5 }} /> },
            { label: 'Register', path: '/register', icon: <AppRegistrationTwoToneIcon sx={{ scale: 1.5 }} /> },
        ] : []),
        ...(user ? [
            { label: 'Workspace', path: '/workspace', icon: <DesignServicesTwoToneIcon sx={{ scale: 1.5 }} /> },
        ] : [])
    ]

    function handleLogout() {
        logout()
    }

    return (
        <React.Fragment>
            <AppBar position="static" sx={{ backgroundColor: theme.palette.surface.main, '@media print': { display: 'none' } }}>
                <Toolbar>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" width="100%">
                        <Box>
                            <Link href="" color='inherit' aria-label="help" onClick={() => setLeftOpen(true)}>
                                <Button>
                                    <Typography variant="h6" color="text.primary">
                                        <MenuTwoToneIcon sx={{ scale: 1.5 }} />
                                    </Typography>
                                </Button>
                            </Link>

                            <Link href="/help" color='inherit' aria-label="help">
                                <Button>
                                    <Typography variant="h6" sx={{ flexGrow: 1, fontVariant: 'small-caps', fontSize: '1.15rem', color: currentPathname == '/help' ? theme.palette.accent.main : theme.palette.text.primary }}>
                                        <Stack direction="row" gap={1} justifyContent="space-between" alignItems="center">
                                            <MusicNoteTwoToneIcon sx={{ scale: 1.5 }} /> Help
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
                                            <Typography variant="h6" sx={{ flexGrow: 1, fontVariant: 'small-caps', fontSize: '1.15rem', color: currentPathname == path ? theme.palette.accent.main : theme.palette.text.primary }}>
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
                                                    <ExitToAppTwoToneIcon sx={{ scale: 1.5 }} /> Log out
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
                                        <MenuTwoToneIcon sx={{ scale: 1.5 }} />
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
                                        <Typography variant="h6" sx={{ flexGrow: 1, fontVariant: 'small-caps', color: currentPathname == path ? theme.palette.accent.main : theme.palette.text.primary }}>
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
