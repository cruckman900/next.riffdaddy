// /components/InstrumentSelector.tsx

import { useState } from "react"
import { instruments } from "@/utils/instruments"
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    ListItemIcon,
    ListItemText,
} from '@mui/material'
import { motion } from "framer-motion"

export default function InstrumentSelector() {
    const [selected, setSelected] = useState("Guitar")

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >
            <FormControl fullWidth>
                <InputLabel id="instrument-label">Instrument</InputLabel>
                <Select
                    labelId="instrument-label"
                    value={selected}
                    label="Instrument"
                    onChange={(e) => setSelected(e.target.value)}
                >
                    {instruments.map(({ value, label, icon: Icon }) => (
                        <MenuItem key={value} value={value}>
                            <ListItemIcon><Icon /></ListItemIcon>
                            <ListItemText primary={label} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </motion.div >
    )
}
