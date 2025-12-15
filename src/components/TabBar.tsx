// src/components/TabBar.tsx
'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Box, IconButton, Tab as MuiTab, Tabs } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useTabsStrict } from '@/context/TabsContext'
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core'
import {
    arrayMove,
    SortableContext,
    useSortable,
    horizontalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

function SortableLabel({ id, children }: { id: string; children: React.ReactNode }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        display: 'inline-flex',
    }
    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            {children}
        </div>
    )
}

export default function TabBar() {
    const tabs = useTabsStrict()
    const activeId = tabs.activeTab?.id ?? false

    const containerRef = useRef<HTMLDivElement | null>(null)
    const [ready, setReady] = useState(false)

    useEffect(() => {
        let raf = 0
        let cancelled = false
        function check() {
            if (cancelled) return
            const el = containerRef.current
            if (el && el.offsetHeight > 0 && el.offsetWidth > 0) {
                setReady(true)
                return
            }
            raf = requestAnimationFrame(check)
        }
        raf = requestAnimationFrame(check)
        return () => {
            cancelled = true
            cancelAnimationFrame(raf)
        }
    }, [])

    const sensors = useSensors(useSensor(PointerSensor))

    if (tabs.tabs.length === 0) {
        return (
            <Box ref={containerRef} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', borderBottom: 1, borderColor: 'divider', px: 2, height: 48 }}>
                <Box sx={{ color: 'text.secondary' }}>No tabs open</Box>
            </Box>
        )
    }

    if (!ready) {
        return (
            <Box ref={containerRef} sx={{ display: 'flex', alignItems: 'center', bgcolor: 'background.default', borderBottom: 1, borderColor: 'divider', px: 2, height: 48 }}>
                <Box sx={{ color: 'text.secondary' }}>Loading tabs…</Box>
            </Box>
        )
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        if (!over || active.id === over.id) return
        const ids = tabs.tabs.map(t => t.id)
        const oldIndex = ids.indexOf(active.id as string)
        const newIndex = ids.indexOf(over.id as string)
        if (oldIndex === -1 || newIndex === -1) return
        tabs.reorderTabs(oldIndex, newIndex)
    }

    return (
        <Box ref={containerRef} sx={{ display: 'flex', alignItems: 'center', bgcolor: 'background.default', borderBottom: 1, borderColor: 'divider' }}>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={tabs.tabs.map(t => t.id)} strategy={horizontalListSortingStrategy}>
                    <Tabs value={activeId} variant="scrollable" scrollButtons="auto" sx={{ flex: 1 }} aria-label="open tabs">
                        {tabs.tabs.map((t) => (
                            <MuiTab
                                key={t.id}
                                value={t.id}
                                label={
                                    <SortableLabel id={t.id}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <span style={{ pointerEvents: 'none' }}>{t.title}</span>
                                            <IconButton
                                                component="span"
                                                size="small"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    tabs.closeTab(t.id)
                                                }}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' || e.key === ' ') {
                                                        e.preventDefault()
                                                        e.stopPropagation()
                                                        tabs.closeTab(t.id)
                                                    }
                                                }}
                                                aria-label={`Close ${t.title}`}
                                                sx={{ ml: 0.5 }}
                                            >
                                                <CloseIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    </SortableLabel>
                                }
                                onClick={() => tabs.switchTab(t.id)}
                                sx={{ textTransform: 'none', minWidth: 120 }}
                            />
                        ))}
                    </Tabs>
                </SortableContext>
            </DndContext>
        </Box>
    )
}
