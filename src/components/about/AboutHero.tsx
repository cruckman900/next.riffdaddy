// src/components/about/AboutHero.tsx
'use client'

import { Box, Chip, Stack, Typography } from '@mui/material'
import { motion } from 'framer-motion'
import Image from 'next/image'
import AutoAwesomeTwoToneIcon from '@mui/icons-material/AutoAwesomeTwoTone'

// Shared brand neon palette — matches the home hero, header, and footer.
const GLOW = {
    green: '#00ff80',
    purple: '#b366ff',
    cyan: '#00e5ff',
}

export default function AboutHero() {
    return (
        <Box
            sx={{
                position: 'relative',
                width: '100%',
                overflow: 'hidden',
                minHeight: { xs: 'auto', md: '58vh' },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                px: 3,
                py: { xs: 8, md: 6 },
                bgcolor: 'background.default',
            }}
        >
            {/* Ambient glow blobs */}
            <Box
                sx={{
                    position: 'absolute',
                    inset: 0,
                    pointerEvents: 'none',
                    background: `radial-gradient(circle at 82% 18%, ${GLOW.purple}26, transparent 45%),
                        radial-gradient(circle at 12% 30%, ${GLOW.green}20, transparent 45%),
                        radial-gradient(circle at 50% 110%, ${GLOW.cyan}1f, transparent 55%)`,
                }}
            />

            {/* Faint tech grid texture */}
            <Box
                sx={{
                    position: 'absolute',
                    inset: 0,
                    pointerEvents: 'none',
                    opacity: 0.05,
                    backgroundImage:
                        'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)',
                    backgroundSize: '48px 48px',
                }}
            />

            {/* A single, large, slowly-drifting guitar silhouette behind the copy */}
            <Box sx={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                <motion.div
                    style={{ position: 'absolute', right: '-6%', top: '-6%', width: 'min(46vw, 520px)' }}
                    animate={{ y: [0, -16, 0], rotate: [-1.5, 1.5, -1.5] }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                >
                    <Image
                        src="/svg/guitar.svg"
                        alt="Guitar"
                        width={520}
                        height={280}
                        style={{
                            width: '100%',
                            height: 'auto',
                            filter: `drop-shadow(0 0 32px ${GLOW.purple})`,
                            opacity: 0.22,
                        }}
                    />
                </motion.div>
                <motion.div
                    style={{ position: 'absolute', left: '-8%', bottom: '-10%', width: 'min(30vw, 320px)' }}
                    animate={{ y: [0, -12, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
                >
                    <Image
                        src="/svg/drums.svg"
                        alt="Drums"
                        width={320}
                        height={260}
                        style={{
                            width: '100%',
                            height: 'auto',
                            filter: `drop-shadow(0 0 28px ${GLOW.green})`,
                            opacity: 0.18,
                        }}
                    />
                </motion.div>
            </Box>

            {/* Foreground content */}
            <Stack
                spacing={3}
                alignItems="center"
                textAlign="center"
                sx={{ position: 'relative', zIndex: 2, maxWidth: 780 }}
            >
                <Chip
                    icon={<AutoAwesomeTwoToneIcon sx={{ color: `${GLOW.purple} !important` }} />}
                    label="THE STORY SO FAR"
                    sx={{
                        bgcolor: 'rgba(0,0,0,0.35)',
                        border: `1px solid ${GLOW.purple}66`,
                        color: GLOW.purple,
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                        px: 1,
                        boxShadow: `0 0 16px ${GLOW.purple}33`,
                    }}
                />

                <Typography
                    component="h1"
                    sx={{
                        fontSize: { xs: '2.1rem', sm: '2.75rem', md: '3.25rem' },
                        fontWeight: 700,
                        lineHeight: 1.15,
                        backgroundImage: `linear-gradient(90deg, ${GLOW.purple}, ${GLOW.cyan} 50%, ${GLOW.green})`,
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        color: 'transparent',
                        filter: `drop-shadow(0 0 22px ${GLOW.cyan}44)`,
                    }}
                >
                    Built by a musician who got tired of ugly tab editors
                </Typography>

                <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ fontSize: { xs: '1rem', md: '1.15rem' }, lineHeight: 1.75, maxWidth: 640 }}
                >
                    NEXTRiff started as a stubborn side project: real notation, real playback, and a UI that
                    doesn&apos;t feel like it escaped from 2004. It&apos;s still growing, one riff at a time —
                    here&apos;s what&apos;s under the hood and where it&apos;s headed.
                </Typography>
            </Stack>
        </Box>
    )
}
