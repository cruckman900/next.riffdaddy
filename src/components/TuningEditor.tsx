// /components/TuningEditor.tsx

import { useState } from "react";

export default function TuningEditor() {
    const [tuning, setTuning] = useState(["E4", "B3", "G3", "D3", "A2", "E2"])

    const updateTuning = (index: number, value: string) => {
        const newTuning = [...tuning]
        newTuning[index] = value
        setTuning(newTuning)
    }

    return (
        <div className="flex gap-1 flex-wrap text-sm">
            {tuning.map((note, i) => (
                <input
                    key={i}
                    value={note}
                    onChange={(e) => updateTuning(i, e.target.value)}
                    className="w-14 px-1 py-0.5 text-center border rounded"
                />
            ))}
        </div>
    )
}