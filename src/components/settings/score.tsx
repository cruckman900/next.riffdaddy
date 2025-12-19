/* eslint-disable react-hooks/exhaustive-deps */
import { Slider, Box, Typography, FormControlLabel, Switch, Divider } from '@mui/material'
import { useMusic } from '@/context/MusicContext'
import { useEffect, useState } from 'react'

export function ScoreSettings() {
    const { measuresPerRow, setMeasuresPerRow, scoreFixedWidth, setScoreFixedWidth } = useMusic()
    const [tempMeasuresPerRow, setTempMeasuresPerRow] = useState(measuresPerRow)

    // debounce scale
    useEffect(() => {
        const id = setTimeout(() => setMeasuresPerRow(tempMeasuresPerRow), 200)
        return () => clearTimeout(id)
    }, [tempMeasuresPerRow])

    return (
        <>
            <Typography variant="h6" gutterBottom color="text.primary">
                Score
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mt: 2, px: 1 }}>
                <Typography variant="subtitle1">Measures Per Row ({measuresPerRow})</Typography>
                <Box sx={{ px: 1 }}>
                    <Slider
                        value={tempMeasuresPerRow}
                        min={1}
                        max={6}
                        step={1}
                        onChange={(_, val) => setTempMeasuresPerRow(val as number)}
                    />
                </Box>
            </Box>

            <FormControlLabel
                sx={{ color: 'text.primary', mt: 2, px: 1 }}
                control={<Switch checked={scoreFixedWidth} onChange={() => setScoreFixedWidth(!scoreFixedWidth)} />}
                label={`Score Width: ${scoreFixedWidth ? 'Fixed' : 'Auto'}`}
            />
        </>
    )
}
