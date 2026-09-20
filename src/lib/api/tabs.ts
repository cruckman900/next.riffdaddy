// src/lib/api/tabs.ts
//
// Thin axios client for the FastAPI backend's tab-storage endpoints (see
// D:\Python Projects\baselinepy.ro — app/routes/tab.py). Used by the
// Save/File Open menu items to persist and restore a CompositionSnapshot.

import axios from 'axios'
import { CompositionSnapshot, Measure, ScoreMetadata } from '@/types/music'
import { getVoiceOptions } from '@/tools/playback'

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

export interface BackendTab {
    id: string
    public_id: string
    filename?: string | null
    instrument?: string | null
    tuning?: string | null
    artist?: string | null
    title?: string | null
    genre?: string | null
    content?: string | null
    user_id?: string | null
    uploaded_at: string
    created_at?: string | null
    updated_at?: string | null
    archived?: boolean
}

export interface SaveTabInput {
    title: string
    userId: string
    instrument: string
    tuning: string
    genre: string
    composition: CompositionSnapshot
}

function serialize(composition: CompositionSnapshot): string {
    return JSON.stringify(composition)
}

// Fills in fields a measure might be missing (older saved tabs, or a
// hand-edited/foreign JSON file opened via Local Disk) so rendering never
// crashes on an undefined array — every consumer (beat-count, beaming,
// width calc, …) assumes `notes`/`rests`/`beamGroups` are always arrays.
function normalizeMeasure(measure: Partial<Measure>): Measure {
    return {
        id: measure.id ?? crypto.randomUUID(),
        notes: Array.isArray(measure.notes) ? measure.notes : [],
        rests: Array.isArray(measure.rests) ? measure.rests : [],
        beamGroups: Array.isArray(measure.beamGroups) ? measure.beamGroups : [],
        clef: measure.clef,
        timeSignature: measure.timeSignature ?? '4/4',
        keySignature: measure.keySignature,
    }
}

export const EMPTY_METADATA: ScoreMetadata = {
    title: '', artist: '', album: '', composer: '', year: '', capo: 0, difficulty: '', notes: '',
}

// Fills in fields that older saved data (backend or local-disk files saved
// before a feature existed) might be missing, so opening an old file never
// crashes on an undefined field. Shared by deserializeComposition (backend
// JSON string) and the local-disk file loader (src/lib/localFile.ts).
export function normalizeComposition(parsed: Partial<CompositionSnapshot>): CompositionSnapshot {
    return {
        ...parsed,
        measures: Array.isArray(parsed.measures) && parsed.measures.length > 0
            ? parsed.measures.map(normalizeMeasure)
            : [normalizeMeasure({})],
        selectedNoteRefs: Array.isArray(parsed.selectedNoteRefs) ? parsed.selectedNoteRefs : [],
        selectedVoice: parsed.selectedVoice ?? getVoiceOptions(parsed.selectedInstrument ?? 'guitar')[0]?.id ?? '',
        metadata: { ...EMPTY_METADATA, ...parsed.metadata },
    } as CompositionSnapshot
}

export function deserializeComposition(content: string): CompositionSnapshot {
    const parsed = JSON.parse(content) as Partial<CompositionSnapshot>
    return normalizeComposition(parsed)
}

export async function createBackendTab(input: SaveTabInput): Promise<BackendTab> {
    const res = await axios.post<BackendTab>(`${API_BASE}/tabs`, {
        public_id: crypto.randomUUID(),
        title: input.title,
        instrument: input.instrument,
        tuning: input.tuning,
        genre: input.genre,
        content: serialize(input.composition),
        user_id: input.userId,
    })
    return res.data
}

export async function updateBackendTab(tabId: string, input: SaveTabInput): Promise<BackendTab> {
    const res = await axios.patch<BackendTab>(`${API_BASE}/${tabId}`, {
        title: input.title,
        instrument: input.instrument,
        tuning: input.tuning,
        genre: input.genre,
        content: serialize(input.composition),
        user_id: input.userId,
    })
    return res.data
}

export async function getBackendTab(tabId: string): Promise<BackendTab> {
    const res = await axios.get<BackendTab>(`${API_BASE}/${tabId}`)
    return res.data
}

export async function listBackendTabs(userId: string, includeArchived = false): Promise<BackendTab[]> {
    const res = await axios.get<BackendTab[]>(`${API_BASE}/tabs`, {
        params: { user_id: userId, include_archived: includeArchived },
    })
    return res.data
}

export async function deleteBackendTab(tabId: string): Promise<void> {
    await axios.delete(`${API_BASE}/${tabId}`)
}

// Soft-delete/restore — flips the `archived` flag via the same PATCH the
// rest of the app already uses for saves, rather than a bespoke endpoint.
export async function setBackendTabArchived(tabId: string, archived: boolean): Promise<BackendTab> {
    const res = await axios.patch<BackendTab>(`${API_BASE}/${tabId}`, { archived })
    return res.data
}
