import { IconBase, IconProps } from './IconBase';

export function ClefIcon(props: IconProps) {
    return (
        <IconBase {...props}>
            {/* Vertical line */}
            <path d="M12 4v16" stroke="currentColor" strokeWidth="1.5" />
            {/* Swirl/dot to suggest clef */}
            <circle cx="11" cy="9" r="2" fill="currentColor" />
            <circle cx="13" cy="15" r="3" fill="currentColor" />
        </IconBase>
    );
}
