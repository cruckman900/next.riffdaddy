'use client'

import { useTabs } from '@/context/TabsContext'
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    Divider,
} from '@mui/material'
import Workbench from '../Workbench'
import Settings from '../Settings'

export default function TabContentRenderer() {
    const tabs = useTabs()
    const active = tabs?.activeTab

    if (!active) return null

    return (
        <Box sx={{ height: { xs: 'auto', md: '100%' }, bgcolor: 'background.default' }}>
            {/* Content area based on tab type */}
            {active.type === 'editor' && (
                <Workbench />
            )}

            {active.type === 'settings' && (
                <Settings />
            )}

            {active.type === 'history' && (
                <Box sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom color="text.primary">
                        Recently Closed Tabs
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    {tabs?.history.length === 0 ? (
                        <Typography color="text.secondary">No history yet</Typography>
                    ) : (
                        <List>
                            {tabs.history.map((h) => (
                                <ListItem
                                    key={h.id}
                                    button
                                    onClick={() => tabs.newTab({ title: h.title, type: h.type, payload: h.payload })}
                                >
                                    <ListItemText primary={h.title} />
                                </ListItem>
                            ))}
                        </List>
                    )}
                </Box>
            )}
        </Box>
    )
}
