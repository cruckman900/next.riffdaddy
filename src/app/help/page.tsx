// src/components/Help.jsx
'use client'

import { Box, Stack, Typography } from "@mui/material"

export default function Help() {
    return (
        <Box
            sx={{
                p: 4,
                display: 'flex',
                flex: 1,
                flexDirection: 'column',
                gap: 3,
                bgcolor: 'background.paper',
            }}
        >
            <Typography variant="h3" fontWeight={700} color="text.primary">
                Need help getting started?
            </Typography>

            <Typography variant="body1" color="text.secondary">
                I will be building this section soon.
            </Typography>

            <Stack direction="row" gap={3} sx={{ height: '100%', p: 2 }}>
                <Box sx={{ width: '30%', maxWidth: '320px' }}>
                    <Typography variant="h4" color="text.secondary">
                        Table of Contents
                    </Typography>
                </Box>
                <Box>
                    <Typography variant="h4" color="text.secondary">
                        The contents
                    </Typography>
                </Box>
            </Stack>
        </Box>
    )
}