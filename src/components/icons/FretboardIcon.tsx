import { IconBase, IconProps } from './IconBase'

export function FretboardIcon(props: IconProps) {
    return (
        <IconBase {...props}>
            {/* Simplified fretboard: horizontal lines for strings, vertical for frets */}
            <path d="M3 6h18M3 10h18M3 14h18M3 18h18" stroke="currentColor" strokeWidth="1.5" />
            <path d="M6 4v14M10 4v14M14 4v14M18 4v14" stroke="currentColor" strokeWidth="1.5" />
        </IconBase>
    )
}
