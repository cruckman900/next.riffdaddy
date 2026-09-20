// src/components/about/FeatureShowcase.tsx
'use client'

import { Box, Typography } from '@mui/material'
import { motion } from 'framer-motion'
import type { SvgIconComponent } from '@mui/icons-material'
import PianoTwoToneIcon from '@mui/icons-material/PianoTwoTone'
import GraphicEqTwoToneIcon from '@mui/icons-material/GraphicEqTwoTone'
import TuneTwoToneIcon from '@mui/icons-material/TuneTwoTone'
import PlayCircleTwoToneIcon from '@mui/icons-material/PlayCircleTwoTone'
import CloudSyncTwoToneIcon from '@mui/icons-material/CloudSyncTwoTone'
import LockPersonTwoToneIcon from '@mui/icons-material/LockPersonTwoTone'
import PrintTwoToneIcon from '@mui/icons-material/PrintTwoTone'
import HelpCenterTwoToneIcon from '@mui/icons-material/HelpCenterTwoTone'

const GLOW = {
    green: '#00ff80',
    purple: '#b366ff',
    cyan: '#00e5ff',
}

interface Feature {
    icon: SvgIconComponent
    color: string
    title: string
    description: string
}

const FEATURES: Feature[] = [
    {
        icon: PianoTwoToneIcon,
        color: GLOW.green,
        title: 'Tab, Staff & Combined',
        description: 'Switch between guitar tab, standard staff, or both at once — rendered in sync with VexFlow.',
    },
    {
        icon: TuneTwoToneIcon,
        color: GLOW.cyan,
        title: 'Instrument, Tuning & Voice',
        description: 'Pick your instrument, string count, and tuning, then choose a playback voice to match the tone in your head.',
    },
    {
        icon: PlayCircleTwoToneIcon,
        color: GLOW.purple,
        title: 'Real Playback',
        description: 'Hear your riff played back right in the browser through sampled instrument voices.',
    },
    {
        icon: GraphicEqTwoToneIcon,
        color: GLOW.green,
        title: 'Expressive Notation',
        description: 'Dotted notes, ties, accents, and more — select one or more notes to dress them up.',
    },
    {
        icon: CloudSyncTwoToneIcon,
        color: GLOW.cyan,
        title: 'Cloud & Local Saves',
        description: 'Save and load tabs to your account or straight to disk, with proper Save As naming.',
    },
    {
        icon: LockPersonTwoToneIcon,
        color: GLOW.purple,
        title: 'Accounts That Persist',
        description: 'Secure, JWT-backed sign in that survives a refresh — your place in the workspace is never lost.',
    },
    {
        icon: PrintTwoToneIcon,
        color: GLOW.green,
        title: 'Print-Ready Scores',
        description: 'Paginated, page-numbered printouts where a stave or tab is never split across pages.',
    },
    {
        icon: HelpCenterTwoToneIcon,
        color: GLOW.cyan,
        title: 'A Real Help Center',
        description: 'Searchable documentation covering every tool in the workspace, kept up to date as features ship.',
    },
]

export default function FeatureShowcase() {
    return (
        <Box sx={{ position: 'relative', px: { xs: 3, md: 8 }, py: { xs: 6, md: 10 }, bgcolor: 'background.default' }}>
            <Typography variant="h4" textAlign="center" fontWeight={700} color="text.primary" sx={{ mb: 1.5 }}>
                What&apos;s Actually In Here
            </Typography>
            <Typography
                variant="body1"
                textAlign="center"
                color="text.secondary"
                sx={{ mb: 6, maxWidth: 640, mx: 'auto' }}
            >
                No vaporware — every one of these ships in the current workspace.
            </Typography>

            <Box
                sx={{
                    display: 'grid',
                    gap: 3,
                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
                    maxWidth: 1200,
                    mx: 'auto',
                }}
            >
                {FEATURES.map(({ icon: Icon, color, title, description }, i) => (
                    <motion.div
                        key={title}
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.5, delay: (i % 4) * 0.08 }}
                    >
                        <Box
                            sx={{
                                height: '100%',
                                p: 3,
                                borderRadius: 3,
                                border: '1px solid',
                                borderColor: 'divider',
                                bgcolor: 'background.paper',
                                transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: `0 0 24px ${color}44`,
                                    borderColor: color,
                                },
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'inline-flex',
                                    p: 1.25,
                                    borderRadius: 2,
                                    mb: 2,
                                    bgcolor: `${color}1a`,
                                }}
                            >
                                <Icon sx={{ fontSize: 26, color }} />
                            </Box>
                            <Typography variant="subtitle1" fontWeight={700} color="text.primary" sx={{ mb: 0.75 }}>
                                {title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {description}
                            </Typography>
                        </Box>
                    </motion.div>
                ))}
            </Box>
        </Box>
    )
}
