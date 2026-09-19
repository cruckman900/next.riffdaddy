// src/components/ThemeChooser.tsx
'use client'

import { Box, Stack, Typography } from '@mui/material'
import { themes } from './themes'
import { useThemeContext } from '@/context/ThemeContext'

export const ThemeChooser = () => {
    const { themeName, setThemeName, mode, toggleMode } = useThemeContext()

    return (
        <Stack spacing={2}>
            <Typography variant="h6" color='text.secondary'>Choose Theme</Typography>

            {/* Theme swatches */}
            <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
                {Object.entries(themes).map(([name, factory]) => {
                    const preview = factory(mode)
                    const active = themeName === name
                    const swatchColor = preview.palette.accent.main

                    return (
                        <Box
                            key={name}
                            component="button"
                            onClick={() => setThemeName(name as keyof typeof themes)}
                            sx={{
                                cursor: 'pointer',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 0.5,
                                p: 1,
                                minWidth: 76,
                                borderRadius: 2,
                                border: '1px solid',
                                borderColor: active ? swatchColor : 'divider',
                                bgcolor: active ? `${swatchColor}1a` : 'transparent',
                                boxShadow: active ? `0 0 12px ${swatchColor}77` : 'none',
                                transition: 'all 0.15s ease',
                            }}
                        >
                            <Box
                                sx={{
                                    width: 28,
                                    height: 28,
                                    borderRadius: '50%',
                                    bgcolor: swatchColor,
                                    boxShadow: `0 0 10px ${swatchColor}`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: 14,
                                }}
                            >
                                {preview.custom?.icon}
                            </Box>
                            <Typography
                                variant="caption"
                                sx={{
                                    textTransform: 'capitalize',
                                    fontWeight: active ? 700 : 400,
                                    color: active ? swatchColor : 'text.secondary',
                                }}
                            >
                                {name}
                            </Typography>
                        </Box>
                    )
                })}
            </Stack>

            {/* Light/Dark toggle */}
            <Box
                component="button"
                onClick={toggleMode}
                sx={{
                    cursor: 'pointer',
                    mt: 1,
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    color: 'text.primary',
                    bgcolor: 'transparent',
                    textAlign: 'center',
                    '&:hover': { borderColor: 'text.secondary' },
                }}
            >
                Toggle {mode === 'dark' ? 'Light' : 'Dark'} Mode
            </Box>
        </Stack>
    )
}
