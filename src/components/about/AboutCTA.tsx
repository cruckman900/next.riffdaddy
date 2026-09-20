// src/components/about/AboutCTA.tsx
'use client'

import { Box, Button, Stack, Typography } from '@mui/material'
import Link from 'next/link'
import { useAuthContext } from '@/context/AuthProvider'

const GLOW = {
    green: '#00ff80',
    purple: '#b366ff',
    cyan: '#00e5ff',
}

export default function AboutCTA() {
    const { user } = useAuthContext()

    return (
        <Box
            sx={{
                position: 'relative',
                overflow: 'hidden',
                px: 3,
                py: { xs: 8, md: 10 },
                bgcolor: 'background.paper',
                textAlign: 'center',
            }}
        >
            <Box
                sx={{
                    position: 'absolute',
                    inset: 0,
                    pointerEvents: 'none',
                    background: `radial-gradient(circle at 50% 0%, ${GLOW.green}1a, transparent 55%)`,
                }}
            />

            <Stack spacing={3} alignItems="center" sx={{ position: 'relative', zIndex: 1, maxWidth: 620, mx: 'auto' }}>
                <Typography variant="h4" fontWeight={700} color="text.primary">
                    Ready to plug in?
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    Jump into the workspace and start riffing — no credit card, no sign-up hoops, just tabs.
                </Typography>
                <Button
                    component={Link}
                    href={user ? '/workspace' : '/register'}
                    variant="contained"
                    size="large"
                    sx={{
                        bgcolor: GLOW.green,
                        color: '#04150a',
                        fontWeight: 700,
                        px: 4,
                        boxShadow: `0 0 20px ${GLOW.green}66`,
                        '&:hover': {
                            bgcolor: GLOW.green,
                            boxShadow: `0 0 32px ${GLOW.green}`,
                        },
                    }}
                >
                    {user ? 'Enter the Workspace' : "Start Riffing — It's Free"}
                </Button>
            </Stack>
        </Box>
    )
}
