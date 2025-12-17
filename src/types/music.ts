export interface MusicNote {
    id: string
    pitch: string | string[]
    string?: number | number[]
    fret?: number | number[]   // but always resolved to single values when building TabNote
    duration: string
}

export interface MusicRest {
    id: string
    duration: string
}

export interface Measure {
    id: string
    notes: MusicNote[]
    rests: MusicRest[]          // NEW
    timeSignature: string
    keySignature?: string       // NEW (optional, defaults to 'C')
    clef?: string               // NEW (optional, defaults to 'treble')
    beamGroups: string[][]     // NEW (array of arrays of note IDs to be beamed together)
}

export interface MusicState {
    measures: Measure[]
    tuning: string[]

    // Notes
    addNote: (measureId: string, note: Partial<MusicNote>) => void
    removeNote: (measureId: string, noteId: string) => void
    updateNote: (measureId: string, noteId: string, updates: Partial<MusicNote>) => void

    // Rests
    addRest: (measureId: string, rest: Partial<MusicRest>) => void
    removeRest: (measureId: string, restId: string) => void
    updateRest: (measureId: string, restId: string, updates: Partial<MusicRest>) => void

    // Measures
    addMeasure: (timeSignature?: string, keySignature?: string) => void
    removeMeasure: (measureId: string) => void
    updateMeasure: (measureId: string, updates: Partial<Measure>) => void

    // ✅ new helper
    getMeasureBeatCount: (measure: Measure) => number
}
