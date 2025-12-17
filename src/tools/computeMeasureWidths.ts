// src/tools/computeMeasureWidths.ts

import { Measure } from '@/types/music'
import { durationToBeats } from './durationUtils' // or inline this if needed

export const MEASURE_PADDING = 10

export function computeMeasureWidths(measures: Measure[], baseWidth = 150, beatScale = 40) {
    return measures.map(measure => {
        const totalBeats =
            measure.notes.reduce((sum, n) => sum + durationToBeats(n.duration), 0) +
            measure.rests.reduce((sum, r) => sum + durationToBeats(r.duration), 0)
        return Math.max(baseWidth, baseWidth + totalBeats * beatScale)
    })
}
