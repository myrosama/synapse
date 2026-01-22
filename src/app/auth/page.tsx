'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, Chrome, Apple, AlertCircle, Loader2 } from 'lucide-react';
import { RecitoLogo } from '@/components/ui/recito-logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useAuth } from '@/lib/store';
import { signIn as apiSignIn, signUp as apiSignUp } from '@/lib/api';

export default function AuthPage() {
    const router = useRouter();
    const { signIn } = useAuth();
    const [activeTab, setActiveTab] = useState('signin');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Form states
    const [signInForm, setSignInForm] = useState({ email: '', password: '', rememberMe: false });
    const [signUpForm, setSignUpForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const user = await apiSignIn(signInForm.email, signInForm.password);
            signIn(user);
            router.push('/app');
        } catch (err) {
            setError('Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (signUpForm.password !== signUpForm.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (signUpForm.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            const user = await apiSignUp(signUpForm.name, signUpForm.email, signUpForm.password);
            signIn(user);
            router.push('/app');
        } catch (err) {
            setError('Failed to create account. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0B1220] flex items-center justify-center p-4">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-cyan-500/10 to-transparent rounded-full blur-3xl" />
                <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-violet-500/10 to-transparent rounded-full blur-3xl" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative w-full max-w-md"
            >
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block">
                        <RecitoLogo size="lg" />
                    </Link>
                    <p className="text-slate-400 mt-2">Learn by teaching it back</p>
                </div>

                <Card className="p-6">
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="w-full mb-6">
                            <TabsTrigger value="signin" className="flex-1">Sign In</TabsTrigger>
                            <TabsTrigger value="signup" className="flex-1">Sign Up</TabsTrigger>
                        </TabsList>

                        {/* Error message */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/30 p-3 mb-4"
                            >
                                <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
                                <p className="text-sm text-red-400">{error}</p>
                            </motion.div>
                        )}

                        {/* Sign In Form */}
                        <TabsContent value="signin">
                            <form onSubmit={handleSignIn} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1.5">
                                        Email
                                    </label>
                                    <Input
                                        type="email"
                                        placeholder="you@example.com"
                                        icon={<Mail className="h-4 w-4" />}
                                        value={signInForm.email}
                                        onChange={(e) => setSignInForm({ ...signInForm, email: e.target.value })}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1.5">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <Input
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="••••••••"
                                            icon={<Lock className="h-4 w-4" />}
                                            value={signInForm.password}
                                            onChange={(e) => setSignInForm({ ...signInForm, password: e.target.value })}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={signInForm.rememberMe}
                                            onChange={(e) => setSignInForm({ ...signInForm, rememberMe: e.target.checked })}
                                            className="rounded border-white/20 bg-white/5 text-cyan-500 focus:ring-cyan-400"
                                        />
                                        <span className="text-sm text-slate-400">Remember me</span>
                                    </label>
                                    <a href="#" className="text-sm text-cyan-400 hover:text-cyan-300">
                                        Forgot password?
                                    </a>
                                </div>

                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Signing in...
                                        </>
                                    ) : (
                                        'Sign In'
                                    )}
                                </Button>
                            </form>
                        </TabsContent>

                        {/* Sign Up Form */}
                        <TabsContent value="signup">
                            <form onSubmit={handleSignUp} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1.5">
                                        Full Name
                                    </label>
                                    <Input
                                        type="text"
                                        placeholder="John Doe"
                                        icon={<User className="h-4 w-4" />}
                                        value={signUpForm.name}
                                        onChange={(e) => setSignUpForm({ ...signUpForm, name: e.target.value })}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1.5">
                                        Email
                                    </label>
                                    <Input
                                        type="email"
                                        placeholder="you@example.com"
                                        icon={<Mail className="h-4 w-4" />}
                                        value={signUpForm.email}
                                        onChange={(e) => setSignUpForm({ ...signUpForm, email: e.target.value })}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1.5">
                                        Password
                                    </label>
                                    <Input
                                        type="password"
                                        placeholder="••••••••"
                                        icon={<Lock className="h-4 w-4" />}
                                        value={signUpForm.password}
                                        onChange={(e) => setSignUpForm({ ...signUpForm, password: e.target.value })}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1.5">
                                        Confirm Password
                                    </label>
                                    <Input
                                        type="password"
                                        placeholder="••••••••"
                                        icon={<Lock className="h-4 w-4" />}
                                        value={signUpForm.confirmPassword}
                                        onChange={(e) => setSignUpForm({ ...signUpForm, confirmPassword: e.target.value })}
                                        required
                                    />
                                </div>

                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Creating account...
                                        </>
                                    ) : (
                                        'Create Account'
                                    )}
                                </Button>
                            </form>
                        </TabsContent>

                        {/* Social Login */}
                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-white/10" />
                                </div>
                                <div className="relative flex justify-center text-xs">
                                    <span className="bg-[#101B2D] px-2 text-slate-500">or continue with</span>
                                </div>
                            </div>

                            <div className="mt-4 grid grid-cols-2 gap-3">
                                <Button variant="outline" disabled className="gap-2">
                                    <Chrome className="h-4 w-4" />
                                    Google
                                </Button>
                                <Button variant="outline" disabled className="gap-2">
                                    <Apple className="h-4 w-4" />
                                    Apple
                                </Button>
                            </div>
                            <p className="text-xs text-slate-500 text-center mt-3">
                                Social login coming soon
                            </p>
                        </div>
                    </Tabs>
                </Card>

                <p className="text-center text-sm text-slate-500 mt-6">
                    By continuing, you agree to our{' '}
                    <a href="#" className="text-cyan-400 hover:text-cyan-300">Terms</a>
                    {' '}and{' '}
                    <a href="#" className="text-cyan-400 hover:text-cyan-300">Privacy Policy</a>
                </p>
            </motion.div>
        </div>
    );
}
