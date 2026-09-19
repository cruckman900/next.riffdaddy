// src/components/help/helpTopics.tsx
import type { SvgIconComponent } from '@mui/icons-material'
import RocketLaunchTwoToneIcon from '@mui/icons-material/RocketLaunchTwoTone'
import DashboardTwoToneIcon from '@mui/icons-material/DashboardTwoTone'
import BuildTwoToneIcon from '@mui/icons-material/BuildTwoTone'
import PaletteTwoToneIcon from '@mui/icons-material/PaletteTwoTone'
import KeyboardAltTwoToneIcon from '@mui/icons-material/KeyboardAltTwoTone'
import LockPersonTwoToneIcon from '@mui/icons-material/LockPersonTwoTone'

export interface HelpTopic {
    id: string
    title: string
    icon: SvgIconComponent
    summary: string
}

// Table-of-contents metadata. The actual rich content for each topic lives in
// HelpSection.tsx so JSX bodies stay colocated with their markup.
export const HELP_TOPICS: HelpTopic[] = [
    {
        id: 'getting-started',
        title: 'Getting Started',
        icon: RocketLaunchTwoToneIcon,
        summary: 'The splash screen, navigation, and creating your first tab.',
    },
    {
        id: 'workspace',
        title: 'The Workspace',
        icon: DashboardTwoToneIcon,
        summary: 'Tabs, the tool rail, and the score preview.',
    },
    {
        id: 'tools',
        title: 'Tools',
        icon: BuildTwoToneIcon,
        summary: 'Instrument & tuning, clefs, fretboard & keyboard input, playback.',
    },
    {
        id: 'settings',
        title: 'Settings',
        icon: PaletteTwoToneIcon,
        summary: 'Themes and score display preferences.',
    },
    {
        id: 'shortcuts',
        title: 'Keyboard Shortcuts',
        icon: KeyboardAltTwoToneIcon,
        summary: 'Speed up your workflow with the keyboard.',
    },
    {
        id: 'account',
        title: 'Account & Access',
        icon: LockPersonTwoToneIcon,
        summary: 'Registering, logging in, and resetting your password.',
    },
]
