/* eslint-disable prefer-const */
'use client'

import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { MusicNote, MusicRest, MusicState, Measure, CompositionSnapshot } from "@/types/music"
import { Tuning, tuningPresets, defaultTuningWithOctaves, resolveTuningOctaves } from '@/utils/tunings'
import { computePitchFromTab, computeTabFromPitch } from '@/tools/conversion'
import { durationToBeats, getMeasureBeatCount } from '@/tools/duration'
import { loadSettings, saveSettings } from '@/utils/settingsStore'
import { useTabs } from '@/context/TabsContext'
import { v4 as uuid } from 'uuid'

const MusicContext = createContext<MusicState | null>(null)

function parseTimeSignature(ts?: string) {
    const [beats, value] = ts?.split('/')?.map(Number) ?? []
    return { numBeats: beats || 4, beatValue: value || 4 }
}

// Builds a brand-new tab's starting composition from the persisted
// "last used" settings (instrument/tuning/tempo/genre) — matches what a
// fresh page load used to seed globally, but now scoped per-tab.
function createDefaultComposition(): CompositionSnapshot {
    const saved = loadSettings()
    const presetNotes = tuningPresets[saved.instrument] ?? tuningPresets.guitar
    const displayNotes = saved.tuningDisplayNotes ?? presetNotes
    const workingTuning = saved.tuningNotes ?? resolveTuningOctaves(saved.instrument, displayNotes)
    return {
        measures: [
            { id: uuid(), notes: [], rests: [], timeSignature: '4/4', keySignature: 'C', clef: 'treble', beamGroups: [] },
        ],
        selectedInstrument: saved.instrument,
        selectedGenre: saved.genre,
        selectedTuning: { name: saved.tuningName ?? 'Standard', notes: displayNotes },
        tuning: workingTuning,
        tempo: saved.tempo,
        selectedNoteRefs: [],
    }
}

export function MusicProvider({ children }: { children: React.ReactNode }) {
    const [activeTool, setActiveTool] = useState('cockpit')
    const [selectedInstrument, setSelectedInstrument] = useState("guitar")
    const [selectedGenre, setSelectedGenre] = useState("All")
    const [selectedTuning, setSelectedTuning] = useState<Tuning>({
        name: "Standard",
        notes: tuningPresets.guitar,
    })
    const [showArcs, setShowArcs] = useState(false)
    const [useAlternate, setUseAlternate] = useState(false)
    const [customTunings, setCustomTunings] = useState<Tuning[]>([])

    const addCustomTuning = (t: Tuning) => setCustomTunings(prev => [...prev, t])

    // Cascading setters — these keep `tuning` (the octave-qualified flat array
    // the fretboard/renderers actually read pitches from) in sync with
    // whatever preset/instrument is selected. Previously selecting a tuning or
    // switching instruments only updated `selectedTuning`/`selectedInstrument`
    // and never touched `tuning`, so the fretboard silently kept using the
    // original default tuning no matter what you picked.
    const selectTuning = (t: Tuning) => {
        setSelectedTuning(t)
        setTuning(resolveTuningOctaves(selectedInstrument, t.notes))
    }

    const selectInstrument = (instrument: string) => {
        setSelectedInstrument(instrument)
        const presetNotes = tuningPresets[instrument] ?? tuningPresets.guitar
        const nextTuning: Tuning = { name: 'Standard', notes: presetNotes, description: 'Default tuning' }
        setSelectedTuning(nextTuning)
        setTuning(resolveTuningOctaves(instrument, presetNotes))
    }

    const [measures, setMeasures] = useState<Measure[]>([
        { id: uuid(), notes: [], rests: [], timeSignature: '4/4', keySignature: 'C', clef: 'treble', beamGroups: [] },
    ])
    const [tuning, setTuning] = useState(defaultTuningWithOctaves.guitar)

    // Score Settings
    const [measuresPerRow, setMeasuresPerRow] = useState(4)
    const [scoreFixedWidth, setScoreFixedWidth] = useState(false)
    const [tempo, setTempo] = useState(120)

    // --- PERSISTENCE ---
    // Load once on mount (client-only, mirrors ThemeContext's pattern so SSR
    // and the first client render both start from the same defaults and
    // avoid a hydration mismatch), then persist on every relevant change.
    // Instrument/genre/tuning/tempo are NOT loaded here anymore — they're
    // per-tab composition data now (see createDefaultComposition and the
    // tab-switch effect below); only the truly global display/layout
    // preferences are loaded at the top level.
    const hasLoadedSettings = useRef(false)
    useEffect(() => {
        const saved = loadSettings()
        setShowArcs(saved.showArcs)
        setUseAlternate(saved.useAlternate)
        setCustomTunings(saved.customTunings)
        setMeasuresPerRow(saved.measuresPerRow)
        setScoreFixedWidth(saved.scoreFixedWidth)

        hasLoadedSettings.current = true
    }, [])

    useEffect(() => {
        if (!hasLoadedSettings.current) return
        const id = setTimeout(() => {
            saveSettings({
                instrument: selectedInstrument,
                genre: selectedGenre,
                tuningName: selectedTuning.name,
                tuningDisplayNotes: selectedTuning.notes,
                tuningNotes: tuning,
                customTunings,
                showArcs,
                useAlternate,
                measuresPerRow,
                scoreFixedWidth,
                tempo,
            })
        }, 200)
        return () => clearTimeout(id)
    }, [selectedInstrument, selectedGenre, selectedTuning, tuning, customTunings, showArcs, useAlternate, measuresPerRow, scoreFixedWidth, tempo])

    // --- MEASURES ---
    const addMeasure = (clef: string = 'treble', timeSignature: string = '4/4', keySignature: string = 'C') => {
        setMeasures(prev => [...prev, { id: uuid(), notes: [], rests: [], clef, timeSignature, keySignature, beamGroups: [] }])
    }

    const removeMeasure = (measureId: string) => {
        setMeasures(prev => prev.filter(m => m.id !== measureId))
    }

    // --- NOTE SELECTION + NOTATION MODIFIERS ---
    const [selectedNoteRefs, setSelectedNoteRefs] = useState<{ measureId: string; noteId: string }[]>([])

    const toggleNoteSelection = (measureId: string, noteId: string) => {
        setSelectedNoteRefs(prev => {
            const exists = prev.some(r => r.measureId === measureId && r.noteId === noteId)
            return exists
                ? prev.filter(r => !(r.measureId === measureId && r.noteId === noteId))
                : [...prev, { measureId, noteId }]
        })
    }

    const clearNoteSelection = () => setSelectedNoteRefs([])

    // Clear selection refs pointing at notes/measures that no longer exist
    // (e.g. the note was removed) so the toolbar never targets stale ids.
    useEffect(() => {
        setSelectedNoteRefs(prev => prev.filter(r => {
            const measure = measures.find(m => m.id === r.measureId)
            return !!measure?.notes.some(n => n.id === r.noteId)
        }))
    }, [measures])

    const toggleModifierOnSelection = (modifierId: string) => {
        if (selectedNoteRefs.length === 0) return
        setMeasures(prev => prev.map(m => {
            const refsForMeasure = selectedNoteRefs.filter(r => r.measureId === m.id)
            if (refsForMeasure.length === 0) return m

            return {
                ...m,
                notes: m.notes.map(n => {
                    if (!refsForMeasure.some(r => r.noteId === n.id)) return n
                    const current = n.modifiers ?? []
                    const has = current.includes(modifierId)
                    return {
                        ...n,
                        modifiers: has ? current.filter(id => id !== modifierId) : [...current, modifierId],
                    }
                }),
            }
        }))
    }

    const updateMeasure = (measureId: string, updates: Partial<Measure>) => {
        setMeasures(prev => prev.map(m => m.id === measureId ? { ...m, ...updates } : m))
    }

    // --- PER-TAB COMPOSITION STATE ---
    // Each open workspace tab (see TabsContext) gets its own independent
    // measures/instrument/tuning/tempo/selection rather than one giant
    // shared state. Rather than rewriting every setter above to operate on
    // a keyed map (which would touch nearly every function in this file),
    // we snapshot the OUTGOING tab's state into a ref and restore the
    // INCOMING tab's state whenever the active tab changes — every existing
    // setter keeps working exactly as before, just against "whichever tab
    // is currently active."
    const tabsApi = useTabs()
    const activeTabId = tabsApi?.activeTab?.id
    const compositionsRef = useRef<Record<string, CompositionSnapshot>>({})
    const previousTabIdRef = useRef<string | undefined>(undefined)

    useEffect(() => {
        const prevId = previousTabIdRef.current
        // Guard against React 18 StrictMode re-invoking this effect a second
        // time in dev with the exact same deps (no real tab change) — without
        // this, the second call would "snapshot" the pre-seed initial state
        // over top of the freshly-seeded composition below, silently
        // reverting the active tab's measures out from under it.
        if (prevId === activeTabId) return

        if (prevId) {
            compositionsRef.current[prevId] = {
                measures, selectedInstrument, selectedGenre, selectedTuning, tuning, tempo, selectedNoteRefs,
            }
        }

        if (activeTabId) {
            const snapshot = compositionsRef.current[activeTabId] ?? createDefaultComposition()
            compositionsRef.current[activeTabId] = snapshot
            setMeasures(snapshot.measures)
            setSelectedInstrument(snapshot.selectedInstrument)
            setSelectedGenre(snapshot.selectedGenre)
            setSelectedTuning(snapshot.selectedTuning)
            setTuning(snapshot.tuning)
            setTempo(snapshot.tempo)
            setSelectedNoteRefs(snapshot.selectedNoteRefs)
        }

        previousTabIdRef.current = activeTabId
        // Only re-run when the active tab actually changes — the outgoing
        // snapshot deliberately reads the latest measures/etc via closure
        // rather than being listed as a dependency.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTabId])

    // Drop stale per-tab snapshots once their tab is actually closed, so a
    // long session doesn't quietly accumulate memory for tabs that no
    // longer exist.
    useEffect(() => {
        if (!tabsApi) return
        const validIds = new Set(tabsApi.tabs.map(t => t.id))
        Object.keys(compositionsRef.current).forEach(id => {
            if (!validIds.has(id)) delete compositionsRef.current[id]
        })
    }, [tabsApi, tabsApi?.tabs])

    // Used by "Open"/Load (see the backend tab-storage integration) to seed
    // a specific tab's composition — including the currently active one,
    // in which case the change is applied immediately.
    const loadComposition = (tabId: string, data: CompositionSnapshot) => {
        compositionsRef.current[tabId] = data
        if (tabId === activeTabId) {
            setMeasures(data.measures)
            setSelectedInstrument(data.selectedInstrument)
            setSelectedGenre(data.selectedGenre)
            setSelectedTuning(data.selectedTuning)
            setTuning(data.tuning)
            setTempo(data.tempo)
            setSelectedNoteRefs(data.selectedNoteRefs)
        }
    }

    // --- NOTES ---
    const addNote = (measureId: string, incoming: Partial<MusicNote>) => {
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
                            beamGroups: [],
                        })
                    }
                    continue
                }

                // ✅ preserve original duration if it fits
                let dur = note.duration
                const beats = durationToBeats(note.duration)
                if (beats > space) {
                    dur = space >= 4 ? 'w'
                        : space >= 2 ? 'h'
                            : space >= 1 ? 'q'
                                : space >= 0.5 ? '8'
                                    : space >= 0.25 ? '16'
                                        : space >= 0.125 ? '32'
                                            : '64'
                }

                const durBeats = durationToBeats(dur)
                const newNote: MusicNote = {
                    ...note,
                    id: uuid(),
                    duration: dur,
                    // Chronological position among this measure's notes+rests
                    // (see MusicNote.order) — used by playback to reconstruct
                    // real note/rest sequencing.
                    order: current.notes.length + current.rests.length,
                }

                // ✅ Beam grouping for 8ths/16ths — built immutably (a new
                // beamGroups array/tuple each time) rather than mutated in
                // place, since `updatedMeasures[currentIdx]` still shares
                // object identity with `prev[currentIdx]` after the shallow
                // `[...prev]` copy above. Mutating those shared nested arrays
                // directly caused notes to be inserted twice under React 18
                // StrictMode, which intentionally invokes state updaters
                // twice in development to catch exactly this kind of bug.
                let beamGroups = current.beamGroups ?? []
                if (dur === '8' || dur === '16') {
                    const lastGroup = beamGroups.length > 0 ? beamGroups[beamGroups.length - 1] : undefined
                    beamGroups = (lastGroup && lastGroup.length < 4)
                        ? [...beamGroups.slice(0, -1), [...lastGroup, newNote.id]]
                        : [...beamGroups, [newNote.id]]
                }

                updatedMeasures[currentIdx] = {
                    ...current,
                    notes: [...current.notes, newNote],
                    beamGroups,
                }

                remainingBeats -= durBeats
                if (remainingBeats <= 0) break
            }

            return updatedMeasures
        })
    }

    const removeNote = (measureId: string, noteId: string, pitchToRemove?: string) => {
        setMeasures(prev =>
            prev.map(m => {
                if (m.id !== measureId) return m

                return {
                    ...m,
                    notes: m.notes.flatMap(n => {
                        if (n.id !== noteId) return [n]

                        // ✅ If no specific pitch requested, remove the whole note
                        if (!pitchToRemove) return []

                        // ✅ If chord, remove just that pitch
                        if (Array.isArray(n.pitch)) {
                            const pitchIdx = n.pitch.findIndex(p => p === pitchToRemove)
                            if (pitchIdx === -1) return [n] // pitch not found, keep note

                            const newPitch = [...n.pitch]
                            newPitch.splice(pitchIdx, 1)

                            const newString = Array.isArray(n.string) ? [...n.string] : n.string ? [n.string] : []
                            const newFret = Array.isArray(n.fret) ? [...n.fret] : n.fret ? [n.fret] : []

                            if (pitchIdx < newString.length) newString.splice(pitchIdx, 1)
                            if (pitchIdx < newFret.length) newFret.splice(pitchIdx, 1)

                            // If chord is now empty, drop the note entirely
                            if (newPitch.length === 0) return []

                            return [{
                                ...n,
                                pitch: newPitch,
                                string: newString,
                                fret: newFret,
                            }]
                        }

                        // ✅ If single note, removing its pitch deletes the note
                        if (typeof n.pitch === 'string' && n.pitch === pitchToRemove) {
                            return []
                        }

                        return [n]
                    }),
                }
            })
        )
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
                            beamGroups: [],
                        })
                    }
                    continue
                }

                const dur = remainingBeats >= space
                    ? (space >= 4 ? 'w' : space >= 2 ? 'h' : space >= 1 ? 'q' : space >= 0.5 ? '8' : space >= 0.25 ? '16' : space >= 0.125 ? '32' : '64')
                    : (remainingBeats >= 4 ? 'w' : remainingBeats >= 2 ? 'h' : remainingBeats >= 1 ? 'q' : remainingBeats >= 0.5 ? '8' : remainingBeats >= 0.25 ? '16' : remainingBeats >= 0.125 ? '32' : '64')

                const durBeats = durationToBeats(dur)
                // Build a new measure object/rests array rather than mutating
                // the shared one in place (see addNote for why this matters).
                updatedMeasures[currentIdx] = {
                    ...current,
                    rests: [...current.rests, {
                        id: uuid(),
                        duration: dur,
                        order: current.notes.length + current.rests.length,
                    }],
                }
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
                activeTool,
                setActiveTool,
                selectedInstrument,
                setSelectedInstrument,
                selectInstrument,
                showArcs,
                setShowArcs,
                useAlternate,
                setUseAlternate,
                selectedGenre,
                setSelectedGenre,
                selectedTuning,
                setSelectedTuning,
                selectTuning,
                customTunings,
                addCustomTuning,
                tuning,
                setTuning,
                measures,
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
                selectedNoteRefs,
                toggleNoteSelection,
                clearNoteSelection,
                toggleModifierOnSelection,
                measuresPerRow,
                setMeasuresPerRow,
                scoreFixedWidth,
                setScoreFixedWidth,
                tempo,
                setTempo,
                loadComposition,
            }}
        >
            {children}
        </MusicContext.Provider>
    )
}

export function useMusic(): MusicState {
    const ctx = useContext(MusicContext)
    if (!ctx) throw new Error('useMusic must be inside MusicProvider')
    return ctx
}
