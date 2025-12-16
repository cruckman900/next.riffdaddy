'use client'

import { createContext, useContext, useState } from 'react'
import { MusicNote, MusicState } from "@/types/music"
import { computePitchFromTab, computeTabFromPitch } from '@/tools/conversion'
import { v4 as uuid } from 'uuid'

const MusicContext = createContext<MusicState | null>(null)

export function MusicProvider({ children }: { children: React.ReactNode }) {
    const [notes, setNotes] = useState<MusicNote[]>([])
    const [timeSignature, setTimeSignature] = useState('4/4')
    const [tuning, setTuning] = useState(['E4', 'B3', 'G3', 'D3', 'A2', 'E2'])

    const addNote = (incoming: Partial<MusicNote>) => {
        const note: MusicNote = {
            id: uuid(),
            pitch: incoming.pitch ?? '',
            duration: incoming.duration ?? 'q',
            string: incoming.string,
            fret: incoming.fret,
        }

        // Normalize: pitch -> TAB or TAB -> pitch
        if (note.pitch && (note.string == null || note.fret == null)) {
            const tab = computeTabFromPitch(note.pitch, tuning)
            note.string = tab.string
            note.fret = tab.fret
        }

        if (!note.pitch && note.string !== null && note.fret !== null) {
            note.pitch = computePitchFromTab(note.string, note.fret, tuning)
        }

        setNotes((prev) => [...prev, note])
    }

    const removeNote = (id: string) => {
        setNotes((prev) => prev.filter((n) => n.id !== id))
    }

    const updateNote = (id: string, updates: Partial<MusicNote>) => {
        setNotes((prev) =>
            prev.map((n) => (n.id === id ? { ...n, ...updates } : n))
        )
    }

    return (
        <MusicContext.Provider
            value={{
                notes,
                timeSignature,
                tuning,
                addNote,
                removeNote,
                updateNote,
            }}
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