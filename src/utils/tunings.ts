// utils/tuningPresets.ts

export type TuningPreset = string[];

export const tuningPresets: { [instrument: string]: TuningPreset } = {
    guitar: ['E', 'A', 'D', 'G', 'B', 'E'],
    'electric-guitar': ['D', 'A', 'D', 'G', 'B', 'E'], // Drop D
    bass: ['E', 'A', 'D', 'G'],
    violin: ['G', 'D', 'A', 'E'],
    cello: ['C', 'G', 'D', 'A'],
};