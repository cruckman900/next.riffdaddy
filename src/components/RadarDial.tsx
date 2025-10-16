import { Box, Typography } from '@mui/material'
import { motion } from 'framer-motion'

export default function RadarDial() {
    return (
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeInOut'}}
            >
                <Box
                    sx={{
                        width: 200,
                        height: 200,
                        borderRadius: '50%',
                        border: '2px solid #90caf9',
                        position: 'relative',
                        bgcolor: 'Background.paper',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: 3,
                    }}
                >
                    <Typography variant='subtitle1'>Radar Dial</Typography>
                    {/* TODO: Add tuning spread or note density markers */}
                </Box>
            </motion.div>
    )
}