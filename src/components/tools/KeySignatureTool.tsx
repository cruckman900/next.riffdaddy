'use client'

import { ToolTemplate } from "./ToolTemplate"
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import Link from '@mui/material/Link'

export function KeySignatureTool() {
    const keys = [
        "C Major / A Minor",
        "G Major / E Minor",
        "D Major / B Minor",
        "A Major / F# Minor",
        "E Major / C# Minor",
        "B Major / G# Minor",
        "F# Major / D# Minor",
        "F Major / D Minor",
    ]

    const handleSelect = (label: string) => {
        // TODO: integrate with MusicContext (e.g. setKeySignature(label))
        console.log("Selected key signature:", label)
    }

    return (
        <ToolTemplate title="Key Signature" shortcut="7">
            <Typography variant="body2" sx={{ mb: 1, opacity: 0.7 }}>
                Select a key signature:
            </Typography>

            <Stack spacing={1}>
                {keys.map((label) => (
                    <Link
                        key={label}
                        component="button"
                        variant="body2"
                        underline="hover"
                        onClick={() => handleSelect(label)}
                        sx={{ textAlign: 'left', cursor: 'pointer' }}
                    >
                        {label}
                    </Link>
                ))}
            </Stack>
        </ToolTemplate>
    )
}
