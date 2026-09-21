// src/components/about/TechStackMarquee.tsx
'use client'

import { Box, Typography } from '@mui/material'
import type { IconType } from 'react-icons'
import {
    SiNextdotjs,
    SiReact,
    SiTypescript,
    SiMui,
    SiFramer,
    SiFastapi,
    SiPython,
    SiPostgresql,
    SiSqlite,
    SiJsonwebtokens,
    SiCloudinary,
} from 'react-icons/si'
import { GiMusicalNotes, GiGrandPiano } from 'react-icons/gi'
import { FaFilePdf } from 'react-icons/fa'

const GLOW = {
    green: '#00ff80',
    purple: '#b366ff',
    cyan: '#00e5ff',
}

interface Tech {
    icon: IconType
    label: string
}

const STACK: Tech[] = [
    { icon: SiNextdotjs, label: 'Next.js' },
    { icon: SiReact, label: 'React' },
    { icon: SiTypescript, label: 'TypeScript' },
    { icon: SiMui, label: 'MUI' },
    { icon: SiFramer, label: 'Framer Motion' },
    { icon: GiMusicalNotes, label: 'VexFlow' },
    { icon: GiGrandPiano, label: 'Tone.js' },
    { icon: SiFastapi, label: 'FastAPI' },
    { icon: SiPython, label: 'Python' },
    { icon: SiPostgresql, label: 'PostgreSQL' },
    { icon: SiSqlite, label: 'SQLite' },
    { icon: SiJsonwebtokens, label: 'JWT Auth' },
    { icon: SiCloudinary, label: 'Cloudinary' },
    { icon: FaFilePdf, label: 'Paged.js' },
]

// The list renders twice back-to-back (not deduped) so the marquee keyframe
// (see .animate-marquee in globals.css) can translate by exactly -50% —
// precisely one copy's width — for a seamless, gapless infinite loop instead
// of a bare list that would visibly snap back to its start.
const LOOPED_STACK = [...STACK, ...STACK]

export default function TechStackMarquee() {
    return (
        <Box sx={{ position: 'relative', py: { xs: 5, md: 7 }, bgcolor: 'background.paper', overflow: 'hidden' }}>
            <Typography
                variant="overline"
                textAlign="center"
                sx={{ display: 'block', color: GLOW.cyan, letterSpacing: '0.14em', fontWeight: 700, mb: 3 }}
            >
                Under The Hood
            </Typography>

            {/* Fade edges so the marquee doesn't have a hard clip */}
            <Box
                sx={{
                    position: 'relative',
                    maskImage: 'linear-gradient(90deg, transparent, black 8%, black 92%, transparent)',
                    WebkitMaskImage: 'linear-gradient(90deg, transparent, black 8%, black 92%, transparent)',
                }}
            >
                <Box
                    className="animate-marquee"
                    sx={{
                        display: 'flex',
                        width: 'max-content',
                        gap: { xs: 4, md: 6 },
                        alignItems: 'center',
                    }}
                >
                    {LOOPED_STACK.map(({ icon: Icon, label }, i) => (
                        <Box
                            key={`${label}-${i}`}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                color: 'text.secondary',
                                whiteSpace: 'nowrap',
                                opacity: 0.85,
                            }}
                        >
                            <Icon
                                size={22}
                                style={{
                                    color: [GLOW.green, GLOW.cyan, GLOW.purple][i % 3],
                                }}
                            />
                            <Typography variant="body2" fontWeight={600}>
                                {label}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </Box>
        </Box>
    )
}
