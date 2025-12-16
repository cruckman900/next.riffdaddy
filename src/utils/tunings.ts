// utils/tuningPresets.ts

export type TuningPreset = string[];

export const noteIndexMap: Record<string, number> = {
    C: 0,
    'C#': 1,
    Db: 1,
    D: 2,
    'D#': 3,
    Eb: 3,
    E: 4,
    F: 5,
    'F#': 6,
    Gb: 6,
    G: 7,
    'G#': 8,
    Ab: 8,
    A: 9,
    'A#': 10,
    Bb: 10,
    B: 11,
}

export const tuningPresets: { [instrument: string]: TuningPreset } = {
    guitar: ['E', 'A', 'D', 'G', 'B', 'E'],
    bass: ['E', 'A', 'D', 'G'],
    violin: ['G', 'D', 'A', 'E'],
    cello: ['C', 'G', 'D', 'A'],
};

export interface Tuning {
    name: string;
    notes: string[];
    description?: string;
    genre?: string;
}

export const alternateTunings: { [instrument: string]: Tuning[] } = {
    guitar: [
        {
            name: 'Drop D',
            notes: ['D', 'A', 'D', 'G', 'B', 'E'],
            description: 'Popular in rock and metal for power chords',
            genre: 'Rock/Metal',
        },
        {
            name: 'Open G',
            notes: ['D', 'G', 'D', 'G', 'B', 'D'],
            description: 'Used in blues and slide guitar',
            genre: 'Blues',
        },
        {
            name: 'DADGAD',
            notes: ['D', 'A', 'D', 'G', 'A', 'D'],
            description: 'Celtic and fingerstyle favorite',
            genre: 'Celtic/Fingerstyle',
        },
    ],
    bass: [
        {
            name: 'Drop D',
            notes: ['D', 'A', 'D', 'G'],
            description: 'Used for heavier low-end riffs',
            genre: 'Rock/Metal',
        },
    ],
    violin: [
        {
            name: 'Cross Tuning',
            notes: ['G', 'D', 'G', 'D'],
            description: 'Used in Appalachian fiddle music',
            genre: 'Folk',
        },
    ],
    cello: [
        {
            name: 'Power Fifths',
            notes: ['C', 'G', 'C', 'G'],
            description: 'Simplified tuning for drone harmonics',
            genre: 'Experimental',
        },
    ],
};