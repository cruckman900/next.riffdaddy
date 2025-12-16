'use client'

import { useState } from 'react'
import { Grid, Button, Typography } from '@mui/material'

export function RhythmPalette({ onSelect }: { onSelect: (duration: string, mode: 'note' | 'rest') => void }) {
    const [mode, setMode] = useState<'note' | 'rest'>('note')
    const durations = [
        { label: 'Whole', value: 'w' },
        { label: 'Half', value: 'h' },
        { label: 'Quarter', value: 'q' },
        { label: 'Eighth', value: '8' },
        { label: 'Sixteenth', value: '16' },
    ]

    return (
        <div>
            <Typography variant="body1" mb={2}>Select duration and mode:</Typography>
            <Grid container spacing={2}>
                {durations.map(d => (
                    <Grid item xs={6} key={d.value}>
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={() => onSelect(d.value, mode)}
                        >
                            {d.label} {mode === 'note' ? 'Note' : 'Rest'}
                        </Button>
                    </Grid>
                ))}
            </Grid>
            <Grid container spacing={2} mt={2}>
                <Grid item xs={6}>
                    <Button fullWidth variant={mode === 'note' ? 'contained' : 'outlined'} onClick={() => setMode('note')}>
                        Note Mode
                    </Button>
                </Grid>
                <Grid item xs={6}>
                    <Button fullWidth variant={mode === 'rest' ? 'contained' : 'outlined'} onClick={() => setMode('rest')}>
                        Rest Mode
                    </Button>
                </Grid>
            </Grid>
        </div>
    )
}
