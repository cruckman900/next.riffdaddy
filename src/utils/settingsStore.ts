// src/utils/settingsStore.ts
//
// Single JSON-blob localStorage store for workspace/tool settings that aren't
// already handled elsewhere (theme persistence lives in ThemeContext). Every
// key is always present in the persisted object — even when unset — so
// consumers never have to guess at partial/missing shapes.

import type { Tuning } from './tunings'

export interface PersistedSettings {
    instrument: string
    genre: string
    tuningName: string | null
    // Octave-qualified notes actually used for pitch math (e.g. "E2").
    tuningNotes: string[] | null
    // Octave-less display notes matching selectedTuning.notes (e.g. "E"),
    // kept separate so a reload can reconstruct the exact selection shown in
    // the UI rather than just falling back to the instrument's default.
    tuningDisplayNotes: string[] | null
    customTunings: Tuning[]
    showArcs: boolean
    useAlternate: boolean
    measuresPerRow: number
    scoreFixedWidth: boolean
    // Extra pixels reserved per note/rest on top of VexFlow's own tight
    // minimum width (see computeMeasureLayoutWidths in
    // src/tools/notation.ts) — 0 is VexFlow's bare/tightly-packed minimum;
    // higher values add breathing room between notes without affecting
    // clef/time/key spacing or empty-measure width.
    noteSpacing: number
    // Playback tempo in BPM — persisted like the other score settings.
    tempo: number
    // Playback voice/timbre id (see src/tools/playback.ts's VoiceOption) —
    // null falls back to the current instrument's first voice.
    voice: string | null
}

export const DEFAULT_SETTINGS: PersistedSettings = {
    instrument: 'guitar',
    genre: 'All',
    tuningName: 'Standard',
    tuningNotes: null,
    tuningDisplayNotes: null,
    customTunings: [],
    showArcs: false,
    useAlternate: false,
    measuresPerRow: 4,
    scoreFixedWidth: false,
    noteSpacing: 18,
    tempo: 120,
    voice: null,
}

const STORAGE_KEY = 'nextriff.settings.v1'

export function loadSettings(): PersistedSettings {
    if (typeof window === 'undefined') return { ...DEFAULT_SETTINGS }
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY)
        if (!raw) return { ...DEFAULT_SETTINGS }
        const parsed = JSON.parse(raw)
        // Merge over defaults so every key is always present, even if the
        // stored blob predates a newly-added setting.
        return { ...DEFAULT_SETTINGS, ...parsed }
    } catch {
        return { ...DEFAULT_SETTINGS }
    }
}

export function saveSettings(settings: PersistedSettings) {
    if (typeof window === 'undefined') return
    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    } catch {
        // localStorage can throw in private-browsing/quota-exceeded cases —
        // settings just won't persist this time, not worth surfacing to the UI.
    }
}
