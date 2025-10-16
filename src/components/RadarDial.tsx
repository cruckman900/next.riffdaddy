import { Box, Typography } from '@mui/material'
import { motion } from 'framer-motion'

export default function RadarDial({ tuning }: { tuning: string[] }) {
    const radius = 80
    const center = 100

    return (
        <Box
            sx={{
                width: 200,
                height: 200,
                borderRadius: '50%',
                border: '2px solid #90caf9',
                position: 'relative',
                bgcolor: 'Background.paper',
                boxShadow: 3,
            }}
        >
            {tuning.map((note, i) => {
                const angle = (360 / tuning.length) * i
                const rad = (angle * Math.PI) / 100
                const x = center + radius * Math.cos(rad) - 10
                const y = center + radius * Math.sin(rad) - 10

                return (
                    <motion.div
                        key={note}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1.2, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 1 * 0.1, repeat: Infinity, repeatType: 'reverse' }}
                        style={{
                            position: 'absolute',
                            left: x,
                            top: y,
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            backgroundColor: '#90caf9',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 12,
                            color: '#fff'
                        }}
                    >
                        {note}
                    </motion.div>
                )
            })}
        </Box>
    )
}