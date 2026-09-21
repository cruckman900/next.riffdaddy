import { IconBase, IconProps } from './IconBase'

export function DrumIcon(props: IconProps) {
    return (
        <IconBase {...props}>
            {/* Simplified drum kit: kick drum, snare, and a cymbal on a stand */}
            <circle cx="11" cy="16" r="5" />
            <circle cx="6" cy="8" r="2.75" />
            <path d="M14 4.5h6M17 4.5v3.5" />
        </IconBase>
    )
}
