import { IconProps } from "@/components/icons/IconBase"
import { CockpitIcon } from "@/components/icons/CockpitIcon"
import { FretboardIcon } from "@/components/icons/FretboardIcon"
import { KeyboardIcon } from "@/components/icons/KeyboardIcon"
import { DrumIcon } from "@/components/icons/DrumIcon"
import { PlaybackIcon } from "@/components/icons/PlaybackIcon"

import { ToolProps } from "@/types/tooling"

import { CockpitTool } from "@/components/tools/CockpitTool"
import { FretboardTool } from "@/components/tools/FretboardTool"
import { KeyboardTool } from "@/components/tools/KeyboardTool"
import { DrumTool } from "@/components/tools/DrumTool"
import { PlaybackTool } from "@/components/tools/PlaybackTool"
import { ClefPalette } from "@/components/tools/ClefPalette"
import { ClefIcon } from "@/components/icons/ClefIcon"
import { MetadataTool } from "@/components/tools/MetadataTool"
import { MetadataIcon } from "@/components/icons/MetadataIcon"

export const TOOL_REGISTRY: Record<string, {
    id: string
    label: string
    icon: (props: IconProps) => JSX.Element
    shortcut: string
    component: React.ComponentType<ToolProps>
}> = {
    cockpit: {
        id: "cockpit",
        label: "Instrument & Tuning",
        icon: CockpitIcon,
        component: CockpitTool,
        shortcut: "1"
    },
    clef: {
        id: "clef",
        label: "Score and Measure",
        icon: ClefIcon,
        component: ClefPalette,
        shortcut: "2"
    },
    fretboard: {
        id: "fretboard",
        label: "Fretboard Input",
        icon: FretboardIcon,
        component: FretboardTool,
        shortcut: "3"
    },
    keyboard: {
        id: "keyboard",
        label: "Keyboard Input",
        icon: KeyboardIcon,
        component: KeyboardTool,
        shortcut: "4"
    },
    // Only shown/reachable when the current tab's instrument is Drums (see
    // ToolRail's filtering and Workbench's auto-switch effect) — takes
    // Fretboard/Keyboard's place rather than sitting alongside them, since
    // neither makes sense for an unpitched kit.
    drum: {
        id: "drum",
        label: "Drum Input",
        icon: DrumIcon,
        component: DrumTool,
        shortcut: "7"
    },
    playback: {
        id: "playback",
        label: "Playback Controls",
        icon: PlaybackIcon,
        component: PlaybackTool,
        shortcut: "5"
    },
    metadata: {
        id: "metadata",
        label: "Song Info",
        icon: MetadataIcon,
        component: MetadataTool,
        shortcut: "6"
    },
}

export const TOOL_ORDER: string[] = [
    "cockpit",
    "clef",
    "fretboard",
    "keyboard",
    "drum",
    "playback",
    "metadata",
]
