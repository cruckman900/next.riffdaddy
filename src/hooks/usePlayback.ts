// src/hooks/usePlayback.ts
//
// React glue for PlaybackEngine — owns its lifecycle, exposes play/pause/
// stop plus loading/error/progress state for the Playback Controls tool.

'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useMusic } from '@/context/MusicContext'
import { PlaybackEngine, buildPlaybackSchedule } from '@/tools/playback'

export function usePlayback() {
    const { measures, tempo, selectedInstrument } = useMusic()
    const engineRef = useRef<PlaybackEngine | null>(null)

    const [isPlaying, setIsPlaying] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [currentMeasureIndex, setCurrentMeasureIndex] = useState<number | null>(null)

    useEffect(() => {
        engineRef.current = new PlaybackEngine()
        return () => {
            engineRef.current?.dispose()
            engineRef.current = null
        }
    }, [])

    const stop = useCallback(() => {
        engineRef.current?.stop()
        setIsPlaying(false)
        setCurrentMeasureIndex(null)
    }, [])

    // Stop playback if the composition changes out from under it (e.g. the
    // user edits notes mid-playback) rather than continuing with a stale
    // schedule.
    useEffect(() => {
        if (isPlaying) stop()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [measures])

    const play = useCallback(async () => {
        const engine = engineRef.current
        if (!engine) return

        const schedule = buildPlaybackSchedule(measures, tempo)
        if (schedule.length === 0) return

        setError(null)
        setIsLoading(true)
        try {
            await engine.ensureInstrument(selectedInstrument)
        } catch {
            setError('Could not load the instrument sound. Check your connection and try again.')
            setIsLoading(false)
            return
        }
        setIsLoading(false)
        setIsPlaying(true)
        engine.play(schedule, {
            onMeasureChange: setCurrentMeasureIndex,
            onDone: () => {
                setIsPlaying(false)
                setCurrentMeasureIndex(null)
            },
        })
    }, [measures, tempo, selectedInstrument])

    const toggle = useCallback(() => {
        if (isPlaying) stop()
        else play()
    }, [isPlaying, play, stop])

    const hasNotes = useMemo(() => measures.some(m => m.notes.length > 0), [measures])
    const measureCount = measures.length

    return {
        isPlaying,
        isLoading,
        error,
        currentMeasureIndex,
        hasNotes,
        measureCount,
        play,
        stop,
        toggle,
    }
}
