// src/components/ThemeChooser.tsx
'use client'

import { Button, Stack, Typography } from '@mui/material'
import { themes } from './themes'
import { useThemeContext } from '@/context/ThemeContext'

export const ThemeChooser = () => {
    const { themeName, setThemeName, mode, toggleMode } = useThemeContext()

    return (
        <Stack spacing={2}>
            <Typography variant="h6">Choose Theme</Typography>

            {/* Theme buttons */}
            <Stack direction="row" spacing={2} flexWrap="wrap">
                {Object.entries(themes).map(([name, factory]) => {
                    const preview = factory(mode) // just to grab icon
                    return (
                        <Button
                            key={name}
                            variant={themeName === name ? 'contained' : 'outlined'}
                            onClick={() => setThemeName(name as keyof typeof themes)}
                            startIcon={<span>{preview.custom?.icon}</span>}
                        >
                            {name}
                        </Button>
                    )
                })}
            </Stack>

            {/* Light/Dark toggle */}
            <Button
                variant="outlined"
                onClick={toggleMode}
                sx={{ mt: 2 }}
            >
                Toggle {mode === 'dark' ? 'Light' : 'Dark'} Mode
            </Button>
        </Stack>
    )
}
