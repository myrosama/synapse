'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Settings,
    Users,
    BookOpen,
    Trash2,
    RefreshCw,
    Plus,
    Check,
    AlertCircle,
    Calendar,
    Clock,
    Edit,
    Save,
    X,
    FolderPlus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { resetAllData, saveSession, fetchTopics } from '@/lib/api';
import { useAuth } from '@/lib/store';
import { mockTopics } from '@/lib/mock-data';
import { Topic, Session, TopicCategory, LanguageLevel } from '@/lib/types';

// Topic categories and levels for forms
const CATEGORIES: TopicCategory[] = ['Grammar', 'Vocabulary', 'Writing', 'Speaking'];
const LEVELS: LanguageLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export default function AdminPage() {
    const { user } = useAuth();
    const [users, setUsers] = useState<any[]>([]);
    const [sessions, setSessions] = useState<any[]>([]);
    const [customTopics, setCustomTopics] = useState<Topic[]>([]);
    const [isResetting, setIsResetting] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [activeTab, setActiveTab] = useState('overview');

    // New session form state
    const [newSession, setNewSession] = useState({
        topicId: 'topic-1',
        score: 75,
        date: new Date().toISOString().split('T')[0],
    });

    // New topic form state
    const [showTopicForm, setShowTopicForm] = useState(false);
    const [newTopic, setNewTopic] = useState<{
        title: string;
        category: TopicCategory;
        level: LanguageLevel;
        estimatedMinutes: number;
        tags: string;
    }>({
        title: '',
        category: 'Grammar',
        level: 'B1',
        estimatedMinutes: 10,
        tags: '',
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        // Load users
        const storedUsers = localStorage.getItem('recito_users');
        if (storedUsers) {
            setUsers(JSON.parse(storedUsers));
        }

        // Load sessions
        const storedSessions = localStorage.getItem('recito_sessions');
        if (storedSessions) {
            setSessions(JSON.parse(storedSessions));
        } else {
            setSessions([]);
        }

        // Load custom topics
        const storedTopics = localStorage.getItem('recito_custom_topics');
        if (storedTopics) {
            setCustomTopics(JSON.parse(storedTopics));
        }
    };

    const showMessage = (type: 'success' | 'error', text: string) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 4000);
    };

    const handleResetAllData = async () => {
        if (!confirm('Are you sure you want to reset ALL data? This will delete all users, sessions, and progress.')) {
            return;
        }

        setIsResetting(true);
        try {
            await resetAllData();
            localStorage.removeItem('recito_custom_topics');
            setUsers([]);
            setSessions([]);
            setCustomTopics([]);
            showMessage('success', 'All data has been reset successfully!');
            setTimeout(() => {
                window.location.href = '/auth';
            }, 1500);
        } catch (error) {
            showMessage('error', 'Failed to reset data');
        } finally {
            setIsResetting(false);
        }
    };

    const handleDeleteUser = (userId: string) => {
        if (!confirm('Delete this user and all their data?')) return;

        const updatedUsers = users.filter(u => u.id !== userId);
        localStorage.setItem('recito_users', JSON.stringify(updatedUsers));
        setUsers(updatedUsers);
        showMessage('success', 'User deleted');
    };

    const handleClearSessions = () => {
        if (!confirm('Clear all sessions?')) return;

        localStorage.removeItem('recito_sessions');
        setSessions([]);
        showMessage('success', 'All sessions cleared');
    };

    const handleAddSession = async () => {
        const topic = [...mockTopics, ...customTopics].find(t => t.id === newSession.topicId);
        if (!topic) {
            showMessage('error', 'Please select a valid topic');
            return;
        }

        const session: Partial<Session> = {
            id: `session-${Date.now()}`,
            topicId: newSession.topicId,
            topic: topic,
            date: new Date(newSession.date).toISOString(),
            totalScore: newSession.score,
            status: 'completed',
            level: topic.level,
            scores: {
                correctness: Math.round(newSession.score + (Math.random() * 10 - 5)),
                coverage: Math.round(newSession.score + (Math.random() * 10 - 5)),
                clarity: Math.round(newSession.score + (Math.random() * 10 - 5)),
                english: Math.round(newSession.score + (Math.random() * 10 - 5)),
            },
        };

        try {
            await saveSession(session);
            loadData(); // Refresh data
            showMessage('success', 'Session added successfully!');
            setNewSession({ topicId: 'topic-1', score: 75, date: new Date().toISOString().split('T')[0] });
        } catch (error) {
            showMessage('error', 'Failed to add session');
        }
    };

    const handleAddTopic = () => {
        if (!newTopic.title.trim()) {
            showMessage('error', 'Please enter a topic title');
            return;
        }

        const topic: Topic = {
            id: `custom-topic-${Date.now()}`,
            title: newTopic.title.trim(),
            category: newTopic.category,
            level: newTopic.level,
            estimatedMinutes: newTopic.estimatedMinutes,
            tags: newTopic.tags.split(',').map(t => t.trim()).filter(Boolean),
            starred: false,
        };

        const updatedTopics = [...customTopics, topic];
        localStorage.setItem('recito_custom_topics', JSON.stringify(updatedTopics));
        setCustomTopics(updatedTopics);
        showMessage('success', 'Topic added successfully!');
        setNewTopic({ title: '', category: 'Grammar', level: 'B1', estimatedMinutes: 10, tags: '' });
        setShowTopicForm(false);
    };

    const handleDeleteTopic = (topicId: string) => {
        if (!confirm('Delete this custom topic?')) return;

        const updatedTopics = customTopics.filter(t => t.id !== topicId);
        localStorage.setItem('recito_custom_topics', JSON.stringify(updatedTopics));
        setCustomTopics(updatedTopics);
        showMessage('success', 'Topic deleted');
    };

    const handleDeleteSession = (sessionId: string) => {
        if (!confirm('Delete this session?')) return;

        const updatedSessions = sessions.filter(s => s.id !== sessionId);
        localStorage.setItem('recito_sessions', JSON.stringify(updatedSessions));
        setSessions(updatedSessions);
        showMessage('success', 'Session deleted');
    };

    const allTopics = [...mockTopics, ...customTopics];

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
            >
                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                    <Settings className="h-8 w-8 text-cyan-400" />
                    <div>
                        <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
                        <p className="text-sm text-slate-400">Manage sessions, topics, users, and data</p>
                    </div>
                </div>

                {/* Message Toast */}
                {message && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${message.type === 'success'
                            ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                            : 'bg-red-500/10 border border-red-500/20 text-red-400'
                            }`}
                    >
                        {message.type === 'success' ? <Check className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                        {message.text}
                    </motion.div>
                )}

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="mb-6">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="sessions">Sessions</TabsTrigger>
                        <TabsTrigger value="topics">Topics</TabsTrigger>
                        <TabsTrigger value="users">Users</TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview">
                        <div className="grid gap-6">
                            {/* Stats */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <Card className="p-4 text-center">
                                    <p className="text-3xl font-bold text-cyan-400">{users.length}</p>
                                    <p className="text-sm text-slate-400">Users</p>
                                </Card>
                                <Card className="p-4 text-center">
                                    <p className="text-3xl font-bold text-purple-400">{sessions.length}</p>
                                    <p className="text-sm text-slate-400">Sessions</p>
                                </Card>
                                <Card className="p-4 text-center">
                                    <p className="text-3xl font-bold text-green-400">{allTopics.length}</p>
                                    <p className="text-sm text-slate-400">Topics</p>
                                </Card>
                                <Card className="p-4 text-center">
                                    <p className="text-3xl font-bold text-orange-400">{customTopics.length}</p>
                                    <p className="text-sm text-slate-400">Custom Topics</p>
                                </Card>
                            </div>

                            {/* Quick Actions */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <RefreshCw className="h-5 w-5" />
                                        Quick Actions
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-wrap gap-3">
                                    <Button onClick={() => setActiveTab('sessions')}>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Session
                                    </Button>
                                    <Button variant="secondary" onClick={() => { setActiveTab('topics'); setShowTopicForm(true); }}>
                                        <FolderPlus className="h-4 w-4 mr-2" />
                                        Add Topic
                                    </Button>
                                    <Button variant="outline" onClick={handleClearSessions}>
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Clear Sessions
                                    </Button>
                                    <Button variant="danger" onClick={handleResetAllData} disabled={isResetting}>
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        {isResetting ? 'Resetting...' : 'Reset All Data'}
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Sessions Tab */}
                    <TabsContent value="sessions">
                        <div className="grid gap-6">
                            {/* Add Session Form */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Plus className="h-5 w-5" />
                                        Add New Session
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid md:grid-cols-4 gap-4">
                                        <div>
                                            <label className="block text-sm text-slate-400 mb-1">Topic</label>
                                            <select
                                                value={newSession.topicId}
                                                onChange={(e) => setNewSession({ ...newSession, topicId: e.target.value })}
                                                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-white/10 text-white"
                                            >
                                                {allTopics.map(topic => (
                                                    <option key={topic.id} value={topic.id}>{topic.title}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm text-slate-400 mb-1">Score (%)</label>
                                            <Input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={newSession.score}
                                                onChange={(e) => setNewSession({ ...newSession, score: parseInt(e.target.value) || 0 })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-slate-400 mb-1">Date</label>
                                            <Input
                                                type="date"
                                                value={newSession.date}
                                                onChange={(e) => setNewSession({ ...newSession, date: e.target.value })}
                                            />
                                        </div>
                                        <div className="flex items-end">
                                            <Button onClick={handleAddSession} className="w-full">
                                                <Plus className="h-4 w-4 mr-2" />
                                                Add Session
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Sessions List */}
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle className="flex items-center gap-2">
                                        <Calendar className="h-5 w-5" />
                                        All Sessions ({sessions.length})
                                    </CardTitle>
                                    <Button variant="outline" size="sm" onClick={loadData}>
                                        <RefreshCw className="h-4 w-4" />
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    {sessions.length === 0 ? (
                                        <p className="text-slate-400 text-sm py-8 text-center">No sessions yet. Add one above!</p>
                                    ) : (
                                        <div className="space-y-2 max-h-96 overflow-y-auto">
                                            {sessions.map((session) => (
                                                <div
                                                    key={session.id}
                                                    className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold ${session.totalScore >= 80 ? 'bg-green-500/20 text-green-400' :
                                                            session.totalScore >= 60 ? 'bg-yellow-500/20 text-yellow-400' :
                                                                'bg-red-500/20 text-red-400'
                                                            }`}>
                                                            {session.totalScore}%
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-white">{session.topic?.title || 'Unknown Topic'}</p>
                                                            <p className="text-xs text-slate-400">
                                                                {new Date(session.date).toLocaleDateString()} • {session.topic?.category || 'N/A'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-red-400 hover:text-red-300"
                                                        onClick={() => handleDeleteSession(session.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Topics Tab */}
                    <TabsContent value="topics">
                        <div className="grid gap-6">
                            {/* Add Topic Form */}
                            {showTopicForm ? (
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between">
                                        <CardTitle className="flex items-center gap-2">
                                            <FolderPlus className="h-5 w-5" />
                                            Add New Topic
                                        </CardTitle>
                                        <Button variant="ghost" size="sm" onClick={() => setShowTopicForm(false)}>
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm text-slate-400 mb-1">Title</label>
                                                <Input
                                                    placeholder="e.g., Third Conditional"
                                                    value={newTopic.title}
                                                    onChange={(e) => setNewTopic({ ...newTopic, title: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-slate-400 mb-1">Category</label>
                                                <select
                                                    value={newTopic.category}
                                                    onChange={(e) => setNewTopic({ ...newTopic, category: e.target.value as any })}
                                                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-white/10 text-white"
                                                >
                                                    {CATEGORIES.map(cat => (
                                                        <option key={cat} value={cat}>{cat}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm text-slate-400 mb-1">Level</label>
                                                <select
                                                    value={newTopic.level}
                                                    onChange={(e) => setNewTopic({ ...newTopic, level: e.target.value as any })}
                                                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-white/10 text-white"
                                                >
                                                    {LEVELS.map(level => (
                                                        <option key={level} value={level}>{level}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm text-slate-400 mb-1">Duration (min)</label>
                                                <Input
                                                    type="number"
                                                    min="5"
                                                    max="60"
                                                    value={newTopic.estimatedMinutes}
                                                    onChange={(e) => setNewTopic({ ...newTopic, estimatedMinutes: parseInt(e.target.value) || 10 })}
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-sm text-slate-400 mb-1">Tags (comma separated)</label>
                                                <Input
                                                    placeholder="e.g., conditionals, hypothetical, advanced"
                                                    value={newTopic.tags}
                                                    onChange={(e) => setNewTopic({ ...newTopic, tags: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex justify-end mt-4">
                                            <Button onClick={handleAddTopic}>
                                                <Save className="h-4 w-4 mr-2" />
                                                Save Topic
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ) : (
                                <Button onClick={() => setShowTopicForm(true)} className="self-start">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Custom Topic
                                </Button>
                            )}

                            {/* Custom Topics */}
                            {customTopics.length > 0 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <FolderPlus className="h-5 w-5 text-purple-400" />
                                            Custom Topics ({customTopics.length})
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            {customTopics.map((topic) => (
                                                <div
                                                    key={topic.id}
                                                    className="flex items-center justify-between p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg"
                                                >
                                                    <div>
                                                        <p className="font-medium text-white">{topic.title}</p>
                                                        <p className="text-xs text-slate-400">
                                                            {topic.category} • {topic.level} • {topic.estimatedMinutes} min
                                                        </p>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-red-400 hover:text-red-300"
                                                        onClick={() => handleDeleteTopic(topic.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Built-in Topics */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <BookOpen className="h-5 w-5" />
                                        Built-in Topics ({mockTopics.length})
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-2 max-h-96 overflow-y-auto">
                                        {mockTopics.map((topic) => (
                                            <div
                                                key={topic.id}
                                                className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg"
                                            >
                                                <div>
                                                    <p className="font-medium text-white">{topic.title}</p>
                                                    <p className="text-xs text-slate-400">
                                                        {topic.category} • {topic.level} • {topic.estimatedMinutes} min
                                                    </p>
                                                </div>
                                                <div className="flex gap-1">
                                                    {topic.tags.slice(0, 2).map((tag) => (
                                                        <span
                                                            key={tag}
                                                            className="px-2 py-0.5 text-xs bg-slate-700 text-slate-300 rounded"
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Users Tab */}
                    <TabsContent value="users">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5" />
                                    Registered Users ({users.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {users.length === 0 ? (
                                    <p className="text-slate-400 text-sm py-8 text-center">No users registered yet.</p>
                                ) : (
                                    <div className="space-y-2">
                                        {users.map((u) => (
                                            <div
                                                key={u.id}
                                                className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center text-white font-bold">
                                                        {u.name?.charAt(0)?.toUpperCase() || 'U'}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-white">{u.name}</p>
                                                        <p className="text-sm text-slate-400">{u.email}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="text-right text-sm">
                                                        <p className="text-slate-300">Level: {u.level}</p>
                                                        <p className="text-slate-500">Goal: {u.goal}</p>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-red-400 hover:text-red-300"
                                                        onClick={() => handleDeleteUser(u.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </motion.div>
        </div>
    );
}
