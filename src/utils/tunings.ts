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
        {
            name: 'Open D',
            notes: ['D', 'A', 'D', 'F#', 'A', 'D'],
            description: 'Bright, resonant tuning for slide and folk',
            genre: 'Folk/Slide',
        },
        {
            name: 'Half Step Down',
            notes: ['Eb', 'Ab', 'Db', 'Gb', 'Bb', 'Eb'],
            description: 'Common in grunge and metal for heavier tone',
            genre: 'Rock/Metal',
        },
        {
            name: 'Open C',
            notes: ['C', 'G', 'C', 'G', 'C', 'E'],
            description: 'Massive, droning chords used in modern acoustic',
            genre: 'Acoustic/Experimental',
        },
    ],
    bass: [
        {
            name: 'Drop D',
            notes: ['D', 'A', 'D', 'G'],
            description: 'Used for heavier low-end riffs',
            genre: 'Rock/Metal',
        },
        {
            name: 'BEAD',
            notes: ['B', 'E', 'A', 'D'],
            description: 'Extended low range, common on 5-string basses',
            genre: 'Metal/Jazz',
        },
        {
            name: 'Tenor Bass',
            notes: ['A', 'D', 'G', 'C'],
            description: 'Higher register tuning, used in jazz',
            genre: 'Jazz',
        },
    ],
    violin: [
        {
            name: 'Cross Tuning',
            notes: ['G', 'D', 'G', 'D'],
            description: 'Used in Appalachian fiddle music',
            genre: 'Folk',
        },
        {
            name: 'Calico',
            notes: ['A', 'E', 'A', 'E'],
            description: 'Bright drone tuning for old-time fiddle',
            genre: 'Folk',
        },
        {
            name: 'AEAE',
            notes: ['A', 'E', 'A', 'E'],
            description: 'Common in Scandinavian and American fiddle traditions',
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
        {
            name: 'CGCG',
            notes: ['C', 'G', 'C', 'G'],
            description: 'Drone tuning for avant-garde and folk',
            genre: 'Experimental/Folk',
        },
        {
            name: 'Baroque Cello',
            notes: ['A', 'D', 'F', 'A'],
            description: 'Historical tuning used in early music ensembles',
            genre: 'Classical',
        },
    ],
}