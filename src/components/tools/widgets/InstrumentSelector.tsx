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
    onChange: (instrument: string, strings: number, frets: number) => void
}

const instrumentOptions: Record<string, { strings: number[]; frets: number[] }> = {
    guitar: { strings: [6, 7, 8], frets: [19, 21, 22, 24] },
    bass: { strings: [4, 5, 6], frets: [20, 21, 22, 24] },
    cello: { strings: [4], frets: [12, 15] },   // positions
    violin: { strings: [4], frets: [12, 15] },  // positions
}

export default function InstrumentSelector({ value, onChange }: Props) {
    const instrument = value ?? "guitar"
    const currentOpts = instrumentOptions[instrument] ?? instrumentOptions.guitar

    const [strings, setStrings] = useState<number>(currentOpts.strings[0])
    const [frets, setFrets] = useState<number>(currentOpts.frets[0])

    // Reset strings/frets to the new instrument's defaults whenever the
    // instrument (driven by the parent, e.g. context) changes — previously
    // this compared against a separately-tracked local `instrument` copy that
    // could fall out of sync, leaving stale strings/frets values that didn't
    // belong to the new instrument's option list.
    useEffect(() => {
        setStrings(currentOpts.strings[0])
        setFrets(currentOpts.frets[0])
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [instrument])

    const handleInstrumentChange = (val: string) => {
        const opts = instrumentOptions[val] ?? instrumentOptions.guitar
        onChange(val, opts.strings[0], opts.frets[0])
    }

    const handleStringsChange = (val: number) => {
        setStrings(val)
        onChange(instrument, val, frets)
    }

    const handleFretsChange = (val: number) => {
        setFrets(val)
        onChange(instrument, strings, val)
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >
            <Box
                display="flex"
                gap={1}
                sx={{
                    pt: 1,
                    maxWidth: 320,
                    flexWrap: 'wrap',
                }}
            >
                {/* Instrument dropdown */}
                <FormControl size="small" sx={{ minWidth: 100, flex: 1 }}>
                    <InputLabel id="instrument-label">Instrument</InputLabel>
                    <Select
                        labelId="instrument-label"
                        value={instrument}
                        label="Instrument"
                        onChange={(e: SelectChangeEvent<string>) => handleInstrumentChange(e.target.value)}
                        renderValue={(val) => {
                            const inst = instruments.find((i) => i.value === (val ?? instrument))
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

                {/* Strings dropdown */}
                <FormControl size="small" sx={{ minWidth: 80, flex: 1 }}>
                    <InputLabel>Strings</InputLabel>
                    <Select
                        value={strings}
                        label="Strings"
                        onChange={(e) => handleStringsChange(Number(e.target.value))}
                    >
                        {currentOpts.strings.map((s) => (
                            <MenuItem key={s} value={s}>{s}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Frets dropdown */}
                <FormControl size="small" sx={{ minWidth: 80, flex: 1 }}>
                    <InputLabel>Frets</InputLabel>
                    <Select
                        value={frets}
                        label="Frets"
                        onChange={(e) => handleFretsChange(Number(e.target.value))}
                    >
                        {currentOpts.frets.map((f) => (
                            <MenuItem key={f} value={f}>{f}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
        </motion.div>
    )
}
