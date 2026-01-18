'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    User,
    Mail,
    LogOut,
    Settings,
    Globe,
    Target,
    Moon,
    Trash2
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem
} from '@/components/ui/select';
import { ConfirmModal } from '@/components/ui/modal';
import { useAuth, useUser, useToast } from '@/lib/store';
import { deleteAllSessions } from '@/lib/api';
import { LanguageLevel, LearningGoal } from '@/lib/types';
import { getInitials, getLevelColor } from '@/lib/utils';

export default function ProfilePage() {
    const router = useRouter();
    const { signOut } = useAuth();
    const user = useUser();
    const toast = useToast();

    // Settings state
    const [level, setLevel] = useState<LanguageLevel>(user?.level || 'B1');
    const [goal, setGoal] = useState<LearningGoal>(user?.goal || 'IELTS');
    const [nativeLanguage, setNativeLanguage] = useState(user?.nativeLanguage || 'Spanish');
    const [strictCorrections, setStrictCorrections] = useState(false);
    const [harderQuestions, setHarderQuestions] = useState(false);
    const [showHints, setShowHints] = useState(true);

    // Modals
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const handleSignOut = () => {
        signOut();
        router.push('/');
    };

    const handleDeleteAllSessions = async () => {
        setDeleteLoading(true);
        try {
            await deleteAllSessions();
            toast.success('All sessions deleted.');
            setShowDeleteModal(false);
        } catch (error) {
            toast.error('Failed to delete sessions.');
        } finally {
            setDeleteLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-2xl md:text-3xl font-bold text-white">Profile</h1>
                <p className="text-slate-400 mt-1">Manage your account and preferences.</p>
            </motion.div>

            {/* Account */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5 text-cyan-400" />
                            Account
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center text-xl font-medium text-white">
                                {user ? getInitials(user.name) : 'G'}
                            </div>
                            <div>
                                <p className="text-lg font-medium text-white">{user?.name || 'Guest'}</p>
                                <p className="text-sm text-slate-400 flex items-center gap-1">
                                    <Mail className="h-4 w-4" />
                                    {user?.email || 'Not signed in'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                            <Badge className={getLevelColor(user?.level || 'B1')}>
                                Level: {user?.level || 'B1'}
                            </Badge>
                            <Badge variant="secondary">{user?.totalSessions || 0} sessions</Badge>
                            <Badge variant="warning">{user?.streakDays || 0} day streak</Badge>
                        </div>

                        <Button variant="outline" onClick={handleSignOut} className="w-full sm:w-auto">
                            <LogOut className="h-4 w-4 mr-2" />
                            Sign Out
                        </Button>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Learning Preferences */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Target className="h-5 w-5 text-cyan-400" />
                            Learning Preferences
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                                    Current Level
                                </label>
                                <Select value={level} onValueChange={(v) => setLevel(v as LanguageLevel)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="A1">A1 - Beginner</SelectItem>
                                        <SelectItem value="A2">A2 - Elementary</SelectItem>
                                        <SelectItem value="B1">B1 - Intermediate</SelectItem>
                                        <SelectItem value="B2">B2 - Upper Intermediate</SelectItem>
                                        <SelectItem value="C1">C1 - Advanced</SelectItem>
                                        <SelectItem value="C2">C2 - Proficient</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                                    Learning Goal
                                </label>
                                <Select value={goal} onValueChange={(v) => setGoal(v as LearningGoal)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="IELTS">IELTS Preparation</SelectItem>
                                        <SelectItem value="SAT">SAT Preparation</SelectItem>
                                        <SelectItem value="Conversation">Conversation Skills</SelectItem>
                                        <SelectItem value="School">School English</SelectItem>
                                        <SelectItem value="Business">Business English</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                                    Native Language
                                </label>
                                <Select value={nativeLanguage} onValueChange={setNativeLanguage}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Spanish">Spanish</SelectItem>
                                        <SelectItem value="Chinese">Chinese</SelectItem>
                                        <SelectItem value="Arabic">Arabic</SelectItem>
                                        <SelectItem value="Russian">Russian</SelectItem>
                                        <SelectItem value="Portuguese">Portuguese</SelectItem>
                                        <SelectItem value="Japanese">Japanese</SelectItem>
                                        <SelectItem value="Korean">Korean</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-white/10">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-white">Strict corrections</p>
                                    <p className="text-xs text-slate-400">Get detailed grammar corrections</p>
                                </div>
                                <Switch
                                    checked={strictCorrections}
                                    onCheckedChange={setStrictCorrections}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-white">Harder questions</p>
                                    <p className="text-xs text-slate-400">AI asks more challenging questions</p>
                                </div>
                                <Switch
                                    checked={harderQuestions}
                                    onCheckedChange={setHarderQuestions}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-white">Show hints</p>
                                    <p className="text-xs text-slate-400">Display native language hints</p>
                                </div>
                                <Switch
                                    checked={showHints}
                                    onCheckedChange={setShowHints}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* UI Preferences */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Settings className="h-5 w-5 text-cyan-400" />
                            UI Preferences
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-white flex items-center gap-2">
                                    <Moon className="h-4 w-4" />
                                    Theme
                                </p>
                                <p className="text-xs text-slate-400">Dark mode is the default</p>
                            </div>
                            <Select defaultValue="dark" disabled>
                                <SelectTrigger className="w-32">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="dark">Dark</SelectItem>
                                    <SelectItem value="light">Light</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Danger Zone */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <Card className="border-red-500/30">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-red-400">
                            <Trash2 className="h-5 w-5" />
                            Danger Zone
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-slate-400 mb-4">
                            Permanently delete all your session data. This action cannot be undone.
                        </p>
                        <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
                            Delete All Sessions
                        </Button>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                open={showDeleteModal}
                onOpenChange={setShowDeleteModal}
                title="Delete All Sessions?"
                description="This will permanently delete all your learning sessions and progress. This action cannot be undone."
                confirmLabel="Delete All"
                variant="danger"
                onConfirm={handleDeleteAllSessions}
                loading={deleteLoading}
            />
        </div>
    );
}
