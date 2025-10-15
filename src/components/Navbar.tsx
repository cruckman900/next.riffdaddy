// components/Navbar.tsx
"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/context/AuthProvider';
import { AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItemButton, ListItemText, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import MusicNoteIcon from '@mui/icons-material/MusicNote'
import Link from 'next/link'

const Navbar = () => {
    const { user, logout } = useAuthContext()
    
    const [drawerOpen, setDrawerOpen] = useState(false)

    const router = useRouter()

    const navItems = [
        { label: 'Home', path: '/'},
        { label: 'About', path: '/about' },
        ... (!user ? [
            { label: 'Login', path: '/login' },
            { label: 'Register', path: '/register' },
        ] : []),
        ... (user ? [
            { label: 'Upload', path: '/upload' },
            { label: 'Tabs', path: '/tabs' },
            { label: 'Themes', path: '/themes' },
        ] : [])
    ]

    function handleLogout() {
        logout()
        router.push("/")
    }

    return (
        <>
            <AppBar position="static" color="primary">
                <Toolbar>
                    <IconButton edge="start" color='inherit' aria-label="logo">
                        <MusicNoteIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        NEXTRiff
                    </Typography>
                    <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                        {navItems.map(({ label, path }) => (
                            <Link key={label} href={path} passHref>
                                <Typography
                                    variant="button"
                                    sx={{
                                        mx: 1,
                                        color: 'white',
                                        textDecoration: 'none'
                                    }}
                                >
                                    {label}
                                </Typography>
                            </Link>
                        ))}
                        {user && (
                            <Typography
                                variant='button'
                                sx={{
                                    mx: 1,
                                    color: 'white',
                                    textDecoration: 'none',
                                    cursor: 'pointer',
                                    display: 'inline-block'
                                }}
                                onClick={handleLogout}
                            >
                                Log out
                            </Typography>
                        )}
                    </Box>
                    <IconButton
                        edge="end"
                        color="inherit"
                        aria-label="menu"
                        sx={{ display: { sm: 'none' } }}
                        onClick={() => setDrawerOpen(true)}
                    >
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
                <Box sx={{ width: 250 }} role="presentation" onClick={() => setDrawerOpen(false)}>
                    <List>
                        {navItems.map(({ label, path }) => (
                            <Link key={label} href={path} passHref>
                                <ListItemButton>
                                    <ListItemText primary={label} />
                                </ListItemButton>
                            </Link>
                        ))}
                    </List>
                </Box>
            </Drawer>
        </>
    )
}

export default Navbar