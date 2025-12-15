// /components/InstrumentSelector.tsx
import { useEffect, useState } from "react"
import { instruments } from "@/utils/instruments"
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Box,
    SelectChangeEvent,
} from '@mui/material'
import { motion } from "framer-motion"

type Props = {
    value?: string
    onChange: (value: string) => void
}

export default function InstrumentSelector({ value, onChange }: Props) {
    // internal state used when parent doesn't fully control the component
    const [selected, setSelected] = useState<string>(value ?? "Guitar")

    // keep internal state in sync when parent provides a value
    useEffect(() => {
        if (typeof value === 'string' && value !== selected) {
            setSelected(value)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value])

    const handleChange = (val: string) => {
        setSelected(val)
        onChange(val)
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
                    onChange={(e: SelectChangeEvent<string>) => handleChange(e.target.value as string)}
                    renderValue={(val) => {
                        const inst = instruments.find((i) => i.value === (val ?? selected))
                        return (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {inst?.icon && <inst.icon />}
                                {inst?.label}
                            </Box>
                        )
                    }}
                >
                    {instruments.map(({ value: v, label, icon: Icon }) => (
                        <MenuItem key={v} value={v}>
                            <ListItemIcon><Icon /></ListItemIcon>
                            <ListItemText primary={label} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </motion.div>
    )
}
