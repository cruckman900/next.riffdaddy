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
import MoreVertIcon from '@mui/icons-material/MoreVert'
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
    // Tab id to switch into rename mode for once the context menu has fully
    // closed (see the Menu's TransitionProps.onExited below).
    const [pendingRenameId, setPendingRenameId] = useState<string | null>(null)

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

    // Just requests the rename — the actual setEditingId happens in the
    // Menu's onExited below, once its closing focus-restoration is done.
    const handleRename = () => {
        setPendingRenameId(menuTabId)
        handleCloseMenu()
    }

    return (
        <Box
            className="print:hidden"
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
                TabIndicatorProps={{
                    sx: {
                        backgroundColor: theme.palette.accent.main,
                        boxShadow: `0 0 8px ${theme.palette.accent.main}`,
                        width: isSmall ? undefined : 3,
                    },
                }}
                sx={{ flex: 1 }}
            >
                {tabs.tabs.map((t) => {
                    const isEditing = editingId === t.id
                    const isFile = t.type === 'editor'
                    const isActive = activeId === t.id

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
                                                color: isActive ? theme.palette.accent.main : 'inherit',
                                                textShadow: isActive ? `0 0 8px ${theme.palette.accent.main}66` : 'none',
                                            }}
                                        >
                                            {t.title}
                                        </Box>
                                    )}
                                    {/* Touch-friendly rename entry point — double-click/right-click
                                        don't have great mobile equivalents (double-tap usually
                                        zooms, and there's no "right click"), so small screens get an
                                        explicit tappable affordance instead. */}
                                    {isFile && isSmall && !isEditing && (
                                        <IconButton
                                            component="span"
                                            size="small"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleContextMenu(e, t.id)
                                            }}
                                            aria-label={`Rename ${t.title}`}
                                        >
                                            <MoreVertIcon fontSize="small" />
                                        </IconButton>
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
                                transition: 'background-color 0.2s ease',
                                '&:hover': {
                                    bgcolor: 'rgba(255,255,255,0.04)',
                                },
                                '&.Mui-selected': {
                                    bgcolor: `${theme.palette.accent.main}14`,
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
                TransitionProps={{
                    // Entering edit mode only after the closing transition
                    // (and MUI's focus-restoration to the menu's anchor) has
                    // fully finished. Doing it any earlier — even
                    // synchronously in the MenuItem's onClick — races the
                    // Menu's own focus-restore: the rename TextField would
                    // mount and autoFocus, then get its focus immediately
                    // yanked back and blurred by the still-closing Menu,
                    // which cancelled the rename before a user could type.
                    onExited: () => {
                        if (pendingRenameId) setEditingId(pendingRenameId)
                        setPendingRenameId(null)
                    },
                }}
            >
                <MenuItem onClick={handleRename}>Rename</MenuItem>
            </Menu>
        </Box>
    )
}
