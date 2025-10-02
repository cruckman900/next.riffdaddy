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

