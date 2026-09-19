// src/tools/duration.ts
//
// Single source of truth for VexFlow-style duration-string <-> beat-count
// conversion, and for reconstructing the true chronological order of a
// measure's notes and rests. Used by MusicContext (measure-filling logic),
// notation.ts (rendering), and playback.ts (audio scheduling) so all three
// agree on timing.

import { Measure, MusicNote, MusicRest } from '@/types/music'

export function durationToBeats(duration: string): number {
    switch (duration.replace('r', '')) {
        case 'w': return 4
        case 'h': return 2
        case 'q': return 1
        case '8': return 0.5
        case '16': return 0.25
        case '32': return 0.125
        case '64': return 0.0625
        default: return 1
    }
}

export function getMeasureBeatCount(measure: Measure): number {
    return measure.notes.reduce((sum, n) => sum + durationToBeats(n.duration), 0) +
        measure.rests.reduce((sum, r) => sum + durationToBeats(r.duration), 0)
}

export interface OrderedMeasureItem {
    type: 'note' | 'rest'
    item: MusicNote | MusicRest
}

/**
 * Notes and rests are stored in separate arrays (see MusicNote.order for
 * why), so this merges and sorts them back into the order they were
 * actually inserted in. Items without an `order` (legacy data created
 * before this field existed) sort as if they were notes-then-rests, in
 * their original array order — i.e. exactly the old behavior — so nothing
 * that already worked changes for existing tabs.
 */
export function getOrderedMeasureItems(measure: Measure): OrderedMeasureItem[] {
    const notes = measure.notes.map((item, i) => ({ type: 'note' as const, item, fallback: i }))
    const rests = measure.rests.map((item, i) => ({ type: 'rest' as const, item, fallback: measure.notes.length + i }))
    return [...notes, ...rests]
        .sort((a, b) => (a.item.order ?? a.fallback) - (b.item.order ?? b.fallback))
        .map(({ type, item }) => ({ type, item }))
}
