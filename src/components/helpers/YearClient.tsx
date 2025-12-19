// YearClient.tsx
'use client'

export default function YearClient() {
    const year = new Date().getFullYear()
    return <>{year}</>
}