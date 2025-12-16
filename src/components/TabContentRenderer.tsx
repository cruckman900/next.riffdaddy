'use client'

import { useTabs } from '@/context/TabsContext'
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    Switch,
    Divider,
} from '@mui/material'
import Workbench from './Workbench'
import { MusicProvider } from '@/context/MusicContext'

export default function TabContentRenderer() {
    const tabs = useTabs()
    const active = tabs?.activeTab

    if (!active) return null

    return (
        <Box sx={{ height: { xs: 'auto', md: '100%' }, bgcolor: 'background.default' }}>
            {/* Content area based on tab type */}
            {active.type === 'editor' && (
                // <Typography color="text.secondary">Editor content placeholder</Typography>
                <MusicProvider>
                    <Workbench />
                </MusicProvider>
            )}

            {active.type === 'settings' && (
                <Box
                    sx={{
                        display: 'flex',
                        height: '100%',
                        bgcolor: 'background.default',
                    }}
                >
                    <Box
                        sx={{
                            width: { xs: '100%', md: 320 },
                            bgcolor: 'background.paper',
                            borderRight: 1,
                            borderColor: 'divider',
                            p: 3,
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <Typography variant="h6" gutterBottom color="text.primary">
                            Settings
                        </Typography>

                        <List>
                            <ListItem disablePadding sx={{ py: 1 }}>
                                <ListItemText primary="Dark Mode" />
                                <Switch />
                            </ListItem>
                            <ListItem disablePadding sx={{ py: 1 }}>
                                <ListItemText primary="Autosave" />
                                <Switch defaultChecked />
                            </ListItem>
                        </List>

                        <Divider sx={{ my: 2 }} />

                        <Typography variant="body2" color="text.secondary">
                            Changes are saved automatically.
                        </Typography>
                    </Box>

                    <Box sx={{ flexGrow: 1 }} />
                </Box>
            )}

            {active.type === 'history' && (
                <Box>
                    <Typography variant="h6" gutterBottom color="text.primary">
                        Recently Closed Tabs
                    </Typography>
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
