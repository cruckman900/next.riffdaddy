// src/components/ThemeRegistry.tsx
'use client';

import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { getTheme } from '@/theme';
import { useTheme } from '@/context/ThemeContext';

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const muiTheme = getTheme(theme);

  return <MuiThemeProvider theme={muiTheme}>{children}</MuiThemeProvider>;
}