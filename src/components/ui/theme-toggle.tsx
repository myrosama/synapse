'use client';

import { Moon, Sun, Monitor, Smartphone } from 'lucide-react';
import { useTheme, Theme } from '@/lib/theme';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const themeOptions: { value: Theme; label: string; icon: typeof Sun }[] = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'night', label: 'Night', icon: Monitor },
    { value: 'oled', label: 'OLED', icon: Smartphone },
];

export function ThemeToggle({ className }: { className?: string }) {
    const { theme, setTheme } = useTheme();

    return (
        <div className={cn('flex items-center gap-1 p-1 bg-slate-800/50 rounded-lg', className)}>
            {themeOptions.map(({ value, label, icon: Icon }) => (
                <button
                    key={value}
                    onClick={() => setTheme(value)}
                    className={cn(
                        'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all',
                        theme === value
                            ? 'bg-cyan-500/20 text-cyan-400'
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                    )}
                    title={label}
                >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{label}</span>
                </button>
            ))}
        </div>
    );
}
