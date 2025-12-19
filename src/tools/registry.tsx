import { IconProps } from "@/components/icons/IconBase"
import { CockpitIcon } from "@/components/icons/CockpitIcon"
import { FretboardIcon } from "@/components/icons/FretboardIcon"
import { KeyboardIcon } from "@/components/icons/KeyboardIcon"
import { PlaybackIcon } from "@/components/icons/PlaybackIcon"

import { ToolProps } from "@/types/tooling"

import { CockpitTool } from "@/components/tools/CockpitTool"
import { FretboardTool } from "@/components/tools/FretboardTool"
import { KeyboardTool } from "@/components/tools/KeyboardTool"
import { PlaybackTool } from "@/components/tools/PlaybackTool"
import { ClefPalette } from "@/components/tools/ClefPalette"
import { ClefIcon } from "@/components/icons/ClefIcon"

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
    playback: {
        id: "playback",
        label: "Playback Controls",
        icon: PlaybackIcon,
        component: PlaybackTool,
        shortcut: "5"
    },
}

export const TOOL_ORDER: string[] = [
    "cockpit",
    "clef",
    "fretboard",
    "keyboard",
    "playback",
]
