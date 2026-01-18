'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    Flame,
    PlayCircle,
    Clock,
    TrendingUp,
    Target,
    BookOpen,
    ArrowRight,
    ChevronRight
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem
} from '@/components/ui/select';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton, SkeletonCard } from '@/components/ui/skeleton';
import { useUser, useApp } from '@/lib/store';
import { fetchSessions, fetchTopics } from '@/lib/api';
import { Session, Topic, LanguageLevel, TopicCategory, LearningGoal } from '@/lib/types';
import { formatDate, getScoreColor, getLevelColor, getRelativeTime } from '@/lib/utils';

export default function DashboardPage() {
    const router = useRouter();
    const user = useUser();
    const { state } = useApp();
    const [sessions, setSessions] = useState<Session[]>([]);
    const [topics, setTopics] = useState<Topic[]>([]);
    const [loading, setLoading] = useState(true);

    // New session form
    const [goal, setGoal] = useState<LearningGoal>('IELTS');
    const [level, setLevel] = useState<LanguageLevel>('B1');
    const [category, setCategory] = useState<TopicCategory>('Grammar');
    const [selectedTopic, setSelectedTopic] = useState<string>('');

    useEffect(() => {
        const loadData = async () => {
            try {
                const [sessionsData, topicsData] = await Promise.all([
                    fetchSessions(),
                    fetchTopics({ level, category }),
                ]);
                setSessions(sessionsData);
                setTopics(topicsData);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [level, category]);

    // Filter topics by selected criteria
    useEffect(() => {
        const loadTopics = async () => {
            const topicsData = await fetchTopics({ level, category });
            setTopics(topicsData);
            if (topicsData.length > 0) {
                setSelectedTopic(topicsData[0].id);
            }
        };
        loadTopics();
    }, [level, category]);

    const inProgressSession = sessions.find(s => s.status === 'in_progress');
    const completedSessions = sessions.filter(s => s.status === 'completed');
    const averageScore = completedSessions.length > 0
        ? Math.round(completedSessions.reduce((sum, s) => sum + s.totalScore, 0) / completedSessions.length)
        : 0;

    const handleStartSession = () => {
        if (selectedTopic) {
            router.push(`/app/learn?topic=${selectedTopic}`);
        } else {
            router.push('/app/learn');
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-12 w-64" />
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Welcome Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white">
                        Welcome back, {user?.name?.split(' ')[0] || 'Learner'}!
                    </h1>
                    <p className="text-slate-400 mt-1">Ready to teach something new today?</p>
                </div>

                {/* Streak badge */}
                <div className="flex items-center gap-3 bg-amber-500/10 rounded-xl px-4 py-2">
                    <Flame className="h-5 w-5 text-amber-400" />
                    <div>
                        <p className="text-lg font-bold text-amber-400">{user?.streakDays || 0} days</p>
                        <p className="text-xs text-slate-400">Current streak</p>
                    </div>
                </div>
            </motion.div>

            {/* Continue Session */}
            {inProgressSession && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card className="border-cyan-500/30 bg-gradient-to-r from-cyan-500/10 to-transparent">
                        <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                                    <PlayCircle className="h-6 w-6 text-cyan-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-cyan-400 font-medium">Continue your session</p>
                                    <p className="text-white font-semibold">{inProgressSession.topic.title}</p>
                                </div>
                            </div>
                            <Button onClick={() => router.push('/app/learn')}>
                                Resume
                                <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Start New Session Panel */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-2"
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BookOpen className="h-5 w-5 text-cyan-400" />
                                Start a New Session
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Goal</label>
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

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Level</label>
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
                                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Category</label>
                                    <Select value={category} onValueChange={(v) => setCategory(v as TopicCategory)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Grammar">Grammar</SelectItem>
                                            <SelectItem value="Vocabulary">Vocabulary</SelectItem>
                                            <SelectItem value="Speaking">Speaking</SelectItem>
                                            <SelectItem value="Writing">Writing</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Topic</label>
                                    <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a topic" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {topics.map(topic => (
                                                <SelectItem key={topic.id} value={topic.id}>
                                                    {topic.title}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <Button onClick={handleStartSession} className="w-full sm:w-auto">
                                Start Session
                                <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Progress Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-4"
                >
                    <Card>
                        <CardContent className="flex items-center gap-4 py-4">
                            <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
                                <BookOpen className="h-5 w-5 text-violet-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">{user?.totalSessions || 0}</p>
                                <p className="text-sm text-slate-400">Total sessions</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="flex items-center gap-4 py-4">
                            <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                                <TrendingUp className="h-5 w-5 text-green-400" />
                            </div>
                            <div>
                                <p className={`text-2xl font-bold ${getScoreColor(averageScore)}`}>{averageScore}%</p>
                                <p className="text-sm text-slate-400">Average score</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="py-4">
                            <div className="flex items-center gap-4 mb-3">
                                <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                                    <Target className="h-5 w-5 text-amber-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-white">Areas to improve</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Badge variant="warning">Conditionals</Badge>
                                <Badge variant="warning">Articles</Badge>
                                <Badge variant="warning">Phrasal verbs</Badge>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Recent Sessions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Recent Sessions</CardTitle>
                        <Link href="/app/library">
                            <Button variant="ghost" size="sm" className="gap-1">
                                View all
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        {completedSessions.length === 0 ? (
                            <EmptyState
                                icon="empty"
                                title="No sessions yet"
                                description="Start your first session to see your progress here."
                                action={{
                                    label: 'Start First Session',
                                    onClick: () => router.push('/app/learn'),
                                }}
                            />
                        ) : (
                            <div className="space-y-3">
                                {completedSessions.slice(0, 5).map((session) => (
                                    <Link
                                        key={session.id}
                                        href={`/app/session/${session.id}`}
                                        className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                                                <BookOpen className="h-5 w-5 text-cyan-400" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-white">{session.topic.title}</p>
                                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                                    <span>{getRelativeTime(session.date)}</span>
                                                    <Badge variant="muted" className={getLevelColor(session.level)}>
                                                        {session.level}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`text-lg font-bold ${getScoreColor(session.totalScore)}`}>
                                                {session.totalScore}%
                                            </p>
                                            <Badge variant={session.status === 'completed' ? 'success' : 'warning'}>
                                                {session.status === 'completed' ? 'Completed' : 'In Progress'}
                                            </Badge>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
