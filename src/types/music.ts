import { Tuning } from '@/utils/tunings'

export interface MusicNote {
    id: string
    pitch: string | string[]
    string?: number | number[]
    fret?: number | number[]   // but always resolved to single values when building TabNote
    duration: string
    // IDs from NOTE_MODIFIERS (src/tools/noteModifiers.ts) — articulations,
    // ornaments, dotted-note augmentation, and single-note techniques applied
    // via the notation toolbar when one or more notes are selected.
    modifiers?: string[]
    // Chronological insertion order within the measure, shared with rests
    // (see MusicRest.order) — notes and rests live in separate arrays, so
    // this is what lets playback (and getOrderedMeasureItems) reconstruct
    // the true left-to-right sequence instead of always playing notes
    // before rests. Optional/undefined for legacy data.
    order?: number
}

export interface MusicRest {
    id: string
    duration: string
    // See MusicNote.order.
    order?: number
}

export interface Measure {
    id: string
    notes: MusicNote[]
    rests: MusicRest[]          // NEW
    clef?: string               // NEW (optional, defaults to 'treble')
    timeSignature: string
    keySignature?: string       // NEW (optional, defaults to 'C')
    beamGroups: string[][]     // NEW (array of arrays of note IDs to be beamed together)
}

// Everything that's independent per open workspace tab (as opposed to
// global display/layout preferences like measuresPerRow, which live in
// settingsStore and apply regardless of which tab is active). This is the
// shape saved to/loaded from the backend for a given tab.
export interface CompositionSnapshot {
    measures: Measure[]
    selectedInstrument: string
    selectedGenre: string
    selectedTuning: Tuning
    tuning: string[]
    tempo: number
    selectedNoteRefs: { measureId: string; noteId: string }[]
}

export interface MusicState {
    activeTool: string
    setActiveTool: (tool: string) => void

    selectedInstrument: string
    setSelectedInstrument: (instrument: string) => void
    // Cascading setter: updates selectedInstrument AND resets tuning/selectedTuning
    // to that instrument's default preset (fixes tuning/instrument desync).
    selectInstrument: (instrument: string) => void

    selectedGenre: string
    setSelectedGenre: (genre: string) => void

    selectedTuning: Tuning
    setSelectedTuning: (t: Tuning) => void
    // Cascading setter: updates selectedTuning AND the flat `tuning` notes
    // array together so the fretboard/renderers actually reflect the change.
    selectTuning: (t: Tuning) => void

    showArcs: boolean
    setShowArcs: (s: boolean) => void

    useAlternate: boolean
    setUseAlternate: (s: boolean) => void

    customTunings: Tuning[]
    addCustomTuning: (t: Tuning) => void

    measures: Measure[]
    tuning: string[]
    setTuning: (notes: string[]) => void

    // Note selection + notation modifiers (accents, ornaments, dotted notes,
    // techniques) — drives the contextual notation toolbar in Score Preview.
    selectedNoteRefs: { measureId: string; noteId: string }[]
    toggleNoteSelection: (measureId: string, noteId: string) => void
    clearNoteSelection: () => void
    toggleModifierOnSelection: (modifierId: string) => void

    // Score Settings
    measuresPerRow: number
    setMeasuresPerRow: (count: number) => void
    scoreFixedWidth: boolean
    setScoreFixedWidth: (fixed: boolean) => void

    // Playback tempo (BPM), persisted like the other score settings.
    tempo: number
    setTempo: (bpm: number) => void

    // Notes
    addNote: (measureId: string, note: Partial<MusicNote>) => void
    removeNote: (measureId: string, noteId: string) => void
    updateNote: (measureId: string, noteId: string, updates: Partial<MusicNote>) => void

    // Rests
    addRest: (measureId: string, rest: Partial<MusicRest>) => void
    removeRest: (measureId: string, restId: string) => void
    updateRest: (measureId: string, restId: string, updates: Partial<MusicRest>) => void

    // Measures
    addMeasure: (clef?: string, timeSignature?: string, keySignature?: string) => void
    removeMeasure: (measureId: string) => void
    updateMeasure: (measureId: string, updates: Partial<Measure>) => void

    // ✅ new helper
    getMeasureBeatCount: (measure: Measure) => number

    // Loads a full composition snapshot into a specific workspace tab (used
    // by "Open"/Load — see the backend tab-storage integration). If that
    // tab happens to be the active one, the change is applied immediately;
    // otherwise it's stashed and picked up automatically the moment the
    // user switches to it.
    loadComposition: (tabId: string, data: CompositionSnapshot) => void
}
