import { motion } from 'framer-motion'
import React from 'react'
import { useTheme } from '@mui/material/styles'

export interface IconProps {
    active?: boolean
    hovered?: boolean
    size?: number
    color?: string
}

interface IconBaseProps extends IconProps {
    children: React.ReactNode
}

export function IconBase({
    active = false,
    hovered = false,
    size = 28,
    color,
    children,
}: IconBaseProps) {
    const theme = useTheme()

    // Color palette
    const defaultColor = theme.palette.muted.contrastText //"#7f8a99"
    const hoverColor = theme.palette.text.primary //"#cfd8e3"
    const activeColor = theme.palette.accent.main // "#00d4ff"

    // Final stroke color
    const finalColor = color || (active ? activeColor : hovered ? hoverColor : defaultColor)

    // Stroke width
    const strokeWidth = active ? 2.5 : 2.25

    // Animation values
    const scale = active ? 1.15 : hovered ? 1.1 : 1
    const opacity = active ? 1 : hovered ? 0.9 : 0.8

    return (
        <motion.svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            initial={{ scale: 1, opacity: 0.8 }}
            animate={{ scale, opacity }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            style={{ cursor: 'pointer' }}
        >
            {React.Children.map(children, (child) => {
                if (!React.isValidElement(child)) return null

                return React.cloneElement(child as React.ReactElement, {
                    stroke: finalColor,
                    strokeWidth,
                    fill: 'none',
                    strokeLinecap: 'round',
                    strokeLinejoin: 'round',
                })
            })}
        </motion.svg>
    )
}