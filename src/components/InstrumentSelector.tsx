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

export default function InstrumentSelector({ onChange }: { onChange: (value: string) => void }) {
    const [selected, setSelected] = useState("Guitar")

    const handleChange = (value: string) => {
        setSelected(value)
        onChange(value)
    }

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
                    onChange={(e) => handleChange(e.target.value)}
                    renderValue={() => {
                        const inst = instruments.find((i) => i.value === selected);
                        return (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {inst?.icon && <inst.icon />}
                                {inst?.label}
                            </Box>
                        );
                    }}
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
