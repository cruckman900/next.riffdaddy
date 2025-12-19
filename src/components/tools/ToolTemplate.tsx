'use client'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

export function ToolTemplate({
    title,
    shortcut,
    children,
}: {
    title?: string
    shortcut?: string
    children?: React.ReactNode
}) {
    return (
        <Box display="flex" flexDirection="column" height="88%" sx={{ bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3 }}>
            {/* Header */}
            <Box
                px={2}
                py={1.5}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                sx={{
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    bgcolor: 'rgba(255,255,255,0.03)',
                }}
            >
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
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
