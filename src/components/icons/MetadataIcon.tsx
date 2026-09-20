import { IconBase, IconProps } from './IconBase';

// A small "info card" with a music note badge in the corner — represents
// the score's descriptive metadata (Title/Artist/etc.), distinct from the
// clef icon (which represents the notated music itself). Note: IconBase
// forces `fill: none` + a shared stroke color on every child (see
// ClefIcon's circles), so this is built entirely from strokes.
export function MetadataIcon(props: IconProps) {
    return (
        <IconBase {...props}>
            {/* Card outline */}
            <rect x="3" y="4" width="14" height="16" rx="2" />
            {/* Text lines (Title / Artist rows) */}
            <path d="M6 8h8" />
            <path d="M6 11.5h8" />
            <path d="M6 15h5" />
            {/* Music note badge, bottom-right */}
            <circle cx="18" cy="18" r="1.6" />
            <path d="M19.6 18V9.5l2-.6" />
            <circle cx="21.6" cy="8.9" r="1.6" />
        </IconBase>
    );
}
