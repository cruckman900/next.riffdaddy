'use client'

import { useState, useEffect } from "react"
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import TabRenderer from './TabRenderer'
import StaffRenderer from './StaffRenderer'
import CombinedRenderer from "./CombinedRenderer"
import { useMusic } from '@/context/MusicContext'

interface ScorePreviewProps {
    setActiveMeasureId: (id: string) => void
    activeMeasureId?: string | null
}

export default function ScorePreview({ setActiveMeasureId, activeMeasureId }: ScorePreviewProps) {
    const [viewMode, setViewMode] = useState<'tab' | 'staff' | 'both'>('tab')
    const { measures, getMeasureBeatCount } = useMusic()

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
                    if (prev === 'staff') return 'both'
                    return 'tab'
                })
            }
            if (e.key === 'ArrowDown') {
                setViewMode(prev => {
                    if (prev === 'tab') return 'both'
                    if (prev === 'both') return 'staff'
                    return 'tab'
                })
            }
        }

        window.addEventListener('keydown', handleKey)
        return () => window.removeEventListener('keydown', handleKey)
    }, [measures, activeMeasureId, setActiveMeasureId])

    return (
        <Box height="100%" overflow="auto" p="10px">
            <Grid item xs={12} md={8}>
                <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 2, boxShadow: 1 }}>
                    <FormControl fullWidth className="print:hidden">
                        <InputLabel id="view-mode-label" sx={{ color: 'WindowText' }}>View Mode</InputLabel>
                        <Select
                            labelId="view-mode-label"
                            value={viewMode}
                            label="View Mode"
                            onChange={(e) => setViewMode(e.target.value as 'tab' | 'staff' | 'both')}
                            sx={{
                                color: 'GrayText',
                                '.MuiOutlinedInput-notchedOutline': { borderColor: 'GrayText' },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' },
                                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.light' },
                                '.MuiSvgIcon-root': { color: 'GrayText' },
                            }}
                        >
                            <MenuItem value="tab">Tab</MenuItem>
                            <MenuItem value="staff">Staff</MenuItem>
                            <MenuItem value="both">Both</MenuItem>
                        </Select>
                    </FormControl>

                    <Box
                        className="print:hidden"
                        sx={{
                            backgroundColor: '#fef3c7',
                            color: '#92400e',
                            padding: '8px 16px',
                            borderRadius: 1,
                            fontSize: '0.875rem',
                            marginBottom: 2,
                        }}
                    >
                        🖨️ Heads up: For best results when printing, set margins to “none” and scale to “100%”.
                    </Box>

                    {/* Keyboard hints */}
                    <Box
                        sx={{
                            backgroundColor: '#e0f2fe',
                            color: '#0369a1',
                            padding: '6px 12px',
                            borderRadius: 1,
                            fontSize: '0.75rem',
                            marginBottom: 2,
                        }}
                    >
                        ⌨️ Tip: Use ← and → to cycle measures, ↑ and ↓ to switch view modes.
                    </Box>

                    {/* Measure selector with beat count + overflow indicator */}
                    <Stack
                        direction="row"
                        flexWrap="wrap"
                        gap={1}
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

                            const tooltipText = `Measure ${idx + 1}
Time: ${m.timeSignature}
Key: ${m.keySignature || 'C'}
Clef: ${m.clef || 'treble'}
Beats: ${currentBeats}/${maxBeats}${overfilled ? ' (Overflow!)' : ''}`

                            return (
                                <Tooltip key={m.id} title={tooltipText} arrow>
                                    <Button
                                        variant={isActive ? 'contained' : 'outlined'}
                                        color={overfilled ? 'error' : isActive ? 'primary' : 'inherit'}
                                        size="small"
                                        onClick={() => setActiveMeasureId(m.id)}
                                        sx={{
                                            minWidth: 100,
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        {`Measure ${idx + 1}`}
                                        {overfilled && <WarningAmberIcon fontSize="small" sx={{ ml: 0.5 }} />}
                                    </Button>
                                </Tooltip>
                            )
                        })}
                    </Stack>

                    {/* Printable Renderers */}
                    {viewMode === 'tab' && <TabRenderer activeMeasureId={activeMeasureId} />}
                    {viewMode === 'staff' && <StaffRenderer activeMeasureId={activeMeasureId} />}
                    {viewMode === 'both' && <CombinedRenderer activeMeasureId={activeMeasureId} />}
                </Box>
            </Grid>
        </Box>
    )
}
