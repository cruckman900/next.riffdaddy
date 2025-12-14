import { IconBase, IconProps } from './IconBase';

export function CockpitIcon(props: IconProps) {
    return (
        <IconBase {...props}>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v3" />
            <path d="M12 19v3" />
            <path d="M4.93 4.93l2.12 2.12" />
            <path d="M16.95 16.95l2.12 2.12" />
            <path d="M2 12h3" />
            <path d="M19 12h3" />
            <path d="M4.93 19.07l2.12-2.12" />
            <path d="M16.95 7.05l2.12-2.12" />
        </IconBase>
    )
}