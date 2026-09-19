'use client'

import React, { useState, useEffect } from "react"
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import HtmlTooltip from '@mui/material/Tooltip'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import TableRowsTwoToneIcon from '@mui/icons-material/TableRowsTwoTone'
import MusicNoteTwoToneIcon from '@mui/icons-material/MusicNoteTwoTone'
import LayersTwoToneIcon from '@mui/icons-material/LayersTwoTone'
import PrintTwoToneIcon from '@mui/icons-material/PrintTwoTone'
import KeyboardTwoToneIcon from '@mui/icons-material/KeyboardTwoTone'
import { Typography } from '@mui/material'
import TabRenderer from './TabRenderer'
import StaffRenderer from './StaffRenderer'
import CombinedRenderer from "./CombinedRenderer"
import NotationToolbar from './NotationToolbar'
import { useMusic } from '@/context/MusicContext'
import { useTheme } from "@mui/material/styles"

interface ScorePreviewProps {
    setActiveMeasureId: (id: string) => void
    activeMeasureId?: string | null
}

export default function ScorePreview({ setActiveMeasureId, activeMeasureId }: ScorePreviewProps) {
    const theme = useTheme()

    const [viewMode, setViewMode] = useState<'tab' | 'staff' | 'combined'>('tab')
    const { measures, getMeasureBeatCount } = useMusic()

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 600


    // Keyboard navigation
    useEffect(() => {
        function handleKey(e: KeyboardEvent) {
            if (!measures.length) return
            const currentIndex = measures.findIndex(m => m.id === activeMeasureId)

            if (e.key === 'ArrowRight') {
                const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % measures.length : 0
                setActiveMeasureId(measures[nextIndex].id)
            }
            if (e.key === 'ArrowLeft') {
                const prevIndex = currentIndex >= 0 ? (currentIndex - 1 + measures.length) % measures.length : measures.length - 1
                setActiveMeasureId(measures[prevIndex].id)
            }

            if (e.key === 'ArrowUp') {
                setViewMode(prev => {
                    if (prev === 'tab') return 'staff'
                    if (prev === 'staff') return 'combined'
                    return 'tab'
                })
            }
            if (e.key === 'ArrowDown') {
                setViewMode(prev => {
                    if (prev === 'tab') return 'combined'
                    if (prev === 'combined') return 'staff'
                    return 'tab'
                })
            }
        }

        window.addEventListener('keydown', handleKey)
        return () => window.removeEventListener('keydown', handleKey)
    }, [measures, activeMeasureId, setActiveMeasureId])

    return (
        <Box height="100%" overflow="auto" p="10px">
            <Box
                sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: 'background.default',
                    border: '1px solid',
                    borderColor: 'divider',
                    boxShadow: `0 0 24px ${theme.palette.accent.main}22`,
                }}
            >
                {/* Header: title + view mode segmented control */}
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    justifyContent="space-between"
                    alignItems={{ xs: 'stretch', sm: 'center' }}
                    spacing={1.5}
                    className="print:hidden"
                    sx={{ mb: 1.5 }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 600,
                            color: theme.palette.accent.main,
                            textShadow: `0 0 10px ${theme.palette.accent.main}66`,
                        }}
                    >
                        Score Preview
                    </Typography>

                    <ToggleButtonGroup
                        value={viewMode}
                        exclusive
                        size="small"
                        onChange={(_, next) => next && setViewMode(next)}
                        sx={{
                            bgcolor: 'rgba(255,255,255,0.03)',
                            '.MuiToggleButton-root': {
                                color: theme.palette.text.secondary,
                                border: '1px solid',
                                borderColor: 'divider',
                                textTransform: 'none',
                                gap: 0.75,
                                '&.Mui-selected': {
                                    color: theme.palette.accent.main,
                                    bgcolor: `${theme.palette.accent.main}1f`,
                                    boxShadow: `0 0 12px ${theme.palette.accent.main}55`,
                                },
                            },
                        }}
                    >
                        <ToggleButton value="tab"><TableRowsTwoToneIcon fontSize="small" /> Tab</ToggleButton>
                        <ToggleButton value="staff"><MusicNoteTwoToneIcon fontSize="small" /> Staff</ToggleButton>
                        <ToggleButton value="combined"><LayersTwoToneIcon fontSize="small" /> Combined</ToggleButton>
                    </ToggleButtonGroup>
                </Stack>

                {!isMobile && (
                    <Stack direction="row" spacing={1} className="print:hidden" sx={{ mb: 1 }}>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                bgcolor: `${theme.palette.accent.main}14`,
                                color: theme.palette.text.primary,
                                padding: '6px 12px',
                                borderRadius: 1,
                                fontSize: '0.8rem',
                                flex: 1,
                            }}
                        >
                            <PrintTwoToneIcon fontSize="small" sx={{ color: theme.palette.accent.main }} />
                            Heads up: for best print results, set margins to &ldquo;none&rdquo; and scale to &ldquo;100%&rdquo;.
                        </Box>

                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                bgcolor: 'rgba(255,255,255,0.04)',
                                color: theme.palette.text.secondary,
                                padding: '6px 12px',
                                borderRadius: 1,
                                fontSize: '0.75rem',
                            }}
                        >
                            <KeyboardTwoToneIcon fontSize="small" />
                            ← → cycles measures · ↑ ↓ switches view
                        </Box>
                    </Stack>
                )}

                {/* Measure selector with beat count + overflow indicator */}
                <Stack
                    direction="row"
                    flexWrap="wrap"
                    gap={1}
                    mt={2}
                    mb={2}
                >
                    {measures.map((m, idx) => {
                        const [beats, value] = m.timeSignature.split('/').map(Number)
                        const numBeats = beats || 4
                        const beatValue = value || 4
                        const maxBeats = numBeats * (4 / beatValue)
                        const currentBeats = getMeasureBeatCount(m)
                        const overfilled = currentBeats > maxBeats
                        const isActive = activeMeasureId === m.id
                        const fillPct = Math.min(100, (currentBeats / maxBeats) * 100)

                        return (
                            <HtmlTooltip key={m.id} title={
                                <Stack direction="column" spacing={1} padding={0.5} width={125}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Typography variant="body2" sx={{ textAlign: 'left', opacity: 0.8 }}>
                                            Measure
                                        </Typography>
                                        <Typography variant="body1" sx={{ textAlign: 'right' }}>
                                            {idx + 1}
                                        </Typography>
                                    </Stack>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Typography variant="body2" sx={{ textAlign: 'left', opacity: 0.8 }}>
                                            Clef
                                        </Typography>
                                        <Typography variant="body1" sx={{ textAlign: 'right' }}>
                                            {m.clef || 'treble'}
                                        </Typography>
                                    </Stack>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Typography variant="body2" sx={{ textAlign: 'left', opacity: 0.8 }}>
                                            Time
                                        </Typography>
                                        <Typography variant="body1" sx={{ textAlign: 'right' }}>
                                            {m.timeSignature}
                                        </Typography>
                                    </Stack>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Typography variant="body2" sx={{ textAlign: 'left', opacity: 0.8 }}>
                                            Key
                                        </Typography>
                                        <Typography variant="body1" sx={{ textAlign: 'right' }}>
                                            {m.keySignature || 'C'}
                                        </Typography>
                                    </Stack>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Typography variant="body2" sx={{ textAlign: 'left', opacity: 0.8 }}>
                                            Beats
                                        </Typography>
                                        <Typography variant="body1" sx={{ textAlign: 'right' }}>
                                            {currentBeats}/{maxBeats}{overfilled ? ' (Overflow!)' : ''}
                                        </Typography>
                                    </Stack>
                                </Stack>
                            } arrow>
                                <Stack
                                    direction="column"
                                    alignItems="center"
                                    gap={0.75}
                                    sx={{ mb: 0.5 }}
                                >
                                    <Button
                                        variant={isActive ? 'contained' : 'outlined'}
                                        size="small"
                                        onClick={() => setActiveMeasureId(m.id)}
                                        sx={{
                                            minWidth: 110,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                            borderRadius: 999,
                                            transition: 'box-shadow 0.2s ease, transform 0.2s ease',
                                            ...(overfilled
                                                ? {
                                                    color: theme.palette.error.main,
                                                    borderColor: theme.palette.error.main,
                                                    bgcolor: isActive ? `${theme.palette.error.main}22` : 'transparent',
                                                    boxShadow: `0 0 10px ${theme.palette.error.main}66`,
                                                }
                                                : isActive
                                                    ? {
                                                        bgcolor: theme.palette.accent.main,
                                                        color: theme.palette.getContrastText(theme.palette.accent.main),
                                                        boxShadow: `0 0 14px ${theme.palette.accent.main}88`,
                                                    }
                                                    : {
                                                        borderColor: 'divider',
                                                        color: theme.palette.text.secondary,
                                                    }),
                                            '&:hover': {
                                                transform: 'translateY(-1px)',
                                            },
                                        }}
                                    >
                                        <Box>{`Measure ${idx + 1}`}</Box>
                                        {overfilled && <Box><WarningAmberIcon fontSize="small" sx={{ ml: 0.5 }} /></Box>}
                                    </Button>

                                    {/* Beat-fill progress bar */}
                                    <Box sx={{ width: 96, height: 4, borderRadius: 999, bgcolor: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                                        <Box
                                            sx={{
                                                width: `${fillPct}%`,
                                                height: '100%',
                                                borderRadius: 999,
                                                bgcolor: overfilled ? theme.palette.error.main : theme.palette.accent.main,
                                                boxShadow: overfilled
                                                    ? `0 0 6px ${theme.palette.error.main}`
                                                    : `0 0 6px ${theme.palette.accent.main}`,
                                                transition: 'width 0.2s ease',
                                            }}
                                        />
                                    </Box>

                                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                                        {`${currentBeats}/${maxBeats} beats`}
                                    </Typography>
                                </Stack>
                            </HtmlTooltip>
                        )
                    })}
                </Stack>

                {/* Contextual toolbar — appears when one or more notes are selected */}
                <NotationToolbar />

                {/* Printable Renderers — kept on a light "sheet" for print/notation clarity */}
                <Box
                    sx={{
                        bgcolor: '#ffffff',
                        borderRadius: 2,
                        boxShadow: `0 0 0 1px rgba(0,0,0,0.06), 0 8px 30px rgba(0,0,0,0.35)`,
                        overflow: 'hidden',
                    }}
                >
                    {viewMode === 'tab' && <TabRenderer activeMeasureId={activeMeasureId} />}
                    {viewMode === 'staff' && <StaffRenderer activeMeasureId={activeMeasureId} />}
                    {viewMode === 'combined' && <CombinedRenderer activeMeasureId={activeMeasureId} />}
                </Box>
            </Box>
        </Box>
    )
}
