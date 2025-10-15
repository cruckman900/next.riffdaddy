// /components/InstrumentSelector.tsx

import { useState } from "react"
export default function InstrumentSelector() {
    const instruments = ["Guitar", "Bass", "Ukulele", "Violin"]
    const [instrument, setInstrument] = useState("Guitar")

    return (
        <select
            id="instrument"
            value={instrument}
            onChange={(e) => setInstrument(e.target.value)}
            className="px-2 py-1 border rounded print:hidden"
        >
            {instruments.map((inst) => (
                <option key={inst}>{inst}</option>
            ))}
        </select>
    )
}