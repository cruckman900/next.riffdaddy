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
                    press any key) to dismiss it and reveal the app underneath. Once you&apos;re logged in, the splash
                    screen won&apos;t show again on future visits — it only appears while signed out.
                </Typography>

                <SubHeading>Finding your way around</SubHeading>
                <Bullet>The <strong>header</strong> always shows the NEXTRiff logo (click it to return home) and a link to LinearDescent.</Bullet>
                <Bullet>The <strong>top nav</strong> links to Home, About, and either Login/Register (signed out) or Workspace/Log out (signed in).</Bullet>
                <Bullet>The <strong>☰ menu</strong> on the left of the nav opens a drawer with File New, File Open, Save, Save As, Settings, and History.</Bullet>

                <SubHeading>Creating your first tab</SubHeading>
                <Bullet>Register or log in, then open <strong>Workspace</strong> from the top nav.</Bullet>
                <Bullet>Click <strong>New Tab</strong> on the empty state, or use <strong>☰ → File New</strong>, to open a fresh editor tab.</Bullet>
                <Bullet>Each tab keeps its own score — rename a tab by double-clicking its title, or right-click for more options.</Bullet>
                <Bullet>Nothing is lost on refresh: your open tabs, each tab&apos;s notes, the active tool, and where you left off are all restored automatically.</Bullet>
            </HelpSection>

            <HelpSection id="workspace" title={topic('workspace').title} icon={topic('workspace').icon}>
                <Typography variant="body2">
                    The Workspace is a three-part layout: a vertical <strong>tool rail</strong>, a <strong>tool panel</strong> with
                    controls for whichever tool is active, and a <strong>Score Preview</strong> that renders your composition live.
                </Typography>

                <SubHeading>Tabs</SubHeading>
                <Bullet>Open tabs appear in the strip on the left (top, on small screens).</Bullet>
                <Bullet>Double-click a tab&apos;s title to rename it inline, or right-click for a Rename dialog — on touch devices, tap the ⋮ icon that appears on each tab instead.</Bullet>
                <Bullet>Click the ✕ on a tab to close it — closed tabs are kept in <strong>History</strong> so you can reopen them.</Bullet>

                <SubHeading>Score Preview</SubHeading>
                <Bullet>Switch between <strong>Tab</strong>, <strong>Staff</strong>, and <strong>Combined</strong> views using the segmented control.</Bullet>
                <Bullet>Each measure gets a pill button with a live beat-fill bar — it glows red if a measure has more notes than it can hold.</Bullet>
                <Bullet>Click a measure to make it active; new notes and rests are inserted into the active measure. A measure automatically widens or narrows to fit whatever note values it holds.</Bullet>
                <Bullet>Rows of measures justify to fill the full width of the page, up to the <strong>Measures Per Row</strong> cap set in Settings — and in Combined view, each measure&apos;s tab staff and standard-notation staff always share the same width.</Bullet>
            </HelpSection>

            <HelpSection id="tools" title={topic('tools').title} icon={topic('tools').icon}>
                <Typography variant="body2">
                    Seven tools live on the tool rail, though only six show at once — Fretboard and Keyboard Input swap
                    out for Drum Input automatically when your instrument is a drum kit. Switch tools by clicking an
                    icon or pressing its number shortcut.
                </Typography>

                <SubHeading>1 · Instrument &amp; Tuning</SubHeading>
                <Bullet>Pick an instrument — guitars, bass, other pitched instruments, or <strong>Drums</strong>. For pitched instruments, choose a string count and fret count and the TAB staff and fretboard both update to match.</Bullet>
                <Bullet>Filter tunings by genre, choose a preset, or expand <strong>Add Custom Tuning</strong> to define your own.</Bullet>
                <Bullet>Pick a <strong>Voice</strong> (e.g. a guitar&apos;s Acoustic, Clean, Overdrive, or Distortion timbre) — this is what Playback uses for this tab.</Bullet>
                <Bullet>The radar dial visualizes your open strings; toggle <strong>Show Harmonic Arcs</strong> to see interval relationships colored by distance (unison, 4th, 5th, octave).</Bullet>
                <Bullet>For <strong>Drums</strong>, the panel switches to kit-building controls: <strong>Pieces</strong> (4–8, replacing string count) and <strong>Bass</strong> (1–2 kick pedals, replacing fret count), a <strong>Kit Style</strong> preset (Standard, Jazz, Metal, replacing Tuning), and a <strong>Voice</strong> of Acoustic Kit or Electronic Kit. The radar dial and harmonic arcs are hidden since they don&apos;t apply to a kit.</Bullet>

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

                <SubHeading>7 · Drum Input</SubHeading>
                <Bullet>Only shown when your instrument is <strong>Drums</strong> (it replaces Fretboard and Keyboard Input on the tool rail). Pieces are laid out as circular pads arranged like a real kit — kick and hi-hat pedals at the bottom, toms and cymbals above.</Bullet>
                <Bullet>Click one or more pads to build a hit — e.g. kick + closed hi-hat together — then click <strong>Commit</strong> to add it to the active measure, the same way as Fretboard/Keyboard Input. Use <strong>Insert a rest</strong> for a rest instead.</Bullet>
                <Bullet>The Score Preview shows a percussion staff only for drum tabs (no Tab/Combined views), with a distinct notehead per piece — a plain notehead for drums/toms and an X notehead for hi-hats, cymbals, and rides.</Bullet>

                <SubHeading>Rhythm Palette</SubHeading>
                <Bullet>Shown above the Fretboard, Keyboard, and Drum Input tools, it sets the duration (whole through 64th note) applied to the next note, chord, or rest you commit.</Bullet>

                <SubHeading>5 · Playback</SubHeading>
                <Bullet>Press the play button to hear your composition using the Voice picked in Instrument &amp; Tuning — the active measure highlights as it plays.</Bullet>
                <Bullet>Drag the <strong>Tempo</strong> slider (40–240 BPM) to change playback speed; it&apos;s saved per tab.</Bullet>

                <SubHeading>6 · Song Info</SubHeading>
                <Bullet>Fill in Title, Artist/Author, Album, Composer, Year, Capo, Difficulty, and Notes/Comments for this score.</Bullet>
                <Bullet>Anything you fill in appears as a header above the score in Score Preview, and on every printed page.</Bullet>
                <Bullet>Tuning is shown here too, as a read-only reference — change it from the Instrument &amp; Tuning tool.</Bullet>
            </HelpSection>

            <HelpSection id="notation" title={topic('notation').title} icon={topic('notation').icon}>
                <Typography variant="body2">
                    Click any note in the Score Preview (Tab, Staff, or Combined view) to select it — shift-click, or click
                    several in a row, to select more than one. A contextual toolbar appears above the score whenever at
                    least one note is selected.
                </Typography>

                <SubHeading>Modifying a selection</SubHeading>
                <Bullet>Modifiers are grouped into categories — <strong>Duration</strong> (dotted/double-dotted), <strong>Articulation</strong> (accent, staccato, tenuto, marcato, fermata, up-/down-bow), <strong>Ornament</strong> (trill, turn, mordent), <strong>Technique</strong> (vibrato, harmonic, bend, tremolo, pizzicato), <strong>Stroke</strong> (brush/roll up or down, arpeggio), <strong>Dynamics</strong> (pp through ff), and <strong>Fingering</strong> (1–4, T).</Bullet>
                <Bullet>Click a chip to toggle that modifier on every currently-selected note; an active modifier glows to show it&apos;s applied.</Bullet>
                <Bullet><strong>Bend</strong> is a dropdown rather than a plain toggle — click it to choose an amount (1/4, 1/2, Full, 1 1/2, 2 Steps, or Bend &amp; Release); picking a new amount replaces whichever one was already applied, and re-picking the active one removes it.</Bullet>

                <SubHeading>Managing individual notes</SubHeading>
                <Bullet>With exactly one note selected: <strong>Insert Before</strong> / <strong>Insert After</strong> add a brand-new note next to it, and <strong>Edit</strong> lets you replace its pitch/fret — both jump you to Fretboard Input to commit the change.</Bullet>
                <Bullet>With 2 or more notes selected — even across different measures: <strong>Tie</strong> connects them with a curved arc (in their true left-to-right order) that draws in Tab, Staff, and Combined view, including across a barline — click it again (now labeled <strong>Untie</strong>) to remove it. A tie only actually draws where both notes land on the same printed row; one spanning a line break isn&apos;t drawn.</Bullet>
                <Bullet><strong>Delete</strong> removes every selected note; <strong>Clear</strong> just deselects without changing anything.</Bullet>
            </HelpSection>

            <HelpSection id="saving" title={topic('saving').title} icon={topic('saving').icon}>
                <Typography variant="body2">
                    Every save/open action lets you choose <strong>Database</strong> (stored on the server, tied to your
                    account) or <strong>Local Disk</strong> (a plain <code>.nriff.json</code> file you download and can
                    reopen later, even offline).
                </Typography>

                <SubHeading>Save &amp; Save As</SubHeading>
                <Bullet><strong>Save</strong> quietly updates the same database record once a tab has been saved there before; the first time (or for a tab that&apos;s never been saved), it opens Save As instead.</Bullet>
                <Bullet><strong>Save As</strong> lets you pick Database or Local Disk and choose a name — if another open tab already uses that name, NEXTRiff appends &ldquo;(1)&rdquo;, &ldquo;(2)&rdquo;, and so on automatically.</Bullet>
                <Bullet>Local Disk saves are a fresh download every time (browsers can&apos;t silently overwrite a file you already downloaded) — that&apos;s expected, same as any other site&apos;s export button.</Bullet>

                <SubHeading>File Open</SubHeading>
                <Bullet>Choose <strong>Database</strong> to pick from tabs you&apos;ve saved to your account, or <strong>Local Disk</strong> to browse for a previously downloaded <code>.nriff.json</code> file.</Bullet>
                <Bullet>Each database tab has an <strong>Archive</strong> action (hides it from the list without deleting it — toggle <strong>Show archived</strong> to see and restore archived tabs) and a <strong>Delete permanently</strong> action, which asks for confirmation since it can&apos;t be undone.</Bullet>

                <SubHeading>Printing</SubHeading>
                <Bullet>Click <strong>Print</strong> above the Score Preview for a clean, paginated printout — everything except the score itself (and your Song Info header) is hidden, margins are minimized, and each stave/tab row is guaranteed to stay whole rather than splitting across a page.</Bullet>
                <Bullet>The print preview shows real <strong>&ldquo;Page X of Y&rdquo;</strong> numbers at the bottom of every page before you print.</Bullet>
                <Bullet>A plain browser print (Ctrl/Cmd+P) also works as a quick fallback — it gets the clean layout and no split staves, just without the numbered pages.</Bullet>
            </HelpSection>

            <HelpSection id="settings" title={topic('settings').title} icon={topic('settings').icon}>
                <Typography variant="body2">
                    Open Settings from the <strong>☰ menu</strong>. It opens as its own tab so you can keep working alongside it, and every change saves automatically.
                </Typography>

                <SubHeading>General</SubHeading>
                <Bullet>Choose from ten color themes, each with its own accent glow used throughout the app.</Bullet>
                <Bullet>Toggle between light and dark mode independently of the theme.</Bullet>

                <SubHeading>Score</SubHeading>
                <Bullet>Adjust <strong>Measures Per Row</strong> to control the maximum number of measures the Score Preview will place on one row (a row can still hold fewer if the measures are wide).</Bullet>
                <Bullet>Drag <strong>Note Spacing</strong> to add breathing room between notes — 0px is VexFlow&apos;s tightest possible packing, higher values add more space per note.</Bullet>
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
                <ShortcutRow keys={<Kbd>6</Kbd>} description="Song Info tool" />
                <ShortcutRow keys={<Kbd>7</Kbd>} description="Drum Input tool (only when your instrument is Drums)" />
                <ShortcutRow keys={<><Kbd>←</Kbd><Kbd>→</Kbd></>} description="Cycle the active measure in Score Preview" />
                <ShortcutRow keys={<><Kbd>↑</Kbd><Kbd>↓</Kbd></>} description="Switch Score Preview view mode (Tab / Staff / Combined)" />
                <ShortcutRow keys={<Kbd>Esc</Kbd>} description="Close the print preview" />
            </HelpSection>

            <HelpSection id="account" title={topic('account').title} icon={topic('account').icon}>
                <Typography variant="body2">
                    NEXTRiff accounts unlock the Workspace where your tabs live.
                </Typography>
                <Bullet><strong>Register</strong> with a username, email, and password to create an account and jump straight into the Workspace.</Bullet>
                <Bullet><strong>Login</strong> with your email and password if you already have an account.</Bullet>
                <Bullet>Use <strong>Forgot password?</strong> on the login page to request a reset link by email.</Bullet>
                <Bullet>Once you&apos;re logged in, refreshing the page (or coming back later) never loses your work or your place — your session, open tabs, and each tab&apos;s content are all restored automatically, and the splash screen stays out of the way.</Bullet>
                <Bullet>Click <strong>Log out</strong> in the top nav at any time to end your session.</Bullet>
            </HelpSection>
        </Stack>
    )
}
