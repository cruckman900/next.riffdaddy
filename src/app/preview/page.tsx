'use client';

// import { Box, useTheme } from '@/context/ThemeContext';
import { Box, useTheme } from '@mui/material';

export default function PreviewPage() {
  const theme = useTheme();

  return (
    <div className="p-4 m-4 rounded shadow text-center bg-white dark:bg-black text-black dark:text-white">
      <p>Theme: {theme.palette.mode}</p>
      <p>This block should switch colors.</p>

      <Box
        sx={{
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
          padding: 2,
          borderRadius: 2,
        }}
      >
        Theme-aware Box
      </Box>
    </div>
  );
}
