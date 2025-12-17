import { IconBase, IconProps } from './IconBase'

export function NoteIcon(props: IconProps) {
    return (
        <IconBase {...props}>
            <path d="M9 4v10a3 3 0 1 0 2-2.83V6h5V4H9z" />
        </IconBase>
    )
}