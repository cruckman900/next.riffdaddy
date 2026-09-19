// src/components/home/HeroSection.tsx
'use client'

import { Box, Button, Chip, Stack, Typography } from '@mui/material'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import MusicNoteTwoToneIcon from '@mui/icons-material/MusicNoteTwoTone'
import { useAuthContext } from '@/context/AuthProvider'

// Brand neon palette — matches the header, footer, and splash screen
// so the hero feels like part of the same stage lighting rig.
const GLOW = {
    green: '#00ff80',
    purple: '#b366ff',
    cyan: '#00e5ff',
}

interface FloatingInstrumentProps {
    src: string
    alt: string
    glow: string
    width: number
    height: number
    style: React.CSSProperties
    duration?: number
    delay?: number
    rotate?: number
}

function FloatingInstrument({
    src,
    alt,
    glow,
    width,
    height,
    style,
    duration = 7,
    delay = 0,
    rotate = 0,
}: FloatingInstrumentProps) {
    return (
        <motion.div
            style={{ position: 'absolute', ...style }}
            animate={{
                y: [0, -18, 0],
                rotate: rotate ? [-rotate, rotate, -rotate] : 0,
            }}
            transition={{ duration, repeat: Infinity, ease: 'easeInOut', delay }}
        >
            <Image
                src={src}
                alt={alt}
                width={width}
                height={height}
                style={{
                    width: '100%',
                    height: 'auto',
                    filter: `drop-shadow(0 0 28px ${glow})`,
                    opacity: 0.32,
                }}
            />
        </motion.div>
    )
}

export default function HeroSection() {
    const { user } = useAuthContext()

    return (
        <Box
            sx={{
                position: 'relative',
                width: '100%',
                overflow: 'hidden',
                minHeight: { xs: 'auto', md: '78vh' },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                px: 3,
                py: { xs: 10, md: 6 },
                bgcolor: 'background.default',
            }}
        >
            {/* Ambient glow blobs */}
            <Box
                sx={{
                    position: 'absolute',
                    inset: 0,
                    pointerEvents: 'none',
                    background: `radial-gradient(circle at 18% 28%, ${GLOW.purple}26, transparent 45%),
                        radial-gradient(circle at 82% 22%, ${GLOW.cyan}22, transparent 45%),
                        radial-gradient(circle at 50% 100%, ${GLOW.green}1f, transparent 55%)`,
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

            {/* Floating instrument silhouettes */}
            <Box sx={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                <FloatingInstrument
                    src="/svg/guitar.svg"
                    alt="Guitar"
                    glow={GLOW.green}
                    width={420}
                    height={230}
                    style={{ left: '-6%', bottom: '4%', width: 'min(40vw, 440px)' }}
                    duration={7}
                    rotate={2}
                />
                <FloatingInstrument
                    src="/svg/piano.svg"
                    alt="Piano"
                    glow={GLOW.cyan}
                    width={260}
                    height={340}
                    style={{ right: '4%', top: '0%', width: 'min(20vw, 240px)' }}
                    duration={9}
                    delay={0.6}
                />
                <FloatingInstrument
                    src="/svg/drums.svg"
                    alt="Drums"
                    glow={GLOW.purple}
                    width={340}
                    height={260}
                    style={{ right: '-8%', bottom: '-4%', width: 'min(32vw, 360px)' }}
                    duration={8}
                    delay={1.2}
                    rotate={1.5}
                />
            </Box>

            {/* Foreground content */}
            <Stack
                spacing={3}
                alignItems="center"
                textAlign="center"
                sx={{ position: 'relative', zIndex: 2, maxWidth: 760 }}
            >
                <Chip
                    icon={<MusicNoteTwoToneIcon sx={{ color: `${GLOW.cyan} !important` }} />}
                    label="RIFF-READY TAB PARSING"
                    sx={{
                        bgcolor: 'rgba(0,0,0,0.35)',
                        border: `1px solid ${GLOW.cyan}66`,
                        color: GLOW.cyan,
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                        px: 1,
                        boxShadow: `0 0 16px ${GLOW.cyan}33`,
                    }}
                />

                <Typography
                    component="h1"
                    sx={{
                        fontSize: { xs: '2.25rem', sm: '3rem', md: '3.5rem' },
                        fontWeight: 700,
                        lineHeight: 1.1,
                        backgroundImage: `linear-gradient(90deg, ${GLOW.green}, ${GLOW.cyan} 50%, ${GLOW.purple})`,
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        color: 'transparent',
                        filter: `drop-shadow(0 0 22px ${GLOW.purple}55)`,
                    }}
                >
                    Welcome to NEXTRiff
                </Typography>

                <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ fontSize: { xs: '1rem', md: '1.15rem' }, lineHeight: 1.7 }}
                >
                    Create, preview, parse, and riff on guitar tabs. I&apos;ll be adding other instruments
                    and features soon, but for now — let&apos;s get started with the basics.
                </Typography>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ pt: 1 }}>
                    <Button
                        component={Link}
                        href={user ? '/workspace' : '/register'}
                        variant="contained"
                        size="large"
                        sx={{
                            bgcolor: GLOW.green,
                            color: '#04150a',
                            fontWeight: 700,
                            px: 3.5,
                            boxShadow: `0 0 20px ${GLOW.green}66`,
                            '&:hover': {
                                bgcolor: GLOW.green,
                                boxShadow: `0 0 32px ${GLOW.green}`,
                            },
                        }}
                    >
                        {user ? 'Enter the Workspace' : "Start Riffing — It's Free"}
                    </Button>
                    <Button
                        component={Link}
                        href="/about"
                        variant="outlined"
                        size="large"
                        sx={{
                            borderColor: `${GLOW.purple}88`,
                            color: GLOW.purple,
                            px: 3.5,
                            '&:hover': {
                                borderColor: GLOW.purple,
                                boxShadow: `0 0 16px ${GLOW.purple}55`,
                            },
                        }}
                    >
                        Learn More
                    </Button>
                </Stack>

                <Typography
                    variant="caption"
                    sx={{
                        color: GLOW.cyan,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        opacity: 0.75,
                        pt: 1,
                    }}
                >
                    Built with a backstage pass.
                </Typography>
            </Stack>
        </Box>
    )
}
