import { IconBase, IconProps } from './IconBase';

export function MeasureIcon(props: IconProps) {
    return (
        <IconBase {...props}>
            {/* Two vertical bar lines to represent a measure boundary */}
            <path d="M6 4v16M18 4v16" stroke="currentColor" strokeWidth="1.5" />
            {/* Small beat markers inside the measure */}
            <circle cx="10" cy="8" r="1" fill="currentColor" />
            <circle cx="14" cy="12" r="1" fill="currentColor" />
            <circle cx="10" cy="16" r="1" fill="currentColor" />
        </IconBase>
    );
}
