import { IconBase, IconProps } from './IconBase';

export function ScoreLayoutSlidersIcon(props: IconProps) {
    return (
        <IconBase {...props}>
            {/* Top slider line */}
            <path d="M4 7h16" />
            {/* Left arrow */}
            <path d="M4 7l3-3v6z" />
            {/* Right arrow */}
            <path d="M20 7l-3-3v6z" />

            {/* Bottom slider line */}
            <path d="M4 17h16" />
            {/* Left arrow */}
            <path d="M4 17l3-3v6z" />
            {/* Right arrow */}
            <path d="M20 17l-3-3v6z" />
        </IconBase>
    );
}