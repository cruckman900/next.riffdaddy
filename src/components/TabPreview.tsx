'use client'

import type { TabData } from '@/types/Tab'
import { motion } from 'framer-motion'

export default function TabPreview(props: TabData) {
    const { title, artist, genre, musicalKey, tempo, timeSignature, tab } = props

    const genreColor = {
        metal: 'bg-gray-900 text-red-500',
        jazz: 'bg-indigo-900 text-yellow-300',
        blues: 'bg-blue-900 text-white',
        rock: 'bg-black text-pink-400',
        classical: 'bg-amber-50 text-gray-800',
        country: 'bg-yellow-100 text-orange-700',
        other: 'bbg-gradient-to-r from-cyan-700 to-purple-700 text-white'
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className={`rounded-xl p-6 shadow-xl ${genreColor[genre]}`}
        >
            <h2 className='text-2xl font-bold mb-2'>{`🎶 “${title}” — ${artist}`}</h2>
            <p className='text-sm mb-4 opacity-80'>
                Key: {musicalKey} · Tempo: {tempo} BPM · Time Signature: {timeSignature}
            </p>
            <pre className="text-mono text-sm whitespace-pre-wrap leading-relaxed">
                {tab}
            </pre>
        </motion.div>
    )
}