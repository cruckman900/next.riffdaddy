'use client'

import { useState } from 'react';
import { IconProps } from '@/components/icons/IconBase';
import { Tooltip } from './Tooltip';
import { useTheme } from '@mui/material/styles';

interface ToolButtonProps {
    label: string;
    active: boolean;
    onClick: () => void;
    children: (props: IconProps) => JSX.Element;
}

export function ToolButton({ label, active, onClick, children }: ToolButtonProps) {
    const theme = useTheme()

    const [hovered, setHovered] = useState(false);

    const Icon = children;

    return (
        <Tooltip label={label}>
            <button
                aria-label={label}
                onClick={onClick}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                style={{
                    position: 'relative',
                    width: "48px",
                    height: "48px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "10px",
                    background: active
                        ? `${theme.palette.accent.main}22`
                        : hovered
                            ? 'rgba(255,255,255,0.06)'
                            : "transparent",
                    boxShadow: active ? `0 0 14px ${theme.palette.accent.main}77` : 'none',
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    transition: 'background 0.2s ease, box-shadow 0.2s ease',
                }}
            >
                {active && (
                    <span
                        style={{
                            position: 'absolute',
                            left: -6,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            width: 3,
                            height: 22,
                            borderRadius: 999,
                            background: theme.palette.accent.main,
                            boxShadow: `0 0 8px ${theme.palette.accent.main}`,
                        }}
                    />
                )}
                {Icon({ active, hovered, size: 28 })}
            </button>
        </Tooltip>
    );
}