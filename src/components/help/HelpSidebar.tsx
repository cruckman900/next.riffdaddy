// src/components/help/HelpSidebar.tsx
'use client'

import { Box, Stack, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { HELP_TOPICS } from './helpTopics'

interface HelpSidebarProps {
    activeId: string
    onSelect: (id: string) => void
    orientation?: 'vertical' | 'horizontal'
}

export default function HelpSidebar({ activeId, onSelect, orientation = 'vertical' }: HelpSidebarProps) {
    const theme = useTheme()
    const isHorizontal = orientation === 'horizontal'

    return (
        <Stack
            direction={isHorizontal ? 'row' : 'column'}
            spacing={1}
            sx={{
                overflowX: isHorizontal ? 'auto' : 'visible',
                pb: isHorizontal ? 1 : 0,
            }}
        >
            {HELP_TOPICS.map(({ id, title, icon: Icon }) => {
                const active = activeId === id
                return (
                    <Box
                        key={id}
                        component="button"
                        onClick={() => onSelect(id)}
                        sx={{
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.25,
                            flexShrink: 0,
                            textAlign: 'left',
                            px: 1.5,
                            py: 1,
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: active ? theme.palette.accent.main : 'divider',
                            bgcolor: active ? `${theme.palette.accent.main}1a` : 'transparent',
                            boxShadow: active ? `0 0 12px ${theme.palette.accent.main}66` : 'none',
                            color: active ? theme.palette.accent.main : theme.palette.text.secondary,
                            transition: 'all 0.15s ease',
                            '&:hover': {
                                borderColor: theme.palette.accent.main,
                                color: theme.palette.accent.main,
                            },
                        }}
                    >
                        <Icon fontSize="small" sx={{ color: 'inherit' }} />
                        <Typography variant="body2" sx={{ fontWeight: active ? 700 : 500, whiteSpace: 'nowrap', color: 'inherit' }}>
                            {title}
                        </Typography>
                    </Box>
                )
            })}
        </Stack>
    )
}
