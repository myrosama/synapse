'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, GraduationCap, Library, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
    { href: '/app', icon: LayoutDashboard, label: 'Home' },
    { href: '/app/learn', icon: GraduationCap, label: 'Learn' },
    { href: '/app/library', icon: Library, label: 'Library' },
    { href: '/app/profile', icon: User, label: 'Profile' },
];

export function MobileNav() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden border-t border-white/8 bg-[#0B1220]/95 backdrop-blur-sm">
            <div className="flex h-16 items-center justify-around px-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href ||
                        (item.href !== '/app' && pathname.startsWith(item.href));

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-colors',
                                isActive
                                    ? 'text-cyan-400'
                                    : 'text-slate-400 hover:text-white'
                            )}
                        >
                            <item.icon className={cn('h-5 w-5', isActive && 'text-cyan-400')} />
                            <span className="text-xs font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
