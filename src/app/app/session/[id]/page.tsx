'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Calendar,
    Copy,
    Download,
    ArrowRight,
    MessageSquare,
    CheckCircle,
    AlertCircle
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Skeleton, SkeletonCard } from '@/components/ui/skeleton';
import { useToast } from '@/lib/store';
import { fetchSession } from '@/lib/api';
import { Session } from '@/lib/types';
import { formatDateTime, getScoreColor, getLevelColor, getGradeLabel } from '@/lib/utils';

export default function SessionDetailPage() {
    const params = useParams();
    const router = useRouter();
    const toast = useToast();
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadSession = async () => {
            try {
                const data = await fetchSession(params.id as string);
                setSession(data);
            } finally {
                setLoading(false);
            }
        };
        loadSession();
    }, [params.id]);

    const handleCopySummary = () => {
        if (!session) return;
        const summary = `
Topic: ${session.topic.title}
Date: ${formatDateTime(session.date)}
Score: ${session.totalScore}%

My Explanation:
${session.userExplanation}

Improved Explanation:
${session.improvedExplanation}
    `.trim();
        navigator.clipboard.writeText(summary);
        toast.success('Summary copied to clipboard.');
    };

    const handleDownloadPdf = () => {
        toast.info('PDF download coming soon.');
    };

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto space-y-6">
                <Skeleton className="h-8 w-64" />
                <SkeletonCard />
                <SkeletonCard />
            </div>
        );
    }

    if (!session) {
        return (
            <div className="max-w-4xl mx-auto text-center py-12">
                <p className="text-slate-400">Session not found.</p>
                <Button variant="outline" onClick={() => router.push('/app/library')} className="mt-4">
                    Back to Library
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-white">{session.topic.title}</h1>
                        <div className="flex items-center gap-3 mt-1 text-sm text-slate-400">
                            <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {formatDateTime(session.date)}
                            </span>
                            <Badge className={getLevelColor(session.level)}>{session.level}</Badge>
                            <Badge variant={session.status === 'completed' ? 'success' : 'warning'}>
                                {session.status === 'completed' ? 'Completed' : 'In Progress'}
                            </Badge>
                        </div>
                    </div>
                </div>

                <div className={`text-3xl font-bold ${getScoreColor(session.totalScore)}`}>
                    {session.totalScore}%
                    <span className="text-sm font-normal text-slate-400 ml-2">
                        {getGradeLabel(session.totalScore)}
                    </span>
                </div>
            </motion.div>

            {/* Tabs */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <Tabs defaultValue="overview">
                    <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="transcript">Transcript</TabsTrigger>
                        <TabsTrigger value="corrections">Corrections</TabsTrigger>
                        <TabsTrigger value="improved">Improved</TabsTrigger>
                    </TabsList>

                    {/* Overview */}
                    <TabsContent value="overview" className="space-y-6">
                        {/* Scores */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Score Breakdown</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    {[
                                        { label: 'Correctness', value: session.scores.correctness },
                                        { label: 'Coverage', value: session.scores.coverage },
                                        { label: 'Clarity', value: session.scores.clarity },
                                        { label: 'English', value: session.scores.english },
                                    ].map(score => (
                                        <div key={score.label}>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm text-slate-400">{score.label}</span>
                                                <span className={`text-sm font-medium ${getScoreColor(score.value)}`}>
                                                    {score.value}%
                                                </span>
                                            </div>
                                            <Progress
                                                value={score.value}
                                                variant={score.value >= 70 ? 'success' : score.value >= 50 ? 'warning' : 'danger'}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* My explanation */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Your Explanation</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-300 leading-relaxed bg-white/5 rounded-xl p-4">
                                    {session.userExplanation}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Missing points */}
                        {session.missingPoints.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Missing Key Points</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2">
                                        {session.missingPoints.map((point, i) => (
                                            <li key={i} className="flex items-start gap-2 text-slate-300">
                                                <AlertCircle className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
                                                {point}
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    {/* Transcript */}
                    <TabsContent value="transcript">
                        <Card>
                            <CardHeader>
                                <CardTitle>Q&A Transcript</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {session.qaTranscript.length === 0 ? (
                                    <p className="text-slate-400 text-center py-8">No transcript available.</p>
                                ) : (
                                    session.qaTranscript.map((qa, i) => (
                                        <div key={i} className="space-y-3 pb-4 border-b border-white/10 last:border-0">
                                            {/* Question */}
                                            <div className="flex gap-3">
                                                <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center flex-shrink-0">
                                                    <MessageSquare className="h-4 w-4 text-violet-400" />
                                                </div>
                                                <div className="rounded-2xl rounded-tl-none bg-white/5 p-3 flex-1">
                                                    <p className="text-sm text-slate-300">{qa.question}</p>
                                                </div>
                                            </div>

                                            {/* Answer */}
                                            <div className="flex gap-3 justify-end">
                                                <div className="rounded-2xl rounded-tr-none bg-cyan-500/10 p-3 max-w-[80%]">
                                                    <p className="text-sm text-slate-300">
                                                        {qa.skipped ? (
                                                            <span className="text-slate-500 italic">Skipped</span>
                                                        ) : (
                                                            qa.answer
                                                        )}
                                                    </p>
                                                </div>
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center flex-shrink-0 text-xs font-medium">
                                                    You
                                                </div>
                                            </div>

                                            {/* Coach note */}
                                            {qa.coachNote && (
                                                <div className="ml-11 rounded-lg bg-cyan-500/10 border border-cyan-500/30 p-2">
                                                    <p className="text-xs text-cyan-400">{qa.coachNote}</p>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Corrections */}
                    <TabsContent value="corrections">
                        <Card>
                            <CardHeader>
                                <CardTitle>Corrections</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {session.corrections.length === 0 ? (
                                    <div className="text-center py-8">
                                        <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-3" />
                                        <p className="text-green-400 font-medium">No corrections needed!</p>
                                        <p className="text-sm text-slate-400">Great job on your explanation.</p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-white/10">
                                                    <th className="text-left py-3 px-4 text-slate-400 font-medium">You wrote</th>
                                                    <th className="text-left py-3 px-4 text-slate-400 font-medium">Better</th>
                                                    <th className="text-left py-3 px-4 text-slate-400 font-medium">Why</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {session.corrections.map((correction, i) => (
                                                    <tr key={i} className="border-b border-white/5">
                                                        <td className="py-4 px-4 text-red-400">{correction.bad}</td>
                                                        <td className="py-4 px-4 text-green-400">{correction.good}</td>
                                                        <td className="py-4 px-4 text-slate-400">{correction.why}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Improved */}
                    <TabsContent value="improved">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Improved Explanation</CardTitle>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        navigator.clipboard.writeText(session.improvedExplanation);
                                        toast.success('Copied!');
                                    }}
                                >
                                    <Copy className="h-4 w-4 mr-2" />
                                    Copy
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-300 leading-relaxed bg-white/5 rounded-xl p-4">
                                    {session.improvedExplanation}
                                </p>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </motion.div>

            {/* Actions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap gap-3"
            >
                <Button variant="outline" onClick={handleCopySummary}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Summary
                </Button>
                <Button variant="outline" onClick={handleDownloadPdf}>
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                </Button>
                <div className="flex-1" />
                <Button onClick={() => router.push(`/app/learn?topic=${session.nextLessonSuggestion.id}`)}>
                    Start Next Lesson
                    <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
            </motion.div>
        </div>
    );
}
