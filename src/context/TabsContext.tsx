// src/context/TabsContext.tsx
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

export function useTabs() {
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