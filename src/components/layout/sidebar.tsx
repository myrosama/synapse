'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    GraduationCap,
    Library,
    User,
    HelpCircle,
    ChevronLeft,
    ChevronRight,
    Settings,
    Moon,
    Sun,
    Sparkles,
    Target,
    Lightbulb,
    Gamepad2,
    Mic,
    PenTool,
    Smartphone,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { RecitoLogo } from '@/components/ui/recito-logo';
import { Button } from '@/components/ui/button';
import { useSidebar } from '@/lib/store';
import { useTheme, Theme } from '@/lib/theme';

const navItems = [
    { href: '/app', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/app/learn', icon: GraduationCap, label: 'Learn' },
    { href: '/app/testlar', icon: Target, label: 'Testlar' },
    { href: '/app/vocab', icon: Gamepad2, label: 'Vocab Games' },
    { href: '/app/grammar', icon: PenTool, label: 'Grammar' },
    { href: '/app/speaking', icon: Mic, label: 'Speaking' },
    { href: '/app/formulas', icon: Lightbulb, label: 'Formulas' },
    { href: '/app/library', icon: Library, label: 'Library' },
    { href: '/app/profile', icon: User, label: 'Profile' },
    { href: '/app/help', icon: HelpCircle, label: 'Help' },
    { href: '/app/admin', icon: Settings, label: 'Admin' },
];

const themeIcons: Record<Theme, typeof Moon> = {
    dark: Moon,
    light: Sun,
    night: Sparkles,
    oled: Smartphone,
};

const themeLabels: Record<Theme, string> = {
    dark: 'Dark',
    light: 'Light',
    night: 'Night',
    oled: 'OLED',
};

const themeOrder: Theme[] = ['dark', 'light', 'night', 'oled'];

export function Sidebar() {
    const pathname = usePathname();
    const { collapsed, toggle } = useSidebar();
    const { theme, setTheme } = useTheme();

    const cycleTheme = () => {
        const currentIndex = themeOrder.indexOf(theme);
        const nextIndex = (currentIndex + 1) % themeOrder.length;
        setTheme(themeOrder[nextIndex]);
    };

    const ThemeIcon = themeIcons[theme];

    return (
        <aside
            className={cn(
                'fixed left-0 top-0 z-40 h-full border-r border-white/8 bg-[#0B1220] transition-all duration-300',
                collapsed ? 'w-20' : 'w-64',
                'hidden lg:block'
            )}
        >
            {/* Logo */}
            <div className="flex h-16 items-center justify-between border-b border-white/8 px-4">
                <Link href="/app" className="flex items-center">
                    <RecitoLogo showText={!collapsed} size="md" />
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-1 p-3">
                {navItems.map((item) => {
                    const isActive = pathname === item.href ||
                        (item.href !== '/app' && pathname.startsWith(item.href));

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                                isActive
                                    ? 'bg-cyan-500/15 text-cyan-400'
                                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                            )}
                        >
                            <item.icon className={cn('h-5 w-5 flex-shrink-0', isActive && 'text-cyan-400')} />
                            {!collapsed && <span>{item.label}</span>}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom actions */}
            <div className="absolute bottom-4 left-0 right-0 px-3 space-y-2">
                {/* Theme toggle */}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={cycleTheme}
                    className={cn('w-full justify-center', collapsed ? 'px-2' : 'justify-start gap-3')}
                    title={`Theme: ${themeLabels[theme]}`}
                >
                    <ThemeIcon className="h-4 w-4" />
                    {!collapsed && <span>{themeLabels[theme]} Mode</span>}
                </Button>

                {/* Collapse toggle */}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggle}
                    className={cn('w-full justify-center', collapsed ? 'px-2' : '')}
                >
                    {collapsed ? (
                        <ChevronRight className="h-4 w-4" />
                    ) : (
                        <>
                            <ChevronLeft className="h-4 w-4" />
                            <span className="ml-2">Collapse</span>
                        </>
                    )}
                </Button>
            </div>
        </aside>
    );
}

