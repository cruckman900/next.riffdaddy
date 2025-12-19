// src/components/ThemeSwitcher.tsx
"use client"

import { useTheme } from '@/context/ThemeContext'
import { toast } from 'react-hot-toast';


export default function ThemeSwitcher() {
    const { theme, toggleTheme } = useTheme();

    const handleToggle = () => {
        toggleTheme();
        toast.success(`🎶 Now Playing: ${theme === 'light' ? 'Dark Riff' : 'Light Jam'}`);
    };

    return (
        <button
            onClick={handleToggle}
            className="fixed bottom-3 right-4 z-50 px-3 py-1 w-25 text-sm font-bold rounded-full bg-black dark:bg-white text-white dark:text-black border border-white dark:border-black hover:bg-white dark:hover:bg-black hover:text-black dark:hover:text-white transition"
        >
            {theme === 'light' ? 'Dark Riff' : 'Light Jam'}
        </button>
    )
}