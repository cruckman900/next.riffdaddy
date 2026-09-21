// src/tools/noteModifiers.ts
//
// Catalog of note-level notation modifiers (articulations, ornaments, dotted
// notes, and single-note techniques) offered by the notation toolbar, plus
// the logic to apply them to a built VexFlow note during rendering.

import { Articulation, Ornament, Vibrato, Dot, Annotation, AnnotationVerticalJustify, Bend, Tremolo, Stroke, FretHandFinger, StaveNote, TabNote } from 'vexflow'

export type NotatableVexNote = StaveNote | TabNote

export type NoteModifierCategory = 'Duration' | 'Articulation' | 'Ornament' | 'Technique' | 'Stroke' | 'Dynamics' | 'Fingering'

export interface NoteModifierDef {
    id: string
    label: string
    category: NoteModifierCategory
    apply: (note: NotatableVexNote) => void
    // When set, this modifier belongs to a mutually-exclusive family (e.g.
    // every Bend amount) — the notation toolbar collapses all members
    // sharing a group into a single chip that opens a menu of options,
    // rather than showing every variant as its own permanently-visible chip.
    // See setExclusiveModifierOnSelection in MusicContext.
    group?: string
}

// VexFlow modifiers can throw if a note can't accommodate them in a given
// context — catching per-modifier keeps one bad/unsupported combination from
// blanking out the whole score render.
function safeApply(fn: () => void, label: string) {
    try {
        fn()
    } catch (err) {
        console.warn(`NEXTRiff: couldn't apply "${label}" notation modifier`, err)
    }
}

// A plain text annotation below the note — used for dynamics markings
// (p/mf/f/etc), which VexFlow's dedicated `TextDynamics` class can't express
// here since it's a standalone tickable meant to occupy its own slot in a
// voice, not something attachable to an existing note via addModifier().
function dynamicsAnnotation(note: NotatableVexNote, text: string, label: string) {
    safeApply(() => {
        const annotation = new Annotation(text)
        annotation.setVerticalJustification(AnnotationVerticalJustify.BOTTOM)
        note.addModifier(annotation)
    }, label)
}

export const NOTE_MODIFIERS: NoteModifierDef[] = [
    // --- Duration ---
    {
        id: 'dot',
        label: 'Dotted',
        category: 'Duration',
        apply: (note) => safeApply(() => Dot.buildAndAttach([note], { all: true }), 'Dotted'),
    },
    {
        id: 'double-dot',
        label: 'Double Dotted',
        category: 'Duration',
        // A second dot augments the first by half again — buildAndAttach
        // simply adds another dot glyph each time it's called.
        apply: (note) => safeApply(() => {
            Dot.buildAndAttach([note], { all: true })
            Dot.buildAndAttach([note], { all: true })
        }, 'Double Dotted'),
    },

    // --- Articulation ---
    {
        id: 'accent',
        label: 'Accent',
        category: 'Articulation',
        apply: (note) => safeApply(() => note.addModifier(new Articulation('a>')), 'Accent'),
    },
    {
        id: 'staccato',
        label: 'Staccato',
        category: 'Articulation',
        apply: (note) => safeApply(() => note.addModifier(new Articulation('a.')), 'Staccato'),
    },
    {
        id: 'staccatissimo',
        label: 'Staccatissimo',
        category: 'Articulation',
        apply: (note) => safeApply(() => note.addModifier(new Articulation('av')), 'Staccatissimo'),
    },
    {
        id: 'tenuto',
        label: 'Tenuto',
        category: 'Articulation',
        apply: (note) => safeApply(() => note.addModifier(new Articulation('a-')), 'Tenuto'),
    },
    {
        id: 'marcato',
        label: 'Marcato',
        category: 'Articulation',
        apply: (note) => safeApply(() => note.addModifier(new Articulation('a^')), 'Marcato'),
    },
    {
        id: 'fermata',
        label: 'Fermata',
        category: 'Articulation',
        apply: (note) => safeApply(() => note.addModifier(new Articulation('a@a')), 'Fermata'),
    },
    {
        id: 'up-bow',
        label: 'Up Bow',
        category: 'Articulation',
        apply: (note) => safeApply(() => note.addModifier(new Articulation('a|')), 'Up Bow'),
    },
    {
        id: 'down-bow',
        label: 'Down Bow',
        category: 'Articulation',
        apply: (note) => safeApply(() => note.addModifier(new Articulation('am')), 'Down Bow'),
    },

    // --- Ornament ---
    {
        id: 'trill',
        label: 'Trill',
        category: 'Ornament',
        apply: (note) => safeApply(() => note.addModifier(new Ornament('tr')), 'Trill'),
    },
    {
        id: 'turn',
        label: 'Turn',
        category: 'Ornament',
        apply: (note) => safeApply(() => note.addModifier(new Ornament('turn')), 'Turn'),
    },
    {
        id: 'mordent',
        label: 'Mordent',
        category: 'Ornament',
        apply: (note) => safeApply(() => note.addModifier(new Ornament('mordent')), 'Mordent'),
    },

    // --- Technique (single-note playing techniques) ---
    {
        id: 'vibrato',
        label: 'Vibrato',
        category: 'Technique',
        apply: (note) => safeApply(() => note.addModifier(new Vibrato().setVibratoWidth(20)), 'Vibrato'),
    },
    {
        id: 'harmonic',
        label: 'Harmonic',
        category: 'Technique',
        apply: (note) => safeApply(() => {
            const annotation = new Annotation('Harm.')
            annotation.setVerticalJustification(AnnotationVerticalJustify.TOP)
            note.addModifier(annotation)
        }, 'Harmonic'),
    },
    {
        id: 'bend-quarter',
        label: '1/4 Step',
        category: 'Technique',
        group: 'bend',
        apply: (note) => safeApply(() => note.addModifier(new Bend([{ type: Bend.UP, text: '1/4' }])), '1/4 Step Bend'),
    },
    {
        id: 'bend-half',
        label: '1/2 Step',
        category: 'Technique',
        group: 'bend',
        apply: (note) => safeApply(() => note.addModifier(new Bend([{ type: Bend.UP, text: '1/2' }])), '1/2 Step Bend'),
    },
    {
        id: 'bend-full',
        label: 'Full Step',
        category: 'Technique',
        group: 'bend',
        apply: (note) => safeApply(() => note.addModifier(new Bend([{ type: Bend.UP, text: 'Full' }])), 'Full Step Bend'),
    },
    {
        id: 'bend-one-half',
        label: '1 1/2 Steps',
        category: 'Technique',
        group: 'bend',
        apply: (note) => safeApply(() => note.addModifier(new Bend([{ type: Bend.UP, text: '1 1/2' }])), '1 1/2 Step Bend'),
    },
    {
        id: 'bend-two',
        label: '2 Steps',
        category: 'Technique',
        group: 'bend',
        apply: (note) => safeApply(() => note.addModifier(new Bend([{ type: Bend.UP, text: '2' }])), '2 Step Bend'),
    },
    {
        id: 'bend-release',
        label: 'Bend & Release',
        category: 'Technique',
        group: 'bend',
        apply: (note) => safeApply(() => note.addModifier(new Bend([
            { type: Bend.UP, text: 'Full' },
            { type: Bend.DOWN, text: '' },
        ])), 'Bend & Release'),
    },
    {
        id: 'tremolo',
        label: 'Tremolo',
        category: 'Technique',
        apply: (note) => safeApply(() => note.addModifier(new Tremolo(3)), 'Tremolo'),
    },
    {
        id: 'left-hand-pizzicato',
        label: 'L.H. Pizzicato',
        category: 'Technique',
        apply: (note) => safeApply(() => note.addModifier(new Articulation('a+')), 'L.H. Pizzicato'),
    },
    {
        id: 'snap-pizzicato',
        label: 'Snap Pizzicato',
        category: 'Technique',
        apply: (note) => safeApply(() => note.addModifier(new Articulation('ao')), 'Snap Pizzicato'),
    },

    // --- Stroke (strum / arpeggio direction, applies best to chords) ---
    {
        id: 'brush-down',
        label: 'Brush Down',
        category: 'Stroke',
        apply: (note) => safeApply(() => note.addModifier(new Stroke(Stroke.Type.BRUSH_DOWN)), 'Brush Down'),
    },
    {
        id: 'brush-up',
        label: 'Brush Up',
        category: 'Stroke',
        apply: (note) => safeApply(() => note.addModifier(new Stroke(Stroke.Type.BRUSH_UP)), 'Brush Up'),
    },
    {
        id: 'roll-down',
        label: 'Roll Down',
        category: 'Stroke',
        apply: (note) => safeApply(() => note.addModifier(new Stroke(Stroke.Type.ROLL_DOWN)), 'Roll Down'),
    },
    {
        id: 'roll-up',
        label: 'Roll Up',
        category: 'Stroke',
        apply: (note) => safeApply(() => note.addModifier(new Stroke(Stroke.Type.ROLL_UP)), 'Roll Up'),
    },
    {
        id: 'arpeggio',
        label: 'Arpeggio',
        category: 'Stroke',
        apply: (note) => safeApply(() => note.addModifier(new Stroke(Stroke.Type.ARPEGGIO_DIRECTIONLESS)), 'Arpeggio'),
    },

    // --- Dynamics (rendered as text below the note/stave) ---
    { id: 'dyn-pp', label: 'pp', category: 'Dynamics', apply: (note) => dynamicsAnnotation(note, 'pp', 'pp') },
    { id: 'dyn-p', label: 'p', category: 'Dynamics', apply: (note) => dynamicsAnnotation(note, 'p', 'p') },
    { id: 'dyn-mp', label: 'mp', category: 'Dynamics', apply: (note) => dynamicsAnnotation(note, 'mp', 'mp') },
    { id: 'dyn-mf', label: 'mf', category: 'Dynamics', apply: (note) => dynamicsAnnotation(note, 'mf', 'mf') },
    { id: 'dyn-f', label: 'f', category: 'Dynamics', apply: (note) => dynamicsAnnotation(note, 'f', 'f') },
    { id: 'dyn-ff', label: 'ff', category: 'Dynamics', apply: (note) => dynamicsAnnotation(note, 'ff', 'ff') },

    // --- Fingering (fretting-hand finger indicators) ---
    { id: 'finger-1', label: '1', category: 'Fingering', apply: (note) => safeApply(() => note.addModifier(new FretHandFinger('1')), 'Finger 1') },
    { id: 'finger-2', label: '2', category: 'Fingering', apply: (note) => safeApply(() => note.addModifier(new FretHandFinger('2')), 'Finger 2') },
    { id: 'finger-3', label: '3', category: 'Fingering', apply: (note) => safeApply(() => note.addModifier(new FretHandFinger('3')), 'Finger 3') },
    { id: 'finger-4', label: '4', category: 'Fingering', apply: (note) => safeApply(() => note.addModifier(new FretHandFinger('4')), 'Finger 4') },
    { id: 'finger-t', label: 'T', category: 'Fingering', apply: (note) => safeApply(() => note.addModifier(new FretHandFinger('T')), 'Finger T') },
]

export const NOTE_MODIFIER_CATEGORIES: NoteModifierCategory[] = [
    'Duration', 'Articulation', 'Ornament', 'Technique', 'Stroke', 'Dynamics', 'Fingering',
]

/** Applies every modifier id present on a note's `modifiers` list to its built VexFlow note. */
export function applyNoteModifiers(vexNote: NotatableVexNote, modifierIds: string[] | undefined) {
    if (!modifierIds?.length) return
    for (const id of modifierIds) {
        const def = NOTE_MODIFIERS.find(m => m.id === id)
        def?.apply(vexNote)
    }
}
