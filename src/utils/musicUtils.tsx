import { Measure } from "@/types/music"

const DURATION_VALUES: Record<string, number> = {
    w: 4,
    h: 2,
    q: 1,
    '8': 0.5,
    '16': 0.25,
    qr: 1,
    hr: 2,
    wr: 4,
}

export function beatsRemaining(measure: Measure): number {
    const beatsPerMeasure = parseInt(measure.timeSignature.split('/')[0])
    const used = measure.notes.reduce((sum, n) => {
        const val = DURATION_VALUES[n.duration] ?? 0
        return sum + val
    }, 0)
    return Math.max(0, beatsPerMeasure - used)
}
