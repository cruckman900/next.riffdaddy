export function computeTabFromPitch(pitch: string, tuning: string[]) {
    // Example: pitch "E4" -> find closest string/fret
    // You can refine this later with better heuristics

    const midi = pitchToMidi(pitch)

    let best = { string: 1, fret: 0, diff: Infinity }

    tuning.forEach((openPitch, index) => {
        const openMidi = pitchToMidi(openPitch)
        const fret = midi - openMidi
        if (fret >= 0 && fret < best.diff) {
            best = { string: index + 1, fret, diff: fret }
        }
    })

    return { string: best.string, fret: best.fret }
}

export function computePitchFromTab(string: number, fret: number, tuning: string[]) {
    const openPitch = tuning[string - 1]
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