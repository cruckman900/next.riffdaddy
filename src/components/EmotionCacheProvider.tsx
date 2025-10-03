// src/components/EmotionCacheProvider.tsx
"use client"

import { CacheProvider } from "@emotion/react"
import { emotionCache } from "../lib/emotionCache"

export default function EmotionCacheProvider({ children }: { children: React.ReactNode }) {
    return <CacheProvider value={emotionCache}>{children}</CacheProvider>
}