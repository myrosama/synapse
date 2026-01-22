'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Menu, LogOut, Settings, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RecitoLogo } from '@/components/ui/recito-logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useAuth, useSidebar } from '@/lib/store';
import { useState } from 'react';

export function Topbar() {
    const router = useRouter();
    const { user, signOut } = useAuth();
    const { toggle } = useSidebar();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSignOut = () => {
        signOut();
        router.push('/');
    };

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <header className="fixed top-0 right-0 left-0 lg:left-64 z-30 h-16 border-b border-white/8 bg-[#0B1220]/95 backdrop-blur-sm">
            <div className="flex h-full items-center justify-between px-4 lg:px-6">
                {/* Mobile menu button & Logo */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={toggle}
                        className="lg:hidden p-2 rounded-lg text-slate-400 hover:bg-white/5 hover:text-white"
                    >
                        <Menu className="h-5 w-5" />
                    </button>
                    <Link href="/app" className="lg:hidden">
                        <RecitoLogo size="sm" />
                    </Link>
                </div>

                {/* Search */}
                <div className="hidden md:flex flex-1 max-w-md mx-4">
                    <Input
                        placeholder="Search topics, sessions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        icon={<Search className="h-4 w-4" />}
                        className="w-full"
                    />
                </div>

                {/* Right side */}
                <div className="flex items-center gap-3">
                    {/* Theme Toggle */}
                    <ThemeToggle className="hidden md:flex" />

                    <Button
                        onClick={() => router.push('/app/learn')}
                        size="sm"
                        className="hidden sm:flex"
                    >
                        Start Session
                    </Button>

                    {/* User menu */}
                    <div className="relative">
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="flex items-center gap-2 rounded-xl p-1.5 hover:bg-white/5 transition-colors"
                        >
                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center text-xs font-medium text-white">
                                {user ? getInitials(user.name) : 'G'}
                            </div>
                        </button>

                        {showUserMenu && (
                            <>
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setShowUserMenu(false)}
                                />
                                <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-white/10 bg-[#101B2D] p-1 shadow-xl z-50">
                                    {user && (
                                        <div className="px-3 py-2 border-b border-white/10 mb-1">
                                            <p className="text-sm font-medium text-white">{user.name}</p>
                                            <p className="text-xs text-slate-400">{user.email}</p>
                                        </div>
                                    )}
                                    <Link
                                        href="/app/profile"
                                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white"
                                        onClick={() => setShowUserMenu(false)}
                                    >
                                        <User className="h-4 w-4" />
                                        Profile
                                    </Link>
                                    <Link
                                        href="/app/profile"
                                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white"
                                        onClick={() => setShowUserMenu(false)}
                                    >
                                        <Settings className="h-4 w-4" />
                                        Settings
                                    </Link>
                                    <button
                                        onClick={handleSignOut}
                                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-400 hover:bg-red-500/10"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Sign out
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
