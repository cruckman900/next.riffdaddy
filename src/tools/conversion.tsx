export function computeTabFromPitch(pitch: string, tuning: string[]) {
    const midi = pitchToMidi(pitch)
    let best = { string: 1, fret: 0, diff: Infinity }

    for (let index = 0; index < tuning.length; index++) {
        const openPitch = tuning[index]
        const openMidi = pitchToMidi(openPitch)
        const fret = midi - openMidi

        if (fret < 0) {
            continue // skip strings where pitch is below open note
        }

        const stringIndex = tuning.length - index // reverse numbering
        if (fret < best.diff) {
            best = { string: stringIndex, fret, diff: fret }
        }
    }

    return { string: best.string, fret: best.fret }
}

export function computePitchFromTab(string: number, fret: number, tuning: string[]): string {
    const openPitch = tuning[tuning.length - string]
    const midi = pitchToMidi(openPitch) + fret
    return midiToPitch(midi)
}

const NOTE_ORDER = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

export function pitchToMidi(pitch: string) {
    const note = pitch.slice(0, -1)
    const octave = parseInt(pitch.slice(-1))
    const index = NOTE_ORDER.indexOf(note)
    return index + 12 * (octave + 1)
}

export function midiToPitch(midi: number) {
    const note = NOTE_ORDER[midi % 12]
    const octave = Math.floor(midi / 12) - 1
    return `${note}${octave}`
}
