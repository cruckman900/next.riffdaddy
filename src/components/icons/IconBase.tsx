import { motion } from 'framer-motion';
import React from 'react';

export interface IconProps {
    active?: boolean;
    hovered?: boolean;
    size?: number;
    color?: string;
    children: React.ReactNode;
}

export function IconBase({
    active = false,
    hovered = false,
    size = 28,
    color,
    children,
}: IconProps) {
    // Color logic
    const defaultColor = "#7f8a99";
    const hoverColor = "#cfd8e3";
    const activeColor = "#00d4ff";
    const finalColor = color || (active ? activeColor : hovered ? hoverColor : defaultColor);

    // Stroke width logic
    const strokeWidth = active ? 2.5 : 2.25;

    return (
        <motion.svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            initial={{ scale: 1 }}
            animate={{
                scale: active ? 1.15 : hovered ? 1.1 : 1,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            style={{ cursor: 'pointer' }}
        >
            {React.Children.map(children, (child) => {
                if (!React.isValidElement(child)) return null;

                return React.cloneElement(child as React.ReactElement, {
                    stroke: finalColor,
                    strokeWidth,
                    fill: 'none',
                    strokeLinecap: 'round',
                    strokeLinejoin: 'round',
                });
            })}
        </motion.svg>
    );
}