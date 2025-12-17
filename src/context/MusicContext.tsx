/* eslint-disable prefer-const */
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
        console.log('Adding note to measure:', measureId, incoming)
        setMeasures(prev => {
            const idx = prev.findIndex(m => m.id === measureId)
            if (idx === -1) return prev

            // Build base note
            let note: MusicNote = {
                id: uuid(),
                pitch: incoming.pitch ?? '',
                duration: incoming.duration ?? 'q',
                string: incoming.string,
                fret: incoming.fret,
            }

            // ✅ Normalize to arrays
            if (!Array.isArray(note.pitch)) {
                note.pitch = note.pitch ? [note.pitch] : []
            }
            if (note.string != null && !Array.isArray(note.string)) {
                note.string = [note.string]
            }
            if (note.fret != null && !Array.isArray(note.fret)) {
                note.fret = [note.fret]
            }

            // ✅ Compute missing tab from pitch
            if (note.pitch.length > 0 && (!note.string || !note.fret)) {
                const strings: number[] = []
                const frets: number[] = []
                note.pitch.forEach(p => {
                    const tab = computeTabFromPitch(p, tuning)
                    strings.push(tab.string)
                    frets.push(tab.fret)
                })
                note.string = strings
                note.fret = frets
            }

            // ✅ Compute missing pitch from tab
            if ((!note.pitch || note.pitch.length === 0) && note.string && note.fret) {
                const pitches: string[] = []
                note.string.forEach((s, i) => {
                    // ✅ ensure f is always a number
                    let f: number = 0
                    if (Array.isArray(note.fret)) {
                        f = note.fret[i] ?? 0
                    } else if (typeof note.fret === 'number') {
                        f = note.fret
                    }
                    pitches.push(computePitchFromTab(s, f, tuning))
                })
                note.pitch = pitches
            }

            // --- Measure filling logic ---
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
        setMeasures(prev =>
            prev.map(m =>
                m.id === measureId
                    ? {
                        ...m,
                        notes: m.notes.map(n => {
                            if (n.id !== noteId) return n

                            // Merge updates
                            let updated: MusicNote = { ...n, ...updates }

                            // ✅ Normalize to arrays
                            if (!Array.isArray(updated.pitch)) {
                                updated.pitch = updated.pitch ? [updated.pitch] : []
                            }
                            if (updated.string != null && !Array.isArray(updated.string)) {
                                updated.string = [updated.string]
                            }
                            if (updated.fret != null && !Array.isArray(updated.fret)) {
                                updated.fret = [updated.fret]
                            }

                            // ✅ Compute missing tab from pitch
                            if (updated.pitch.length > 0 && (!updated.string || !updated.fret)) {
                                const strings: number[] = []
                                const frets: number[] = []
                                updated.pitch.forEach(p => {
                                    const tab = computeTabFromPitch(p, tuning)
                                    strings.push(tab.string)
                                    frets.push(tab.fret)
                                })
                                updated.string = strings
                                updated.fret = frets
                            }

                            // ✅ Compute missing pitch from tab
                            if ((!updated.pitch || updated.pitch.length === 0) && updated.string && updated.fret) {
                                const pitches: string[] = []
                                updated.string.forEach((s, i) => {
                                    let f: number = 0
                                    if (Array.isArray(updated.fret)) {
                                        f = updated.fret[i] ?? 0
                                    } else if (typeof updated.fret === 'number') {
                                        f = updated.fret
                                    }
                                    pitches.push(computePitchFromTab(s, f, tuning))
                                })
                                updated.pitch = pitches
                            }

                            return updated
                        }),
                    }
                    : m
            )
        )
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
