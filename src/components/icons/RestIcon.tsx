import { IconBase, IconProps } from './IconBase';

export function NoteIcon(props: IconProps) {
    return (
        <IconBase {...props}>
            <path d="M10 3l4 4-4 4 4 4-4 4" />
        </IconBase>
    );
}