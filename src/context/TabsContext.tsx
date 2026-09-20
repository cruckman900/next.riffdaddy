/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useAuthContext } from './AuthProvider'

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
    // True once this user's persisted tabs (if any) have been restored from
    // localStorage — consumers (MusicContext's stale-composition cleanup)
    // need this to avoid mistaking "haven't hydrated yet" (tabs === []) for
    // "this user genuinely has no tabs," which would otherwise wipe out
    // every other persisted composition before they'd even been restored.
    hydrated: boolean
    newTab: (tab: Omit<Tab, 'id' | 'createdAt'>) => Tab
    switchTab: (id: string) => void
    closeTab: (id: string) => void
    renameTab: (id: string, newTitle: string) => void
    // Merges new fields into a tab's payload (e.g. stashing the backend tab
    // id after a Save, so a later Save updates rather than re-creates it).
    updateTabPayload: (id: string, payload: Record<string, unknown>) => void
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

// Ensures a tab title doesn't collide with any currently-open tab: "Untitled"
// becomes "Untitled (1)", then "Untitled (2)", etc. Exported so Save As
// (LeftMenu.tsx) can reuse the exact same numbering when the user renames a
// tab to something another open tab already uses.
export function uniqueTitle(desired: string, existingTitles: string[]): string {
    if (!existingTitles.includes(desired)) return desired
    let count = 1
    while (existingTitles.includes(`${desired} (${count})`)) count++
    return `${desired} (${count})`
}

// Persisted per-user (not globally) so a refresh restores exactly the open
// tabs/active tab a signed-in user left behind, without one browser's
// different accounts stepping on each other's open work.
const TABS_STORAGE_PREFIX = 'nextriff.tabs.'
function tabsStorageKey(userId: string) {
    return `${TABS_STORAGE_PREFIX}${userId}`
}

function readStoredTabs(userId: string): TabsState | null {
    if (typeof window === 'undefined') return null
    try {
        const raw = localStorage.getItem(tabsStorageKey(userId))
        return raw ? (JSON.parse(raw) as TabsState) : null
    } catch {
        return null
    }
}

export const TabsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, loading: authLoading } = useAuthContext()
    const [state, setState] = useState<TabsState>({ tabs: [], activeTabId: undefined, history: [] })
    const [hydrated, setHydrated] = useState(false)
    // Tracks which user's tabs we've already restored from localStorage, so
    // we (a) only do it once per resolved user and (b) don't let the write
    // effect below persist the still-empty initial state over top of that
    // user's real saved tabs before the restore has had a chance to run.
    const hydratedForUserIdRef = useRef<string | null>(null)

    useEffect(() => {
        if (authLoading || !user) return
        if (hydratedForUserIdRef.current === user.id) return
        const stored = readStoredTabs(user.id)
        if (stored) setState(stored)
        hydratedForUserIdRef.current = user.id
        setHydrated(true)
    }, [user, authLoading])

    useEffect(() => {
        if (!user || hydratedForUserIdRef.current !== user.id) return
        const id = setTimeout(() => {
            try {
                localStorage.setItem(tabsStorageKey(user.id), JSON.stringify(state))
            } catch {
                // localStorage can throw in private-browsing/quota-exceeded
                // cases — not worth surfacing to the UI over losing autosave.
            }
        }, 250)
        return () => clearTimeout(id)
    }, [state, user])

    const newTab = (tabPartial: Omit<Tab, 'id' | 'createdAt'>) => {
        // Dedup title against `prev.tabs` (inside the updater) rather than
        // the outer `state` closure, so newTab's identity doesn't depend on
        // `state` beyond what the api's `[state]` memo dep already covers —
        // callers still get the created tab back synchronously since
        // React invokes this updater function immediately.
        let createdTab!: Tab
        setState(prev => {
            const title = uniqueTitle(tabPartial.title, prev.tabs.map(t => t.title))
            const tab: Tab = { ...tabPartial, title, id: uid(), createdAt: Date.now() }
            createdTab = tab
            return {
                ...prev,
                tabs: [...prev.tabs, tab],
                activeTabId: tab.id,
                history: [tab, ...prev.history].slice(0, 50),
            }
        })
        return createdTab
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

    const updateTabPayload = (id: string, payload: Record<string, unknown>) => {
        setState(prev => ({
            ...prev,
            tabs: prev.tabs.map(t => (t.id === id ? { ...t, payload: { ...t.payload, ...payload } } : t)),
        }))
    }

    const api: TabsApi = useMemo(
        () => ({
            tabs: state.tabs,
            activeTab: state.tabs.find(t => t.id === state.activeTabId),
            history: state.history,
            hydrated,
            newTab,
            switchTab,
            closeTab,
            renameTab,
            updateTabPayload,
        }),
        [state, hydrated]
    )

    return <TabsContext.Provider value={api}>{children}</TabsContext.Provider>
}
