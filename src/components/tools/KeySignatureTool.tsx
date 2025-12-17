'use client'

import { ToolTemplate } from "./ToolTemplate"
import { useMusic } from '@/context/MusicContext'
import { Typography, Grid } from '@mui/material'
import { ToolProps } from '@/types/tooling'

const KEYS = [
    { sig: 'C', label: 'C Major / A Minor' },
    { sig: 'G', label: 'G Major / E Minor' },
    { sig: 'D', label: 'D Major / B Minor' },
    { sig: 'A', label: 'A Major / F# Minor' },
    { sig: 'E', label: 'E Major / C# Minor' },
    { sig: 'B', label: 'B Major / G# Minor' },
    { sig: 'F#', label: 'F# Major / D# Minor' },
    { sig: 'C#', label: 'C# Major / A# Minor' },
    { sig: 'F', label: 'F Major / D Minor' },
    { sig: 'Bb', label: 'Bb Major / G Minor' },
    { sig: 'Eb', label: 'Eb Major / C Minor' },
    { sig: 'Ab', label: 'Ab Major / F Minor' },
    { sig: 'Db', label: 'Db Major / Bb Minor' },
    { sig: 'Gb', label: 'Gb Major / Eb Minor' },
    { sig: 'Cb', label: 'Cb Major / Ab Minor' },
]

export function KeySignatureTool({ measureId }: ToolProps) {
    const { updateMeasure } = useMusic()

    const handleClick = (keySignature: string) => {
        if (!measureId) return
        updateMeasure(measureId, { keySignature })
    }

    return (
        <ToolTemplate title="Key Signature" shortcut="K">
            <Typography variant="body2" mb={2}>
                Select a key signature for this measure.
            </Typography>

            <Grid container spacing={2}>
                {KEYS.map(key => (
                    <Grid item xs={6} key={key.sig}>
                        <Typography
                            variant="caption"
                            sx={{
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                textDecoration: 'underline',
                                textAlign: 'center',
                                display: 'block',
                            }}
                            onClick={() => handleClick(key.sig)}
                        >
                            {key.label}
                        </Typography>
                    </Grid>
                ))}
            </Grid>
        </ToolTemplate>
    )
}
