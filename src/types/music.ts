export interface MusicNote {
    id: string
    pitch: string
    duration: string
    string?: number
    fret?: number
}

export interface MusicState {
    notes: MusicNote[]
    timeSignature: string
    tuning: string[]
    addNote: (note: Partial<MusicNote>) => void
    removeNote: (id: string) => void
    updateNote: (id: string, updates: Partial<MusicNote>) => void
}