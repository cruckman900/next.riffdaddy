// src/components/ThemeRegistry.tsx
'use client'

import { ThemeProvider as MuiThemeProvider } from '@mui/material'
import { themes } from './themes'
import { useThemeContext } from '@/context/ThemeContext'

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  const { themeName, mode } = useThemeContext()

  // TypeScript now knows themeName is a valid key
  const muiTheme = themes[themeName](mode)

  return <MuiThemeProvider theme={muiTheme}>{children}</MuiThemeProvider>
}
