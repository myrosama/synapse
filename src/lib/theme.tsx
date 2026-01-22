'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'dark' | 'light' | 'night' | 'oled';

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const themes = {
    dark: {
        '--bg-primary': '#0B1220',
        '--bg-secondary': '#111827',
        '--bg-card': '#1a2332',
        '--bg-elevated': '#243447',
        '--text-primary': '#ffffff',
        '--text-secondary': '#94a3b8',
        '--text-muted': '#64748b',
        '--border-color': 'rgba(255, 255, 255, 0.08)',
        '--accent-primary': '#22d3ee',
        '--accent-secondary': '#8b5cf6',
        '--glow-primary': 'rgba(34, 211, 238, 0.3)',
        '--glow-secondary': 'rgba(139, 92, 246, 0.3)',
    },
    light: {
        '--bg-primary': '#f8fafc',
        '--bg-secondary': '#ffffff',
        '--bg-card': '#ffffff',
        '--bg-elevated': '#f1f5f9',
        '--text-primary': '#0f172a',
        '--text-secondary': '#475569',
        '--text-muted': '#64748b',
        '--border-color': 'rgba(0, 0, 0, 0.1)',
        '--accent-primary': '#0891b2',
        '--accent-secondary': '#7c3aed',
        '--glow-primary': 'rgba(8, 145, 178, 0.2)',
        '--glow-secondary': 'rgba(124, 58, 237, 0.2)',
    },
    night: {
        '--bg-primary': '#000814',
        '--bg-secondary': '#001d3d',
        '--bg-card': '#003566',
        '--bg-elevated': '#004d99',
        '--text-primary': '#e2e8f0',
        '--text-secondary': '#94a3b8',
        '--text-muted': '#64748b',
        '--border-color': 'rgba(255, 255, 255, 0.05)',
        '--accent-primary': '#00ffff',
        '--accent-secondary': '#ff00ff',
        '--glow-primary': 'rgba(0, 255, 255, 0.4)',
        '--glow-secondary': 'rgba(255, 0, 255, 0.4)',
    },
    oled: {
        '--bg-primary': '#000000',
        '--bg-secondary': '#000000',
        '--bg-card': '#0a0a0a',
        '--bg-elevated': '#141414',
        '--text-primary': '#ffffff',
        '--text-secondary': '#a1a1aa',
        '--text-muted': '#71717a',
        '--border-color': 'rgba(255, 255, 255, 0.06)',
        '--accent-primary': '#22d3ee',
        '--accent-secondary': '#a855f7',
        '--glow-primary': 'rgba(34, 211, 238, 0.5)',
        '--glow-secondary': 'rgba(168, 85, 247, 0.5)',
    },
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>('dark');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const savedTheme = localStorage.getItem('recito_theme') as Theme;
        if (savedTheme && themes[savedTheme]) {
            setThemeState(savedTheme);
        }
    }, []);

    useEffect(() => {
        if (!mounted) return;

        // Apply theme CSS variables
        const root = document.documentElement;
        const themeVars = themes[theme];

        Object.entries(themeVars).forEach(([key, value]) => {
            root.style.setProperty(key, value);
        });

        // Apply theme class for Tailwind
        root.classList.remove('theme-dark', 'theme-light', 'theme-night', 'theme-oled');
        root.classList.add(`theme-${theme}`);

        // Save preference
        localStorage.setItem('recito_theme', theme);
    }, [theme, mounted]);

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
    };

    if (!mounted) {
        return null;
    }

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
}
