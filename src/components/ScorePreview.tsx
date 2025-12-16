'use client'

import { useState } from "react"
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import TabRenderer from './TabRenderer'
import StaffRenderer from './StaffRenderer'

export default function ScorePreview() {
    const [viewMode, setViewMode] = useState<'tab' | 'staff' | 'both'>('tab')

    return (
        <Box height="100%" overflow="auto" p="10px">
            {/* Renderer Slab (printable) */}
            <Grid item xs={12} md={8}>
                <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 2, boxShadow: 1 }}>
                    <FormControl fullWidth className="print:hidden">
                        <InputLabel id="view-mode-label" sx={{ color: 'WindowText' }}>View Mode</InputLabel>
                        <Select
                            labelId="view-mode-label"
                            value={viewMode}
                            label="View Mode"
                            onChange={(e) => setViewMode(e.target.value as 'tab' | 'staff' | 'both')}
                            sx={{
                                color: 'GrayText',
                                '.MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'GrayText',
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'primary.main',
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'primary.light',
                                },
                                '.MuiSvgIcon-root': {
                                    color: 'GrayText',
                                },
                            }}
                        >
                            <MenuItem value="tab">Tab</MenuItem>
                            <MenuItem value="staff">Staff</MenuItem>
                            <MenuItem value="both">Both</MenuItem>
                        </Select>
                    </FormControl>

                    <Box
                        className="print:hidden"
                        sx={{
                            backgroundColor: '#fef3c7',
                            color: '#92400e',
                            padding: '8px 16px',
                            borderRadius: 1,
                            fontSize: '0.875rem',
                            marginBottom: 2,
                        }}
                    >
                        🖨️ Heads up: For best results when printing, set margins to “none” and scale to “100%” in your printer settings.
                    </Box>

                    {/* Printable Renderers */}
                    {viewMode === 'tab' && (
                        <TabRenderer />
                    )}
                    {viewMode === 'staff' && (
                        <StaffRenderer />
                    )}
                    {viewMode === 'both' && (
                        <>
                            <TabRenderer />
                            <StaffRenderer />
                        </>
                    )}
                </Box>
            </Grid>
        </Box>
    )
}