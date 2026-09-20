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

// Octave-qualified defaults (e.g. "E2") used as a reference point when a
// preset/custom tuning only supplies octave-less note names (e.g. "E").
// FretboardTool and the renderers need octave-qualified notes to compute
// MIDI/pitch values, but tuning presets and the custom-tuning form only deal
// in plain note names, so we resolve a sensible octave per string here.
export const defaultTuningWithOctaves: { [instrument: string]: string[] } = {
    guitar: ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'],
    bass: ['E1', 'A1', 'D2', 'G2'],
    violin: ['G3', 'D4', 'A4', 'E5'],
    cello: ['C2', 'G2', 'D3', 'A3'],
}

function parseNoteOctave(value: string): { name: string; octave: number } | null {
    const match = value.match(/^([A-G][#b]?)(\d+)$/)
    if (!match) return null
    return { name: match[1], octave: parseInt(match[2], 10) }
}

/**
 * Resolves a list of octave-less (or already-qualified) note names into
 * octave-qualified strings (e.g. "E" -> "E2"), by picking whichever octave
 * keeps each string's pitch closest to the instrument's default tuning at
 * that string position. This keeps alternate tunings like Drop D or Open G
 * sensible without requiring users to type octave numbers.
 */
export function resolveTuningOctaves(instrument: string, noteNames: string[]): string[] {
    // Already octave-qualified (e.g. custom tuning typed as "E2, A2, ...")? Pass through.
    if (noteNames.length > 0 && noteNames.every(n => /\d$/.test(n.trim()))) {
        return noteNames.map(n => n.trim())
    }

    const defaults = defaultTuningWithOctaves[instrument] ?? defaultTuningWithOctaves.guitar

    return noteNames.map((rawName, i) => {
        const name = rawName.trim()
        const defaultStr = defaults[i] ?? defaults[defaults.length - 1]
        const parsedDefault = parseNoteOctave(defaultStr)
        const defaultOctave = parsedDefault?.octave ?? 3
        const defaultSemitone = noteIndexMap[parsedDefault?.name ?? 'E'] ?? 4
        const defaultMidi = defaultOctave * 12 + defaultSemitone

        const targetSemitone = noteIndexMap[name] ?? 0

        let bestOctave = defaultOctave
        let bestDistance = Infinity
        for (const octave of [defaultOctave - 1, defaultOctave, defaultOctave + 1]) {
            const midi = octave * 12 + targetSemitone
            const distance = Math.abs(midi - defaultMidi)
            if (distance < bestDistance) {
                bestDistance = distance
                bestOctave = octave
            }
        }

        return `${name}${bestOctave}`
    })
}

const CHROMATIC_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

/**
 * Adjusts a tuning's string count by extending/trimming from the low string
 * — e.g. going from 6 to 7 strings adds a low B a perfect fourth (5
 * semitones) below the current lowest string, matching how real
 * extended-range guitars/basses are actually tuned (a 7-string's low B sits
 * a fourth below standard low E; a 5-string bass's low B sits a fourth below
 * standard low E, etc). Trimming removes strings from the low end the same
 * way. This gives every instrument+string-count combination a sensible
 * default without needing a hand-authored preset for every possible count —
 * players who want something more specific can still use "Add Custom Tuning".
 */
export function resolveStringCount(baseNotes: string[], targetCount: number): string[] {
    if (targetCount <= 0 || baseNotes.length === 0) return baseNotes
    let notes = [...baseNotes]
    while (notes.length < targetCount) {
        const lowestSemitone = noteIndexMap[notes[0]] ?? 4
        const nextSemitone = ((lowestSemitone - 5) % 12 + 12) % 12
        notes = [CHROMATIC_NAMES[nextSemitone], ...notes]
    }
    while (notes.length > targetCount) {
        notes = notes.slice(1)
    }
    return notes
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