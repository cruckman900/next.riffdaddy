/* eslint-disable react-hooks/exhaustive-deps */
import { Slider, Box, Typography, FormControlLabel, Switch, Divider } from '@mui/material'
import { useMusic } from '@/context/MusicContext'
import { useEffect, useState } from 'react'
import { useTheme } from '@mui/material'

export function ScoreSettings() {
    const { measuresPerRow, setMeasuresPerRow, scoreFixedWidth, setScoreFixedWidth, noteSpacing, setNoteSpacing } = useMusic()
    const [tempMeasuresPerRow, setTempMeasuresPerRow] = useState(measuresPerRow)
    const [tempNoteSpacing, setTempNoteSpacing] = useState(noteSpacing)

    const theme = useTheme()

    // debounce scale
    useEffect(() => {
        const id = setTimeout(() => setMeasuresPerRow(tempMeasuresPerRow), 200)
        return () => clearTimeout(id)
    }, [tempMeasuresPerRow])

    useEffect(() => {
        const id = setTimeout(() => setNoteSpacing(tempNoteSpacing), 200)
        return () => clearTimeout(id)
    }, [tempNoteSpacing])

    return (
        <>
            <Typography
                variant="h6"
                gutterBottom
                sx={{ color: theme.palette.accent.main, fontWeight: 700, textShadow: `0 0 8px ${theme.palette.accent.main}55` }}
            >
                Score
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mt: 2, px: 1 }}>
                <Typography variant="subtitle1" color="text.secondary">Measures Per Row ({measuresPerRow})</Typography>
                <Box sx={{ px: 1 }}>
                    <Slider
                        value={tempMeasuresPerRow}
                        min={1}
                        max={6}
                        step={1}
                        onChange={(_, val) => setTempMeasuresPerRow(val as number)}
                        sx={{
                            color: theme.palette.accent.main,
                            '& .MuiSlider-thumb': { boxShadow: `0 0 8px ${theme.palette.accent.main}` },
                        }}
                    />
                </Box>
            </Box>

            <Box sx={{ mt: 2, px: 1 }}>
                <Typography variant="subtitle1" color="text.secondary">
                    Note Spacing ({tempNoteSpacing}px)
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                    Extra breathing room added per note, beyond VexFlow&apos;s tightest packing.
                </Typography>
                <Box sx={{ px: 1 }}>
                    <Slider
                        value={tempNoteSpacing}
                        min={0}
                        max={40}
                        step={2}
                        onChange={(_, val) => setTempNoteSpacing(val as number)}
                        sx={{
                            color: theme.palette.accent.main,
                            '& .MuiSlider-thumb': { boxShadow: `0 0 8px ${theme.palette.accent.main}` },
                        }}
                    />
                </Box>
            </Box>

            <FormControlLabel
                sx={{ color: theme.palette.text.primary, mt: 2, px: 1 }}
                control={
                    <Switch
                        checked={scoreFixedWidth}
                        onChange={() => setScoreFixedWidth(!scoreFixedWidth)}
                        sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': { color: theme.palette.accent.main },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: theme.palette.accent.main },
                        }}
                    />
                }
                label={`Score Width: ${scoreFixedWidth ? 'Fixed' : 'Auto'}`}
            />
        </>
    )
}
