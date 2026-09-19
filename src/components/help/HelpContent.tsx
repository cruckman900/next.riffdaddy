// src/components/help/HelpContent.tsx
'use client'

import { Stack, Typography } from '@mui/material'
import HelpSection from './HelpSection'
import { SubHeading, Kbd, ShortcutRow, Bullet } from './HelpBlocks'
import { HELP_TOPICS } from './helpTopics'

export default function HelpContent() {
    const topic = (id: string) => HELP_TOPICS.find(t => t.id === id)!

    return (
        <Stack>
            <HelpSection id="getting-started" title={topic('getting-started').title} icon={topic('getting-started').icon}>
                <Typography variant="body2">
                    NEXTRiff opens with a glowing splash screen — click <strong>&ldquo;Click to Enter&rdquo;</strong> (or
                    press any key) to dismiss it and reveal the app underneath.
                </Typography>

                <SubHeading>Finding your way around</SubHeading>
                <Bullet>The <strong>header</strong> always shows the NEXTRiff logo (click it to return home) and a link to LinearDescent.</Bullet>
                <Bullet>The <strong>top nav</strong> links to Home, About, and either Login/Register (signed out) or Workspace/Log out (signed in).</Bullet>
                <Bullet>The <strong>☰ menu</strong> on the left of the nav opens a drawer with File New, File Open, Save, Settings, and History.</Bullet>

                <SubHeading>Creating your first tab</SubHeading>
                <Bullet>Register or log in, then open <strong>Workspace</strong> from the top nav.</Bullet>
                <Bullet>Click <strong>New Tab</strong> on the empty state, or use <strong>☰ → File New</strong>, to open a fresh editor tab.</Bullet>
                <Bullet>Each tab keeps its own score — rename a tab by double-clicking its title, or right-click for more options.</Bullet>
            </HelpSection>

            <HelpSection id="workspace" title={topic('workspace').title} icon={topic('workspace').icon}>
                <Typography variant="body2">
                    The Workspace is a three-part layout: a vertical <strong>tool rail</strong>, a <strong>tool panel</strong> with
                    controls for whichever tool is active, and a <strong>Score Preview</strong> that renders your composition live.
                </Typography>

                <SubHeading>Tabs</SubHeading>
                <Bullet>Open tabs appear in the strip on the left (top, on small screens).</Bullet>
                <Bullet>Double-click a tab&apos;s title to rename it, or right-click for a rename menu.</Bullet>
                <Bullet>Click the ✕ on a tab to close it — closed tabs are kept in <strong>History</strong> so you can reopen them.</Bullet>

                <SubHeading>Score Preview</SubHeading>
                <Bullet>Switch between <strong>Tab</strong>, <strong>Staff</strong>, and <strong>Combined</strong> views using the segmented control.</Bullet>
                <Bullet>Each measure gets a pill button with a live beat-fill bar — it glows red if a measure has more notes than it can hold.</Bullet>
                <Bullet>Click a measure to make it active; new notes and rests are inserted into the active measure.</Bullet>
            </HelpSection>

            <HelpSection id="tools" title={topic('tools').title} icon={topic('tools').icon}>
                <Typography variant="body2">
                    Five tools live on the tool rail. Switch between them by clicking an icon or pressing its number shortcut.
                </Typography>

                <SubHeading>1 · Instrument &amp; Tuning</SubHeading>
                <Bullet>Pick an instrument, string count, and fret count.</Bullet>
                <Bullet>Filter tunings by genre, choose a preset, or expand <strong>Add Custom Tuning</strong> to define your own.</Bullet>
                <Bullet>The radar dial visualizes your open strings; toggle <strong>Show Harmonic Arcs</strong> to see interval relationships colored by distance (unison, 4th, 5th, octave).</Bullet>

                <SubHeading>2 · Score &amp; Measure</SubHeading>
                <Bullet>Choose a clef, time signature, and key signature using the glowing chip selectors.</Bullet>
                <Bullet>Click <strong>Add Measure</strong> to append a new measure with the selected settings.</Bullet>

                <SubHeading>3 · Fretboard Input</SubHeading>
                <Bullet>Click frets to select notes — click several across different strings to build a chord.</Bullet>
                <Bullet>Toggle the fret count (12/21/24) and octave labels, then click <strong>Commit Note</strong> (or <strong>Commit Chord</strong>) to add it to the active measure.</Bullet>
                <Bullet>Use <strong>Insert a rest</strong> to add a rest of the current duration instead.</Bullet>

                <SubHeading>4 · Keyboard Input</SubHeading>
                <Bullet>Click piano keys (white and black) across up to 5 octaves to build notes or chords, then commit them the same way as the fretboard.</Bullet>
                <Bullet>Keys below your instrument&apos;s lowest string are disabled automatically.</Bullet>

                <SubHeading>Rhythm Palette</SubHeading>
                <Bullet>Shown above the Fretboard and Keyboard tools, it sets the duration (whole through 64th note) applied to the next note, chord, or rest you commit.</Bullet>

                <SubHeading>5 · Playback</SubHeading>
                <Bullet>Transport buttons and the tempo slider are a preview of the upcoming playback experience — the audio engine is still on the way.</Bullet>
            </HelpSection>

            <HelpSection id="settings" title={topic('settings').title} icon={topic('settings').icon}>
                <Typography variant="body2">
                    Open Settings from the <strong>☰ menu</strong>. It opens as its own tab so you can keep working alongside it.
                </Typography>

                <SubHeading>General</SubHeading>
                <Bullet>Choose from ten color themes, each with its own accent glow used throughout the app.</Bullet>
                <Bullet>Toggle between light and dark mode independently of the theme.</Bullet>

                <SubHeading>Score</SubHeading>
                <Bullet>Adjust <strong>Measures Per Row</strong> to control how densely the Score Preview lays out measures.</Bullet>
                <Bullet>Switch <strong>Score Width</strong> between Auto (fills the available space) and Fixed (consistent print-friendly width).</Bullet>
            </HelpSection>

            <HelpSection id="shortcuts" title={topic('shortcuts').title} icon={topic('shortcuts').icon}>
                <Typography variant="body2">
                    These shortcuts are active anywhere inside the Workspace.
                </Typography>
                <ShortcutRow keys={<Kbd>1</Kbd>} description="Instrument & Tuning tool" />
                <ShortcutRow keys={<Kbd>2</Kbd>} description="Score & Measure tool" />
                <ShortcutRow keys={<Kbd>3</Kbd>} description="Fretboard Input tool" />
                <ShortcutRow keys={<Kbd>4</Kbd>} description="Keyboard Input tool" />
                <ShortcutRow keys={<Kbd>5</Kbd>} description="Playback tool" />
                <ShortcutRow keys={<><Kbd>←</Kbd><Kbd>→</Kbd></>} description="Cycle the active measure in Score Preview" />
                <ShortcutRow keys={<><Kbd>↑</Kbd><Kbd>↓</Kbd></>} description="Switch Score Preview view mode (Tab / Staff / Combined)" />
            </HelpSection>

            <HelpSection id="account" title={topic('account').title} icon={topic('account').icon}>
                <Typography variant="body2">
                    NEXTRiff accounts unlock the Workspace where your tabs live.
                </Typography>
                <Bullet><strong>Register</strong> with a username, email, and password to create an account and jump straight into the Workspace.</Bullet>
                <Bullet><strong>Login</strong> with your email and password if you already have an account.</Bullet>
                <Bullet>Use <strong>Forgot password?</strong> on the login page to request a reset link by email.</Bullet>
                <Bullet>Click <strong>Log out</strong> in the top nav at any time to end your session.</Bullet>
            </HelpSection>
        </Stack>
    )
}
