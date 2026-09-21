// src/tools/playback.ts
//
// Turns the current composition (measures) into a timed schedule of notes,
// then plays it back through a real (free, no API key) instrument sample
// library via soundfont-player. Uses the shared duration/order helpers so
// playback timing always matches what addNote/addRest actually built.

import { instrument as loadInstrument, Player } from 'soundfont-player'
import { Measure, MusicNote } from '@/types/music'
import { durationToBeats, getOrderedMeasureItems } from './duration'
import { DRUM_PIECES, DrumPieceId } from '@/utils/drumKits'

export interface PlaybackEvent {
    measureId: string
    measureIndex: number
    noteId: string
    time: number       // seconds from the start of playback
    duration: number   // seconds
    pitches: string[]  // e.g. ['E4', 'G#4'] — soundfont-player note names
}

export interface VoiceOption {
    id: string
    label: string
    soundfontName: string
    // Which of soundfont-player's two bundled sample sets this voice needs —
    // only 'percussion' (real per-piece drum samples) requires FluidR3_GM
    // specifically; everything else uses the default (MusyngKite).
    soundfont?: 'FluidR3_GM' | 'MusyngKite'
}

// General MIDI has distinct patches for different guitar/bass/string timbres
// (soundfont-player loads real GM soundfont samples for all of them, free,
// no API key) — surfaced here as a per-instrument "Voice" picker instead of
// hard-locking every instrument to a single fixed sound.
const INSTRUMENT_VOICES: Record<string, VoiceOption[]> = {
    guitar: [
        { id: 'acoustic_nylon', label: 'Acoustic (Nylon)', soundfontName: 'acoustic_guitar_nylon' },
        { id: 'acoustic_steel', label: 'Acoustic (Steel)', soundfontName: 'acoustic_guitar_steel' },
        { id: 'clean', label: 'Clean Electric', soundfontName: 'electric_guitar_clean' },
        { id: 'jazz', label: 'Jazz Electric', soundfontName: 'electric_guitar_jazz' },
        { id: 'muted', label: 'Muted Electric', soundfontName: 'electric_guitar_muted' },
        { id: 'overdrive', label: 'Overdrive', soundfontName: 'overdriven_guitar' },
        { id: 'distortion', label: 'Distortion', soundfontName: 'distortion_guitar' },
        { id: 'harmonics', label: 'Harmonics', soundfontName: 'guitar_harmonics' },
    ],
    bass: [
        { id: 'finger', label: 'Finger', soundfontName: 'electric_bass_finger' },
        { id: 'pick', label: 'Pick', soundfontName: 'electric_bass_pick' },
        { id: 'fretless', label: 'Fretless', soundfontName: 'fretless_bass' },
        { id: 'slap1', label: 'Slap 1', soundfontName: 'slap_bass_1' },
        { id: 'slap2', label: 'Slap 2', soundfontName: 'slap_bass_2' },
        { id: 'acoustic', label: 'Acoustic', soundfontName: 'acoustic_bass' },
    ],
    violin: [
        { id: 'standard', label: 'Standard', soundfontName: 'violin' },
        { id: 'pizzicato', label: 'Pizzicato', soundfontName: 'pizzicato_strings' },
        { id: 'tremolo', label: 'Tremolo', soundfontName: 'tremolo_strings' },
        { id: 'ensemble', label: 'Ensemble', soundfontName: 'string_ensemble_1' },
    ],
    cello: [
        { id: 'standard', label: 'Standard', soundfontName: 'cello' },
        { id: 'pizzicato', label: 'Pizzicato', soundfontName: 'pizzicato_strings' },
        { id: 'tremolo', label: 'Tremolo', soundfontName: 'tremolo_strings' },
        { id: 'ensemble', label: 'Ensemble', soundfontName: 'string_ensemble_1' },
    ],
    // soundfont-player's bundled sample set doesn't actually host a real
    // "one instrument, every MIDI note is a different drum" percussion kit
    // (its own `percussion` name is listed in the manifest but 404s on the
    // actual hosted files — confirmed live). Both voices below are instead a
    // single real pitched instrument, reused across every piece's distinct
    // GM note number (see DRUM_PIECES/resolvePlaybackPitch) so each piece
    // still gets its own audibly different pitch/tone: 'taiko_drum' is a
    // real acoustic drum sample (deep, punchy, non-synthetic) for "Acoustic
    // Kit", 'synth_drum' is a synthesized tone for "Electronic Kit" (a
    // lightweight 808/909-style approximation).
    drums: [
        { id: 'acoustic_kit', label: 'Acoustic Kit', soundfontName: 'taiko_drum' },
        { id: 'electronic_kit', label: 'Electronic Kit', soundfontName: 'synth_drum' },
    ],
}

export function getVoiceOptions(instrumentKey: string): VoiceOption[] {
    return INSTRUMENT_VOICES[instrumentKey] ?? INSTRUMENT_VOICES.guitar
}

function voiceOption(instrumentKey: string, voiceId?: string): VoiceOption {
    const voices = getVoiceOptions(instrumentKey)
    const match = voiceId ? voices.find(v => v.id === voiceId) : undefined
    return match ?? voices[0]
}

export function instrumentSoundName(instrumentKey: string, voiceId?: string): Parameters<typeof loadInstrument>[1] {
    return (voiceOption(instrumentKey, voiceId)?.soundfontName as Parameters<typeof loadInstrument>[1]) ?? 'acoustic_grand_piano'
}

/**
 * Resolves one note's raw `pitch` value into whatever soundfont-player
 * actually needs to play it: a real pitch name for every pitched
 * instrument, or a stringified MIDI note number for drums — each piece's
 * `midi` value (see DRUM_PIECES) is just a distinct number that pitch-shifts
 * whichever single drum voice is loaded (soundfont-player's `.play()`
 * accepts either a note name or a raw number).
 */
export function resolvePlaybackPitch(instrumentKey: string, rawPitch: string): string {
    if (instrumentKey !== 'drums') return rawPitch
    const piece = DRUM_PIECES[rawPitch as DrumPieceId]
    return piece ? String(piece.midi) : rawPitch
}

/**
 * Flattens every measure's notes+rests (in true chronological order, not
 * array order — see getOrderedMeasureItems) into a single absolute-time
 * schedule. Rests simply advance the clock; only notes produce events.
 * `instrumentKey` is only needed to resolve drum pieces to their playable
 * MIDI numbers (see resolvePlaybackPitch) — every other instrument's pitch
 * strings pass straight through unchanged.
 */
export function buildPlaybackSchedule(measures: Measure[], tempo: number, instrumentKey = 'guitar'): PlaybackEvent[] {
    const secondsPerBeat = 60 / Math.max(1, tempo)
    const events: PlaybackEvent[] = []
    let time = 0

    measures.forEach((measure, measureIndex) => {
        getOrderedMeasureItems(measure).forEach(({ type, item }) => {
            const seconds = durationToBeats(item.duration) * secondsPerBeat

            if (type === 'note') {
                const note = item as MusicNote
                const rawPitches = Array.isArray(note.pitch) ? note.pitch : note.pitch ? [note.pitch] : []
                const pitches = rawPitches.map(p => resolvePlaybackPitch(instrumentKey, p))
                if (pitches.length > 0) {
                    events.push({
                        measureId: measure.id,
                        measureIndex,
                        noteId: note.id,
                        time,
                        duration: seconds,
                        pitches,
                    })
                }
            }

            time += seconds
        })
    })

    return events
}

export function getScheduleDuration(schedule: PlaybackEvent[]): number {
    return schedule.reduce((max, e) => Math.max(max, e.time + e.duration), 0)
}

/**
 * Thin wrapper around soundfont-player that owns the AudioContext + loaded
 * instrument, and schedules/cancels playback. Kept framework-agnostic (no
 * React) so it can be driven by a simple hook.
 */
export class PlaybackEngine {
    private ac: AudioContext | null = null
    private player: Player | null = null
    private loadedInstrument: string | null = null
    private timers: ReturnType<typeof setTimeout>[] = []
    private activeNodes: AudioNode[] = []

    private getContext(): AudioContext {
        if (!this.ac) {
            const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
            this.ac = new Ctx()
        }
        return this.ac
    }

    async ensureInstrument(instrumentKey: string, voiceId?: string): Promise<void> {
        const voice = voiceOption(instrumentKey, voiceId)
        const soundName = (voice?.soundfontName ?? 'acoustic_grand_piano') as Parameters<typeof loadInstrument>[1]
        // Cache key includes the soundfont set — 'percussion' only exists in
        // FluidR3_GM, distinct from every other voice's default MusyngKite.
        const cacheKey = `${soundName}:${voice?.soundfont ?? 'default'}`
        const ac = this.getContext()
        if (ac.state === 'suspended') await ac.resume()
        if (this.player && this.loadedInstrument === cacheKey) return
        this.player = await loadInstrument(ac, soundName, voice?.soundfont ? { soundfont: voice.soundfont } : undefined)
        this.loadedInstrument = cacheKey
    }

    /**
     * Plays a schedule starting now. `onMeasureChange` fires as playback
     * crosses into each measure (for a play-cursor highlight); `onDone`
     * fires once when the whole schedule has finished.
     */
    play(schedule: PlaybackEvent[], opts: { onMeasureChange?: (measureIndex: number) => void; onDone?: () => void } = {}) {
        this.stop()
        if (!this.player) return
        const ac = this.getContext()
        const startAt = ac.currentTime + 0.05

        schedule.forEach(event => {
            event.pitches.forEach(pitch => {
                const node = this.player!.play(pitch, startAt + event.time, {
                    duration: event.duration * 0.95,
                    gain: 1,
                })
                this.activeNodes.push(node as unknown as AudioNode)
            })
        })

        let lastMeasure = -1
        schedule.forEach(event => {
            if (event.measureIndex === lastMeasure) return
            lastMeasure = event.measureIndex
            const id = setTimeout(() => opts.onMeasureChange?.(event.measureIndex), event.time * 1000)
            this.timers.push(id)
        })

        const totalMs = getScheduleDuration(schedule) * 1000 + 150
        const doneId = setTimeout(() => opts.onDone?.(), totalMs)
        this.timers.push(doneId)
    }

    stop() {
        this.timers.forEach(clearTimeout)
        this.timers = []
        if (this.player) {
            try {
                this.player.stop()
            } catch {
                // no-op — stop() can throw if nothing is currently playing
            }
        }
        this.activeNodes = []
    }

    dispose() {
        this.stop()
        this.ac?.close().catch(() => {})
        this.ac = null
        this.player = null
        this.loadedInstrument = null
    }
}
