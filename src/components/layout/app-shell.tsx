'use client';

import { ReactNode } from 'react';
import { Sidebar } from './sidebar';
import { Topbar } from './topbar';
import { MobileNav } from './mobile-nav';
import { useSidebar } from '@/lib/store';
import { cn } from '@/lib/utils';

interface AppShellProps {
    children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
    const { collapsed } = useSidebar();

    return (
        <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
            <Sidebar />
            <Topbar />

            {/* Main content */}
            <main
                className={cn(
                    'pt-16 pb-20 lg:pb-0 transition-all duration-300',
                    collapsed ? 'lg:pl-20' : 'lg:pl-64'
                )}
            >
                <div className="min-h-[calc(100vh-4rem)] p-4 lg:p-6">
                    {children}
                </div>
            </main>

            <MobileNav />
        </div>
    );
}
