// src/tools/playback.ts
//
// Turns the current composition (measures) into a timed schedule of notes,
// then plays it back through a real (free, no API key) instrument sample
// library via soundfont-player. Uses the shared duration/order helpers so
// playback timing always matches what addNote/addRest actually built.

import { instrument as loadInstrument, Player } from 'soundfont-player'
import { Measure, MusicNote } from '@/types/music'
import { durationToBeats, getOrderedMeasureItems } from './duration'
import { DRUM_PIECES, DrumCategory, DrumPieceId } from '@/utils/drumKits'

export interface PlaybackNote {
    pitch: string // soundfont-player note name/MIDI number
    // Which real instrument sample plays this specific note — only set for
    // drums (see resolveDrumSoundfont); every other instrument uses the one
    // instrument loaded for the whole tab, so this stays undefined.
    soundfontName?: string
}

export interface PlaybackEvent {
    measureId: string
    measureIndex: number
    noteId: string
    time: number         // seconds from the start of playback
    duration: number     // seconds
    notes: PlaybackNote[]
}

export interface VoiceOption {
    id: string
    label: string
    soundfontName: string
    // Which of soundfont-player's two bundled sample sets this voice needs —
    // everything currently uses the default (MusyngKite).
    soundfont?: 'FluidR3_GM' | 'MusyngKite'
    // Drums only: soundfont-player's bundled sample set has no true
    // multi-sample "one instrument per drum" percussion kit (its 'percussion'
    // name is listed in the manifest but 404s on the actually hosted files —
    // confirmed live), so each drum *category* is instead voiced by a
    // distinct real GM instrument sample, pitch-shifted within that category
    // only (see resolveDrumSoundfont/DRUM_PIECES). This is what makes a kick
    // actually sound different from a snare, tom, hi-hat, or cymbal.
    drumCategorySoundfonts?: Record<DrumCategory, string>
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
    // actual hosted files — confirmed live). Each voice below instead maps
    // every drum *category* (kick/snare/tom/hi-hat/cymbal) to its own real
    // GM instrument sample — chosen so the categories are audibly distinct
    // families of sound, not one drum retuned — and only pitch-shifts
    // within a category (e.g. the three toms are the same 'melodic_tom'
    // sample at three different pitches, which is exactly what that GM
    // instrument is for).
    drums: [
        {
            id: 'acoustic_kit', label: 'Acoustic Kit', soundfontName: 'taiko_drum',
            drumCategorySoundfonts: {
                kick: 'taiko_drum',       // deep, resonant, real acoustic drum sample
                snare: 'woodblock',       // sharp, short transient stands in for a snare crack
                tom: 'melodic_tom',       // GM's actual "tuned toms" instrument
                hihat: 'agogo',           // short metallic tick
                cymbal: 'reverse_cymbal', // the only real cymbal-timbre sample available
            },
        },
        {
            id: 'electronic_kit', label: 'Electronic Kit', soundfontName: 'synth_drum',
            drumCategorySoundfonts: {
                kick: 'synth_drum',       // synthesized 808/909-style low tone
                snare: 'steel_drums',     // bright, punchy, distinct from the kick/tom tone
                tom: 'synth_drum',        // same synth voice as kick, pitched per tom (like a real drum machine)
                hihat: 'tinkle_bell',     // bright, short, digital-feeling tick
                cymbal: 'reverse_cymbal', // still the only cymbal-timbre sample available
            },
        },
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
 * within its category's instrument (soundfont-player's `.play()` accepts
 * either a note name or a raw number).
 */
export function resolvePlaybackPitch(instrumentKey: string, rawPitch: string): string {
    if (instrumentKey !== 'drums') return rawPitch
    const piece = DRUM_PIECES[rawPitch as DrumPieceId]
    return piece ? String(piece.midi) : rawPitch
}

/**
 * Resolves which real GM instrument sample should play one drum piece for
 * the given voice — see VoiceOption.drumCategorySoundfonts. Returns
 * undefined for non-drum pitches (the engine then just uses the single
 * instrument loaded for the whole tab).
 */
export function resolveDrumSoundfont(voiceId: string | undefined, rawPitch: string): string | undefined {
    const voice = voiceOption('drums', voiceId)
    const piece = DRUM_PIECES[rawPitch as DrumPieceId]
    if (!piece) return undefined
    return voice.drumCategorySoundfonts?.[piece.category] ?? voice.soundfontName
}

/**
 * Flattens every measure's notes+rests (in true chronological order, not
 * array order — see getOrderedMeasureItems) into a single absolute-time
 * schedule. Rests simply advance the clock; only notes produce events.
 * `instrumentKey`/`voiceId` are only needed to resolve drum pieces to their
 * playable MIDI numbers and per-category instrument sample (see
 * resolvePlaybackPitch/resolveDrumSoundfont) — every other instrument's
 * pitch strings pass straight through unchanged.
 */
export function buildPlaybackSchedule(measures: Measure[], tempo: number, instrumentKey = 'guitar', voiceId?: string): PlaybackEvent[] {
    const secondsPerBeat = 60 / Math.max(1, tempo)
    const events: PlaybackEvent[] = []
    let time = 0

    measures.forEach((measure, measureIndex) => {
        getOrderedMeasureItems(measure).forEach(({ type, item }) => {
            const seconds = durationToBeats(item.duration) * secondsPerBeat

            if (type === 'note') {
                const note = item as MusicNote
                const rawPitches = Array.isArray(note.pitch) ? note.pitch : note.pitch ? [note.pitch] : []
                const notes: PlaybackNote[] = rawPitches.map(p => ({
                    pitch: resolvePlaybackPitch(instrumentKey, p),
                    soundfontName: instrumentKey === 'drums' ? resolveDrumSoundfont(voiceId, p) : undefined,
                }))
                if (notes.length > 0) {
                    events.push({
                        measureId: measure.id,
                        measureIndex,
                        noteId: note.id,
                        time,
                        duration: seconds,
                        notes,
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
 * instrument(s), and schedules/cancels playback. Kept framework-agnostic
 * (no React) so it can be driven by a simple hook.
 *
 * Every non-drum instrument loads exactly one `Player`. Drums are the
 * exception: a kit's voice maps several *categories* to different real GM
 * instrument samples (see VoiceOption.drumCategorySoundfonts), so multiple
 * players are loaded at once and each note picks the right one by the
 * `soundfontName` PlaybackEvent attached to it.
 */
export class PlaybackEngine {
    private ac: AudioContext | null = null
    private player: Player | null = null
    private loadedInstrument: string | null = null
    private drumPlayers: Map<string, Player> = new Map()
    private loadedDrumVoice: string | null = null
    private isDrumMode = false
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
        const ac = this.getContext()
        if (ac.state === 'suspended') await ac.resume()

        if (instrumentKey === 'drums') {
            const voice = voiceOption('drums', voiceId)
            const uniqueNames = Array.from(new Set(Object.values(voice.drumCategorySoundfonts ?? {})))
            const alreadyLoaded = this.isDrumMode && this.loadedDrumVoice === voice.id
                && uniqueNames.every(name => this.drumPlayers.has(name))
            if (alreadyLoaded) return

            const players = await Promise.all(
                uniqueNames.map(name => loadInstrument(ac, name as Parameters<typeof loadInstrument>[1]))
            )
            this.drumPlayers = new Map(uniqueNames.map((name, i) => [name, players[i]]))
            this.loadedDrumVoice = voice.id
            this.isDrumMode = true
            this.player = null
            this.loadedInstrument = null
            return
        }

        this.isDrumMode = false
        this.drumPlayers = new Map()
        this.loadedDrumVoice = null

        const voice = voiceOption(instrumentKey, voiceId)
        const soundName = (voice?.soundfontName ?? 'acoustic_grand_piano') as Parameters<typeof loadInstrument>[1]
        const cacheKey = `${soundName}:${voice?.soundfont ?? 'default'}`
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
        if (!this.isDrumMode && !this.player) return
        if (this.isDrumMode && this.drumPlayers.size === 0) return
        const ac = this.getContext()
        const startAt = ac.currentTime + 0.05

        schedule.forEach(event => {
            event.notes.forEach(({ pitch, soundfontName }) => {
                const player = this.isDrumMode
                    ? (soundfontName && this.drumPlayers.get(soundfontName)) || this.drumPlayers.values().next().value
                    : this.player
                if (!player) return
                const node = player.play(pitch, startAt + event.time, {
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
        this.drumPlayers.forEach(player => {
            try {
                player.stop()
            } catch {
                // no-op — stop() can throw if nothing is currently playing
            }
        })
        this.activeNodes = []
    }

    dispose() {
        this.stop()
        this.ac?.close().catch(() => {})
        this.ac = null
        this.player = null
        this.loadedInstrument = null
        this.drumPlayers = new Map()
        this.loadedDrumVoice = null
        this.isDrumMode = false
    }
}
