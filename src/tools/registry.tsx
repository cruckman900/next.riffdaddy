import { IconProps } from "@/components/icons/IconBase"
import { CockpitIcon } from "@/components/icons/CockpitIcon"
import { MeasureIcon } from "@/components/icons/MeasureIcon"
import { FretboardIcon } from "@/components/icons/FretboardIcon"
import { KeyboardIcon } from "@/components/icons/KeyboardIcon"
import { RestIcon } from "@/components/icons/RestIcon"
import { TimeSignatureIcon } from "@/components/icons/TimeSignatureIcon"
import { KeySignatureIcon } from "@/components/icons/KeySignatureIcon"
import { PlaybackIcon } from "@/components/icons/PlaybackIcon"

import { ToolProps } from "@/types/tooling"

import { CockpitTool } from "@/components/tools/CockpitTool"
import { MeasureTool } from "@/components/tools/MeasureTool"
import { FretboardTool } from "@/components/tools/FretboardTool"
import { KeyboardTool } from "@/components/tools/KeyboardTool"
import { RestEntryTool } from "@/components/tools/RestEntryTool"
import { TimeSignatureTool } from "@/components/tools/TimeSignatureTool"
import { KeySignatureTool } from "@/components/tools/KeySignatureTool"
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
    measure: {
        id: "Measure",
        label: "Measure Entry",
        icon: MeasureIcon,
        component: MeasureTool,
        shortcut: "2"
    },
    clef: {
        id: "clef",
        label: "Clef Palette",
        icon: ClefIcon,
        component: ClefPalette,
        shortcut: "C"
    },
    fretboard: {
        id: "fretboard",
        label: "Fretboard",
        icon: FretboardIcon,
        component: FretboardTool,
        shortcut: "3"
    },
    keyboard: {
        id: "keyboard",
        label: "Keyboard",
        icon: KeyboardIcon,
        component: KeyboardTool,
        shortcut: "4"
    },
    rests: {
        id: "rests",
        label: "Rest Entry",
        icon: RestIcon,
        component: RestEntryTool,
        shortcut: "5"
    },
    time: {
        id: "time",
        label: "Time Signature",
        icon: TimeSignatureIcon,
        component: TimeSignatureTool,
        shortcut: "6"
    },
    key: {
        id: "key",
        label: "Key Signature",
        icon: KeySignatureIcon,
        component: KeySignatureTool,
        shortcut: "7"
    },
    playback: {
        id: "playback",
        label: "Playback Controls",
        icon: PlaybackIcon,
        component: PlaybackTool,
        shortcut: "8"
    },
}

export const TOOL_ORDER: string[] = [
    "cockpit",
    "measure",
    "clef",
    "fretboard",
    "keyboard",
    "rests",
    "time",
    "key",
    "playback",
]
