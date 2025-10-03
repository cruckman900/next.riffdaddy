/* eslint-disable @next/next/no-img-element */
// src/components/SplashIntro.tsx
"use client"

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function SplashIntro() {
    const [visible, setVisible] = useState(true)
    const [canPlay, setCanPlay] = useState(false);

    useEffect(() => {
        const handleInteraction = () => setCanPlay(true);
        window.addEventListener('click', handleInteraction, { once: true });
        window.addEventListener('keydown', handleInteraction, { once: true });
        window.addEventListener('scroll', handleInteraction, { once: true });

        return () => {
            window.removeEventListener('click', handleInteraction);
            window.removeEventListener('keydown', handleInteraction);
            window.removeEventListener('scroll', handleInteraction);
        };
    }, []);


    useEffect(() => {
        if (canPlay) {
            const audio = new Audio('/splash.mp3');
            audio.volume = 0.6;
            audio.play();

            const timer = setTimeout(() => setVisible(false), 3500)
            return () => clearTimeout(timer)
        }
    }, [canPlay])

    if (!visible) return null;

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
                    <div className='relative'>
                        <img
                            src="/og-image.png"
                            alt="NEXTRiff Splash"
                            className="w-3/4 max-w-md drop-shadow-[0_0_12px_#b366ff]"
                        />
                        <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[#b366ff] font-mono text-sm px-4 py-2 border border-[#b366ff] rounded-full animate-pulse drop-shadow-[0_0_6px_#b366ff] bg-black bg-opacity-80">
                            Click to Enter
                        </span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}