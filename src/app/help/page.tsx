// src/app/help/page.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { Box, Typography, useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import HelpSidebar from '@/components/help/HelpSidebar'
import HelpContent from '@/components/help/HelpContent'
import { HELP_TOPICS } from '@/components/help/helpTopics'

// Reference line (in px from the scroll container's top) used to decide which
// section counts as "active" — also the offset applied when scrolling a
// section into view, so the two stay in sync.
const SCROLL_OFFSET = 24

export default function HelpPage() {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

    const [activeId, setActiveId] = useState(HELP_TOPICS[0].id)
    const isClickScrolling = useRef(false)
    const scrollAreaRef = useRef<HTMLDivElement>(null)

    // Scroll-spy based on section position rather than intersection ratio —
    // ratio-based spies bias toward short sections that fully fit on screen,
    // which misses the currently-scrolled-past section when it's taller than
    // the viewport (a common case here since sections vary a lot in length).
    useEffect(() => {
        const container = scrollAreaRef.current
        if (!container) return

        const sections = HELP_TOPICS
            .map(t => ({ id: t.id, el: document.getElementById(t.id) }))
            .filter((s): s is { id: string; el: HTMLElement } => !!s.el)

        if (!sections.length) return

        let raf = 0
        const updateActive = () => {
            if (isClickScrolling.current) return

            const { scrollTop, scrollHeight, clientHeight } = container

            // Pin to the extremes so the first/last topic always highlights
            // even if its section doesn't cross the reference line exactly.
            if (scrollTop <= 1) {
                setActiveId(sections[0].id)
                return
            }
            if (scrollTop + clientHeight >= scrollHeight - 1) {
                setActiveId(sections[sections.length - 1].id)
                return
            }

            const containerTop = container.getBoundingClientRect().top
            let current = sections[0].id
            for (const s of sections) {
                const relativeTop = s.el.getBoundingClientRect().top - containerTop
                if (relativeTop - SCROLL_OFFSET <= 0) {
                    current = s.id
                } else {
                    break
                }
            }
            setActiveId(current)
        }

        const handleScroll = () => {
            cancelAnimationFrame(raf)
            raf = requestAnimationFrame(updateActive)
        }

        updateActive()
        container.addEventListener('scroll', handleScroll, { passive: true })
        window.addEventListener('resize', handleScroll)
        return () => {
            cancelAnimationFrame(raf)
            container.removeEventListener('scroll', handleScroll)
            window.removeEventListener('resize', handleScroll)
        }
    }, [])

    const handleSelect = (id: string) => {
        const container = scrollAreaRef.current
        const el = document.getElementById(id)
        setActiveId(id)

        if (container && el) {
            const containerRect = container.getBoundingClientRect()
            const elRect = el.getBoundingClientRect()
            const target = container.scrollTop + (elRect.top - containerRect.top) - SCROLL_OFFSET

            isClickScrolling.current = true
            container.scrollTo({ top: Math.max(0, target), behavior: 'smooth' })
            // release the lock once the smooth scroll has had time to settle
            window.setTimeout(() => { isClickScrolling.current = false }, 500)
        }
    }

    return (
        <Box
            ref={scrollAreaRef}
            sx={{
                position: 'relative',
                width: '100%',
                height: 'calc(100vh - 205px)',
                overflowY: 'auto',
                bgcolor: 'background.default',
            }}
        >
            <Box
                sx={{
                    position: 'absolute',
                    inset: 0,
                    pointerEvents: 'none',
                    background: `radial-gradient(circle at 15% 10%, ${theme.palette.accent.main}1a, transparent 45%)`,
                }}
            />

            <Box sx={{ position: 'relative', p: { xs: 2, sm: 4 }, pb: 0 }}>
                <Typography
                    variant="h3"
                    sx={{
                        fontWeight: 700,
                        color: theme.palette.accent.main,
                        textShadow: `0 0 14px ${theme.palette.accent.main}66`,
                    }}
                >
                    Help Center
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                    Everything you need to know to preview, parse, and riff on your tabs.
                </Typography>
            </Box>

            <Box
                sx={{
                    position: 'relative',
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    gap: 2,
                    p: { xs: 2, sm: 4 },
                    alignItems: 'flex-start',
                }}
            >
                <Box
                    sx={{
                        flexShrink: 0,
                        width: isMobile ? '100%' : 240,
                        ...(isMobile ? {} : { position: 'sticky', top: 16 }),
                    }}
                >
                    <HelpSidebar
                        activeId={activeId}
                        onSelect={handleSelect}
                        orientation={isMobile ? 'horizontal' : 'vertical'}
                    />
                </Box>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <HelpContent />
                </Box>
            </Box>
        </Box>
    )
}
