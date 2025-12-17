'use client'

import { createContext, useContext, useState } from 'react'
import { MusicNote, MusicRest, MusicState, Measure } from "@/types/music"
import { computePitchFromTab, computeTabFromPitch } from '@/tools/conversion'
import { v4 as uuid } from 'uuid'

const MusicContext = createContext<MusicState | null>(null)

function parseTimeSignature(ts?: string) {
    const [beats, value] = ts?.split('/')?.map(Number) ?? []
    return { numBeats: beats || 4, beatValue: value || 4 }
}

function durationToBeats(duration: string): number {
    switch (duration.replace('r', '')) {
        case 'w': return 4
        case 'h': return 2
        case 'q': return 1
        case '8': return 0.5
        case '16': return 0.25
        default: return 1
    }
}

// ✅ New helper: compute total beats in a measure
function getMeasureBeatCount(measure: Measure): number {
    return measure.notes.reduce((sum, n) => sum + durationToBeats(n.duration), 0) +
        measure.rests.reduce((sum, r) => sum + durationToBeats(r.duration), 0)
}

export function MusicProvider({ children }: { children: React.ReactNode }) {
    const [measures, setMeasures] = useState<Measure[]>([
        { id: uuid(), notes: [], rests: [], timeSignature: '4/4', keySignature: 'C', clef: 'treble' },
    ])
    const [tuning] = useState(['E2', 'A2', 'D3', 'G3', 'B3', 'E4'])

    // --- MEASURES ---
    const addMeasure = (timeSignature: string = '4/4', keySignature: string = 'C') => {
        setMeasures(prev => [...prev, { id: uuid(), notes: [], rests: [], timeSignature, keySignature }])
    }

    const removeMeasure = (measureId: string) => {
        setMeasures(prev => prev.filter(m => m.id !== measureId))
    }

    const updateMeasure = (measureId: string, updates: Partial<Measure>) => {
        setMeasures(prev => prev.map(m => m.id === measureId ? { ...m, ...updates } : m))
    }

    // --- NOTES ---
    const addNote = (measureId: string, incoming: Partial<MusicNote>) => {
        setMeasures(prev => {
            const idx = prev.findIndex(m => m.id === measureId)
            if (idx === -1) return prev

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

            const { numBeats, beatValue } = parseTimeSignature(prev[idx].timeSignature)
            const maxBeats = numBeats * (4 / beatValue)

            const updatedMeasures = [...prev]
            let currentIdx = idx
            let remainingBeats = durationToBeats(note.duration)

            while (remainingBeats > 0) {
                const current = updatedMeasures[currentIdx]
                const used = getMeasureBeatCount(current)
                const space = maxBeats - used

                if (space <= 0) {
                    currentIdx += 1
                    if (!updatedMeasures[currentIdx]) {
                        updatedMeasures.push({
                            id: uuid(),
                            notes: [],
                            rests: [],
                            timeSignature: current.timeSignature,
                            keySignature: current.keySignature,
                        })
                    }
                    continue
                }

                const dur = remainingBeats >= space
                    ? (space >= 1 ? 'q' : space >= 0.5 ? '8' : '16')
                    : (remainingBeats >= 1 ? 'q' : remainingBeats >= 0.5 ? '8' : '16')

                const durBeats = durationToBeats(dur)
                updatedMeasures[currentIdx].notes.push({ ...note, id: uuid(), duration: dur })
                remainingBeats -= durBeats

                // ✅ break if consumed exactly
                if (remainingBeats <= 0) break
            }
            return updatedMeasures
        })
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

    // --- RESTS ---
    const addRest = (measureId: string, incoming: Partial<MusicRest>) => {
        setMeasures(prev => {
            const idx = prev.findIndex(m => m.id === measureId)
            if (idx === -1) return prev

            const rest: MusicRest = { id: uuid(), duration: incoming.duration ?? 'q' }

            const { numBeats, beatValue } = parseTimeSignature(prev[idx].timeSignature)
            const maxBeats = numBeats * (4 / beatValue)

            const updatedMeasures = [...prev]
            let currentIdx = idx
            let remainingBeats = durationToBeats(rest.duration)

            while (remainingBeats > 0) {
                const current = updatedMeasures[currentIdx]
                const used = getMeasureBeatCount(current)
                const space = maxBeats - used

                if (space <= 0) {
                    currentIdx += 1
                    if (!updatedMeasures[currentIdx]) {
                        updatedMeasures.push({
                            id: uuid(),
                            notes: [],
                            rests: [],
                            timeSignature: current.timeSignature,
                            keySignature: current.keySignature,
                        })
                    }
                    continue
                }

                const dur = remainingBeats >= space
                    ? (space >= 1 ? 'q' : space >= 0.5 ? '8' : '16')
                    : (remainingBeats >= 1 ? 'q' : remainingBeats >= 0.5 ? '8' : '16')

                const durBeats = durationToBeats(dur)
                updatedMeasures[currentIdx].rests.push({ id: uuid(), duration: dur })
                remainingBeats -= durBeats

                if (remainingBeats <= 0) break
            }

            return updatedMeasures
        })
    }

    const removeRest = (measureId: string, restId: string) => {
        setMeasures(prev => prev.map(m =>
            m.id === measureId ? { ...m, rests: m.rests.filter(r => r.id !== restId) } : m
        ))
    }

    const updateRest = (measureId: string, restId: string, updates: Partial<MusicRest>) => {
        setMeasures(prev => prev.map(m =>
            m.id === measureId
                ? { ...m, rests: m.rests.map(r => r.id === restId ? { ...r, ...updates } : r) }
                : m
        ))
    }

    return (
        <MusicContext.Provider
            value={{
                measures,
                tuning,
                addMeasure,
                removeMeasure,
                updateMeasure,
                addNote,
                removeNote,
                updateNote,
                addRest,
                removeRest,
                updateRest,
                getMeasureBeatCount, // ✅ exposed helper
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
