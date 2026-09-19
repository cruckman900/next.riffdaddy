// src/components/home/FeatureGrid.tsx
'use client'

import { Box, Typography } from '@mui/material'
import { motion } from 'framer-motion'
import type { SvgIconComponent } from '@mui/icons-material'
import PaletteTwoToneIcon from '@mui/icons-material/PaletteTwoTone'
import LibraryMusicTwoToneIcon from '@mui/icons-material/LibraryMusicTwoTone'
import AutoAwesomeTwoToneIcon from '@mui/icons-material/AutoAwesomeTwoTone'
import FilterAltTwoToneIcon from '@mui/icons-material/FilterAltTwoTone'
import DataObjectTwoToneIcon from '@mui/icons-material/DataObjectTwoTone'
import ShareTwoToneIcon from '@mui/icons-material/ShareTwoTone'

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
        icon: PaletteTwoToneIcon,
        color: GLOW.green,
        title: 'Genre-Based Themes',
        description: 'Metal, jazz, blues, rock, classical, country — every genre gets its own glowing palette.',
    },
    {
        icon: LibraryMusicTwoToneIcon,
        color: GLOW.cyan,
        title: 'Metadata at a Glance',
        description: 'Key, tempo, and time signature surface instantly so you always know the groove.',
    },
    {
        icon: AutoAwesomeTwoToneIcon,
        color: GLOW.purple,
        title: 'Expressive Motion UI',
        description: 'Tailwind + Framer Motion bring glowing transitions to every tab and toolbar.',
    },
    {
        icon: FilterAltTwoToneIcon,
        color: GLOW.green,
        title: 'Smart Tab Filtering',
        description: 'Slice through your library by genre and find your next riff in seconds.',
    },
    {
        icon: DataObjectTwoToneIcon,
        color: GLOW.cyan,
        title: 'Type-Safe Core',
        description: 'Built with TypeScript end-to-end for clean, predictable component props.',
    },
    {
        icon: ShareTwoToneIcon,
        color: GLOW.purple,
        title: 'Social-Ready Previews',
        description: 'OG and Twitter cards make your riffs look great wherever they\u2019re shared.',
    },
]

export default function FeatureGrid() {
    return (
        <Box sx={{ position: 'relative', px: { xs: 3, md: 8 }, py: { xs: 6, md: 10 }, bgcolor: 'background.paper' }}>
            <Typography variant="h4" textAlign="center" fontWeight={700} color="text.primary" sx={{ mb: 1.5 }}>
                Everything You Need to Riff
            </Typography>
            <Typography
                variant="body1"
                textAlign="center"
                color="text.secondary"
                sx={{ mb: 6, maxWidth: 620, mx: 'auto' }}
            >
                NEXTRiff blends musical metadata, genre-aware styling, and expressive motion into one riff-ready workbench.
            </Typography>

            <Box
                sx={{
                    display: 'grid',
                    gap: 3,
                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
                    maxWidth: 1100,
                    mx: 'auto',
                }}
            >
                {FEATURES.map(({ icon: Icon, color, title, description }, i) => (
                    <motion.div
                        key={title}
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.5, delay: i * 0.08 }}
                    >
                        <Box
                            sx={{
                                height: '100%',
                                p: 3,
                                borderRadius: 3,
                                border: '1px solid',
                                borderColor: 'divider',
                                bgcolor: 'background.default',
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
                                <Icon sx={{ fontSize: 28, color }} />
                            </Box>
                            <Typography variant="h6" color="text.primary" sx={{ mb: 1 }}>
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
