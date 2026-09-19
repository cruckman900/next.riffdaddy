'use client'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'

export function ToolTemplate({
    title,
    shortcut,
    children,
}: {
    title?: string
    shortcut?: string
    children?: React.ReactNode
}) {
    const theme = useTheme()

    return (
        <Box
            display="flex"
            flexDirection="column"
            height="88%"
            sx={{
                bgcolor: 'background.default',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: `0 0 18px ${theme.palette.accent.main}22`,
            }}
        >
            {/* Header */}
            <Box
                px={2}
                py={1.5}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                sx={{
                    borderBottom: `2px solid ${theme.palette.accent.main}55`,
                    bgcolor: 'rgba(255,255,255,0.03)',
                    borderTopLeftRadius: 'inherit',
                    borderTopRightRadius: 'inherit',
                }}
            >
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 600,
                        color: theme.palette.accent.main,
                        textShadow: `0 0 10px ${theme.palette.accent.main}66`,
                    }}
                >
                    {title}
                </Typography>

                <Box display="flex" gap={1} alignItems="center">
                    <Typography variant="body2" sx={{ opacity: 0.6 }}>
                        Shortcut:
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.8 }}>
                        {shortcut}
                    </Typography>
                </Box>
            </Box>

            {/* Content */}
            <Box flex={1} p={2} overflow="auto">
                {children}
            </Box>
        </Box>
    )
}
