import { IconProps } from "@/components/icons/IconBase"
import { CockpitIcon } from "@/components/icons/CockpitIcon"
import { NoteIcon } from "@/components/icons/NoteIcon"
import { RestIcon } from "@/components/icons/RestIcon"
import { TimeSignatureIcon } from "@/components/icons/TimeSignatureIcon"
import { KeySignatureIcon } from "@/components/icons/KeySignatureIcon"
import { PlaybackIcon } from "@/components/icons/PlaybackIcon"

// Tool component types
export interface ToolDefinition {
    id: string
    label: string
    icon: (props: IconProps) => JSX.Element
    component: React.ComponentType<unknown>
    shortcut?: string
}

import { CockpitTool } from "@/components/tools/CockpitTool"
// import { NoteEntryTool } from "@/components/tools/NoteTool"
// import { RestEntryTool } from "@/components/tools/RestTool"
// import { TimeSignatureTool } from "@/components/tools/TimeSignatureTool"
// import { KeySignatureTool } from "@/components/tools/KeySignatureTool"
// import { PlaybackTool } from "@/components/tools/PlaybackTool"

export const TOOL_REGISTRY: Record<string, ToolDefinition> = {
    cockpit: {
        id: "cockpit",
        label: "Instrument & Tuning",
        icon: CockpitIcon,
        component: CockpitTool,
        shortcut: "1"
    },
    // notes: {
    //     id: "notes",
    //     label: "Note Entry",
    //     icon: NoteIcon,
    //     component: NoteEntryTool,
    //     shortcut: "2"
    // },
    // rests: {
    //     id: "rests",
    //     label: "Rest Entry",
    //     icon: RestIcon,
    //     component: RestEntryTool,
    //     shortcut: "3"
    // },
    // time: {
    //     id: "time",
    //     label: "Time Signature",
    //     icon: TimeSignatureIcon,
    //     component: TimeSignatureTool,
    //     shortcut: "4"
    // },
    // key: {
    //     id: "key",
    //     label: "Key Signature",
    //     icon: KeySignatureIcon,
    //     component: KeySignatureTool,
    //     shortcut: "5"
    // },
    // playback: {
    //     id: "playback",
    //     label: "Playback Controls",
    //     icon: PlaybackIcon,
    //     component: PlaybackTool,
    //     shortcut: "6"
    // },
}

export const TOOL_ORDER: string[] = [
    "cockpit",
    // "notes",
    // "rests",
    // "time",
    // "key",
    // "playback",
]