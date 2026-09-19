// src/components/help/HelpBlocks.tsx
'use client'

import { Box, Stack, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'

export function SubHeading({ children }: { children: React.ReactNode }) {
    return (
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary', mt: 1 }}>
            {children}
        </Typography>
    )
}

export function Kbd({ children }: { children: React.ReactNode }) {
    const theme = useTheme()
    return (
        <Box
            component="kbd"
            sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: 28,
                px: 1,
                py: 0.25,
                borderRadius: 1,
                fontFamily: 'monospace',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: theme.palette.accent.main,
                border: '1px solid',
                borderColor: `${theme.palette.accent.main}66`,
                bgcolor: `${theme.palette.accent.main}14`,
                boxShadow: `0 0 6px ${theme.palette.accent.main}44`,
            }}
        >
            {children}
        </Box>
    )
}

export function ShortcutRow({ keys, description }: { keys: React.ReactNode; description: string }) {
    return (
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} sx={{ py: 0.75 }}>
            <Typography variant="body2" color="text.secondary">{description}</Typography>
            <Stack direction="row" spacing={0.5}>{keys}</Stack>
        </Stack>
    )
}

export function Bullet({ children }: { children: React.ReactNode }) {
    return (
        <Stack direction="row" spacing={1} alignItems="flex-start">
            <Box sx={{ mt: '9px', width: 5, height: 5, borderRadius: '50%', bgcolor: 'text.secondary', flexShrink: 0 }} />
            <Typography variant="body2" color="text.secondary">{children}</Typography>
        </Stack>
    )
}
