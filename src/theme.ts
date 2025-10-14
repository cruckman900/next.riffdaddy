// src/theme.ts
import { createTheme } from '@mui/material/styles';

export const getTheme = (mode: 'light' | 'dark') =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: '#ff4081', // Hot pink riff
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#00e5ff', // Electric cyan
        contrastText: '#000000',
      },
      background: {
        default: mode === 'dark' ? '#121212' : '#f5f5f5',
        paper: mode === 'dark' ? '#1e1e1e' : '#ffffff',
      },
      text: {
        primary: mode === 'dark' ? '#ffffff' : '#000000',
        secondary: mode === 'dark' ? '#b0bec5' : '#555555',
        disabled: mode === 'dark' ? '#666666' : '#999999',
      },
      divider: mode === 'dark' ? '#333333' : '#dddddd',
    },

    typography: {
      fontFamily: `'Orbitron', 'Roboto', sans-serif`,
      h1: { fontWeight: 700, fontSize: '3rem' },
      h2: { fontWeight: 700, fontSize: '2.5rem' },
      h3: { fontWeight: 700, fontSize: '2rem' },
      h4: { fontWeight: 700, fontSize: '1.5rem' },
      h5: { fontWeight: 700, fontSize: '1.25rem' },
      h6: { fontWeight: 700, fontSize: '1rem', letterSpacing: '0.05em' },
      subtitle1: { fontSize: '1rem', color: mode === 'dark' ? '#b0bec5' : '#555555' },
      subtitle2: { fontSize: '0.875rem', color: mode === 'dark' ? '#b0bec5' : '#777777' },
      body1: { fontSize: '1rem' },
      body2: { fontSize: '0.875rem' },
      button: { textTransform: 'none', fontWeight: 600 },
      caption: { fontSize: '0.75rem', color: mode === 'dark' ? '#888888' : '#666666' },
      overline: { fontSize: '0.75rem', letterSpacing: '0.1em' },
    },

    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'dark' ? '#1e1e1e' : '#ffffff',
            color: mode === 'dark' ? '#ffffff' : '#000000',
            borderBottom: `1px solid ${mode === 'dark' ? '#333' : '#ccc'}`,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            padding: '8px 16px',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'dark' ? '#1e1e1e' : '#ffffff',
            color: mode === 'dark' ? '#ffffff' : '#000000',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'dark' ? '#1e1e1e' : '#ffffff',
            color: mode === 'dark' ? '#ffffff' : '#000000',
            borderRadius: 12,
            boxShadow: mode === 'dark' ? '0 0 10px #000' : '0 0 6px #ccc',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'dark' ? '#333' : '#eee',
            color: mode === 'dark' ? '#fff' : '#000',
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            backgroundColor: mode === 'dark' ? '#333' : '#fff',
            color: mode === 'dark' ? '#fff' : '#000',
            fontSize: '0.875rem',
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'dark' ? '#444' : '#ccc',
          },
        },
      },
      MuiListItem: {
        styleOverrides: {
          root: {
            color: mode === 'dark' ? '#fff' : '#000',
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          indicator: {
            backgroundColor: '#ff4081',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'dark' ? '#1e1e1e' : '#ffffff',
            color: mode === 'dark' ? '#ffffff' : '#000000',
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            backgroundColor: mode === 'dark' ? '#1e1e1e' : '#ffffff',
            color: mode === 'dark' ? '#ffffff' : '#000000',
          },
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: {
            backgroundColor: mode === 'dark' ? '#1e1e1e' : '#ffffff',
            color: mode === 'dark' ? '#ffffff' : '#000000',
          },
        },
      },
      MuiSnackbarContent: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'dark' ? '#333' : '#eee',
            color: mode === 'dark' ? '#fff' : '#000',
          },
        },
      },
    },
  });