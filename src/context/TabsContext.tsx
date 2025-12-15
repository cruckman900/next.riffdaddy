/* eslint-disable react-hooks/exhaustive-deps */
// src/context/TabsContext.tsx
'use client'

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

export type Tab = {
    id: string
    title: string
    type: 'editor' | 'preview' | 'settings' | 'history' | string
    payload?: unknown
    createdAt: number
}

type TabsState = {
    tabs: Tab[]
    activeTabId?: string
    history: Tab[]
}

type TabsApi = {
    tabs: Tab[]
    activeTab?: Tab | undefined
    history: Tab[]
    newTab: (tab: Omit<Tab, 'id' | 'createdAt'>) => Tab
    renameTab: (id: string, newtitle: string) => void
    openTab: (tab: Tab) => void
    switchTab: (id: string) => void
    closeTab: (id: string) => void
    reopenFromHistory: (id: string) => void
    clearHistory: () => void
    reorderTabs: (fromIndex: number, toIndex: number) => void
}

const STORAGE_KEY = 'riffdaddy:tabs:v1'

const TabsContext = createContext<TabsApi | null>(null)

// safe hook: returns null if provider missing
export function useTabs(): TabsApi | null {
    return useContext(TabsContext)
}

// strict hook: throws if provider missing
export function useTabsStrict(): TabsApi {
    const ctx = useContext(TabsContext)
    if (!ctx) throw new Error('useTabs must be used inside TabsProvider')
    return ctx
}

function uid(prefix = '') {
    return prefix + Math.random().toString(36).slice(2, 9)
}

export const TabsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, setState] = useState<TabsState>(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY)
            if (raw) return JSON.parse(raw) as TabsState
        } catch { }
        return { tabs: [], activeTabId: undefined, history: [] }
    })

    // persist to localStorage
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
        } catch { }
    }, [state])

    // core actions
    const newTab = (tabPartial: Omit<Tab, 'id' | 'createdAt'>) => {
        const tab: Tab = { ...tabPartial, id: uid('tab_'), createdAt: Date.now() }
        setState(prev => ({
            ...prev,
            tabs: [...prev.tabs, tab],
            activeTabId: tab.id,
            history: [tab, ...prev.history].slice(0, 50),
        }))
        return tab
    }

    const renameTab = (id: string, newTitle: string) => {
        setState(prev => {
            const tabs = prev.tabs.map(t =>
                t.id === id ? { ...t, title: newTitle } : t
            )
            return { ...prev, tabs }
        })
    }

    const openTab = (tab: Tab) => {
        setState(prev => {
            const exists = prev.tabs.find(t => t.id === tab.id)
            if (exists) {
                return { ...prev, activeTabId: tab.id }
            }
            return {
                ...prev,
                tabs: [...prev.tabs, tab],
                activeTabId: tab.id,
                history: [tab, ...prev.history].slice(0, 50),
            }
        })
    }

    const switchTab = (id: string) => {
        setState(prev => ({ ...prev, activeTabId: id }))
    }

    const closeTab = (id: string) => {
        setState(prev => {
            const tabs = prev.tabs.filter(t => t.id !== id)
            const closed = prev.tabs.find(t => t.id === id)
            const history = closed ? [closed, ...prev.history].slice(0, 50) : prev.history
            let activeTabId = prev.activeTabId
            if (activeTabId === id) {
                activeTabId = tabs.length ? tabs[tabs.length - 1].id : undefined
            }
            return { ...prev, tabs, activeTabId, history }
        })
    }

    const reopenFromHistory = (id: string) => {
        const tab = state.history.find(h => h.id === id)
        if (!tab) return
        openTab({ ...tab, id: uid('tab_'), createdAt: Date.now() })
    }

    const clearHistory = () => setState(prev => ({ ...prev, history: [] }))

    const reorderTabs = (fromIndex: number, toIndex: number) => {
        setState(prev => {
            const tabs = [...prev.tabs]
            if (fromIndex < 0 || fromIndex >= tabs.length || toIndex < 0 || toIndex >= tabs.length) return prev
            const [moved] = tabs.splice(fromIndex, 1)
            tabs.splice(toIndex, 0, moved)
            return { ...prev, tabs }
        })
    }

    // keyboard shortcuts (global)
    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            const isMac = typeof navigator !== 'undefined' && /mac/i.test(navigator.platform)
            const mod = isMac ? e.metaKey : e.ctrlKey

            // New tab: Ctrl/Cmd+T
            if (mod && e.key.toLowerCase() === 't') {
                e.preventDefault()
                newTab({ title: 'Untitled', type: 'editor', payload: { content: '' } })
                return
            }

            // Close tab: Ctrl/Cmd+W
            if (mod && e.key.toLowerCase() === 'w') {
                e.preventDefault()
                if (state.activeTabId) closeTab(state.activeTabId)
                return
            }

            // Switch tab: Ctrl/Cmd+Tab (and Shift for reverse)
            if (mod && e.key === 'Tab') {
                e.preventDefault()
                const ids = state.tabs.map(t => t.id)
                if (ids.length <= 1) return
                const currentIndex = Math.max(0, ids.indexOf(state.activeTabId || ''))
                const dir = e.shiftKey ? -1 : 1
                const nextIndex = (currentIndex + dir + ids.length) % ids.length
                switchTab(ids[nextIndex])
                return
            }
        }

        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [state.tabs, state.activeTabId])

    const api = useMemo(
        () => ({
            tabs: state.tabs,
            activeTab: state.tabs.find(t => t.id === state.activeTabId),
            history: state.history,
            newTab,
            renameTab,
            openTab,
            switchTab,
            closeTab,
            reopenFromHistory,
            clearHistory,
            reorderTabs,
        }),
        [state]
    )

    return <TabsContext.Provider value={api}>{children}</TabsContext.Provider>
}
