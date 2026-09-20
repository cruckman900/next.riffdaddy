'use client'

import { ToolTemplate } from "./ToolTemplate"
import { useMusic } from '@/context/MusicContext'
import { TextField, Stack, MenuItem, Typography, Box, Divider } from '@mui/material'
import { useTheme } from '@mui/material/styles'

const DIFFICULTIES = ['', 'Beginner', 'Intermediate', 'Advanced', 'Expert']

export function MetadataTool() {
    const theme = useTheme()
    const { metadata, updateMetadata, selectedTuning } = useMusic()

    return (
        <ToolTemplate title="Song Info" shortcut="6">
            <Typography variant="body1" mb={1.5}>
                Attach descriptive info to this score — shown as a header above the printed/previewed music.
            </Typography>

            <Stack spacing={2}>
                <TextField
                    label="Title"
                    value={metadata.title}
                    onChange={(e) => updateMetadata({ title: e.target.value })}
                    fullWidth
                    size="small"
                />
                <TextField
                    label="Artist / Author"
                    value={metadata.artist}
                    onChange={(e) => updateMetadata({ artist: e.target.value })}
                    fullWidth
                    size="small"
                />
                <Stack direction="row" spacing={2}>
                    <TextField
                        label="Album"
                        value={metadata.album}
                        onChange={(e) => updateMetadata({ album: e.target.value })}
                        fullWidth
                        size="small"
                    />
                    <TextField
                        label="Composer"
                        value={metadata.composer}
                        onChange={(e) => updateMetadata({ composer: e.target.value })}
                        fullWidth
                        size="small"
                    />
                </Stack>
                <Stack direction="row" spacing={2}>
                    <TextField
                        label="Year"
                        value={metadata.year}
                        onChange={(e) => updateMetadata({ year: e.target.value })}
                        fullWidth
                        size="small"
                    />
                    <TextField
                        label="Capo"
                        type="number"
                        value={metadata.capo}
                        onChange={(e) => updateMetadata({ capo: Math.max(0, Number(e.target.value) || 0) })}
                        fullWidth
                        size="small"
                        inputProps={{ min: 0, max: 12 }}
                    />
                </Stack>
                <TextField
                    select
                    label="Difficulty"
                    value={metadata.difficulty}
                    onChange={(e) => updateMetadata({ difficulty: e.target.value })}
                    fullWidth
                    size="small"
                >
                    {DIFFICULTIES.map(d => (
                        <MenuItem key={d || 'none'} value={d}>{d || <em>Not set</em>}</MenuItem>
                    ))}
                </TextField>
                <TextField
                    label="Notes / Comments"
                    value={metadata.notes}
                    onChange={(e) => updateMetadata({ notes: e.target.value })}
                    fullWidth
                    multiline
                    minRows={3}
                    size="small"
                />
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Box
                sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: `${theme.palette.accent.main}0f`,
                    border: '1px solid',
                    borderColor: `${theme.palette.accent.main}44`,
                }}
            >
                <Typography variant="subtitle2" sx={{ color: theme.palette.accent.main, fontWeight: 700 }}>
                    Tuning (reference only)
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {selectedTuning.name} — {selectedTuning.notes.join(' ')}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    Change this from the Instrument &amp; Tuning tool.
                </Typography>
            </Box>
        </ToolTemplate>
    )
}
