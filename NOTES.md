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
