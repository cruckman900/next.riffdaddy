'use client'

import { useState } from 'react'
import { Box, TextField } from '@mui/material'

export default function TuningEditor() {
    const [tuning, setTuning] = useState(["E4", "B3", "G3", "D3", "A2", "E2"])

    const updateTuning = (index: number, value: string) => {
        const newTuning = [...tuning]
        newTuning[index] = value
        setTuning(newTuning)
    }

    return (
        <Box
            sx={{
                display: 'flex',
                gap: 1,
                flexWrap: 'wrap',
                alignItems: 'center',
                print: { display: 'none' },
            }}
        >
            {tuning.map((note, i) => (
                <TextField
                    key={i}
                    value={note}
                    onChange={(e) => updateTuning(i, e.target.value)}
                    variant="outlined"
                    size="small"
                    inputProps={{
                        sx: {
                            textAlign: 'center',
                            width: '3.5rem',
                            py: 0.5,
                        },
                    }}
                />
            ))}
        </Box>
    )
}
