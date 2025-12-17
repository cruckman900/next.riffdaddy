import { IconBase, IconProps } from './IconBase'

export function KeyboardIcon(props: IconProps) {
    return (
        <IconBase {...props}>
            {/* Simplified piano keys: rectangle with vertical divisions */}
            <rect x="3" y="6" width="18" height="12" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <path d="M7 6v12M11 6v12M15 6v12M19 6v12" stroke="currentColor" strokeWidth="1.5" />
        </IconBase>
    )
}
