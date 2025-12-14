import { IconBase, IconProps } from './IconBase';

export function NoteIcon(props: IconProps) {
    return (
        <IconBase {...props}>
            <circle cx="12" cy="12" r="9" />
            <path d="M10 8l6 4-6 4z" />
        </IconBase>
    );
}