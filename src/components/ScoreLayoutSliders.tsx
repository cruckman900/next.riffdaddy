/* eslint-disable react-hooks/exhaustive-deps */
import { Slider, Box, Typography, FormControlLabel, Switch } from '@mui/material'
import { useMusic } from '@/context/MusicContext'
import { useEffect, useState } from 'react'

export function ScoreLayoutSliders() {
    const { measuresPerRow, setMeasuresPerRow, scoreFixedWidth, setScoreFixedWidth } = useMusic()
    const [tempMeasuresPerRow, setTempMeasuresPerRow] = useState(measuresPerRow)

    // debounce scale
    useEffect(() => {
        const id = setTimeout(() => setMeasuresPerRow(tempMeasuresPerRow), 200)
        return () => clearTimeout(id)
    }, [tempMeasuresPerRow])

    return (
        <>
            <Box sx={{ mt: 2, px: 1 }}>
                <Typography variant="caption">Measures Per Row ({measuresPerRow})</Typography>
                <Slider
                    value={tempMeasuresPerRow}
                    min={1}
                    max={4}
                    step={1}
                    onChange={(_, val) => setTempMeasuresPerRow(val as number)}
                />
            </Box>

            <FormControlLabel
                sx={{ color: 'text.primary', mt: 2, px: 1 }}
                control={<Switch checked={scoreFixedWidth} onChange={() => setScoreFixedWidth(!scoreFixedWidth)} />}
                label={`Score Width: ${scoreFixedWidth ? 'Fixed' : 'Auto'}`}
            />
        </>
    )
}
