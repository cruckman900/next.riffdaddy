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

// A pointer to one specific note, used by tieGroups below — ties are tracked
// at the composition level (not per-measure) specifically so a tie can span
// across a barline into a different measure, not just connect notes within
// the same one.
export interface TieNoteRef {
    measureId: string
    noteId: string
}

// Optional descriptive info about the piece itself — Title, Artist, etc. —
// shown as a header above the printed/previewed score and editable via the
// Metadata tool (src/components/tools/MetadataTool.tsx). Every field is
// optional free text so an empty score never forces the user to fill
// anything in; `capo` is numeric (fret number, 0 = no capo).
export interface ScoreMetadata {
    title: string
    artist: string
    album: string
    composer: string
    year: string
    capo: number
    difficulty: string
    notes: string
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
    // Playback timbre for the selected instrument (e.g. guitar's "Overdrive"
    // vs "Acoustic (Nylon)") — see src/tools/playback.ts's VoiceOption/
    // getVoiceOptions. Per-tab like the rest of this snapshot.
    selectedVoice: string
    metadata: ScoreMetadata
    // Chains of tied notes, in chronological order within each chain — e.g.
    // [{measureId:'a',noteId:'1'}, {measureId:'b',noteId:'2'}] draws one tie
    // arc from measure a's note 1 into measure b's note 2. Lives here rather
    // than per-measure specifically so a tie can cross a barline. See
    // toggleTieOnSelection in MusicContext and buildTiesFromGroups in
    // src/tools/notation.ts.
    tieGroups: TieNoteRef[][]
}

// Set by the notation toolbar's Insert Before/After/Edit actions (see
// NotationToolbar.tsx) and consumed by FretboardTool/KeyboardTool: instead
// of their "Commit" button always appending a brand-new note, it instead
// updates or inserts relative to `noteId` and then clears this back to null.
export interface PendingNoteAction {
    mode: 'edit' | 'insert-before' | 'insert-after'
    measureId: string
    noteId: string
}

export interface MusicState {
    activeTool: string
    setActiveTool: (tool: string) => void

    selectedInstrument: string
    setSelectedInstrument: (instrument: string) => void
    // Cascading setter: updates selectedInstrument AND resets tuning/selectedTuning
    // to that instrument's default preset (fixes tuning/instrument desync).
    selectInstrument: (instrument: string) => void

    // Playback timbre for the current instrument (e.g. guitar's "Overdrive"
    // vs "Acoustic (Nylon)") — see src/tools/playback.ts's getVoiceOptions.
    selectedVoice: string
    setSelectedVoice: (voice: string) => void

    // Score metadata (Title/Artist/Album/etc.) — see ScoreMetadata. Merges
    // partial updates so each form field in the Metadata tool can update
    // independently without callers needing to spread the rest themselves.
    metadata: ScoreMetadata
    updateMetadata: (updates: Partial<ScoreMetadata>) => void

    selectedGenre: string
    setSelectedGenre: (genre: string) => void

    selectedTuning: Tuning
    setSelectedTuning: (t: Tuning) => void
    // Cascading setter: updates selectedTuning AND the flat `tuning` notes
    // array together so the fretboard/renderers actually reflect the change.
    selectTuning: (t: Tuning) => void

    // Adjusts the current tuning to a different string count (e.g. 6 -> 7
    // string guitar) by extending/trimming from the low string, cascading
    // into `tuning` the same way selectTuning does. Needed because the
    // Instrument panel's Strings dropdown previously had no effect at all.
    setStringCount: (count: number) => void

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

    // Sets (or clears, when reselecting the currently-active option) a
    // mutually-exclusive modifier variant on every selected note — e.g. only
    // one Bend amount (1/4, 1/2, Full, …) can be active on a note at once.
    // `groupIds` is every id in that family, so switching variants correctly
    // removes whichever one was previously applied before adding the new one.
    setExclusiveModifierOnSelection: (groupIds: string[], modifierId: string) => void

    // Chains of tied notes across the whole composition (not scoped to one
    // measure — see TieNoteRef) — read by the renderers to draw tie arcs.
    tieGroups: TieNoteRef[][]

    // Ties (or unties) every currently-selected note together, in true
    // chronological order across the whole composition (not just within one
    // measure) — a no-op if fewer than 2 notes are selected. A tie only
    // actually renders where both of its endpoints land in the same printed
    // row — see buildTiesFromGroups in src/tools/notation.ts.
    toggleTieOnSelection: () => void

    // Deletes every currently-selected note and clears the selection — the
    // notation toolbar's Delete action.
    deleteSelectedNotes: () => void

    // Inserts a brand-new note immediately before/after an existing one
    // within the same measure (not appended at the end like addNote) — the
    // notation toolbar's Insert Before/Insert After actions, fulfilled by
    // whichever input tool (Fretboard/Keyboard) the user commits a note
    // from next while `pendingNoteAction` is set.
    insertNoteRelative: (measureId: string, noteId: string, position: 'before' | 'after', note: Partial<MusicNote>) => void

    // See PendingNoteAction — sets which note (if any) the next Fretboard/
    // Keyboard "Commit" should edit or insert relative to, instead of its
    // default behavior of appending a new note.
    pendingNoteAction: PendingNoteAction | null
    setPendingNoteAction: (action: PendingNoteAction | null) => void

    // Score Settings
    measuresPerRow: number
    setMeasuresPerRow: (count: number) => void
    scoreFixedWidth: boolean
    setScoreFixedWidth: (fixed: boolean) => void
    // Extra pixels reserved per note/rest on top of VexFlow's own tight
    // minimum width — see computeMeasureLayoutWidths in
    // src/tools/notation.ts for what exactly it affects (and what it
    // deliberately doesn't).
    noteSpacing: number
    setNoteSpacing: (spacing: number) => void

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
