// src/tools/durationUtils.ts

// Convert a duration string into beats (quarter-note units)
export function durationToBeats(duration: string): number {
    switch (duration.replace('r', '')) {
        case 'w': return 4
        case 'h': return 2
        case 'q': return 1
        case '8': return 0.5
        case '16': return 0.25
        default: return 1
    }
}