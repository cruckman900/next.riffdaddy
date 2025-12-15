import { useState } from 'react';
import { IconProps } from '@/components/icons/IconBase';

interface ToolButtonProps {
    label: string;
    active: boolean;
    onClick: () => void;
    children: (props: IconProps) => JSX.Element;
}

export function ToolButton({ label, active, onClick, children }: ToolButtonProps) {
    const [hovered, setHovered] = useState(false);

    const Icon = children;

    return (
        <button
            aria-label={label}
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                width: "48px",
                height: "48px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: active ? "rgba(0, 212, 255, 0.1)" : "transparent",
                border: "none",
                cursor: "pointer",
                padding: 0,
            }}
        >
            {Icon({ active, hovered, size: 28 })}
        </button>
    );
}