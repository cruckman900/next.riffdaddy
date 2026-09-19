// src/components/help/HelpSection.tsx
'use client'

import { Box, Stack, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import type { SvgIconComponent } from '@mui/icons-material'

interface HelpSectionProps {
    id: string
    title: string
    icon: SvgIconComponent
    children: React.ReactNode
}

export default function HelpSection({ id, title, icon: Icon, children }: HelpSectionProps) {
    const theme = useTheme()

    return (
        <Box
            id={id}
            component="section"
            sx={{
                mb: 5,
                p: { xs: 2, sm: 3 },
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
                boxShadow: `0 0 20px ${theme.palette.accent.main}14`,
            }}
        >
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                <Box
                    sx={{
                        display: 'inline-flex',
                        p: 1,
                        borderRadius: 2,
                        bgcolor: `${theme.palette.accent.main}1a`,
                    }}
                >
                    <Icon sx={{ color: theme.palette.accent.main }} />
                </Box>
                <Typography
                    variant="h5"
                    sx={{ fontWeight: 700, color: theme.palette.accent.main, textShadow: `0 0 10px ${theme.palette.accent.main}55` }}
                >
                    {title}
                </Typography>
            </Stack>

            <Stack spacing={2} color="text.secondary">
                {children}
            </Stack>
        </Box>
    )
}
