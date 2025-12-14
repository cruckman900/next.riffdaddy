import { IconBase, IconProps } from './IconBase';

export function NoteIcon(props: IconProps) {
    return (
        <IconBase {...props}>
            <path d="M9 3v18" />
            <path d="M15 3v18" />
            <path d="M5 8h14" />
            <path d="M5 16h14" />
        </IconBase>
    );
}