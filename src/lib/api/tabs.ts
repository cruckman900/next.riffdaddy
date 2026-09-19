// src/lib/api/tabs.ts
//
// Thin axios client for the FastAPI backend's tab-storage endpoints (see
// D:\Python Projects\baselinepy.ro — app/routes/tab.py). Used by the
// Save/File Open menu items to persist and restore a CompositionSnapshot.

import axios from 'axios'
import { CompositionSnapshot } from '@/types/music'

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

export function deserializeComposition(content: string): CompositionSnapshot {
    return JSON.parse(content) as CompositionSnapshot
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

export async function listBackendTabs(userId: string): Promise<BackendTab[]> {
    const res = await axios.get<BackendTab[]>(`${API_BASE}/tabs`, { params: { user_id: userId } })
    return res.data
}

export async function deleteBackendTab(tabId: string): Promise<void> {
    await axios.delete(`${API_BASE}/${tabId}`)
}
