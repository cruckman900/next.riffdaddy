// src/themes.ts
// src/themes.ts
import { createTheme } from '@mui/material/styles'

// Extend Theme typing for custom fields
declare module '@mui/material/styles' {
  interface Palette {
    surface: Palette['primary']
    muted: Palette['primary']
    border: Palette['primary']
    accent: Palette['primary']
  }
  interface PaletteOptions {
    surface?: PaletteOptions['primary']
    muted?: PaletteOptions['primary']
    border?: PaletteOptions['primary']
    accent?: PaletteOptions['primary']
  }

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
    primary: { light: string; main: string; dark: string; contrastText: string }
    secondary?: { light: string; main: string; dark: string; contrastText: string }
    accent?: { light: string; main: string; dark: string; contrastText: string }
    surface: { light: string; main: string; dark: string; contrastText: string }
    muted: { light: string; main: string; dark: string; contrastText: string }
    border: { light: string; main: string; dark: string; contrastText: string }
    background: {
      light: { default: string; paper: string }
      main: { default: string; paper: string }
      dark: { default: string; paper: string }
      contrastText: string
    }
    text: string
    icon: string
    hero: string
  }
) =>
  createTheme({
    palette: {
      mode,
      primary: options.primary,
      secondary: options.secondary || options.primary,
      accent: options.accent || options.primary,
      surface: options.surface,
      muted: options.muted,
      border: options.border,
      background: {
        default: options.background.main.default,
        paper: options.background.main.paper,
      },
      text: {
        primary: options.text,
        secondary: options.muted.main,
      },
      divider: options.border.main,
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
      primary: { light: '#66aaff', main: '#0077cc', dark: '#004c99', contrastText: '#ffffff' },
      surface: { light: '#f4f4f4', main: mode === 'dark' ? '#1e1e1e' : '#f4f4f4', dark: '#121212', contrastText: '#000000' },
      muted: { light: '#888888', main: mode === 'dark' ? '#999999' : '#888888', dark: '#555555', contrastText: '#000000' },
      border: { light: '#dddddd', main: mode === 'dark' ? '#2a2a2a' : '#dddddd', dark: '#000000', contrastText: '#000000' },
      background: {
        light: { default: '#ffffff', paper: '#f4f4f4' },
        main: { default: mode === 'dark' ? '#121212' : '#ffffff', paper: mode === 'dark' ? '#1e1e1e' : '#f4f4f4' },
        dark: { default: '#121212', paper: '#1e1e1e' },
        contrastText: '#000000',
      },
      text: mode === 'dark' ? '#e0e0e0' : '#1a1a1a',
      icon: '☀️',
      hero: '/images/light_hero.png',
    }),

  dark: (mode: 'light' | 'dark') =>
    getTheme(mode, {
      primary: { light: '#66ffcc', main: '#00cc88', dark: '#009966', contrastText: '#000000' },
      surface: { light: '#f5f5f5', main: mode === 'dark' ? '#1e1e1e' : '#f5f5f5', dark: '#121212', contrastText: '#ffffff' },
      muted: { light: '#555555', main: mode === 'dark' ? '#999999' : '#555555', dark: '#333333', contrastText: '#ffffff' },
      border: { light: '#dddddd', main: mode === 'dark' ? '#2a2a2a' : '#dddddd', dark: '#000000', contrastText: '#ffffff' },
      background: {
        light: { default: '#f5f5f5', paper: '#ffffff' },
        main: { default: mode === 'dark' ? '#121212' : '#f5f5f5', paper: mode === 'dark' ? '#1e1e1e' : '#ffffff' },
        dark: { default: '#121212', paper: '#1e1e1e' },
        contrastText: '#ffffff',
      },
      text: mode === 'dark' ? '#e0e0e0' : '#000000',
      icon: '🌑',
      hero: '/images/dark_hero.png',
    }),

  hazard: (mode: 'light' | 'dark') =>
    getTheme(mode, {
      primary: { light: '#ffe066', main: '#ffcc00', dark: '#cc9900', contrastText: '#000000' },
      surface: { light: '#fffbe6', main: mode === 'dark' ? '#2a1f00' : '#fffbe6', dark: '#1a1a1a', contrastText: '#ffffff' },
      muted: { light: '#d4c28a', main: '#d4c28a', dark: '#a89c5a', contrastText: '#000000' },
      border: { light: '#d6cfc7', main: '#4a3a00', dark: '#2a1f00', contrastText: '#000000' },
      background: {
        light: { default: '#fffbe6', paper: '#f2ede7' },
        main: { default: mode === 'dark' ? '#1a1a1a' : '#fffbe6', paper: mode === 'dark' ? '#2a1f00' : '#f2ede7' },
        dark: { default: '#1a1a1a', paper: '#2a1f00' },
        contrastText: '#000000',
      },
      text: mode === 'dark' ? '#f5f5f5' : '#1a1a1a',
      icon: '⚠️',
      hero: '/images/hazard_hero.png',
    }),

  brownstone: (mode: 'light' | 'dark') =>
    getTheme(mode, {
      primary: { light: '#b07a56', main: '#8b5e3c', dark: '#5f3f28', contrastText: '#ffffff' },
      surface: { light: '#fdfaf6', main: mode === 'dark' ? '#3e2c1c' : '#fdfaf6', dark: '#2a1a0a', contrastText: '#000000' },
      muted: { light: '#a89c91', main: '#a89c91', dark: '#7a6c61', contrastText: '#000000' },
      border: { light: '#d6cfc7', main: '#d6cfc7', dark: '#3e2c1c', contrastText: '#000000' },
      background: {
        light: { default: '#fdfaf6', paper: '#f2ede7' },
        main: { default: mode === 'dark' ? '#3e2c1c' : '#fdfaf6', paper: mode === 'dark' ? '#2a1a0a' : '#f2ede7' },
        dark: { default: '#3e2c1c', paper: '#2a1a0a' },
        contrastText: '#000000',
      },
      text: mode === 'dark' ? '#f5f5f5' : '#3e2c1c',
      icon: '🟤',
      hero: '/images/brownstone_hero.png',
    }),

  midnight: (mode: 'light' | 'dark') =>
    getTheme(mode, {
      primary: { light: '#5a8cc2', main: '#3a6ea5', dark: '#274b73', contrastText: '#ffffff' },
      surface: { light: '#e0e6ed', main: mode === 'dark' ? '#132a3d' : '#e0e6ed', dark: '#0b1c2c', contrastText: '#ffffff' },
      muted: { light: '#7a8ca3', main: '#7a8ca3', dark: '#4a5a6b', contrastText: '#ffffff' },
      border: { light: '#cdd3d9', main: '#1f2f44', dark: '#0b1c2c', contrastText: '#ffffff' },
      background: {
        light: { default: '#e0e6ed', paper: '#f5f5f5' },
        main: { default: mode === 'dark' ? '#0b1c2c' : '#e0e6ed', paper: mode === 'dark' ? '#132a3d' : '#f5f5f5' },
        dark: { default: '#0b1c2c', paper: '#132a3d' },
        contrastText: '#ffffff',
      },
      text: mode === 'dark' ? '#e0e6ed' : '#132a3d',
      icon: '🌌',
      hero: '/images/midnight_hero.png',
    }),

  slate: (mode: 'light' | 'dark') =>
    getTheme(mode, {
      primary: { light: '#7a868f', main: '#5c6770', dark: '#3d454b', contrastText: '#ffffff' },
      surface: { light: '#f8f9fa', main: mode === 'dark' ? '#2e343b' : '#f8f9fa', dark: '#1a1d21', contrastText: '#000000' },
      muted: { light: '#8a939b', main: '#8a939b', dark: '#5a6167', contrastText: '#000000' },
      border: { light: '#cdd3d9', main: '#cdd3d9', dark: '#2e343b', contrastText: '#000000' },
      background: {
        light: { default: '#f8f9fa', paper: '#e2e6ea' },
        main: { default: mode === 'dark' ? '#2e343b' : '#f8f9fa', paper: mode === 'dark' ? '#1a1d21' : '#e2e6ea' },
        dark: { default: '#2e343b', paper: '#1a1d21' },
        contrastText: '#000000',
      },
      text: mode === 'dark' ? '#e0e0e0' : '#2e343b',
      icon: '🪨',
      hero: '/images/slate_hero.png',
    }),

  purple: (mode: 'light' | 'dark') =>
    getTheme(mode, {
      primary: { light: '#c29de6', main: '#a678d6', dark: '#754fa3', contrastText: '#ffffff' },
      surface: { light: '#f0eafc', main: mode === 'dark' ? '#2c1a3a' : '#f0eafc', dark: '#1e1126', contrastText: '#ffffff' },
      muted: { light: '#bca6d0', main: '#bca6d0', dark: '#8a6fa3', contrastText: '#ffffff' },
      border: { light: '#e0d6f0', main: '#3f2b4f', dark: '#2c1a3a', contrastText: '#ffffff' },
      background: {
        light: { default: '#f0eafc', paper: '#e0d6f0' },
        main: { default: mode === 'dark' ? '#1e1126' : '#f0eafc', paper: mode === 'dark' ? '#2c1a3a' : '#e0d6f0' },
        dark: { default: '#1e1126', paper: '#2c1a3a' },
        contrastText: '#ffffff',
      },
      text: mode === 'dark' ? '#f0eafc' : '#2c1a3a',
      icon: '🔮',
      hero: '/images/purple_hero.png',
    }),

  pink: (mode: 'light' | 'dark') =>
    getTheme(mode, {
      primary: { light: '#f48fb1', main: '#e91e63', dark: '#b0003a', contrastText: '#ffffff' },
      surface: { light: '#fff5f9', main: mode === 'dark' ? '#3a2a33' : '#fff5f9', dark: '#2a1a23', contrastText: '#000000' },
      muted: { light: '#b88ca2', main: '#b88ca2', dark: '#8a5a73', contrastText: '#000000' },
      border: { light: '#f3c1d7', main: '#f3c1d7', dark: '#a85a73', contrastText: '#000000' },
      background: {
        light: { default: '#fff5f9', paper: '#fce4ec' },
        main: { default: mode === 'dark' ? '#3a2a33' : '#fff5f9', paper: mode === 'dark' ? '#2a1a23' : '#fce4ec' },
        dark: { default: '#3a2a33', paper: '#2a1a23' },
        contrastText: '#000000',
      },
      text: mode === 'dark' ? '#f5f5f5' : '#3a2a33',
      icon: '🌸',
      hero: '/images/pink_hero.png',
    }),

  green: (mode: 'light' | 'dark') =>
    getTheme(mode, {
      primary: { light: '#81c784', main: '#4caf50', dark: '#2e7d32', contrastText: '#ffffff' },
      surface: { light: '#f4fff7', main: mode === 'dark' ? '#1e2f23' : '#f4fff7', dark: '#0a1f13', contrastText: '#000000' },
      muted: { light: '#8aa89b', main: '#8aa89b', dark: '#5a7363', contrastText: '#000000' },
      border: { light: '#cde3d5', main: '#cde3d5', dark: '#1e2f23', contrastText: '#000000' },
      background: {
        light: { default: '#f4fff7', paper: '#e0f2e9' },
        main: { default: mode === 'dark' ? '#1e2f23' : '#f4fff7', paper: mode === 'dark' ? '#0a1f13' : '#e0f2e9' },
        dark: { default: '#1e2f23', paper: '#0a1f13' },
        contrastText: '#000000',
      },
      text: mode === 'dark' ? '#e0e0e0' : '#1e2f23',
      icon: '🌿',
      hero: '/images/green_hero.png',
    }),

  red: (mode: 'light' | 'dark') =>
    getTheme(mode, {
      primary: { light: '#ef5350', main: '#c62828', dark: '#8e0000', contrastText: '#ffffff' },
      surface: { light: '#fff4f4', main: mode === 'dark' ? '#2c1a1a' : '#fff4f4', dark: '#1a0a0a', contrastText: '#000000' },
      muted: { light: '#a88a8a', main: '#a88a8a', dark: '#7a5a5a', contrastText: '#000000' },
      border: { light: '#e0c0c0', main: '#e0c0c0', dark: '#8e0000', contrastText: '#000000' },
      background: {
        light: { default: '#fff4f4', paper: '#fbeaea' },
        main: { default: mode === 'dark' ? '#2c1a1a' : '#fff4f4', paper: mode === 'dark' ? '#1a0a0a' : '#fbeaea' },
        dark: { default: '#2c1a1a', paper: '#1a0a0a' },
        contrastText: '#000000',
      },
      text: mode === 'dark' ? '#f5f5f5' : '#2c1a1a',
      icon: '🔴',
      hero: '/images/red_hero.png',
    }),
}
