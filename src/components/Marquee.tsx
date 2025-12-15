'use client'

export function Marquee() {
    return (
        <div className="relative w-full h-8 overflow-hidden bg-gray-900 text-green-400 text-sm px-4 py-2 font-mono print:hidden">
            <div className="whitespace-nowrap animate-marquee">
                🎶 Now Playing: “Linear Descent” · Tab Preview: E5 · G5 · A5 · D5 · F#5 · B5 · C#5 · Riff On!
            </div>
        </div>
    )
}
