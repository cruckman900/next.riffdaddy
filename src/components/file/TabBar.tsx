import React, { useState, useEffect } from 'react'
import {
    Box,
    IconButton,
    Tab as MuiTab,
    Tabs,
    TextField,
    Menu,
    MenuItem,
    useMediaQuery,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useTabsStrict } from '@/context/TabsContext'
import { useTheme } from '@mui/material/styles'

export default function TabBar() {
    const tabs = useTabsStrict()
    const activeId = tabs.activeTab?.id ?? false
    const [mounted, setMounted] = useState(false)

    const theme = useTheme()
    const isSmall = useMediaQuery(theme.breakpoints.down('sm'))

    // track which tab is being renamed
    const [editingId, setEditingId] = useState<string | null>(null)

    // context menu state
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null)
    const [menuTabId, setMenuTabId] = useState<string | null>(null)

    useEffect(() => {
        const raf = requestAnimationFrame(() => setMounted(true))
        return () => cancelAnimationFrame(raf)
    }, [])

    if (tabs.tabs.length === 0 || !mounted) return null

    const handleContextMenu = (event: React.MouseEvent, tabId: string) => {
        event.preventDefault()
        setMenuAnchor(event.currentTarget as HTMLElement)
        setMenuTabId(tabId)
    }

    const handleCloseMenu = () => {
        setMenuAnchor(null)
        setMenuTabId(null)
    }

    const handleRename = () => {
        if (menuTabId) setEditingId(menuTabId)
        handleCloseMenu()
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: isSmall ? 'row' : 'column',
                alignItems: 'stretch',
                bgcolor: theme.palette.background.paper,
                borderBottom: isSmall ? 1 : 0,
                borderRight: isSmall ? 0 : 1,
                borderColor: theme.palette.divider,
                width: isSmall ? '100%' : 160,
                height: isSmall ? 'auto' : '100%',
            }}
        >
            <Tabs
                value={activeId}
                variant="scrollable"
                scrollButtons="auto"
                orientation={isSmall ? 'horizontal' : 'vertical'}
                aria-label="open tabs"
                sx={{ flex: 1 }}
            >
                {tabs.tabs.map((t) => {
                    const isEditing = editingId === t.id
                    const isFile = t.type === 'editor'

                    return (
                        <MuiTab
                            key={t.id}
                            value={t.id}
                            label={
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        gap: 1,
                                        cursor: 'pointer',
                                    }}
                                    onDoubleClick={() => {
                                        if (isFile) setEditingId(t.id)
                                    }}
                                    onContextMenu={(e) => handleContextMenu(e, t.id)}
                                >
                                    {isEditing && isFile ? (
                                        <TextField
                                            autoFocus
                                            variant="standard"
                                            value={t.title}
                                            onChange={(e) => tabs.renameTab(t.id, e.target.value)}
                                            onBlur={() => setEditingId(null)}
                                            InputProps={{ disableUnderline: true }}
                                            sx={{ px: 1, width: isSmall ? 100 : 80 }}
                                        />
                                    ) : (
                                        <Box
                                            sx={{
                                                flexGrow: 1,
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                            }}
                                        >
                                            {t.title}
                                        </Box>
                                    )}
                                    <IconButton
                                        component="span"
                                        size="small"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            tabs.closeTab(t.id)
                                        }}
                                        aria-label={`Close ${t.title}`}
                                    >
                                        <CloseIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            }
                            onClick={() => tabs.switchTab(t.id)}
                            sx={{
                                textTransform: 'none',
                                minWidth: 120,
                                '&.Mui-selected': {
                                    bgcolor: 'surface.main',
                                    color: theme.palette.text.primary,
                                    fontWeight: 'bold',
                                },
                            }}
                        />
                    )
                })}
            </Tabs>

            {/* Context menu for rename */}
            <Menu
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={handleCloseMenu}
            >
                <MenuItem onClick={handleRename}>Rename</MenuItem>
            </Menu>
        </Box>
    )
}
