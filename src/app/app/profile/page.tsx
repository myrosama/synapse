'use client';

import { useState, useEffect } from 'react';
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
    Trash2,
    Award,
    Flame,
    Zap,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem
} from '@/components/ui/select';
import { ConfirmModal } from '@/components/ui/modal';
import { useAuth, useUser, useToast } from '@/lib/store';
import { deleteAllSessions, fetchSessions } from '@/lib/api';
import { LanguageLevel, LearningGoal } from '@/lib/types';
import { getInitials, getLevelColor } from '@/lib/utils';
import {
    StreakTracker,
    ActivityHeatmap,
    RankProgress,
    Leaderboard,
    AchievementBadge,
    getRank,
    ActivityDay,
    LeaderboardEntry,
} from '@/components/gamification/gamification';

// Mock leaderboard data (would come from backend in production)
const MOCK_LEADERBOARD: LeaderboardEntry[] = [
    { id: '1', name: 'Emma Wilson', xp: 15420, streak: 45, rank: 'Master' },
    { id: '2', name: 'James Chen', xp: 12350, streak: 38, rank: 'Professor' },
    { id: '3', name: 'Sofia Martinez', xp: 9870, streak: 32, rank: 'Professor' },
    { id: '4', name: 'Oliver Brown', xp: 7650, streak: 28, rank: 'Lecturer' },
    { id: '5', name: 'Ava Johnson', xp: 5420, streak: 21, rank: 'Lecturer' },
    { id: '6', name: 'Liam Davis', xp: 4320, streak: 18, rank: 'Lecturer' },
    { id: '7', name: 'Isabella Garcia', xp: 3210, streak: 15, rank: 'Teaching Assistant' },
    { id: '8', name: 'Noah Taylor', xp: 2450, streak: 12, rank: 'Teaching Assistant' },
    { id: '9', name: 'Mia Anderson', xp: 1820, streak: 9, rank: 'Teaching Assistant' },
    { id: '10', name: 'Lucas Thomas', xp: 1240, streak: 6, rank: 'Scholar' },
];

export default function ProfilePage() {
    const router = useRouter();
    const { signOut } = useAuth();
    const user = useUser();
    const toast = useToast();

    // Stats state
    const [userXP, setUserXP] = useState(0);
    const [currentStreak, setCurrentStreak] = useState(0);
    const [longestStreak, setLongestStreak] = useState(0);
    const [lastActive, setLastActive] = useState(new Date().toISOString());
    const [todaySessions, setTodaySessions] = useState(0);
    const [activityData, setActivityData] = useState<ActivityDay[]>([]);

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

    // Load gamification data
    useEffect(() => {
        const loadStats = async () => {
            try {
                const sessions = await fetchSessions();

                // Calculate XP (50 XP per session + bonus for score)
                const totalXP = sessions.reduce((sum, s) => sum + 50 + Math.floor(s.totalScore / 10), 0);
                setUserXP(totalXP);

                // Calculate streaks based on session dates
                if (sessions.length > 0) {
                    // Sort by date
                    const sortedSessions = [...sessions].sort((a, b) =>
                        new Date(b.date).getTime() - new Date(a.date).getTime()
                    );

                    setLastActive(sortedSessions[0].date);

                    // Count today's sessions
                    const today = new Date().toDateString();
                    const todayCount = sessions.filter(s =>
                        new Date(s.date).toDateString() === today
                    ).length;
                    setTodaySessions(todayCount);

                    // Calculate current streak
                    let streak = 0;
                    const dates = new Set(sessions.map(s => new Date(s.date).toDateString()));
                    const checkDate = new Date();

                    // Check if active today, if not, start from yesterday
                    if (!dates.has(checkDate.toDateString())) {
                        checkDate.setDate(checkDate.getDate() - 1);
                    }

                    while (dates.has(checkDate.toDateString())) {
                        streak++;
                        checkDate.setDate(checkDate.getDate() - 1);
                    }
                    setCurrentStreak(streak);

                    // Longest streak (simplified - would need proper calculation)
                    setLongestStreak(Math.max(streak, Math.floor(sessions.length / 2)));
                }

                // Generate activity data for heatmap
                const activityMap = new Map<string, number>();
                sessions.forEach(s => {
                    const dateKey = new Date(s.date).toISOString().split('T')[0];
                    activityMap.set(dateKey, (activityMap.get(dateKey) || 0) + 1);
                });

                const activity: ActivityDay[] = Array.from(activityMap.entries()).map(([date, count]) => ({
                    date,
                    count,
                }));
                setActivityData(activity);
            } catch (error) {
                console.error('Failed to load stats:', error);
            }
        };

        loadStats();
    }, []);

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
            setUserXP(0);
            setCurrentStreak(0);
            setTodaySessions(0);
            setActivityData([]);
        } catch (error) {
            toast.error('Failed to delete sessions.');
        } finally {
            setDeleteLoading(false);
        }
    };

    // Create leaderboard with current user
    const leaderboardWithUser: LeaderboardEntry[] = [
        ...MOCK_LEADERBOARD,
        {
            id: user?.id || 'current',
            name: user?.name || 'You',
            xp: userXP,
            streak: currentStreak,
            rank: getRank(userXP).name,
            isCurrentUser: true,
        }
    ].sort((a, b) => b.xp - a.xp).slice(0, 10);

    const currentRank = getRank(userXP);

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-2xl md:text-3xl font-bold text-white">Profile</h1>
                <p className="text-slate-400 mt-1">Track your progress and manage preferences.</p>
            </motion.div>

            <Tabs defaultValue="overview">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="stats">Stats & Rank</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                    {/* Account Card */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center text-xl font-medium text-white">
                                    {user ? getInitials(user.name) : 'G'}
                                </div>
                                <div className="flex-1">
                                    <p className="text-lg font-medium text-white">{user?.name || 'Guest'}</p>
                                    <p className="text-sm text-slate-400 flex items-center gap-1">
                                        <Mail className="h-4 w-4" />
                                        {user?.email || 'Not signed in'}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl">{currentRank.icon}</span>
                                        <span className={`font-semibold ${currentRank.color}`}>{currentRank.name}</span>
                                    </div>
                                    <p className="text-sm text-cyan-400 font-medium">{userXP.toLocaleString()} XP</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 pt-2">
                                <Badge className={getLevelColor(user?.level || 'B1')}>
                                    Level: {user?.level || 'B1'}
                                </Badge>
                                <Badge variant="secondary">{user?.totalSessions || 0} sessions</Badge>
                                <Badge variant="warning" className="flex items-center gap-1">
                                    <Flame className="h-3 w-3" />
                                    {currentStreak} day streak
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Streak & Daily Goal */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <StreakTracker
                            currentStreak={currentStreak}
                            longestStreak={longestStreak}
                            lastActive={lastActive}
                            dailyGoal={1}
                            todayCount={todaySessions}
                        />
                        <RankProgress currentXP={userXP} />
                    </div>

                    {/* Activity Heatmap */}
                    <ActivityHeatmap data={activityData} weeks={12} />
                </TabsContent>

                {/* Stats & Rank Tab */}
                <TabsContent value="stats" className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                        <RankProgress currentXP={userXP} />
                        <StreakTracker
                            currentStreak={currentStreak}
                            longestStreak={longestStreak}
                            lastActive={lastActive}
                            dailyGoal={1}
                            todayCount={todaySessions}
                        />
                    </div>

                    <Leaderboard entries={leaderboardWithUser} title="Global Leaderboard" />

                    {/* Achievements */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Award className="h-5 w-5 text-amber-400" />
                                Achievements
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <AchievementBadge
                                    name="First Steps"
                                    description="Complete your first session"
                                    icon={<Zap className="h-6 w-6" />}
                                    unlocked={userXP > 0}
                                    unlockedDate={activityData[0]?.date}
                                />
                                <AchievementBadge
                                    name="Week Warrior"
                                    description="7-day streak"
                                    icon={<Flame className="h-6 w-6" />}
                                    unlocked={currentStreak >= 7}
                                />
                                <AchievementBadge
                                    name="Century Club"
                                    description="Earn 100 XP"
                                    icon={<Target className="h-6 w-6" />}
                                    unlocked={userXP >= 100}
                                />
                                <AchievementBadge
                                    name="Scholar"
                                    description="Reach Scholar rank"
                                    icon={<Award className="h-6 w-6" />}
                                    unlocked={userXP >= 100}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Settings Tab */}
                <TabsContent value="settings" className="space-y-6">
                    {/* Learning Preferences */}
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
                                            <SelectItem value="Uzbek">Uzbek</SelectItem>
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

                    {/* Account Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5 text-cyan-400" />
                                Account
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Button variant="outline" onClick={handleSignOut} className="w-full sm:w-auto">
                                <LogOut className="h-4 w-4 mr-2" />
                                Sign Out
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Danger Zone */}
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
                </TabsContent>
            </Tabs>

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
