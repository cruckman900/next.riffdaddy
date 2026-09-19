// src/tools/notation.ts
//
// Shared VexFlow tickable builders + real content-driven measure width
// calculation, used identically by TabRenderer, StaffRenderer, and
// CombinedRenderer so all three lay measures out the same way (and, in
// Combined view, so a measure's tab and staff staves always share one width).

import { Measure, MusicNote, MusicRest } from '@/types/music'
import { TabNote, StaveNote, Voice, Formatter } from 'vexflow'
import { applyNoteModifiers } from './noteModifiers'
import { getOrderedMeasureItems } from './duration'

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

export const MEASURE_PADDING = 10

const MIN_MEASURE_WIDTH = 100
// Extra width reserved for stave modifiers (clef/time/key signature), which
// may be drawn at the start of a row. Row membership isn't known yet when
// measures are first sized, so this is applied to every measure rather than
// only ones that end up first-in-row — a little generous for the rest, but
// safe against ever under-sizing and clipping notation.
const MODIFIER_ALLOWANCE = 60

function minVoiceWidth(tickables: (TabNote | StaveNote)[], numBeats: number, beatValue: number): number {
    if (!tickables.length) return 0
    const voice = new Voice({ numBeats, beatValue }).setStrict(false)
    voice.addTickables(tickables)
    const formatter = new Formatter()
    formatter.joinVoices([voice])
    return formatter.preCalculateMinTotalWidth([voice])
}

export type ScoreViewMode = 'tab' | 'staff' | 'combined'

/**
 * Computes each measure's real rendered width from its actual note content
 * (via VexFlow's own minimum-width calculation) instead of a rough linear
 * beat-count heuristic — a measure full of 8th notes now genuinely comes out
 * wider than one with the same beat count of quarter notes, and a measure
 * should never end up too narrow for VexFlow to lay its notes out cleanly.
 *
 * In 'combined' mode each measure's width is the max of what its tab and
 * staff content need, so the two staves it shares stay the same width.
 */
export function computeMeasureLayoutWidths(measures: Measure[], mode: ScoreViewMode): number[] {
    return measures.map(measure => {
        const { numBeats, beatValue } = parseTimeSignature(measure.timeSignature)
        let width = MIN_MEASURE_WIDTH

        if (mode === 'tab' || mode === 'combined') {
            width = Math.max(width, minVoiceWidth(buildTabTickables(measure), numBeats, beatValue))
        }
        if (mode === 'staff' || mode === 'combined') {
            width = Math.max(width, minVoiceWidth(buildStaffTickables(measure), numBeats, beatValue))
        }

        return width + MODIFIER_ALLOWANCE
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
