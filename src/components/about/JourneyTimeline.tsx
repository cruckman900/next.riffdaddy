// src/components/about/JourneyTimeline.tsx
'use client'

import { Box, Stack, Typography } from '@mui/material'
import { motion } from 'framer-motion'
import type { SvgIconComponent } from '@mui/icons-material'
import PianoTwoToneIcon from '@mui/icons-material/PianoTwoTone'
import LibraryMusicTwoToneIcon from '@mui/icons-material/LibraryMusicTwoTone'
import GraphicEqTwoToneIcon from '@mui/icons-material/GraphicEqTwoTone'
import LockPersonTwoToneIcon from '@mui/icons-material/LockPersonTwoTone'
import PrintTwoToneIcon from '@mui/icons-material/PrintTwoTone'
import RocketLaunchTwoToneIcon from '@mui/icons-material/RocketLaunchTwoTone'

const GLOW = {
    green: '#00ff80',
    purple: '#b366ff',
    cyan: '#00e5ff',
}

interface Milestone {
    icon: SvgIconComponent
    color: string
    title: string
    description: string
}

const MILESTONES: Milestone[] = [
    {
        icon: PianoTwoToneIcon,
        color: GLOW.green,
        title: 'First Riff',
        description: 'Fretboard input and a rhythm palette let the first notes land on a virtual fretboard.',
    },
    {
        icon: LibraryMusicTwoToneIcon,
        color: GLOW.cyan,
        title: 'Finding Its Voice',
        description: 'Tab, staff, and combined renderers came online, with measures that size themselves to fit their notes.',
    },
    {
        icon: GraphicEqTwoToneIcon,
        color: GLOW.purple,
        title: 'Plugged In',
        description: 'Instrument, tuning, and voice selection arrived, followed by real in-browser playback.',
    },
    {
        icon: LockPersonTwoToneIcon,
        color: GLOW.green,
        title: 'Backstage Pass',
        description: 'Secure accounts, refresh-proof sessions, and save/load to the cloud or local disk.',
    },
    {
        icon: PrintTwoToneIcon,
        color: GLOW.cyan,
        title: 'Ready For The Big Stage',
        description: 'Paginated printing, an expanded notation toolbar, and a help center to tie it all together.',
    },
    {
        icon: RocketLaunchTwoToneIcon,
        color: GLOW.purple,
        title: 'What\u2019s Next',
        description: 'More instruments, sharing riffs with other musicians, and whatever the next stubborn idea turns out to be.',
    },
]

export default function JourneyTimeline() {
    return (
        <Box sx={{ position: 'relative', px: { xs: 3, md: 8 }, py: { xs: 6, md: 10 }, bgcolor: 'background.default' }}>
            <Typography variant="h4" textAlign="center" fontWeight={700} color="text.primary" sx={{ mb: 1.5 }}>
                The Journey
            </Typography>
            <Typography
                variant="body1"
                textAlign="center"
                color="text.secondary"
                sx={{ mb: 7, maxWidth: 620, mx: 'auto' }}
            >
                A rough timeline of how NEXTRiff got here — and a hint at where it&apos;s headed.
            </Typography>

            <Box sx={{ position: 'relative', maxWidth: 760, mx: 'auto' }}>
                {/* Vertical spine */}
                <Box
                    sx={{
                        position: 'absolute',
                        left: { xs: 19, sm: '50%' },
                        top: 0,
                        bottom: 0,
                        width: '2px',
                        transform: { sm: 'translateX(-50%)' },
                        background: `linear-gradient(180deg, ${GLOW.green}, ${GLOW.cyan}, ${GLOW.purple})`,
                        opacity: 0.4,
                    }}
                />

                <Stack spacing={{ xs: 4, sm: 5 }}>
                    {MILESTONES.map(({ icon: Icon, color, title, description }, i) => {
                        const isRight = i % 2 === 1
                        return (
                            <motion.div
                                key={title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.4 }}
                                transition={{ duration: 0.5, delay: i * 0.06 }}
                            >
                                <Box
                                    sx={{
                                        position: 'relative',
                                        pl: { xs: 6, sm: isRight ? 0 : 6 },
                                        pr: { xs: 0, sm: isRight ? 6 : 0 },
                                        display: 'flex',
                                        justifyContent: { xs: 'flex-start', sm: isRight ? 'flex-start' : 'flex-end' },
                                        ml: { sm: isRight ? '50%' : 0 },
                                        mr: { sm: isRight ? 0 : '50%' },
                                        textAlign: { xs: 'left', sm: isRight ? 'left' : 'right' },
                                    }}
                                >
                                    {/* Node dot on the spine */}
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: 4,
                                            left: { xs: 12, sm: isRight ? -8 : 'auto' },
                                            right: { sm: isRight ? 'auto' : -8 },
                                            width: 16,
                                            height: 16,
                                            borderRadius: '50%',
                                            bgcolor: 'background.default',
                                            border: `2px solid ${color}`,
                                            boxShadow: `0 0 12px ${color}88`,
                                        }}
                                    />
                                    <Box sx={{ maxWidth: 420 }}>
                                        <Stack
                                            direction={{ xs: 'row', sm: isRight ? 'row' : 'row-reverse' }}
                                            spacing={1}
                                            alignItems="center"
                                            sx={{ mb: 0.75, justifyContent: { xs: 'flex-start', sm: isRight ? 'flex-start' : 'flex-end' } }}
                                        >
                                            <Icon sx={{ color, fontSize: 22 }} />
                                            <Typography variant="subtitle1" fontWeight={700} color="text.primary">
                                                {title}
                                            </Typography>
                                        </Stack>
                                        <Typography variant="body2" color="text.secondary">
                                            {description}
                                        </Typography>
                                    </Box>
                                </Box>
                            </motion.div>
                        )
                    })}
                </Stack>
            </Box>
        </Box>
    )
}
