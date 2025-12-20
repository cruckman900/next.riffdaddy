// src/context/ThemeContext.tsx
'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type ThemeMode = 'light' | 'dark'
type ThemeName =
    | 'light'
    | 'dark'
    | 'hazard'
    | 'brownstone'
    | 'midnight'
    | 'slate'
    | 'purple'
    | 'pink'
    | 'green'
    | 'red'

interface ThemeContextValue {
    themeName: ThemeName
    mode: ThemeMode
    setThemeName: (name: ThemeName) => void
    toggleMode: () => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

export const ThemeProviderContext = ({ children }: { children: ReactNode }) => {
    const [themeName, setThemeName] = useState<ThemeName>('hazard')
    const [mode, setMode] = useState<ThemeMode>('dark')

    // Load saved theme from localStorage
    useEffect(() => {
        const savedThemeName = localStorage.getItem('themeName') as ThemeName | null
        const savedMode = localStorage.getItem('themeMode') as ThemeMode | null
        if (savedThemeName) setThemeName(savedThemeName)
        if (savedMode) setMode(savedMode)
    }, [])

    // Save theme changes to localStorage
    useEffect(() => {
        localStorage.setItem('themeName', themeName)
        localStorage.setItem('themeMode', mode)
    }, [themeName, mode])

    const toggleMode = () => setMode(prev => (prev === 'dark' ? 'light' : 'dark'))

    return (
        <ThemeContext.Provider value={{ themeName, mode, setThemeName, toggleMode }}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useThemeContext = () => {
    const ctx = useContext(ThemeContext)
    if (!ctx) throw new Error('useThemeContext must be used within ThemeProviderContext')
    return ctx
}
