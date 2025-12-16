export interface MusicNote {
    id: string
    pitch: string
    duration: string
    string?: number
    fret?: number
}

export interface Measure {
    id: string
    notes: MusicNote[]
    timeSignature: string
}

export interface MusicState {
    measures: Measure[]
    tuning: string[]
    addNote: (measureId: string, note: Partial<MusicNote>) => void
    removeNote: (measureId: string, noteId: string) => void
    updateNote: (measureId: string, noteId: string, updates: Partial<MusicNote>) => void
    addMeasure: (timeSignature?: string) => void
}
