'use client'

import { useEffect, useRef } from 'react'
import { Factory } from 'vexflow'
import { Typography } from '@mui/material'
import { useMusic } from '@/context/MusicContext'
import { beatsRemaining } from '@/utils/musicUtils'

export default function StaffRenderer() {
  const { measures } = useMusic()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    containerRef.current.innerHTML = ''

    const vf = new Factory({
      renderer: { elementId: containerRef.current.id, width: 900, height: 200 * measures.length },
    })

    measures.forEach((measure, idx) => {
      const system = vf.System({ x: 10, y: 40 + idx * 180, width: 800 })
      const score = vf.EasyScore()

      const staffSyntax: string[] = measure.notes.map(n => `${n.pitch}/${n.duration || 'q'}`)

      // Pad with rests if not enough beats
      const beats = parseInt(measure.timeSignature.split('/')[0])
      while (staffSyntax.length < beats) {
        staffSyntax.push('B4/r')
      }

      const voice = score.voice(score.notes(staffSyntax.join(', '), { stem: 'up' }))
      voice.setStrict(false)

      system.addStave({ voices: [voice] }).addClef('treble').addTimeSignature(measure.timeSignature)
    })

    vf.draw()
  }, [measures])

  return (
    <div>
      <div id="vex-staff" ref={containerRef} className="overflow-x-auto" />
      {measures.map(m => (
        <Typography key={m.id} variant="caption" color="text.secondary">
          {beatsRemaining(m)} beats remaining in this measure
        </Typography>
      ))}
    </div>
  )
}
