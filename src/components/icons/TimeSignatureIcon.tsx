import { IconBase, IconProps } from './IconBase';

export function NoteIcon(props: IconProps) {
    return (
        <IconBase {...props}>
            <path d="M7 4v16" />
            <path d="M17 4v16" />
            <path d="M7 12h10" />
        </IconBase>
    );
}