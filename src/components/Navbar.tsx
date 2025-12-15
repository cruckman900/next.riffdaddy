// src/components/Navbar.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthContext } from '@/context/AuthProvider'
import { AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItemButton, ListItemText, Box } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import MusicNoteIcon from '@mui/icons-material/MusicNote'
import Link from 'next/link'
import LeftMenu from '@/components/LeftMenu'
import NextLinkComposed from '@/components/NextLinkComposed'

const Navbar = () => {
    const { user, logout } = useAuthContext()
    const [rightOpen, setRightOpen] = useState(false)
    const [leftOpen, setLeftOpen] = useState(false)
    const router = useRouter()

    const navItems = [
        { label: 'Home', path: '/' },
        { label: 'About', path: '/about' },
        ...(!user ? [
            { label: 'Login', path: '/login' },
            { label: 'Register', path: '/register' },
        ] : []),
        ...(user ? [
            { label: 'Upload', path: '/upload' },
            { label: 'Tabs', path: '/tabs' },
            { label: 'Themes', path: '/themes' },
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
                    <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => setLeftOpen(true)} sx={{ mr: 1 }}>
                        <MenuIcon />
                    </IconButton>

                    <IconButton edge="start" color='inherit' aria-label="logo" sx={{ ml: 1 }}>
                        <MusicNoteIcon />
                    </IconButton>

                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        NEXTRiff
                    </Typography>

                    <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                        {navItems.map(({ label, path }) => (
                            <Link key={label} href={path} style={{ margin: '0 8px', color: 'white', textDecoration: 'none', fontVariant: 'small-caps' }}>
                                {label}
                            </Link>
                        ))}
                        {user && (
                            <Typography
                                variant='button'
                                sx={{ mx: 1, color: 'white', textDecoration: 'none', cursor: 'pointer', display: 'inline-block' }}
                                onClick={handleLogout}
                            >
                                Log out
                            </Typography>
                        )}
                    </Box>

                    <IconButton edge="end" color="inherit" aria-label="open-nav" sx={{ display: { sm: 'none' } }} onClick={() => setRightOpen(true)}>
                        <MenuIcon />
                    </IconButton>
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
                            <ListItemButton key={label} component={NextLinkComposed} href={path}>
                                <ListItemText primary={label} />
                            </ListItemButton>
                        ))}
                    </List>
                </Box>
            </Drawer>
        </>
    )
}

export default Navbar
