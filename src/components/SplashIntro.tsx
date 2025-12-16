/* eslint-disable @next/next/no-img-element */
'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function SplashIntro() {
  const [visible, setVisible] = useState(true)
  const [canPlay, setCanPlay] = useState(false)

  useEffect(() => {
    if (canPlay) {
      const audio = new Audio('/splash.mp3')
      audio.volume = 0.6
      audio.play()

      const timer = setTimeout(() => setVisible(false), 3500)
      return () => clearTimeout(timer)
    }
  }, [canPlay])

  if (!visible) return null

  const handleInteraction = () => setCanPlay(true)

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1, scale: 1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 3 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
        >
          <div className="relative flex items-center justify-center">
            <img
              src="/og-image.png"
              alt="NEXTRiff Splash"
              className="w-3/4 max-w-md drop-shadow-[0_0_12px_#b366ff]"
              style={{ borderRadius: '24px' }}
            />
            <span
              role="button"
              tabIndex={0}
              onClick={handleInteraction}
              onKeyDown={handleInteraction}
              onScroll={handleInteraction}
              className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#b366ff] font-mono text-sm px-4 py-2 border border-[#b366ff] rounded-full animate-pulse drop-shadow-[0_0_6px_#b366ff] bg-black bg-opacity-80 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#b366ff]"
            >
              Click to Enter
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}