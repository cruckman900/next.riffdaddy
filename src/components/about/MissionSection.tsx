// src/components/about/MissionSection.tsx
'use client'

import { Box, Stack, Typography } from '@mui/material'
import { motion } from 'framer-motion'
import Image from 'next/image'

const GLOW = {
    green: '#00ff80',
    purple: '#b366ff',
    cyan: '#00e5ff',
}

export default function MissionSection() {
    return (
        <Box sx={{ position: 'relative', px: { xs: 3, md: 8 }, py: { xs: 6, md: 9 }, bgcolor: 'background.paper' }}>
            <Box
                sx={{
                    display: 'grid',
                    gap: { xs: 5, md: 8 },
                    gridTemplateColumns: { xs: '1fr', md: '1.1fr 0.9fr' },
                    maxWidth: 1100,
                    mx: 'auto',
                    alignItems: 'center',
                }}
            >
                <motion.div
                    initial={{ opacity: 0, x: -24 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.55 }}
                >
                    <Stack spacing={2.5}>
                        <Typography
                            variant="overline"
                            sx={{ color: GLOW.cyan, letterSpacing: '0.14em', fontWeight: 700 }}
                        >
                            The Mission
                        </Typography>
                        <Typography variant="h4" fontWeight={700} color="text.primary">
                            Notation software should feel like an instrument, not a spreadsheet
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                            Most free tab tools force a trade-off: either you get real standard notation and a
                            clunky, dated interface, or a slick editor that only half-understands music. NEXTRiff
                            is an attempt to stop making that trade-off — tab, staff, and combined views rendered
                            properly with VexFlow, wrapped in an editor that actually feels good to use.
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                            Every measure recalculates its own width based on what&apos;s actually inside it. Every
                            note you place can carry the same expressive detail a real arranger would reach for —
                            ties, accents, dotted rhythms, dynamics. And it all autosaves, persists across a
                            refresh, and plays back through your browser.
                        </Typography>
                    </Stack>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.92 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    <Box
                        sx={{
                            position: 'relative',
                            borderRadius: 4,
                            border: '1px solid',
                            borderColor: 'divider',
                            bgcolor: 'background.default',
                            p: { xs: 4, md: 5 },
                            overflow: 'hidden',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minHeight: 260,
                        }}
                    >
                        <Box
                            sx={{
                                position: 'absolute',
                                inset: 0,
                                pointerEvents: 'none',
                                background: `radial-gradient(circle at 30% 20%, ${GLOW.purple}22, transparent 55%),
                                    radial-gradient(circle at 80% 80%, ${GLOW.green}1f, transparent 55%)`,
                            }}
                        />
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                            style={{ position: 'relative', width: '68%', maxWidth: 220 }}
                        >
                            <Image
                                src="/svg/piano.svg"
                                alt="Piano"
                                width={220}
                                height={280}
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    filter: `drop-shadow(0 0 26px ${GLOW.cyan})`,
                                    opacity: 0.85,
                                }}
                            />
                        </motion.div>

                        {/* Decorative staff lines threading behind the silhouette */}
                        <Box sx={{ position: 'absolute', left: 24, right: 24, top: '50%', transform: 'translateY(-50%)' }}>
                            {[0, 1, 2, 3, 4].map((i) => (
                                <Box
                                    key={i}
                                    sx={{
                                        height: '1px',
                                        my: '9px',
                                        background: `linear-gradient(90deg, transparent, ${GLOW.cyan}55, transparent)`,
                                    }}
                                />
                            ))}
                        </Box>
                    </Box>
                </motion.div>
            </Box>
        </Box>
    )
}
