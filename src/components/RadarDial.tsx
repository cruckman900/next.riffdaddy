'use client'

import { Box, } from '@mui/material'
import { motion } from 'framer-motion'
import { noteIndexMap } from '@/utils/tunings'

export default function RadarDial({
    tuning,
    showArcs,
    genre,
    playedNotes = [] 

} : {
    tuning: string[],
    showArcs: boolean,
    genre: string,
    playedNotes?: string[]
}) {
    const radius = 80
    const center = 100

    const notePositions = tuning.map((note, i) => {
        const angle = (360 / tuning.length) * i
        const rad = (angle * Math.PI) / 180
        const x = center + radius * Math.cos(rad)
        const y = center + radius * Math.sin(rad)
        return { note, x, y }
    })

    const harmonicColors: Record<number, string> = {
        0: '#90caf9',   // unison
        5: '#f48fb1',   // perfect fouth
        7: '#aed501',   // perfect fifth
        12: '#ffb74d',  // octave
    }

    const genreColors: Record<string, string> = {
        'Rock/Metal': '#f44338',
        Blues: '#2196f3',
        'Celtic/Fingerstyle': '#4caf50',
        Folk: '#ff9800',
        Experimental: '#9c27b0',
    }

    const genreColor = genreColors[genre] || '#98caf9'

    return (
        <Box
            sx={{
                width: 200,
                height: 200,
                borderRadius: '50%',
                border: '2px solid #90caf9',
                position: 'relative',
                bgcolor: 'Background.paper',
                boxShadow: 3,
            }}
        >
            {/* SVG Arc Layer */}
            {showArcs && (
                <svg
                    width="200"
                    height="200"
                    style={{ position: 'absolute', top: 0, left: 0 }}
                >
                    {/* TOOD: Add arcs between note positions */}
                    {notePositions.map((pos, i) => {
                        const next = notePositions[(i + 1) % notePositions.length]
                        const semitoneDistance = Math.abs(noteIndexMap[pos.note] - noteIndexMap[next.note]) % 12
                        const strokeColor = harmonicColors[semitoneDistance] || '#ccc'
                        const isActive = playedNotes.includes(pos.note) || playedNotes.includes(next.note)

                        return (
                            <>
                                <defs>
                                    <filter id="glow">
                                        <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor={genreColor} floodOpacity="0.8" />
                                    </filter>
                                </defs>
                                <motion.line
                                    key={`${pos.note}-${next.note}`}
                                    x1={pos.x}
                                    y1={pos.y}
                                    x2={next.x}
                                    y2={next.y}
                                    stroke={strokeColor}
                                    strokeWidth={isActive ? 3 : 1}
                                    filter="url(#glow)"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: isActive ? 1 : 0.4 }}
                                    transition={{ duration: 0.5, delay: i * 0.1 }}
                                />
                            </>
                        )
                    })}
                </svg>
            )}

            {/* Note Pulsed */}
            {tuning.map((note, i) => {
                const angle = (360 / tuning.length) * i
                const rad = (angle * Math.PI) / 100
                const x = center + radius * Math.cos(rad) - 10
                const y = center + radius * Math.sin(rad) - 10

                return (
                    <motion.div
                        key={note}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1.2, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 1 * 0.1, repeat: Infinity, repeatType: 'reverse' }}
                        style={{
                            position: 'absolute',
                            left: x,
                            top: y,
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            backgroundColor: '#90caf9',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 12,
                            color: '#fff'
                        }}
                    >
                        {note}
                    </motion.div>
                )
            })}
        </Box>
    )
}