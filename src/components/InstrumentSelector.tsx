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
    Box,
} from '@mui/material'
import { motion } from "framer-motion"

export default function InstrumentSelector() {
    const [selected, setSelected] = useState("Guitar")

    const selectedInstrument = instruments.find((inst) => inst.value == selected)

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >
            <FormControl fullWidth>
                <InputLabel id="instrument-label">Choose Instrument</InputLabel>
                <Select
                    labelId="instrument-label"
                    value={selected}
                    label="Choose Instrument"
                    onChange={(e) => setSelected(e.target.value)}
                    renderValue={() => (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {selectedInstrument?.icon && <selectedInstrument.icon />}
                            {selectedInstrument?.label}
                        </Box>
                    )}
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
