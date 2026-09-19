// src/components/user/AuthCard.tsx
'use client'

import { Box, Typography } from '@mui/material'
import { motion } from 'framer-motion'
import { useTheme } from '@mui/material/styles'
import Image from 'next/image'
import Link from 'next/link'

const GLOW = {
    green: '#00ff80',
    purple: '#b366ff',
    cyan: '#00e5ff',
}

interface AuthCardProps {
    title: string
    subtitle?: string
    children: React.ReactNode
}

export default function AuthCard({ title, subtitle, children }: AuthCardProps) {
    const theme = useTheme()

    return (
        <Box
            sx={{
                position: 'relative',
                width: '100%',
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                px: 2,
                py: 6,
                bgcolor: 'background.default',
            }}
        >
            {/* Ambient glow, matching the home hero */}
            <Box
                sx={{
                    position: 'absolute',
                    inset: 0,
                    pointerEvents: 'none',
                    background: `radial-gradient(circle at 20% 20%, ${GLOW.purple}22, transparent 45%),
                        radial-gradient(circle at 85% 80%, ${GLOW.cyan}1f, transparent 45%)`,
                }}
            />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                style={{ position: 'relative', width: '100%', maxWidth: 420 }}
            >
                <Box
                    sx={{
                        borderRadius: 3,
                        border: '1px solid',
                        borderColor: 'divider',
                        bgcolor: 'background.paper',
                        boxShadow: `0 0 30px ${theme.palette.accent.main}22`,
                        p: { xs: 3, sm: 4 },
                    }}
                >
                    <Box display="flex" justifyContent="center" mb={2}>
                        <Link href="/">
                            <Image
                                src="/NEXTRiff_Badge.png"
                                alt="NEXTRiff"
                                width={48}
                                height={48}
                                className="drop-shadow-[0_0_10px_#00ff80]"
                                style={{ borderRadius: 10 }}
                            />
                        </Link>
                    </Box>

                    <Typography
                        variant="h5"
                        textAlign="center"
                        sx={{ fontWeight: 700, color: theme.palette.accent.main, textShadow: `0 0 10px ${theme.palette.accent.main}66` }}
                    >
                        {title}
                    </Typography>

                    {subtitle && (
                        <Typography variant="body2" textAlign="center" color="text.secondary" sx={{ mt: 0.5, mb: 1 }}>
                            {subtitle}
                        </Typography>
                    )}

                    <Box sx={{ mt: 2 }}>
                        {children}
                    </Box>
                </Box>
            </motion.div>
        </Box>
    )
}
