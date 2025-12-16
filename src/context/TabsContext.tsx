/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { createContext, useContext, useMemo, useState } from 'react'

export type Tab = {
    id: string
    title: string
    type: 'editor' | 'settings' | 'history'
    payload?: any
    createdAt: number
}

type TabsState = {
    tabs: Tab[]
    activeTabId?: string
    history: Tab[]
}

type TabsApi = {
    tabs: Tab[]
    activeTab?: Tab
    history: Tab[]
    newTab: (tab: Omit<Tab, 'id' | 'createdAt'>) => Tab
    switchTab: (id: string) => void
    closeTab: (id: string) => void
    renameTab: (id: string, newTitle: string) => void
}

const TabsContext = createContext<TabsApi | null>(null)

export function useTabs() {
    return useContext(TabsContext)
}
export function useTabsStrict() {
    const ctx = useContext(TabsContext)
    if (!ctx) throw new Error('useTabs must be used inside TabsProvider')
    return ctx
}

function uid() {
    return 'tab_' + Math.random().toString(36).slice(2, 9)
}

export const TabsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, setState] = useState<TabsState>({ tabs: [], activeTabId: undefined, history: [] })

    const newTab = (tabPartial: Omit<Tab, 'id' | 'createdAt'>) => {
        const tab: Tab = { ...tabPartial, id: uid(), createdAt: Date.now() }
        setState(prev => ({
            ...prev,
            tabs: [...prev.tabs, tab],
            activeTabId: tab.id,
            history: [tab, ...prev.history].slice(0, 50),
        }))
        return tab
    }

    const switchTab = (id: string) => setState(prev => ({ ...prev, activeTabId: id }))

    const closeTab = (id: string) => {
        setState(prev => {
            const tabs = prev.tabs.filter(t => t.id !== id)
            let activeTabId = prev.activeTabId
            if (activeTabId === id) {
                activeTabId = tabs.length ? tabs[tabs.length - 1].id : undefined
            }
            return { ...prev, tabs, activeTabId }
        })
    }

    const renameTab = (id: string, newTitle: string) => {
        setState(prev => ({
            ...prev,
            tabs: prev.tabs.map(t => (t.id === id ? { ...t, title: newTitle } : t)),
        }))
    }

    const api: TabsApi = useMemo(
        () => ({
            tabs: state.tabs,
            activeTab: state.tabs.find(t => t.id === state.activeTabId),
            history: state.history,
            newTab,
            switchTab,
            closeTab,
            renameTab,
        }),
        [state]
    )

    return <TabsContext.Provider value={api}>{children}</TabsContext.Provider>
}
