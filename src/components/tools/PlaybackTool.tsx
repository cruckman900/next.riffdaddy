'use client'

import { ToolTemplate } from "./ToolTemplate"
import Stack from '@mui/material/Stack'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Slider from '@mui/material/Slider'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import StopIcon from '@mui/icons-material/Stop'
import MusicNoteTwoToneIcon from '@mui/icons-material/MusicNoteTwoTone'
import { useTheme } from '@mui/material/styles'
import { useMusic } from '@/context/MusicContext'
import { usePlayback } from '@/hooks/usePlayback'

export function PlaybackTool() {
    const theme = useTheme()
    const { tempo, setTempo } = useMusic()
    const { isPlaying, isLoading, error, currentMeasureIndex, hasNotes, measureCount, toggle, stop } = usePlayback()

    const transportButtonSx = (active: boolean, disabled: boolean) => ({
        width: 56,
        height: 56,
        border: '1px solid',
        borderColor: active ? theme.palette.accent.main : 'divider',
        color: active ? theme.palette.accent.main : theme.palette.text.primary,
        bgcolor: active ? `${theme.palette.accent.main}1f` : 'rgba(255,255,255,0.03)',
        boxShadow: active ? `0 0 16px ${theme.palette.accent.main}77` : 'none',
        transition: 'all 0.15s ease',
        opacity: disabled ? 0.4 : 1,
        '&:hover': disabled ? {} : {
            borderColor: theme.palette.accent.main,
            boxShadow: `0 0 12px ${theme.palette.accent.main}55`,
        },
    })

    return (
        <ToolTemplate title="Playback" shortcut="5">
            <Typography variant="body1" mb={1}>
                Control playback of your composition.
            </Typography>

            {!hasNotes && (
                <Chip
                    icon={<MusicNoteTwoToneIcon sx={{ color: `${theme.palette.accent.main} !important` }} />}
                    label="Add some notes to hear your composition play back"
                    size="small"
                    variant="outlined"
                    sx={{ mb: 2, borderColor: `${theme.palette.accent.main}66`, color: theme.palette.text.secondary }}
                />
            )}

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" mb={2}>
                <IconButton
                    aria-label="Stop"
                    onClick={stop}
                    disabled={!isPlaying}
                    sx={transportButtonSx(false, !isPlaying)}
                >
                    <StopIcon />
                </IconButton>
                <IconButton
                    aria-label={isPlaying ? 'Stop' : 'Play'}
                    onClick={toggle}
                    disabled={!hasNotes || isLoading}
                    sx={transportButtonSx(isPlaying, !hasNotes)}
                >
                    {isLoading ? <CircularProgress size={22} sx={{ color: theme.palette.accent.main }} /> : (isPlaying ? <StopIcon /> : <PlayArrowIcon />)}
                </IconButton>
            </Stack>

            {isPlaying && currentMeasureIndex != null && (
                <Typography variant="body2" align="center" sx={{ mb: 2, color: theme.palette.accent.main }}>
                    Playing measure {currentMeasureIndex + 1} of {measureCount}
                </Typography>
            )}

            <Box>
                <Stack direction="row" justifyContent="space-between" alignItems="baseline">
                    <Typography variant="body2" gutterBottom>
                        Tempo
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.palette.accent.main, fontWeight: 700 }}>
                        {tempo} BPM
                    </Typography>
                </Stack>
                <Box sx={{ px: 1 }}>
                    <Slider
                        value={tempo}
                        onChange={(_, v) => setTempo(v as number)}
                        min={40}
                        max={240}
                        step={1}
                        valueLabelDisplay="auto"
                        sx={{
                            color: theme.palette.accent.main,
                            '& .MuiSlider-thumb': {
                                boxShadow: `0 0 8px ${theme.palette.accent.main}`,
                            },
                        }}
                    />
                </Box>
            </Box>
        </ToolTemplate>
    )
}
