// src/context/TabsContext.tsx
// keep TabsContext creation, but export two hooks:
// - useTabsStrict() throws (optional)
// - useTabs() returns TabsApi | null (safe)
'use client'

import React, { createContext, useContext, useEffect, useMemo, useState } from "react"

export type Tab = {
    id: string
    title: string
    type: 'editor' | 'preview' | 'settings' | string
    payload?: unknown
    createdAt: number
}

type TabsState = {
    tabs: Tab[]
    activeTabId?: string
    history: Tab[] // recent closed/opened tabs
}

type TabsApi = {
    tabs: Tab[]
    activeTab?: Tab | undefined
    history: Tab[]
    newTab: (tab: Omit<Tab, 'id' | 'createdAt'>) => Tab
    openTab: (tab: Tab) => void
    switchTab: (id: string) => void
    closeTab: (id: string) => void
    reopenFromHistory: (id: string) => void
    clearHistory: () => void
}

const STORAGE_KEY = 'app:tabs:v1'

const TabsContext = createContext<TabsApi | null>(null)

// safe hook: returns null when provider missing
export function useTabs() {
    return useContext(TabsContext)
}

// strict mode: throws if provider missing (use in components that must have provider)
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

    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            const isMac = navigator.platform.toLowerCase().includes('mac')
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
                const currentIndex = ids.indexOf(state.activeTabId || '')
                const dir = e.shiftKey ? -1 : 1
                const nextIndex = (currentIndex + dir + ids.length) % ids.length
                switchTab(ids[nextIndex])
                return
            }
        }

        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [state.tabs, state.activeTabId])

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
        } catch { }
    }, [state])

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

    const openTab = (tab: Tab) => {
        // if already open, switch to it
        const exists = state.tabs.find(t => t.id === tab.id)
        if (exists) {
            setState(prev => ({ ...prev, activeTabId: tab.id }))
            return
        }
        setState(prev => ({
            ...prev,
            tabs: [...prev.tabs, tab],
            activeTabId: tab.id,
            history: [tab, ...prev.history].slice(0, 50),
        }))
    }

    const switchTab = (id: string) => {
        setState(prev => ({ ...prev, activeTabId: id }))
    }

    const closeTab = (id: string) => {
        setState(prev => {
            const tabs = prev.tabs.filter(t => t.id !== id)
            const closed = prev.tabs.find(t => t.id !== id)
            const history = closed ? [closed, ...prev.history].slice(0, 50) : prev.history
            let activeTabId = prev.activeTabId
            if (activeTabId === id) {
                // pick the previous tab or the last one
                activeTabId = tabs.length ? tabs[tabs.length - 1].id : undefined
            }
            return { ...prev, tabs, activeTabId, history }
        })
    }

    const reopenFromHistory = (id: string) => {
        const tab = state.history.find(h => h.id === id)
        if (!tab) return
        openTab({ ...tab, id: uid('tab_'), createdAt: Date.now() }) // reopen as new instance
    }

    const clearHistory = () => setState(prev => ({ ...prev, history: [] }))

    const api = useMemo(
        () => ({
            tabs: state.tabs,
            activeTab: state.tabs.find(t => t.id === state.activeTabId),
            history: state.history,
            newTab,
            openTab,
            switchTab,
            closeTab,
            reopenFromHistory,
            clearHistory,
        }),
        [state]
    )

    return <TabsContext.Provider value={api}>{children}</TabsContext.Provider>
}