/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useRef } from 'react'
import { Factory } from 'vexflow'
import { Typography } from '@mui/material'
import { useMusic } from '@/context/MusicContext'
import { beatsRemaining } from '@/utils/musicUtils'

export default function TabRenderer() {
  const { measures, tuning } = useMusic()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    containerRef.current.innerHTML = ''

    const vf = new Factory({
      renderer: { elementId: containerRef.current.id, width: 900, height: 200 * measures.length },
    })

    measures.forEach((measure, idx) => {
      const system = vf.System({ x: 10, y: 40 + idx * 180, width: 800 })

      const tabNotes = measure.notes.map(n => {
        if (n.string != null && n.fret != null) {
          // Normal fretted note
          return vf.TabNote({
            positions: [{ str: n.string, fret: n.fret }],
            duration: n.duration || 'q',
          })
        } else {
          // Rest: dummy position, then suppress fret text
          const rest = vf.TabNote({
            positions: [{ str: 1, fret: 0 }],
            duration: n.duration || 'qr',
          })
            ; (rest as any).drawPositions = () => { }
          return rest
        }
      })

      // If measure is completely empty, pad with a whole rest
      if (tabNotes.length === 0) {
        const rest = vf.TabNote({
          positions: [{ str: 1, fret: 0 }],
          duration: 'wr',
        })
          ; (rest as any).drawPositions = () => { }
        tabNotes.push(rest)
      }

      const voice = vf.Voice({ time: measure.timeSignature })
        .setStrict(false)
        .addTickables(tabNotes)

      system
        .addStave({ voices: [voice], options: { numLines: tuning.length } })
        .addClef('tab')
        .addTimeSignature(measure.timeSignature)
    })

    vf.draw()
  }, [measures, tuning])

  return (
    <div>
      <div id="vex-tab" ref={containerRef} className="overflow-x-auto" />
      {measures.map(m => (
        <Typography key={m.id} variant="caption" color="text.secondary">
          {beatsRemaining(m)} beats remaining in this measure
        </Typography>
      ))}
    </div>
  )
}
