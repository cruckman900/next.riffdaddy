// src/utils/drumKits.ts
//
// Data model for the Drums instrument: which pieces exist, what MIDI note
// each one maps to for playback (General MIDI Percussion Key Map, played
// through soundfont-player's 'percussion' instrument), and where each piece
// sits on a percussion staff for notation (a standard-ish convention shared
// by most notation software — position via a treble-clef-equivalent key,
// notehead via VexFlow's glyph-code suffix, e.g. "x2" for an "x" notehead).

export type DrumPieceId =
    | 'kick'
    | 'snare'
    | 'floor2'
    | 'floor1'
    | 'rack3'
    | 'rack2'
    | 'rack1'
    | 'hihat_closed'
    | 'hihat_open'
    | 'hihat_pedal'
    | 'ride'
    | 'crash'
    | 'china'

export interface DrumPieceDef {
    id: DrumPieceId
    label: string
    // General MIDI Percussion Key Map note number — soundfont-player's
    // `percussion` instrument maps each of these to a distinct real sample.
    midi: number
    // VexFlow StaveNote key (letter/octave), percussion-clef position.
    notationKey: string
    // VexFlow notehead glyph code (see Tables.codeNoteHead) — omitted for a
    // plain/normal notehead (drums/toms), 'x2' for a filled "x" (cymbals,
    // hi-hat), 'x3' for a circled "x" (the standard "open" symbol).
    notehead?: string
}

export const DRUM_PIECES: Record<DrumPieceId, DrumPieceDef> = {
    kick: { id: 'kick', label: 'Kick', midi: 36, notationKey: 'f/4' },
    floor2: { id: 'floor2', label: 'Floor Tom 2', midi: 41, notationKey: 'g/4' },
    floor1: { id: 'floor1', label: 'Floor Tom', midi: 45, notationKey: 'a/4' },
    snare: { id: 'snare', label: 'Snare', midi: 38, notationKey: 'b/4' },
    rack3: { id: 'rack3', label: 'Low Rack Tom', midi: 47, notationKey: 'c/5' },
    rack2: { id: 'rack2', label: 'Mid Rack Tom', midi: 48, notationKey: 'd/5' },
    rack1: { id: 'rack1', label: 'High Rack Tom', midi: 50, notationKey: 'e/5' },
    hihat_closed: { id: 'hihat_closed', label: 'Hi-Hat (Closed)', midi: 42, notationKey: 'f/5', notehead: 'x2' },
    hihat_open: { id: 'hihat_open', label: 'Hi-Hat (Open)', midi: 46, notationKey: 'f/5', notehead: 'x3' },
    hihat_pedal: { id: 'hihat_pedal', label: 'Hi-Hat (Pedal)', midi: 44, notationKey: 'd/4', notehead: 'x2' },
    ride: { id: 'ride', label: 'Ride', midi: 51, notationKey: 'g/5', notehead: 'x2' },
    crash: { id: 'crash', label: 'Crash', midi: 49, notationKey: 'a/5', notehead: 'x2' },
    china: { id: 'china', label: 'China', midi: 52, notationKey: 'b/5', notehead: 'x2' },
}

// Pieces always present regardless of kit size — hi-hat and the two most
// common cymbals aren't counted in a kit's "N-piece" number in real-world
// drum kit naming (that number only counts drums: kick/snare/toms). Listed
// first here specifically so they consistently anchor the left side of the
// Drum Input tool's pad layout across every kit size.
const ALWAYS_ON: DrumPieceId[] = ['kick', 'snare', 'hihat_closed', 'hihat_open', 'crash', 'ride']

// The extra toms each larger kit size adds on top of ALWAYS_ON.
const TOM_ADDITIONS: Record<number, DrumPieceId[]> = {
    4: ['rack2', 'floor1'],
    5: ['rack1', 'rack2', 'floor1'],
    6: ['rack1', 'rack2', 'floor1', 'floor2'],
    7: ['rack1', 'rack2', 'rack3', 'floor1', 'floor2'],
    8: ['rack1', 'rack2', 'rack3', 'floor1', 'floor2', 'hihat_pedal'],
}

// Real-world standard kit configurations by piece (drum) count. Order here
// also drives the visual left-to-right layout in the Drum Input tool and is
// used as the positional "piece index" (like a tuning's string order).
export const DRUM_KIT_SIZES: Record<number, DrumPieceId[]> = Object.fromEntries(
    Object.entries(TOM_ADDITIONS).map(([count, extras]) => [count, [...ALWAYS_ON, ...extras]])
)

export const DRUM_KIT_PIECE_COUNTS = Object.keys(DRUM_KIT_SIZES).map(Number).sort((a, b) => a - b)

export function getKitPieces(pieceCount: number): DrumPieceId[] {
    return DRUM_KIT_SIZES[pieceCount] ?? DRUM_KIT_SIZES[5]
}

// Reverse of getKitPieces — needed because a kit's actual piece array
// (tuning.length) always includes the always-on hi-hat/crash/ride on top of
// its "N-piece" drum count, so the Pieces dropdown can't just display
// tuning.length directly (5-piece Standard is 9 total array entries, not 5).
// Finds the largest kit-size preset that's fully contained in the current
// piece list, so a Kit Style preset with an extra cymbal on top (e.g.
// Metal's china) still reports the right underlying size.
export function getKitSizeForPieces(pieces: DrumPieceId[]): number {
    const pieceSet = new Set(pieces)
    let best = DRUM_KIT_PIECE_COUNTS[0]
    for (const count of DRUM_KIT_PIECE_COUNTS) {
        if (DRUM_KIT_SIZES[count].every(p => pieceSet.has(p))) best = count
    }
    return best
}

// "Bass" (replaces Frets for drums) — 1 or 2 kick pedals. A second pedal
// doesn't add a new piece (there's still one kick drum) so much as unlock
// double-kick/blast-beat notation — surfaced to the Drum Input tool so it
// can label the kick control accordingly, rather than a new DRUM_PIECES entry.
export const DRUM_BASS_COUNTS = [1, 2]

// "Kit Style" reuses the Tuning selector slot in Cockpit — instead of pitch
// names, `notes` holds DrumPieceId strings in the same positional/"string
// index" role a real tuning's note names play (see resolveTuningOctaves and
// setStringCount in MusicContext, both special-cased to skip drums).
export interface DrumKitStyle {
    name: string
    pieces: DrumPieceId[]
    description: string
    genre?: string
}

export const DRUM_KIT_STYLE_PRESETS: DrumKitStyle[] = [
    {
        name: 'Standard',
        pieces: getKitPieces(5),
        description: 'A classic 5-piece rock/pop kit — kick, snare, 2 rack toms, floor tom.',
    },
    {
        name: 'Jazz',
        pieces: ['kick', 'snare', 'rack1', 'floor1', 'hihat_closed', 'hihat_open', 'ride'],
        description: 'Smaller kit leaning on the ride cymbal instead of a crash-heavy setup.',
        genre: 'Jazz',
    },
    {
        name: 'Metal (Double Bass)',
        pieces: [...getKitPieces(7), 'china'],
        description: 'A big 7-piece kit plus a china cymbal, built for double bass and blast beats.',
        genre: 'Rock/Metal',
    },
]
