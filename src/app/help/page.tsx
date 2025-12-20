// src/components/Help.jsx
'use client'

import { Box, Stack, Typography } from "@mui/material"
import useMediaQuery from "@mui/material/useMediaQuery"
import { useTheme } from "@mui/material/styles"

export default function Help() {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

    return (
        <Box
            sx={{
                p: 4,
                display: 'flex',
                flex: 1,
                flexDirection: 'column',
                gap: 3,
                bgcolor: theme.palette.background.default,
            }}
        >
            <Typography variant="h3" fontWeight={700} color="text.primary">
                Need help getting started?
            </Typography>

            <Typography variant="body1" color="text.secondary">
                I will be building this section soon.
            </Typography>

            <Stack direction={isMobile ? 'column' : 'row'} gap={1} sx={{ height: '100%' }}>
                <Box sx={{ width: !isMobile ? '30%' : 'auto', maxWidth: !isMobile ? '320px' : '100%', p: 2, bgcolor: 'background.paper', borderRadius: '1rem' }}>
                    <Typography variant="h4" color="text.secondary">
                        Table of Contents
                    </Typography>
                </Box>
                <Box sx={{ width: !isMobile ? '100%' : 'auto', p: 2, bgcolor: 'background.paper', borderRadius: '1rem' }}>
                    <Typography variant="h4" color="text.secondary">
                        The contents
                    </Typography>
                </Box>
            </Stack>
        </Box>
    )
}