## ⚠️ Tailwind Init Error — v4 Migration Detected — Oct 2, 2025 @ 1:20 AM EDT

Issue: `npx tailwindcss init -p` failed with “could not determine executable”  
Cause: Tailwind CSS v4 deprecated the `init` command  
Fix:
- Option 1: Downgraded to Tailwind v3 to use `init`
- Option 2: Used Tailwind v4’s CSS-first setup with manual `globals.css`

Status: Tailwind now configured. Styling pipeline ready.  

## 🚀 next.riffdaddy Bootstrapped — Tailwind, MUI, Motion — Oct 2, 2025 @ 1:00 AM EDT

Setup:
- Folder structure scaffolded for App Router, components, and static assets
- Installed Tailwind CSS, Material UI, Framer Motion
- Initialized Tailwind config and global styles
- Prepared reusable components: Header, Footer, TabPreview, GlowTabs

Status: Project ready to riff. Next.js layout clean. Styling pipeline expressive.  

## 🎨 Tailwind v4 CSS Layers — Imports vs Directives — Oct 2, 2025 @ 1:45 AM EDT

Context: Tailwind CSS v4 project setup  
Options:
- Classic: `@tailwind base; @tailwind components; @tailwind utilities;`
- Modern: `@import "tailwindcss/preflight.css" layer(base);` etc.

Decision: Using explicit imports for clarity and future-proofing  
Status: Styling pipeline now aligned with Tailwind v4 best practices  

## 📐 Responsive Layout Scaffolding — Header & Footer Locked In — Oct 2, 2025 @ 2:40 AM EDT

Components:
- `Header.tsx`: Glowing badge, site title, mobile-friendly flex layout
- `Footer.tsx`: Centered copyright
- `layout.tsx`: Box layout using Tailwind’s flex and container utilities

Status: Layout now responsive and expressive. Ready for tab preview integration.  

## 📢 OG/Twitter Metadata Wired — Social Preview Activated — Oct 2, 2025 @ 3:15 AM EDT

Action:
- Added `metadata` export to `layout.tsx` with Open Graph and Twitter tags
- Uploaded `og-image.png` and `twitter-image.png` to `/public/`
- Validated preview with Twitter and Facebook tools

Status: next.riffdaddy now looks expressive and clickable when shared.  

Twitter Card Validator
Facebook Sharing Debugger
Open Graph Preview

## 🎸 TabPreview Component — Genre Themes & Motion — Oct 2, 2025 @ 3:25 AM EDT

Features:
- Responsive layout with max-width container
- Genre-based themes: metal, jazz, blues, rock
- Animated entrance using Framer Motion
- Metadata display: key, tempo, time signature
- Tab lines styled with monospaced font and relaxed spacing

Status: Tab preview now expressive, responsive, and riff-ready.  

🧪 Sample Usage
tsx
<TabPreview
  title="Smoke on the Water"
  artist="Deep Purple"
  genre="rock"
  key="G Minor"
  tempo={112}
  timeSignature="4/4"
  tab={`E|------------------------|\nB|------------------------|\nG|--3--5--3--6--5--3------|\nD|------------------------|\nA|------------------------|\nE|------------------------|`}
/>

## 🎨 Genre Palette Expanded — Classical, Country, Other — Oct 2, 2025 @ 3:35 AM EDT

Genres Added:
- Classical: `bg-amber-50 text-gray-800` — elegant and refined
- Country: `bg-yellow-100 text-orange-700` — warm and rustic
- Other: `bg-gradient-to-r from-cyan-700 to-purple-700 text-white` — expressive and genre-fluid

Status: All genre themes now styled and ready for tab previews.  

## 🧠 TypeScript Error Resolved — TabData Defined — Oct 2, 2025 @ 4:00 AM EDT

Issue: `tab` object defaulted to `any` when passed to `TabPreview`  
Fix:
- Defined `TabData` type in `types/Tab.ts`
- Used `TabData[]` for `mockTabs`
- Applied `TabData` as props type in `TabPreview.tsx`

Status: TypeScript now fully aware of tab shape. No more `any`.  

## 🧭 Path Alias Fixed — @/ Now Resolving — Oct 2, 2025 @ 4:05 AM EDT

Issue: `@/` alias not resolving, fallback to `../`  
Fix:
- Verified `tsconfig.json` with `baseUrl` and `paths`
- Restarted dev server to clear cache
- Updated imports to use `@/lib/mockTabs` and `@/components/TabPreview`

Status: Path alias now working. Cleaner imports across the project.  

## ⚠️ Prop Overwrite Warning — ‘key’ Conflict Resolved — Oct 2, 2025 @ 4:10 AM EDT

Issue: `key` prop passed explicitly and also included in spread (`...tab`)  
Fix:
- Renamed tab’s `key` to `musicalKey` to avoid React prop conflict
- Updated `TabData` type and component props
- Alternatively passed props explicitly to avoid spread overwrite

Status: TypeScript warning resolved. Component props now clean and intentional.  

## 🚨 Layout Error Resolved — HTML/Body Tags Recognized — Oct 2, 2025 @ 4:45 AM EDT

Issue: Runtime error — “Missing <html> and <body> tags in the root layout”  
Fixes:
- Verified `layout.tsx` is in `app/` folder
- Ensured correct function signature and metadata export
- Removed conflicting `pages/_app.tsx` or `_document.tsx`
- Returned a single JSX tree starting with `<html>`

Status: Layout now recognized. App Router rendering cleanly.  

## 🎛️ Genre Filter, Tab Switcher, Upload Form — UI Ensemble Expanded — Oct 2, 2025 @ 4:45 AM EDT

Components Added:
- `GenreFilter.tsx`: Glowing genre buttons with Framer Motion
- `TabGallery.tsx`: Animated tab transitions with genre filtering
- `TabUploadForm.tsx`: Mock tab upload form with client-side logging

Status: UI now interactive, expressive, and ready for backend wiring.  

## 🎨 Rebrand Complete — NEXTRiff Badge & OG Image — Oct 2, 2025 @ 4:50 AM EDT

Action:
- Rebranded from fanTABulous to NEXTRiff
- Created new badge and OG image with glowing accents and musical styling
- Updated metadata in `layout.tsx` for Open Graph and Twitter cards
- Deployed assets to `/public` for social sharing and favicon

Status: NEXTRiff now visually branded and socially optimized.  

## 🧠 setGenre Typed — Dispatch with Genre Enum — Oct 2, 2025 @ 10:45 AM EDT

Fix:
- Defined `Genre` union type for genre values
- Typed `setGenre` as `React.Dispatch<React.SetStateAction<Genre>>`
- Passed to `GenreFilter` for full type safety

Status: No more guessing. Genre state now typed and expressive.  

## 🧠 GenreFilter Signature Fixed — Props & Return — Oct 2, 2025 @ 10:55 AM EDT

Issue:
- Incorrect function signature: `{ GenreFilterProps }` instead of `GenreFilterProps`
- Missing `return` statement in JSX block

Fix:
- Updated signature to `({ activeGenre, setGenre }: GenreFilterProps)`
- Added `return` to wrap JSX

Status: Component now compiles cleanly and renders genre buttons with motion.  

## 🧠 Genre Type Mismatch — Cast & Array Typed — Oct 2, 2025 @ 11:00 AM EDT

Issue: `setGenre(genre)` throws error — string not assignable to `Genre`  
Fixes:
- Cast `genre` as `Genre` in `onClick`
- Typed `genres` array as `Genre[]` to avoid future casts

Status: TypeScript now recognizes genre values as valid. No more setter errors.  

## 🧠 Form Submit Typed — React.FormEvent<HTMLFormElement> — Oct 2, 2025 @ 11:50 AM EDT

Fix:
- Typed `e` in `handleSubmit` as `React.FormEvent<HTMLFormElement>`
- Prevents reload and logs mock upload data

Status: Form submission now fully typed and ready for backend wiring.  

## 🧠 Input Change Typed — Multi-Element Support — Oct 2, 2025 @ 11:55 AM EDT

Fix:
- Replaced `React.FormEvent<HTMLFormElement>` with `React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>`
- Ensures `e.target.name` and `e.target.value` are fully typed

Status: Input change handler now supports all form elements cleanly.  

## ✅ Toast Simulated — Upload Flow Activated — Oct 2, 2025 @ 12:00 PM EDT

Steps:
- Installed `react-hot-toast`
- Added `<Toaster />` to layout
- Triggered `toast.success()` on form submit

Status: Upload flow now gives instant feedback. Backend wiring next.  

### [2025-10-03] 🌗 Theme Switch Prep & Scrollbar Stylization

- Enabled `darkMode: 'class'` in Tailwind config for theme switching
- Added custom colors: `riff` (lime green) and `jam` (purple)
- Styled scrollbar with 2px width, gradient thumb, and glowing hover effect
- Scrollbar now riffs in harmony with header/footer palette

### [2025-10-03] 🧹 Folder Refactor: Roadie Cleanup

- Refactored project structure to give `src/` meaningful depth
- Added `components`, `context`, `lib`, and other folders under `src/`
- Fixed path alias `@/*` to resolve cleanly to `src/*`
- Previous structure was too shallow—like a mop closet backstage
- Now importing like a pro: `@/components/Header`, `@/context/ThemeContext`

### [2025-10-03] 🎭 Theme Switcher: The Fat Lady Sang

- Implemented dynamic theme switching with Tailwind + MUI
- Synced `dark` class on `<html>` via client-side hydration
- Refactored MUI theme to respond to `'light' | 'dark'` context
- Fixed TypeScript union mismatch and layout hydration quirks
- UI now toggles like a lighting rig—Dark Riff vs Light Jam
- 🎤 The band took 5 and let the fat lady sing—theme switcher complete!

### [2025-10-03] 🎶 Toast Cue: Now Playing

- Added toast notification to ThemeSwitcher toggle
- Displays “Now Playing: Dark Riff” or “Light Jam” after theme change
- Mounted `react-hot-toast` in layout with bottom-center positioning
- Toast acts like a stage-side LED cue—short, punchy, and expressive

### [2025-10-03] 🎛️ Theme Strategy Clarified

- Confirmed MUI handles global theming via `theme.ts`
- Tailwind used for utility classes and non-MUI elements
- Avoided manual `bg-white dark:bg-black` duplication
- Theme switching now centralized and expressive—like a lighting desk for the whole stage

### [2025-10-03] 🎭 Theme Switcher Paused

- Temporarily removed theme toggle button to reduce complexity
- Default MUI theme delivers clean, expressive UI out of the box
- Bottleneck resolved—focus shifted to core layout and performance
- Theme switching can return later with refined strategy and animation

### [2025-10-03] 🎤 Splash Centering + Entry Trigger

- Centered splash image and “Click to Enter” text using flex layout
- Button now triggers entry event via `setEntered(true)`
- Splash hides on click—ready for transition or route change
- UI now riffs like a concert intro—spotlight, cue, and entry
