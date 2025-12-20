// src/themes.ts
import { createTheme } from '@mui/material'

// Extend Theme typing for custom fields
declare module '@mui/material/styles' {
  interface Theme {
    custom?: {
      icon?: string
      hero?: string
    }
  }
  interface ThemeOptions {
    custom?: {
      icon?: string
      hero?: string
    }
  }
}

// Factory function
export const getTheme = (
  mode: 'light' | 'dark',
  options: {
    primary: string
    secondary?: string
    background: string
    surface: string
    text: string
    muted: string
    border: string
    icon: string
    hero: string
  }
) =>
  createTheme({
    palette: {
      mode,
      primary: { main: options.primary },
      secondary: { main: options.secondary || options.primary },
      background: {
        default: options.background,
        paper: options.surface,
      },
      text: {
        primary: options.text,
        secondary: options.muted,
      },
      divider: options.border,
    },
    typography: {
      fontFamily: `'Orbitron', 'Roboto', sans-serif`,
      h1: { fontWeight: 700, fontSize: '3rem' },
      h2: { fontWeight: 700, fontSize: '2.5rem' },
      h3: { fontWeight: 700, fontSize: '2rem' },
      h4: { fontWeight: 700, fontSize: '1.5rem' },
      h5: { fontWeight: 700, fontSize: '1.25rem' },
      h6: { fontWeight: 700, fontSize: '1rem', letterSpacing: '0.05em' },
      button: { textTransform: 'none', fontWeight: 600 },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: { borderRadius: 8, padding: '8px 16px' },
        },
      },
    },
    custom: {
      icon: options.icon,
      hero: options.hero,
    },
  })

// Registry of all themes
export const themes = {
  light: (mode: 'light' | 'dark') =>
    getTheme(mode, {
      primary: '#0077cc',
      background: mode === 'dark' ? '#121212' : '#ffffff',
      surface: mode === 'dark' ? '#1e1e1e' : '#f4f4f4',
      text: mode === 'dark' ? '#e0e0e0' : '#1a1a1a',
      muted: mode === 'dark' ? '#999999' : '#888888',
      border: mode === 'dark' ? '#2a2a2a' : '#dddddd',
      icon: '☀️',
      hero: '/images/light_hero.png',
    }),
  dark: (mode: 'light' | 'dark') =>
    getTheme(mode, {
      primary: '#00cc88',
      background: mode === 'dark' ? '#121212' : '#f5f5f5',
      surface: mode === 'dark' ? '#1e1e1e' : '#ffffff',
      text: mode === 'dark' ? '#e0e0e0' : '#000000',
      muted: mode === 'dark' ? '#999999' : '#555555',
      border: mode === 'dark' ? '#2a2a2a' : '#dddddd',
      icon: '🌑',
      hero: '/images/dark_hero.png',
    }),
  hazard: (mode: 'light' | 'dark') =>
    getTheme(mode, {
      primary: '#ffcc00',
      background: mode === 'dark' ? '#1a1a1a' : '#fffbe6',
      surface: '#2a1f00',
      text: '#f5f5f5',
      muted: '#d4c28a',
      border: '#4a3a00',
      icon: '⚠️',
      hero: '/images/hazard_hero.png',
    }),
  brownstone: (mode: 'light' | 'dark') =>
    getTheme(mode, {
      primary: '#8b5e3c',
      background: mode === 'dark' ? '#3e2c1c' : '#fdfaf6',
      surface: '#f2ede7',
      text: '#3e2c1c',
      muted: '#a89c91',
      border: '#d6cfc7',
      icon: '🟤',
      hero: '/images/brownstone_hero.png',
    }),
  midnight: (mode: 'light' | 'dark') =>
    getTheme(mode, {
      primary: '#3a6ea5',
      background: mode === 'dark' ? '#0b1c2c' : '#e0e6ed',
      surface: '#132a3d',
      text: '#e0e6ed',
      muted: '#7a8ca3',
      border: '#1f2f44',
      icon: '🌌',
      hero: '/images/midnight_hero.png',
    }),
  slate: (mode: 'light' | 'dark') =>
    getTheme(mode, {
      primary: '#5c6770',
      background: mode === 'dark' ? '#2e343b' : '#f8f9fa',
      surface: '#e2e6ea',
      text: '#2e343b',
      muted: '#8a939b',
      border: '#cdd3d9',
      icon: '🪨',
      hero: '/images/slate_hero.png',
    }),
  purple: (mode: 'light' | 'dark') =>
    getTheme(mode, {
      primary: '#a678d6',
      background: mode === 'dark' ? '#1e1126' : '#f0eafc',
      surface: '#2c1a3a',
      text: '#f0eafc',
      muted: '#bca6d0',
      border: '#3f2b4f',
      icon: '🔮',
      hero: '/images/purple_hero.png',
    }),
  pink: (mode: 'light' | 'dark') =>
    getTheme(mode, {
      primary: '#e91e63',
      background: mode === 'dark' ? '#3a2a33' : '#fff5f9',
      surface: '#fce4ec',
      text: '#3a2a33',
      muted: '#b88ca2',
      border: '#f3c1d7',
      icon: '🌸',
      hero: '/images/pink_hero.png',
    }),
  green: (mode: 'light' | 'dark') =>
    getTheme(mode, {
      primary: '#4caf50',
      background: mode === 'dark' ? '#1e2f23' : '#f4fff7',
      surface: '#e0f2e9',
      text: '#1e2f23',
      muted: '#8aa89b',
      border: '#cde3d5',
      icon: '🌿',
      hero: '/images/green_hero.png',
    }),
  red: (mode: 'light' | 'dark') =>
    getTheme(mode, {
      primary: '#c62828',
      background: mode === 'dark' ? '#2c1a1a' : '#fff4f4',
      surface: '#fbeaea',
      text: '#2c1a1a',
      muted: '#a88a8a',
      border: '#e0c0c0',
      icon: '🔴',
      hero: '/images/red_hero.png',
    }),
}
