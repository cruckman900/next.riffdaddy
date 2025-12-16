'use client'

import { createContext, useContext, useState } from 'react'
import { MusicNote, MusicState, Measure } from "@/types/music"
import { computePitchFromTab, computeTabFromPitch } from '@/tools/conversion'
import { v4 as uuid } from 'uuid'

const MusicContext = createContext<MusicState | null>(null)

export function MusicProvider({ children }: { children: React.ReactNode }) {
    const [measures, setMeasures] = useState<Measure[]>([
        { id: uuid(), notes: [], timeSignature: '4/4' },
    ])
    const [tuning] = useState(['E4', 'B3', 'G3', 'D3', 'A2', 'E2'])

    const addMeasure = (timeSignature: string = '4/4') => {
        setMeasures(prev => [...prev, { id: uuid(), notes: [], timeSignature }])
    }

    const addNote = (measureId: string, incoming: Partial<MusicNote>) => {
        setMeasures(prev => prev.map(m => {
            if (m.id !== measureId) return m
            const note: MusicNote = {
                id: uuid(),
                pitch: incoming.pitch ?? '',
                duration: incoming.duration ?? 'q',
                string: incoming.string,
                fret: incoming.fret,
            }

            // Normalize pitch/TAB
            if (note.pitch && (note.string == null || note.fret == null)) {
                const tab = computeTabFromPitch(note.pitch, tuning)
                note.string = tab.string
                note.fret = tab.fret
            }
            if (!note.pitch && note.string != null && note.fret != null) {
                note.pitch = computePitchFromTab(note.string, note.fret, tuning)
            }

            return { ...m, notes: [...m.notes, note] }
        }))
    }

    const removeNote = (measureId: string, noteId: string) => {
        setMeasures(prev => prev.map(m =>
            m.id === measureId ? { ...m, notes: m.notes.filter(n => n.id !== noteId) } : m
        ))
    }

    const updateNote = (measureId: string, noteId: string, updates: Partial<MusicNote>) => {
        setMeasures(prev => prev.map(m =>
            m.id === measureId
                ? { ...m, notes: m.notes.map(n => n.id === noteId ? { ...n, ...updates } : n) }
                : m
        ))
    }

    return (
        <MusicContext.Provider
            value={{ measures, tuning, addNote, removeNote, updateNote, addMeasure }}
        >
            {children}
        </MusicContext.Provider>
    )
}

export function useMusic() {
    const ctx = useContext(MusicContext)
    if (!ctx) throw new Error('useMusic must be inside MusicProvider')
    return ctx
}
