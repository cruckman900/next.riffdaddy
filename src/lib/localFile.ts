// src/lib/localFile.ts
//
// "Local Disk" save/load location for tabs — a plain JSON file the browser
// downloads (Save) or the user picks via a file input (Open). No backend
// involved at all, so it works offline and needs no account.

import { CompositionSnapshot } from '@/types/music'
import { normalizeComposition } from './api/tabs'

const FORMAT_VERSION = 1

export interface LocalTabFile {
    formatVersion: number
    title: string
    savedAt: string
    composition: CompositionSnapshot
}

function sanitizeFilename(name: string): string {
    // Strip characters that are illegal (or awkward) in file names on
    // Windows/macOS/Linux, and fall back to something sensible if that
    // leaves nothing usable.
    const cleaned = name.trim().replace(/[\\/:*?"<>|]+/g, '_')
    return cleaned || 'Untitled'
}

export function serializeLocalFile(title: string, composition: CompositionSnapshot): string {
    const file: LocalTabFile = {
        formatVersion: FORMAT_VERSION,
        title,
        savedAt: new Date().toISOString(),
        composition,
    }
    return JSON.stringify(file, null, 2)
}

// Triggers a real browser "Save File" download — there's no way for a
// plain web app to silently overwrite a specific file on disk (that needs
// the not-yet-universally-supported File System Access API), so every
// "save to local disk" is a fresh download, same as any other website's
// export/download feature.
export function downloadLocalFile(title: string, composition: CompositionSnapshot) {
    const json = serializeLocalFile(title, composition)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${sanitizeFilename(title)}.nriff.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
}

// Accepts either our own wrapped format ({ title, composition, ... }) or a
// bare CompositionSnapshot (e.g. someone manually re-saved just the
// `content` field from a database export) so opening either kind of JSON
// file works.
export function parseLocalFile(raw: string): { title: string; composition: CompositionSnapshot } {
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed === 'object' && 'composition' in parsed) {
        const file = parsed as Partial<LocalTabFile>
        return {
            title: file.title || 'Untitled',
            composition: normalizeComposition(file.composition ?? {}),
        }
    }
    return {
        title: 'Untitled',
        composition: normalizeComposition(parsed as Partial<CompositionSnapshot>),
    }
}

// Reads a File (from an <input type="file"> change event) as text via
// FileReader, wrapped in a Promise for async/await use.
export function readFileAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(String(reader.result ?? ''))
        reader.onerror = () => reject(reader.error ?? new Error('Failed to read file'))
        reader.readAsText(file)
    })
}
