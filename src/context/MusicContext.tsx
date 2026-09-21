/* eslint-disable prefer-const */
'use client'

import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { MusicNote, MusicRest, MusicState, Measure, CompositionSnapshot, PendingNoteAction, ScoreMetadata, TieNoteRef } from "@/types/music"
import { Tuning, tuningPresets, defaultTuningWithOctaves, resolveTuningOctaves, resolveStringCount } from '@/utils/tunings'
import { computePitchFromTab, computeTabFromPitch } from '@/tools/conversion'
import { DRUM_KIT_STYLE_PRESETS, getKitPieces } from '@/utils/drumKits'
import { durationToBeats, getMeasureBeatCount, getOrderedMeasureItems } from '@/tools/duration'
import { loadSettings, saveSettings } from '@/utils/settingsStore'
import { getVoiceOptions } from '@/tools/playback'
import { EMPTY_METADATA } from '@/lib/api/tabs'
import { useTabs } from '@/context/TabsContext'
import { useAuthContext } from '@/context/AuthProvider'
import { v4 as uuid } from 'uuid'

const MusicContext = createContext<MusicState | null>(null)

// Per-tab composition snapshots + the active toolbar tool are persisted per
// signed-in user so a refresh (or closing and reopening the browser) never
// loses in-progress work or drops you back to a blank workspace — only the
// truly ephemeral stuff (current note selection mid-drag, etc.) is allowed
// to reset.
const COMPOSITIONS_STORAGE_PREFIX = 'nextriff.compositions.'
const ACTIVE_TOOL_STORAGE_PREFIX = 'nextriff.activeTool.'

function compositionsStorageKey(userId: string) {
    return `${COMPOSITIONS_STORAGE_PREFIX}${userId}`
}
function activeToolStorageKey(userId: string) {
    return `${ACTIVE_TOOL_STORAGE_PREFIX}${userId}`
}

function readStoredCompositions(userId: string): Record<string, CompositionSnapshot> {
    if (typeof window === 'undefined') return {}
    try {
        const raw = localStorage.getItem(compositionsStorageKey(userId))
        return raw ? (JSON.parse(raw) as Record<string, CompositionSnapshot>) : {}
    } catch {
        return {}
    }
}

function readStoredActiveTool(userId: string): string | null {
    if (typeof window === 'undefined') return null
    try {
        return localStorage.getItem(activeToolStorageKey(userId))
    } catch {
        return null
    }
}

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
        selectedVoice: saved.voice ?? getVoiceOptions(saved.instrument)[0]?.id ?? '',
        metadata: { ...EMPTY_METADATA },
        tieGroups: [],
    }
}

export function MusicProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuthContext()
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
    const [selectedVoice, setSelectedVoice] = useState(getVoiceOptions('guitar')[0]?.id ?? '')
    const [metadata, setMetadata] = useState<ScoreMetadata>({ ...EMPTY_METADATA })
    const updateMetadata = (updates: Partial<ScoreMetadata>) =>
        setMetadata(prev => ({ ...prev, ...updates }))

    const addCustomTuning = (t: Tuning) => setCustomTunings(prev => [...prev, t])

    // Cascading setters — these keep `tuning` (the octave-qualified flat array
    // the fretboard/renderers actually read pitches from) in sync with
    // whatever preset/instrument is selected. Previously selecting a tuning or
    // switching instruments only updated `selectedTuning`/`selectedInstrument`
    // and never touched `tuning`, so the fretboard silently kept using the
    // original default tuning no matter what you picked.
    //
    // Drums are special-cased throughout: `tuning`/`selectedTuning.notes`
    // hold DrumPieceId strings (not real pitches) in the same positional
    // "string index" role a real tuning's note names play, so
    // resolveTuningOctaves (which parses real note-letter/octave strings)
    // must never run on them — see DRUM_KIT_STYLE_PRESETS in drumKits.ts.
    const selectTuning = (t: Tuning) => {
        setSelectedTuning(t)
        setTuning(selectedInstrument === 'drums' ? t.notes : resolveTuningOctaves(selectedInstrument, t.notes))
    }

    const selectInstrument = (instrument: string) => {
        setSelectedInstrument(instrument)
        if (instrument === 'drums') {
            const standard = DRUM_KIT_STYLE_PRESETS[0]
            const nextTuning: Tuning = { name: standard.name, notes: standard.pieces, description: standard.description }
            setSelectedTuning(nextTuning)
            setTuning(nextTuning.notes)
        } else {
            const presetNotes = tuningPresets[instrument] ?? tuningPresets.guitar
            const nextTuning: Tuning = { name: 'Standard', notes: presetNotes, description: 'Default tuning' }
            setSelectedTuning(nextTuning)
            setTuning(resolveTuningOctaves(instrument, presetNotes))
        }
        // The new instrument's voice list is a different set of ids entirely
        // (e.g. bass's "Slap 1" doesn't exist for violin) — reset to its
        // first/default voice rather than keeping a stale, meaningless id.
        setSelectedVoice(getVoiceOptions(instrument)[0]?.id ?? '')
    }

    // Extends/trims the *current* tuning (whatever preset/custom tuning is
    // active) to a different string count — e.g. picking "7" in the
    // Instrument panel's Strings dropdown for a 6-string guitar tuning. This
    // previously had no effect at all: InstrumentSelector reported the new
    // string count, but nothing consumed it.
    //
    // For drums this is the "Pieces" count instead — swapping to a specific
    // real kit configuration (see DRUM_KIT_SIZES) rather than chromatically
    // extending/trimming, since piece counts aren't just "add one more".
    const setStringCount = (count: number) => {
        if (selectedInstrument === 'drums') {
            const pieces = getKitPieces(count)
            setSelectedTuning(prev => ({ ...prev, notes: pieces }))
            setTuning(pieces)
            return
        }
        const adjustedNotes = resolveStringCount(selectedTuning.notes, count)
        const nextTuning: Tuning = { ...selectedTuning, notes: adjustedNotes }
        setSelectedTuning(nextTuning)
        setTuning(resolveTuningOctaves(selectedInstrument, adjustedNotes))
    }

    const [measures, setMeasures] = useState<Measure[]>([
        { id: uuid(), notes: [], rests: [], timeSignature: '4/4', keySignature: 'C', clef: 'treble', beamGroups: [] },
    ])
    // Chains of tied notes across the whole composition — see TieNoteRef.
    // Lives alongside `measures` (not inside it) specifically so a tie can
    // cross a barline into a different measure.
    const [tieGroups, setTieGroups] = useState<TieNoteRef[][]>([])
    const [tuning, setTuning] = useState(defaultTuningWithOctaves.guitar)

    // Score Settings
    const [measuresPerRow, setMeasuresPerRow] = useState(4)
    const [scoreFixedWidth, setScoreFixedWidth] = useState(false)
    const [noteSpacing, setNoteSpacing] = useState(18)
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
        setNoteSpacing(saved.noteSpacing)

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
                noteSpacing,
                tempo,
                voice: selectedVoice,
            })
        }, 200)
        return () => clearTimeout(id)
    }, [selectedInstrument, selectedGenre, selectedTuning, tuning, customTunings, showArcs, useAlternate, measuresPerRow, scoreFixedWidth, noteSpacing, tempo, selectedVoice])

    // Restores whichever toolbar tool (Instrument & Tuning, Fretboard, etc.)
    // was active before a refresh, per signed-in user. Runs once per
    // resolved user id rather than unconditionally on every render.
    const hydratedActiveToolForUserIdRef = useRef<string | null>(null)
    useEffect(() => {
        if (!user?.id || hydratedActiveToolForUserIdRef.current === user.id) return
        const stored = readStoredActiveTool(user.id)
        if (stored) setActiveTool(stored)
        hydratedActiveToolForUserIdRef.current = user.id
    }, [user?.id])

    useEffect(() => {
        if (!user?.id || hydratedActiveToolForUserIdRef.current !== user.id) return
        try {
            localStorage.setItem(activeToolStorageKey(user.id), activeTool)
        } catch {
            // See the tabs-persistence comment elsewhere — best-effort only.
        }
    }, [activeTool, user?.id])

    // --- MEASURES ---
    const addMeasure = (clef: string = 'treble', timeSignature: string = '4/4', keySignature: string = 'C') => {
        setMeasures(prev => [...prev, { id: uuid(), notes: [], rests: [], clef, timeSignature, keySignature, beamGroups: [] }])
    }

    const removeMeasure = (measureId: string) => {
        setMeasures(prev => prev.filter(m => m.id !== measureId))
        // Drop any tie chain endpoint that lived in the removed measure, and
        // any chain that no longer has at least 2 notes left to connect.
        setTieGroups(prev => prev
            .map(group => group.filter(r => r.measureId !== measureId))
            .filter(group => group.length >= 2))
    }

    // --- NOTE SELECTION + NOTATION MODIFIERS ---
    const [selectedNoteRefs, setSelectedNoteRefs] = useState<{ measureId: string; noteId: string }[]>([])
    // See PendingNoteAction — set by the notation toolbar's Insert Before/
    // Insert After/Edit actions, consumed by whichever input tool
    // (Fretboard/Keyboard) the user commits a note from next.
    const [pendingNoteAction, setPendingNoteAction] = useState<PendingNoteAction | null>(null)

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
        const noteExists = (measureId: string, noteId: string) =>
            !!measures.find(m => m.id === measureId)?.notes.some(n => n.id === noteId)

        setSelectedNoteRefs(prev => prev.filter(r => noteExists(r.measureId, r.noteId)))
        // A pending insert/edit action anchored to a now-deleted note would
        // otherwise silently target nothing — clear it defensively.
        setPendingNoteAction(prev => {
            if (!prev) return prev
            const measure = measures.find(m => m.id === prev.measureId)
            return measure?.notes.some(n => n.id === prev.noteId) ? prev : null
        })
        // Same defensive cleanup for tie chains — belt-and-suspenders on top
        // of removeNote/removeMeasure's own targeted cleanup, in case a note
        // ever disappears through some other path.
        setTieGroups(prev => prev
            .map(group => group.filter(r => noteExists(r.measureId, r.noteId)))
            .filter(group => group.length >= 2))
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

    // Like toggleModifierOnSelection, but for a family of mutually-exclusive
    // variants (e.g. Bend's 1/4 / 1/2 / Full / … amounts) — applying one
    // first strips every other id in `groupIds` from the note so a note can
    // never end up with two conflicting variants at once. Re-selecting the
    // variant that's already active on every selected note removes it
    // instead (acts as a toggle-off), matching toggleModifierOnSelection's
    // behavior for a plain single modifier.
    const setExclusiveModifierOnSelection = (groupIds: string[], modifierId: string) => {
        if (selectedNoteRefs.length === 0) return
        const selectedNotes = selectedNoteRefs
            .map(ref => measures.find(m => m.id === ref.measureId)?.notes.find(n => n.id === ref.noteId))
            .filter((n): n is NonNullable<typeof n> => !!n)
        const alreadyActive = selectedNotes.length > 0 && selectedNotes.every(n => n.modifiers?.includes(modifierId))

        setMeasures(prev => prev.map(m => {
            const refsForMeasure = selectedNoteRefs.filter(r => r.measureId === m.id)
            if (refsForMeasure.length === 0) return m

            return {
                ...m,
                notes: m.notes.map(n => {
                    if (!refsForMeasure.some(r => r.noteId === n.id)) return n
                    const withoutGroup = (n.modifiers ?? []).filter(id => !groupIds.includes(id))
                    return { ...n, modifiers: alreadyActive ? withoutGroup : [...withoutGroup, modifierId] }
                }),
            }
        }))
    }

    // Ties are drawn between two note endpoints rather than being a per-note
    // modifier (see buildTiesFromGroups in src/tools/notation.ts), so unlike
    // toggleModifierOnSelection this needs the whole ordered group of
    // selected notes — in their real chronological order across the entire
    // composition, not selection click order, and not limited to one
    // measure — rather than a single note at a time. Storing chains as
    // {measureId, noteId} pairs (see TieNoteRef) is what lets a tie span a
    // barline into a different measure.
    const toggleTieOnSelection = () => {
        if (selectedNoteRefs.length < 2) return

        const selectedKeys = new Set(selectedNoteRefs.map(r => `${r.measureId}:${r.noteId}`))
        const orderedRefs: TieNoteRef[] = []
        measures.forEach(m => {
            m.notes.forEach(n => {
                if (selectedKeys.has(`${m.id}:${n.id}`)) orderedRefs.push({ measureId: m.id, noteId: n.id })
            })
        })
        if (orderedRefs.length < 2) return

        setTieGroups(prev => {
            const sameGroup = (g: TieNoteRef[]) =>
                g.length === orderedRefs.length && g.every((r, i) => r.measureId === orderedRefs[i].measureId && r.noteId === orderedRefs[i].noteId)
            const alreadyTied = prev.some(sameGroup)

            if (alreadyTied) {
                // Toggle off: remove exactly this tie chain.
                return prev.filter(g => !sameGroup(g))
            }
            // Toggle on: drop any existing group sharing a note with this
            // selection (avoids overlapping/duplicate ties on one note),
            // then add the new chain.
            const overlaps = (g: TieNoteRef[]) => g.some(r => orderedRefs.some(o => o.measureId === r.measureId && o.noteId === r.noteId))
            return [...prev.filter(g => !overlaps(g)), orderedRefs]
        })
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
    // Tracks which user's persisted compositions we've already merged into
    // compositionsRef, so it happens exactly once per resolved user id and
    // (critically) BEFORE the very first tab-switch/seed below reads from
    // that ref — otherwise a freshly-restored tab would seed a brand-new
    // blank composition instead of finding its persisted one.
    const hydratedCompositionsForUserIdRef = useRef<string | null>(null)

    useEffect(() => {
        // Hydrate this user's persisted compositions the first time we know
        // who they are — deliberately part of the same effect as the
        // tab-switch logic below (rather than a separate effect) so there's
        // no ordering race between "load persisted data" and "seed/restore
        // whichever tab is active."
        if (user?.id && hydratedCompositionsForUserIdRef.current !== user.id) {
            compositionsRef.current = { ...readStoredCompositions(user.id), ...compositionsRef.current }
            hydratedCompositionsForUserIdRef.current = user.id
        }

        const prevId = previousTabIdRef.current
        // Guard against React 18 StrictMode re-invoking this effect a second
        // time in dev with the exact same deps (no real tab change) — without
        // this, the second call would "snapshot" the pre-seed initial state
        // over top of the freshly-seeded composition below, silently
        // reverting the active tab's measures out from under it.
        if (prevId === activeTabId) return

        if (prevId) {
            compositionsRef.current[prevId] = {
                measures, selectedInstrument, selectedGenre, selectedTuning, tuning, tempo, selectedNoteRefs, selectedVoice, metadata, tieGroups,
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
            setSelectedVoice(snapshot.selectedVoice)
            setMetadata(snapshot.metadata ?? { ...EMPTY_METADATA })
            // Older saved snapshots (before ties existed) won't have this
            // field at all — default to no ties rather than crashing.
            setTieGroups(snapshot.tieGroups ?? [])
        }

        previousTabIdRef.current = activeTabId
        // Only re-run when the active tab (or the resolved user) changes —
        // the outgoing snapshot deliberately reads the latest measures/etc
        // via closure rather than being listed as a dependency.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTabId, user?.id])

    // Drop stale per-tab snapshots once their tab is actually closed, so a
    // long session doesn't quietly accumulate memory (and localStorage
    // space) for tabs that no longer exist. Gated on tabsApi.hydrated:
    // TabsContext's own tabs list starts out empty before ITS localStorage
    // restore completes, and treating that transient empty list as "the
    // user genuinely has no tabs" would wipe out every persisted
    // composition (including the one just hydrated above) before TabsContext
    // ever got a chance to restore its matching tab ids.
    useEffect(() => {
        if (!tabsApi || !tabsApi.hydrated) return
        const validIds = new Set(tabsApi.tabs.map(t => t.id))
        let removedAny = false
        Object.keys(compositionsRef.current).forEach(id => {
            if (!validIds.has(id)) {
                delete compositionsRef.current[id]
                removedAny = true
            }
        })
        if (removedAny && user?.id) {
            try {
                localStorage.setItem(compositionsStorageKey(user.id), JSON.stringify(compositionsRef.current))
            } catch {
                // Best-effort — see other persistence comments in this file.
            }
        }
    }, [tabsApi, tabsApi?.tabs, tabsApi?.hydrated, user?.id])

    // Autosaves the composition data itself (measures, instrument, tuning,
    // etc.) so a refresh never loses in-progress edits. The *active* tab's
    // freshest values only live in the plain state above (compositionsRef is
    // only updated for it at tab-switch time), so this merges that live
    // state in on top of the ref before writing — otherwise a refresh right
    // after editing notes (without switching tabs first) would restore the
    // second-to-last saved state instead of what's on screen.
    useEffect(() => {
        if (!user?.id || hydratedCompositionsForUserIdRef.current !== user.id) return
        const id = setTimeout(() => {
            const merged = { ...compositionsRef.current }
            if (activeTabId) {
                merged[activeTabId] = {
                    measures, selectedInstrument, selectedGenre, selectedTuning, tuning, tempo, selectedNoteRefs, selectedVoice, metadata, tieGroups,
                }
            }
            try {
                localStorage.setItem(compositionsStorageKey(user.id), JSON.stringify(merged))
            } catch {
                // Best-effort — see other persistence comments in this file.
            }
        }, 300)
        return () => clearTimeout(id)
    }, [measures, selectedInstrument, selectedGenre, selectedTuning, tuning, tempo, selectedNoteRefs, selectedVoice, metadata, tieGroups, activeTabId, user?.id])

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
            setSelectedVoice(data.selectedVoice)
            setMetadata(data.metadata ?? { ...EMPTY_METADATA })
            setTieGroups(data.tieGroups ?? [])
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

            // ✅ Compute missing tab from pitch — skipped for drums, where
            // `pitch` already holds a DrumPieceId (not a real note) and
            // `string`/`fret` are supplied directly by the Drum Input tool.
            if (selectedInstrument !== 'drums' && note.pitch.length > 0 && (!note.string || !note.fret)) {
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

            // ✅ Compute missing pitch from tab (skipped for drums — see above)
            if (selectedInstrument !== 'drums' && (!note.pitch || note.pitch.length === 0) && note.string && note.fret) {
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
                //
                // A new note only continues the last open group if it's
                // truly adjacent to it — i.e. the immediately preceding item
                // in the measure (by chronological order) is that group's
                // last note. Without this check, a quarter note (or a rest)
                // inserted between two runs of 8th/16th notes wouldn't reset
                // beamGroups (that block only runs for beamable durations),
                // so the next 8th/16th note would incorrectly get appended
                // onto the earlier, now-noncontiguous group.
                let beamGroups = current.beamGroups ?? []
                if (dur === '8' || dur === '16') {
                    const precedingItems = getOrderedMeasureItems(current)
                    const precedingItem = precedingItems[precedingItems.length - 1]
                    const lastGroup = beamGroups.length > 0 ? beamGroups[beamGroups.length - 1] : undefined
                    const continuesLastGroup = !!lastGroup
                        && lastGroup.length < 4
                        && !!precedingItem
                        && precedingItem.type === 'note'
                        && lastGroup[lastGroup.length - 1] === precedingItem.item.id

                    beamGroups = continuesLastGroup
                        ? [...beamGroups.slice(0, -1), [...lastGroup!, newNote.id]]
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

    // Whether a removeNote(...) call with this pitchToRemove would delete
    // the note object entirely, as opposed to just trimming one pitch out
    // of a chord and leaving the rest of the note in place — mirrors the
    // exact same branching as the flatMap below. Used to decide whether the
    // note needs cleaning out of any tie chain that references it.
    const wouldFullyRemoveNote = (note: MusicNote, pitchToRemove?: string): boolean => {
        if (!pitchToRemove) return true
        if (Array.isArray(note.pitch)) return note.pitch.includes(pitchToRemove) && note.pitch.length === 1
        return note.pitch === pitchToRemove
    }

    const removeNote = (measureId: string, noteId: string, pitchToRemove?: string) => {
        const noteBefore = measures.find(m => m.id === measureId)?.notes.find(n => n.id === noteId)
        const willFullyRemove = !!noteBefore && wouldFullyRemoveNote(noteBefore, pitchToRemove)

        setMeasures(prev =>
            prev.map(m => {
                if (m.id !== measureId) return m

                const notes = m.notes.flatMap(n => {
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
                })

                // Whether this note still exists as a note object afterwards
                // (e.g. only one pitch of a chord was removed) determines
                // whether it should stay referenced in beamGroups.
                const stillExists = notes.some(n => n.id === noteId)
                const beamGroups = stillExists
                    ? m.beamGroups
                    : m.beamGroups
                        .map(group => group.filter(id => id !== noteId))
                        .filter(group => group.length >= 2)

                return { ...m, notes, beamGroups }
            })
        )

        // A tie group needs at least 2 notes to draw any arc at all — same
        // threshold as beamGroups above. This lives outside setMeasures
        // since tieGroups is now tracked at the composition level, not per
        // measure (see TieNoteRef).
        if (willFullyRemove) {
            setTieGroups(prev => prev
                .map(group => group.filter(r => !(r.measureId === measureId && r.noteId === noteId)))
                .filter(group => group.length >= 2))
        }
    }

    // Deletes every currently-selected note (across whichever measures they
    // belong to) and clears the selection — the notation toolbar's Delete
    // action. Each removeNote call is its own setMeasures update, but React
    // batches synchronous updates from the same event handler, so this is
    // one re-render, not one per note.
    const deleteSelectedNotes = () => {
        selectedNoteRefs.forEach(ref => removeNote(ref.measureId, ref.noteId))
        clearNoteSelection()
    }

    // Inserts a brand-new note immediately before/after an existing one,
    // splicing it into the measure's true chronological position (see
    // getOrderedMeasureItems) rather than appending at the end like addNote.
    // Deliberately does NOT spill overflow into a following measure the way
    // addNote does — an insert always stays local to the measure it targets,
    // even if that pushes it over its beat capacity; the Score Preview
    // already surfaces an "Overflow!" warning for exactly this case.
    const insertNoteRelative = (
        measureId: string,
        anchorNoteId: string,
        position: 'before' | 'after',
        incoming: Partial<MusicNote>
    ) => {
        setMeasures(prev => prev.map(m => {
            if (m.id !== measureId) return m

            // Build the note the same way addNote does: normalize to arrays,
            // then compute whichever of pitch/tab-position is missing.
            let note: MusicNote = {
                id: uuid(),
                pitch: incoming.pitch ?? '',
                duration: incoming.duration ?? 'q',
                string: incoming.string,
                fret: incoming.fret,
            }
            if (!Array.isArray(note.pitch)) note.pitch = note.pitch ? [note.pitch] : []
            if (note.string != null && !Array.isArray(note.string)) note.string = [note.string]
            if (note.fret != null && !Array.isArray(note.fret)) note.fret = [note.fret]

            if (selectedInstrument !== 'drums' && note.pitch.length > 0 && (!note.string || !note.fret)) {
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
            if (selectedInstrument !== 'drums' && (!note.pitch || note.pitch.length === 0) && note.string && note.fret) {
                const pitches: string[] = []
                note.string.forEach((s, i) => {
                    let f = 0
                    if (Array.isArray(note.fret)) f = note.fret[i] ?? 0
                    else if (typeof note.fret === 'number') f = note.fret
                    pitches.push(computePitchFromTab(s, f, tuning))
                })
                note.pitch = pitches
            }

            const orderedItems = getOrderedMeasureItems(m)
            const anchorIdx = orderedItems.findIndex(entry => entry.type === 'note' && entry.item.id === anchorNoteId)
            if (anchorIdx === -1) return m // anchor note not found — no-op

            const insertAt = position === 'before' ? anchorIdx : anchorIdx + 1
            const newItems = [...orderedItems]
            newItems.splice(insertAt, 0, { type: 'note', item: note })

            // Reassign sequential order across everything so the new note's
            // position is reflected consistently for rendering/playback.
            // The inserted note isn't added to any beamGroups even if it's
            // an 8th/16th note — it'll render with its own flag; regrouping
            // surrounding beams around a mid-run insert is a follow-up.
            const notes: MusicNote[] = []
            const rests: MusicRest[] = []
            newItems.forEach((entry, i) => {
                if (entry.type === 'note') notes.push({ ...(entry.item as MusicNote), order: i })
                else rests.push({ ...(entry.item as MusicRest), order: i })
            })

            return { ...m, notes, rests }
        }))
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
                            if (selectedInstrument !== 'drums' && updated.pitch.length > 0 && (!updated.string || !updated.fret)) {
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
                            if (selectedInstrument !== 'drums' && (!updated.pitch || updated.pitch.length === 0) && updated.string && updated.fret) {
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
                selectedVoice,
                setSelectedVoice,
                metadata,
                updateMetadata,
                showArcs,
                setShowArcs,
                useAlternate,
                setUseAlternate,
                selectedGenre,
                setSelectedGenre,
                selectedTuning,
                setSelectedTuning,
                selectTuning,
                setStringCount,
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
                setExclusiveModifierOnSelection,
                tieGroups,
                toggleTieOnSelection,
                deleteSelectedNotes,
                insertNoteRelative,
                pendingNoteAction,
                setPendingNoteAction,
                measuresPerRow,
                setMeasuresPerRow,
                scoreFixedWidth,
                setScoreFixedWidth,
                noteSpacing,
                setNoteSpacing,
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
