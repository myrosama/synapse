'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    Search,
    BookOpen,
    Star,
    StarOff,
    Clock,
    Filter,
    Calendar
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem
} from '@/components/ui/select';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton, SkeletonCard } from '@/components/ui/skeleton';
import { useToast } from '@/lib/store';
import { fetchTopics, fetchSessions, toggleStarTopic } from '@/lib/api';
import { Topic, Session, LanguageLevel, TopicCategory } from '@/lib/types';
import { getLevelColor, getScoreColor, formatDate, getRelativeTime } from '@/lib/utils';

export default function LibraryPage() {
    const router = useRouter();
    const toast = useToast();
    const [topics, setTopics] = useState<Topic[]>([]);
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [levelFilter, setLevelFilter] = useState<LanguageLevel | 'all'>('all');
    const [categoryFilter, setCategoryFilter] = useState<TopicCategory | 'all'>('all');

    useEffect(() => {
        const loadData = async () => {
            try {
                const [topicsData, sessionsData] = await Promise.all([
                    fetchTopics(),
                    fetchSessions(),
                ]);
                setTopics(topicsData);
                setSessions(sessionsData);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const handleToggleStar = async (topicId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const updated = await toggleStarTopic(topicId);
        if (updated) {
            setTopics(topics.map(t => t.id === topicId ? updated : t));
            toast.success(updated.starred ? 'Topic saved!' : 'Topic removed from saved.');
        }
    };

    const filteredTopics = topics.filter(topic => {
        const matchesSearch = topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            topic.tags.some(tag => tag.includes(searchQuery.toLowerCase()));
        const matchesLevel = levelFilter === 'all' || topic.level === levelFilter;
        const matchesCategory = categoryFilter === 'all' || topic.category === categoryFilter;
        return matchesSearch && matchesLevel && matchesCategory;
    });

    const starredTopics = filteredTopics.filter(t => t.starred);
    const otherTopics = filteredTopics.filter(t => !t.starred);

    const filteredSessions = sessions.filter(session => {
        return session.topic.title.toLowerCase().includes(searchQuery.toLowerCase());
    });

    if (loading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-12 w-64" />
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-2xl md:text-3xl font-bold text-white">Library</h1>
                <p className="text-slate-400 mt-1">Browse topics and review past sessions.</p>
            </motion.div>

            <Tabs defaultValue="topics">
                <TabsList>
                    <TabsTrigger value="topics">Topics</TabsTrigger>
                    <TabsTrigger value="sessions">Sessions</TabsTrigger>
                </TabsList>

                {/* Topics Tab */}
                <TabsContent value="topics" className="space-y-6">
                    {/* Filters */}
                    <Card>
                        <CardContent className="flex flex-col md:flex-row gap-4 py-4">
                            <div className="flex-1">
                                <Input
                                    placeholder="Search topics..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    icon={<Search className="h-4 w-4" />}
                                />
                            </div>
                            <Select value={levelFilter} onValueChange={(v) => setLevelFilter(v as LanguageLevel | 'all')}>
                                <SelectTrigger className="w-full md:w-40">
                                    <SelectValue placeholder="Level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Levels</SelectItem>
                                    <SelectItem value="A1">A1</SelectItem>
                                    <SelectItem value="A2">A2</SelectItem>
                                    <SelectItem value="B1">B1</SelectItem>
                                    <SelectItem value="B2">B2</SelectItem>
                                    <SelectItem value="C1">C1</SelectItem>
                                    <SelectItem value="C2">C2</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v as TopicCategory | 'all')}>
                                <SelectTrigger className="w-full md:w-40">
                                    <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    <SelectItem value="Grammar">Grammar</SelectItem>
                                    <SelectItem value="Vocabulary">Vocabulary</SelectItem>
                                    <SelectItem value="Speaking">Speaking</SelectItem>
                                    <SelectItem value="Writing">Writing</SelectItem>
                                </SelectContent>
                            </Select>
                        </CardContent>
                    </Card>

                    {/* Saved Topics */}
                    {starredTopics.length > 0 && (
                        <div>
                            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <Star className="h-5 w-5 text-amber-400" />
                                Saved Topics
                            </h2>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {starredTopics.map(topic => (
                                    <TopicCard
                                        key={topic.id}
                                        topic={topic}
                                        onStar={handleToggleStar}
                                        onStart={() => router.push(`/app/learn?topic=${topic.id}`)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* All Topics */}
                    <div>
                        <h2 className="text-lg font-semibold text-white mb-4">
                            {starredTopics.length > 0 ? 'All Topics' : 'Topics'}
                        </h2>
                        {otherTopics.length === 0 ? (
                            <EmptyState
                                icon="search"
                                title="No topics found"
                                description="Try adjusting your filters or search query."
                            />
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {otherTopics.map(topic => (
                                    <TopicCard
                                        key={topic.id}
                                        topic={topic}
                                        onStar={handleToggleStar}
                                        onStart={() => router.push(`/app/learn?topic=${topic.id}`)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </TabsContent>

                {/* Sessions Tab */}
                <TabsContent value="sessions" className="space-y-4">
                    {/* Search */}
                    <Input
                        placeholder="Search sessions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        icon={<Search className="h-4 w-4" />}
                        className="max-w-md"
                    />

                    {filteredSessions.length === 0 ? (
                        <EmptyState
                            icon="empty"
                            title="No sessions yet"
                            description="Complete your first teach-back session to see it here."
                            action={{
                                label: 'Start Learning',
                                onClick: () => router.push('/app/learn'),
                            }}
                        />
                    ) : (
                        <div className="space-y-3">
                            {filteredSessions.map(session => (
                                <motion.div
                                    key={session.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    onClick={() => router.push(`/app/session/${session.id}`)}
                                    className="flex items-center justify-between p-4 rounded-xl border border-white/8 bg-[#101B2D] hover:bg-[#162035] transition-colors cursor-pointer"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                                            <BookOpen className="h-6 w-6 text-cyan-400" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-white">{session.topic.title}</p>
                                            <div className="flex items-center gap-2 mt-1 text-sm">
                                                <span className="text-slate-400 flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {getRelativeTime(session.date)}
                                                </span>
                                                <Badge className={getLevelColor(session.level)}>{session.level}</Badge>
                                                <Badge variant="muted">{session.topic.category}</Badge>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-2xl font-bold ${getScoreColor(session.totalScore)}`}>
                                            {session.totalScore}%
                                        </p>
                                        <Badge variant={session.status === 'completed' ? 'success' : 'warning'}>
                                            {session.status === 'completed' ? 'Completed' : 'In Progress'}
                                        </Badge>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}

// Topic Card Component
function TopicCard({
    topic,
    onStar,
    onStart
}: {
    topic: Topic;
    onStar: (id: string, e: React.MouseEvent) => void;
    onStart: () => void;
}) {
    return (
        <Card className="hover:border-white/20 transition-colors">
            <CardContent className="py-4">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                        <h3 className="font-medium text-white leading-tight">{topic.title}</h3>
                        <div className="flex items-center gap-2 mt-2">
                            <Badge className={getLevelColor(topic.level)}>{topic.level}</Badge>
                            <Badge variant="muted">{topic.category}</Badge>
                        </div>
                    </div>
                    <button
                        onClick={(e) => onStar(topic.id, e)}
                        className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                    >
                        {topic.starred ? (
                            <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
                        ) : (
                            <StarOff className="h-5 w-5 text-slate-400" />
                        )}
                    </button>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
                    <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {topic.estimatedMinutes} min
                    </span>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4">
                    {topic.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-slate-400">
                            {tag}
                        </span>
                    ))}
                </div>

                <Button size="sm" onClick={onStart} className="w-full">
                    Start Session
                </Button>
            </CardContent>
        </Card>
    );
}
