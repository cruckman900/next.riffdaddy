// src/tools/notation.ts
//
// Shared VexFlow tickable builders + real content-driven measure width
// calculation, used identically by TabRenderer, StaffRenderer, and
// CombinedRenderer so all three lay measures out the same way (and, in
// Combined view, so a measure's tab and staff staves always share one width).

import { Measure, MusicNote, MusicRest, TieNoteRef } from '@/types/music'
import { TabNote, StaveNote, Voice, Formatter, Beam, TabStave, Stave, CanvasContext, StaveTie, TabTie } from 'vexflow'
import { applyNoteModifiers } from './noteModifiers'
import { getOrderedMeasureItems } from './duration'
import { DRUM_PIECES, DrumPieceId } from '@/utils/drumKits'

export function parseTimeSignature(ts?: string) {
    const [beats, value] = ts?.split('/')?.map(Number) ?? []
    return { numBeats: beats || 4, beatValue: value || 4 }
}

export function formatPitch(pitch: string): string {
    const match = pitch?.match(/^([A-Ga-g])([#b]?)(\d)$/)
    return match ? `${match[1].toLowerCase()}${match[2]}/${match[3]}` : 'b/4'
}

function noteFretPositions(n: MusicNote) {
    return Array.isArray(n.string)
        ? n.string.map((s, i) => {
            let fretValue: number | string = 0
            if (Array.isArray(n.fret)) {
                fretValue = n.fret[i] ?? 0
            } else if (typeof n.fret === 'number' || typeof n.fret === 'string') {
                fretValue = n.fret
            }
            return { str: s, fret: fretValue }
        })
        : [
            {
                str: n.string ?? 1,
                fret: typeof n.fret === 'number' || typeof n.fret === 'string' ? n.fret : 0,
            },
        ]
}

// TAB view intentionally only renders notes (no rest glyphs), matching the
// existing tab notation convention.
export function buildTabTickables(measure: Measure): TabNote[] {
    return measure.notes.map(n => {
        const vexNote = new TabNote({
            positions: noteFretPositions(n),
            duration: n.duration || 'q',
        })
        applyNoteModifiers(vexNote, n.modifiers)
        return vexNote
    })
}

// Standard staff notation renders both notes and rests, in the true
// chronological order they were added (see getOrderedMeasureItems) rather
// than always drawing every rest after every note.
export function buildStaffTickables(measure: Measure): StaveNote[] {
    return getOrderedMeasureItems(measure).map(({ type, item }) => {
        if (type === 'note') {
            const n = item as MusicNote
            const vexNote = new StaveNote({
                keys: Array.isArray(n.pitch) ? n.pitch.map(formatPitch) : [formatPitch(n.pitch)],
                duration: n.duration || 'q',
            })
            applyNoteModifiers(vexNote, n.modifiers)
            return vexNote
        }
        const r = item as MusicRest
        return new StaveNote({ keys: ['b/4'], duration: (r.duration || 'q') + 'r' })
    })
}

// For a drum note, `pitch` holds one or more DrumPieceId strings (not a real
// pitch — see DRUM_PIECES in utils/drumKits.ts) identifying which piece(s)
// were hit together. This builds the VexFlow key format VexFlow expects
// ("letter/octave" plus an optional "/glyph-code" for a non-default
// notehead, e.g. "f/5/x2" for an x-notehead hi-hat) directly from each
// piece's predefined staff position, instead of formatPitch's real-note
// parsing (which would just fail on a piece id like "kick").
function formatDrumKey(pieceId: string): string {
    const piece = DRUM_PIECES[pieceId as DrumPieceId]
    if (!piece) return 'b/4'
    return piece.notehead ? `${piece.notationKey}/${piece.notehead}` : piece.notationKey
}

// Percussion-staff equivalent of buildStaffTickables — same chronological
// note+rest ordering, just resolving keys through formatDrumKey instead of
// formatPitch. Drums have no TAB view, so there's no drum equivalent of
// buildTabTickables.
export function buildDrumStaffTickables(measure: Measure): StaveNote[] {
    return getOrderedMeasureItems(measure).map(({ type, item }) => {
        if (type === 'note') {
            const n = item as MusicNote
            const vexNote = new StaveNote({
                keys: Array.isArray(n.pitch) ? n.pitch.map(formatDrumKey) : [formatDrumKey(n.pitch)],
                duration: n.duration || 'q',
            })
            applyNoteModifiers(vexNote, n.modifiers)
            return vexNote
        }
        const r = item as MusicRest
        return new StaveNote({ keys: ['b/4'], duration: (r.duration || 'q') + 'r' })
    })
}

/**
 * Maps each MusicNote id to its index within a tab tickables array (which is
 * always a 1:1, in-order mirror of measure.notes).
 */
export function buildTabNoteIndex(measure: Measure): Map<string, number> {
    const map = new Map<string, number>()
    measure.notes.forEach((n, i) => map.set(n.id, i))
    return map
}

/**
 * Maps each MusicNote id to its index within a staff tickables array — which
 * interleaves notes and rests in chronological order (see
 * getOrderedMeasureItems), so this can't just mirror measure.notes directly
 * the way the tab index can.
 */
export function buildStaffNoteIndex(measure: Measure): Map<string, number> {
    const map = new Map<string, number>()
    getOrderedMeasureItems(measure).forEach((entry, i) => {
        if (entry.type === 'note') map.set(entry.item.id, i)
    })
    return map
}

/**
 * Builds explicit Beam objects from measure.beamGroups (the runs of
 * consecutive 8th/16th notes tracked as notes are added — see
 * MusicContext.addNote) instead of relying on VexFlow's
 * `Beam.generateBeams(tickables)`, which auto-groups purely by duration and
 * ignores any notion of "this run of notes was added together." That
 * mismatch was the cause of flags not disappearing correctly as flagged
 * notes were added one at a time — generateBeams' own grouping heuristic
 * doesn't necessarily agree with beamGroups, so the two fought each other.
 * Groups with fewer than 2 resolvable notes are skipped (a lone flagged
 * note, or a group whose notes were since deleted) and simply render with
 * their individual flags, which is correct VexFlow behavior.
 */
export function buildBeamsFromGroups(
    measure: Measure,
    tickables: (TabNote | StaveNote)[],
    noteIdToIndex: Map<string, number>
): Beam[] {
    const beams: Beam[] = []
    for (const group of measure.beamGroups) {
        const groupTickables = group
            .map(id => noteIdToIndex.get(id))
            .filter((i): i is number => i !== undefined)
            .map(i => tickables[i])
            .filter((t): t is TabNote | StaveNote => !!t)

        if (groupTickables.length < 2) continue

        try {
            beams.push(new Beam(groupTickables))
        } catch (err) {
            console.warn('NEXTRiff: failed to build a beam group', err)
        }
    }
    return beams
}

/**
 * Key format shared by addToRowNoteLookup/buildTiesFromGroups: a note is
 * uniquely identified across the whole composition by its measure + note id
 * together (note ids are only unique within their own measure).
 */
function tieKey(ref: TieNoteRef): string {
    return `${ref.measureId}:${ref.noteId}`
}

/**
 * Adds every note in one measure's already-built tickables to a shared
 * lookup Map, keyed by tieKey — renderers call this once per measure while
 * building a printed row, so the row ends up with a combined lookup letting
 * buildTiesFromGroups resolve a tie's endpoints even when they land in two
 * different (but same-row) measures.
 */
export function addToRowNoteLookup(
    lookup: Map<string, TabNote | StaveNote>,
    measure: Measure,
    tickables: (TabNote | StaveNote)[],
    noteIdToIndex: Map<string, number>
) {
    noteIdToIndex.forEach((idx, noteId) => {
        const tickable = tickables[idx]
        if (tickable) lookup.set(tieKey({ measureId: measure.id, noteId }), tickable)
    })
}

/**
 * Builds StaveTie (staff notation) or TabTie (tab notation) objects from the
 * composition-level tieGroups (see TieNoteRef) — each group is a
 * chronologically-ordered chain of {measureId, noteId} refs, rendered as a
 * chain of pairwise ties (a group of 3 notes draws 2 arcs: note1→note2 and
 * note2→note3), matching how a real tie chain looks in standard notation.
 * Because a chain can cross a barline into a different measure, `noteLookup`
 * must be built from every measure sharing this row (see
 * addToRowNoteLookup) — a tie whose two endpoints end up on different
 * printed rows (i.e. the measures wrapped onto separate lines) simply isn't
 * drawn for that segment, the same graceful degradation as an unresolvable
 * note id. Unlike beams, ties are pure Element instances that don't need to
 * exist before voice.draw() — they're drawn as a separate pass afterwards,
 * same as it works in VexFlow's own examples.
 */
export function buildTiesFromGroups(
    tieGroups: TieNoteRef[][],
    noteLookup: Map<string, TabNote | StaveNote>,
    variant: 'tab' | 'staff'
): (StaveTie | TabTie)[] {
    const TieClass = variant === 'tab' ? TabTie : StaveTie
    const ties: (StaveTie | TabTie)[] = []
    for (const group of tieGroups) {
        for (let i = 0; i < group.length - 1; i++) {
            const firstNote = noteLookup.get(tieKey(group[i]))
            const lastNote = noteLookup.get(tieKey(group[i + 1]))
            if (!firstNote || !lastNote) continue

            try {
                ties.push(new TieClass({ firstNote, lastNote }))
            } catch (err) {
                console.warn('NEXTRiff: failed to build a tie', err)
            }
        }
    }
    return ties
}

// Lazily-created, never-attached-to-the-DOM 2D canvas context, reused for
// every modifier-width measurement below. VexFlow's Stave.format() needs a
// real RenderContext to measure text-based glyphs (time signature digits,
// key signature accidentals) — without one, getNoteStartX() silently
// degrades to a tiny fixed fallback offset instead of the real width these
// modifiers need, which is what caused notes to overflow past a measure's
// own barline for anything beyond a bare treble/tab clef + 4/4 + no
// accidentals. A plain in-memory canvas 2D context (never appended to the
// document) is enough for accurate text metrics — no visible/attached
// canvas or SVG element required.
let measurementContext: CanvasContext | null = null
function getMeasurementContext(): CanvasContext | null {
    if (typeof document === 'undefined') return null // SSR guard
    if (!measurementContext) {
        const ctx2d = document.createElement('canvas').getContext('2d')
        if (!ctx2d) return null
        measurementContext = new CanvasContext(ctx2d)
    }
    return measurementContext
}

export const MEASURE_PADDING = 10

// Was 100 — but VexFlow's real preCalculateMinTotalWidth() for a handful of
// notes (a few quarter notes, say ~9-35px raw) is small, so a 100px floor
// silently clamped almost every lightly-filled measure to the exact same
// width, making measures look like they never resized as notes were added.
// This floor now only exists to keep a genuinely empty measure from
// collapsing to near-zero width; anything with real content quickly grows
// past it and reflects actual note density.
const MIN_MEASURE_WIDTH = 24

function minVoiceWidth(tickables: (TabNote | StaveNote)[], numBeats: number, beatValue: number, extraPerNote: number): number {
    if (!tickables.length) return 0
    const voice = new Voice({ numBeats, beatValue }).setStrict(false)
    voice.addTickables(tickables)
    const formatter = new Formatter()
    formatter.joinVoices([voice])
    const raw = formatter.preCalculateMinTotalWidth([voice])
    // VexFlow's own minimum is genuinely tight (packed edge-to-edge with
    // just enough room for the glyphs themselves) — a *multiplicative*
    // scale on that tiny base barely moves the needle for a handful of
    // notes (e.g. 1.5x of ~30px is still only ~45px total, spread across 4
    // notes). Adding a fixed amount PER NOTE instead gives visible, roughly
    // constant breathing room between notes regardless of how few or many
    // there are in the measure.
    return raw + tickables.length * extraPerNote
}

// Extra width to reserve for whatever clef/time/key signature a measure
// would draw if it ends up first-in-row (row membership isn't known yet
// when measures are first sized, so — like MODIFIER_ALLOWANCE before it —
// this is applied to every measure rather than only ones that end up
// first-in-row: a little generous for the rest, but safe against ever
// under-sizing and clipping notation).
//
// This used to be a flat guess (60px) applied uniformly, which was fine for
// a bare treble/tab clef + 4/4 + C (no accidentals), but silently ran out
// of room for anything busier — e.g. a key signature with several sharps/
// flats needs meaningfully more horizontal space than one with none, and a
// flat guess can't know that. Instead, a throwaway Stave/TabStave is asked
// to actually lay out the exact same clef/time/key this measure would draw
// (using the in-memory measurement context above for accurate glyph
// metrics), and we read back how much space it really consumed. A modest
// fixed safety margin is added on top since this scratch measurement can
// run before web fonts (Bravura/Academico) have fully finished loading,
// giving a slightly smaller number than the real render (which happens
// later, by which point fonts are ready) — better to reserve a little extra
// than let a note clip past the barline again.
const MODIFIER_SAFETY_MARGIN = 20
function measureModifierWidth(measure: Measure, mode: ScoreViewMode): number {
    const ctx = getMeasurementContext()
    const scratchWidth = (isTab: boolean) => {
        const stave = isTab ? new TabStave(0, 0, 400) : new Stave(0, 0, 400)
        if (ctx) stave.setContext(ctx)
        if (measure.clef) stave.addClef(isTab ? 'tab' : measure.clef)
        if (measure.timeSignature) stave.addTimeSignature(measure.timeSignature)
        if (measure.keySignature) stave.addKeySignature(measure.keySignature)
        return stave.getNoteStartX() - stave.getX()
    }

    let allowance = 0
    if (mode === 'tab' || mode === 'combined') allowance = Math.max(allowance, scratchWidth(true))
    if (mode === 'staff' || mode === 'combined' || mode === 'drum-staff') allowance = Math.max(allowance, scratchWidth(false))
    return allowance + MODIFIER_SAFETY_MARGIN
}

export type ScoreViewMode = 'tab' | 'staff' | 'combined' | 'drum-staff'

/**
 * Computes each measure's real rendered width from its actual note content
 * (via VexFlow's own minimum-width calculation) instead of a rough linear
 * beat-count heuristic — a measure full of 8th notes now genuinely comes out
 * wider than one with the same beat count of quarter notes, and a measure
 * should never end up too narrow for VexFlow to lay its notes out cleanly.
 *
 * `noteSpacing` (default 0 = VexFlow's bare minimum, tightly packed) is a
 * fixed number of extra pixels reserved per note/rest in the measure — not
 * the clef/time/key allowance or the empty-measure floor — so users can dial
 * in more visual breathing room between notes (see Settings → Score → Note
 * Spacing). It's additive rather than a multiplier specifically so it stays
 * visible for sparse measures (a handful of quarter notes) without also
 * ballooning already-wide, densely-packed measures out of proportion.
 *
 * In 'combined' mode each measure's width is the max of what its tab and
 * staff content need, so the two staves it shares stay the same width.
 */
export function computeMeasureLayoutWidths(measures: Measure[], mode: ScoreViewMode, noteSpacing = 0): number[] {
    return measures.map(measure => {
        const { numBeats, beatValue } = parseTimeSignature(measure.timeSignature)
        let contentWidth = 0

        if (mode === 'tab' || mode === 'combined') {
            contentWidth = Math.max(contentWidth, minVoiceWidth(buildTabTickables(measure), numBeats, beatValue, noteSpacing))
        }
        if (mode === 'staff' || mode === 'combined') {
            contentWidth = Math.max(contentWidth, minVoiceWidth(buildStaffTickables(measure), numBeats, beatValue, noteSpacing))
        }
        if (mode === 'drum-staff') {
            contentWidth = Math.max(contentWidth, minVoiceWidth(buildDrumStaffTickables(measure), numBeats, beatValue, noteSpacing))
        }

        const width = Math.max(MIN_MEASURE_WIDTH, contentWidth)
        return width + measureModifierWidth(measure, mode)
    })
}


/**
 * Draws a translucent selection highlight behind an already-rendered note's
 * SVG element. VexFlow's own `tickable.getBoundingBox()` isn't reliable for
 * StaveNote/TabNote (it returns the generic Element x/y/width/height, which
 * these note types never populate) — so instead we read the *real* rendered
 * geometry straight from the browser via `SVGGraphicsElement.getBBox()`,
 * then insert a `<rect>` as the previous sibling so it paints underneath the
 * note glyph.
 */
export function highlightNoteElement(svgEl: SVGGraphicsElement, padding = 3) {
    const parent = svgEl.parentNode
    if (!parent) return
    const bbox = svgEl.getBBox()
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    rect.setAttribute('x', String(bbox.x - padding))
    rect.setAttribute('y', String(bbox.y - padding))
    rect.setAttribute('width', String(bbox.width + padding * 2))
    rect.setAttribute('height', String(bbox.height + padding * 2))
    rect.setAttribute('rx', '3')
    rect.setAttribute('fill', 'rgba(255, 196, 0, 0.35)')
    rect.setAttribute('class', 'vf-note-selection-highlight')
    parent.insertBefore(rect, svgEl)
}
