// src/tools/noteModifiers.ts
//
// Catalog of note-level notation modifiers (articulations, ornaments, dotted
// notes, and single-note techniques) offered by the notation toolbar, plus
// the logic to apply them to a built VexFlow note during rendering.

import { Articulation, Ornament, Vibrato, Dot, Annotation, AnnotationVerticalJustify, StaveNote, TabNote } from 'vexflow'

export type NotatableVexNote = StaveNote | TabNote

export type NoteModifierCategory = 'Duration' | 'Articulation' | 'Ornament' | 'Technique'

export interface NoteModifierDef {
    id: string
    label: string
    category: NoteModifierCategory
    apply: (note: NotatableVexNote) => void
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

export const NOTE_MODIFIERS: NoteModifierDef[] = [
    {
        id: 'dot',
        label: 'Dotted',
        category: 'Duration',
        apply: (note) => safeApply(() => Dot.buildAndAttach([note], { all: true }), 'Dotted'),
    },
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
]

export const NOTE_MODIFIER_CATEGORIES: NoteModifierCategory[] = ['Duration', 'Articulation', 'Ornament', 'Technique']

/** Applies every modifier id present on a note's `modifiers` list to its built VexFlow note. */
export function applyNoteModifiers(vexNote: NotatableVexNote, modifierIds: string[] | undefined) {
    if (!modifierIds?.length) return
    for (const id of modifierIds) {
        const def = NOTE_MODIFIERS.find(m => m.id === id)
        def?.apply(vexNote)
    }
}
