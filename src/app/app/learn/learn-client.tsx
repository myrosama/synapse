'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Clock,
    RefreshCw,
    Send,
    Lightbulb,
    ChevronDown,
    ArrowRight,
    ArrowLeft,
    Check,
    Copy,
    Save,
    RotateCcw
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Stepper } from '@/components/ui/stepper';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem
} from '@/components/ui/select';
import { Skeleton, SkeletonLesson } from '@/components/ui/skeleton';
import { useLearnState, useToast } from '@/lib/store';
import {
    fetchTopics,
    generateLesson,
    regenerateLesson,
    submitExplanation,
    getNextQuestion,
    submitAnswer,
    getHint,
    generateFeedback,
    saveSession,
    getStudentInitialQuestion,
    getStudentFollowUp,
    evaluateVoiceSession,
} from '@/lib/api';
import { VoiceChat, ChatMessage } from '@/components/voice/voice-chat';
import { Topic, Lesson, LanguageLevel, TopicCategory, QAItem, Scores, Correction } from '@/lib/types';
import { cn, getScoreColor, getLevelColor } from '@/lib/utils';

const STEPS = ['Setup', 'Lesson', 'Teach', 'Questions', 'Feedback'];

export default function LearnClient() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const toast = useToast();
    const { learnState, updateLearnState, resetLearnState } = useLearnState();

    const [topics, setTopics] = useState<Topic[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Load topics
    useEffect(() => {
        const loadTopics = async () => {
            const data = await fetchTopics();
            setTopics(data);

            // Check if topic was passed via URL
            const topicId = searchParams.get('topic');
            if (topicId && !learnState.topic) {
                const topic = data.find(t => t.id === topicId);
                if (topic) {
                    updateLearnState({ topicId, topic });
                }
            }
        };
        loadTopics();
    }, [searchParams]);

    const filteredTopics = topics.filter(t =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.tags.some(tag => tag.includes(searchQuery.toLowerCase()))
    );

    // Step navigation
    const goToStep = (step: number) => {
        updateLearnState({ step });
    };

    const nextStep = () => {
        updateLearnState({ step: learnState.step + 1 });
    };

    const prevStep = () => {
        updateLearnState({ step: learnState.step - 1 });
    };

    // Step 1: Setup handlers
    const handleTopicSelect = (topicId: string) => {
        const topic = topics.find(t => t.id === topicId);
        updateLearnState({ topicId, topic });
    };

    const handleGenerateLesson = async () => {
        if (!learnState.topicId) return;
        setLoading(true);
        try {
            const lesson = await generateLesson(learnState.topicId);
            updateLearnState({ lesson });
            nextStep();
        } catch (error) {
            toast.error('Failed to generate lesson. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Lesson handlers
    const handleRegenerateLesson = async () => {
        if (!learnState.topicId) return;
        setLoading(true);
        try {
            const lesson = await regenerateLesson(learnState.topicId);
            updateLearnState({ lesson });
            toast.success('Lesson regenerated with new examples.');
        } catch (error) {
            toast.error('Failed to regenerate lesson.');
        } finally {
            setLoading(false);
        }
    };

    // Step 3: Voice Teaching handlers
    const [voiceMessages, setVoiceMessages] = useState<ChatMessage[]>([]);
    const [studentQuestion, setStudentQuestion] = useState('');
    const [isAIProcessing, setIsAIProcessing] = useState(false);
    const [teachingComplete, setTeachingComplete] = useState(false);

    // Load initial student question when entering Step 3
    useEffect(() => {
        if (learnState.step === 3 && !studentQuestion && learnState.topicId) {
            loadInitialQuestion();
        }
    }, [learnState.step, learnState.topicId]);

    const loadInitialQuestion = async () => {
        setIsAIProcessing(true);
        try {
            const question = await getStudentInitialQuestion(learnState.topicId || '');
            setStudentQuestion(question);
        } finally {
            setIsAIProcessing(false);
        }
    };

    const handleVoiceResponse = async (response: string) => {
        if (!response.trim()) return;

        setIsAIProcessing(true);

        // Build transcript from messages
        const transcript = voiceMessages.map(m => ({
            role: m.role === 'student' ? 'student' as const : 'user' as const,
            content: m.content
        }));

        try {
            const result = await getStudentFollowUp(transcript, response);

            // Add the AI's follow-up question
            const newStudentMessage: ChatMessage = {
                id: `student-${Date.now()}`,
                role: 'student',
                content: result.question,
                timestamp: new Date(),
            };

            setVoiceMessages(prev => [...prev, newStudentMessage]);

            // Store the user's explanation
            const currentExplanation = (learnState.userExplanation || '') + '\n' + response;
            updateLearnState({ userExplanation: currentExplanation.trim() });

            if (result.understood) {
                setTeachingComplete(true);
                // Wait a moment then proceed to feedback
                setTimeout(() => {
                    goToStep(5); // Skip questions step, go directly to feedback
                }, 2000);
            }
        } catch (error) {
            toast.error('Failed to get AI response. Please try again.');
        } finally {
            setIsAIProcessing(false);
        }
    };

    const handleRequestHint = async () => {
        const hint = await getHint(0);
        toast.info(hint);
    };

    const handleRetryTeaching = () => {
        setVoiceMessages([]);
        setStudentQuestion('');
        setTeachingComplete(false);
        loadInitialQuestion();
    };

    // Step 4: Q&A handlers
    const [currentQuestion, setCurrentQuestion] = useState('');
    const [currentAnswer, setCurrentAnswer] = useState('');
    const [coachNote, setCoachNote] = useState<string | undefined>();
    const [questionLoading, setQuestionLoading] = useState(false);

    useEffect(() => {
        if (learnState.step === 4 && learnState.currentQuestionIndex < 5) {
            loadNextQuestion();
        }
    }, [learnState.step, learnState.currentQuestionIndex]);

    const loadNextQuestion = async () => {
        setQuestionLoading(true);
        setCoachNote(undefined);
        try {
            const question = await getNextQuestion(learnState.currentQuestionIndex);
            setCurrentQuestion(question);
            setCurrentAnswer('');
        } finally {
            setQuestionLoading(false);
        }
    };

    const handleSubmitAnswer = async () => {
        if (!currentAnswer.trim()) return;
        setLoading(true);
        try {
            const result = await submitAnswer(learnState.currentQuestionIndex, currentAnswer);
            setCoachNote(result.coachNote);

            const newQA: QAItem = {
                question: currentQuestion,
                answer: currentAnswer,
                coachNote: result.coachNote,
            };

            const newTranscript = [...learnState.qaTranscript, newQA];
            updateLearnState({
                qaTranscript: newTranscript,
                currentQuestionIndex: learnState.currentQuestionIndex + 1,
            });

            if (learnState.currentQuestionIndex + 1 >= 5) {
                // Move to feedback step
                setTimeout(() => nextStep(), 1000);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGetHint = async () => {
        setLoading(true);
        try {
            const hint = await getHint(learnState.currentQuestionIndex);
            toast.info(hint);
        } finally {
            setLoading(false);
        }
    };

    const handleSkipQuestion = () => {
        const newQA: QAItem = {
            question: currentQuestion,
            answer: '',
            skipped: true,
        };

        const newTranscript = [...learnState.qaTranscript, newQA];
        updateLearnState({
            qaTranscript: newTranscript,
            currentQuestionIndex: learnState.currentQuestionIndex + 1,
        });

        if (learnState.currentQuestionIndex + 1 >= 5) {
            setTimeout(() => nextStep(), 500);
        }
    };

    // Step 5: Feedback handlers
    const [feedback, setFeedback] = useState<{
        scores: Scores;
        totalScore: number;
        grade: string;
        topFixes: string[];
        corrections: Correction[];
        missingPoints: string[];
        improvedExplanation: string;
        nextSuggestion: Topic;
    } | null>(null);

    useEffect(() => {
        if (learnState.step === 5 && !feedback) {
            loadFeedback();
        }
    }, [learnState.step]);

    const loadFeedback = async () => {
        setLoading(true);
        try {
            const result = await generateFeedback(
                learnState.userExplanation || '',
                learnState.qaTranscript
            );
            setFeedback(result);
            updateLearnState({ feedback: result, scores: result.scores });
        } finally {
            setLoading(false);
        }
    };

    const handleSaveSession = async () => {
        setLoading(true);
        try {
            await saveSession({
                topicId: learnState.topicId,
                topic: learnState.topic,
                lesson: learnState.lesson,
                userExplanation: learnState.userExplanation,
                qaTranscript: learnState.qaTranscript,
                scores: feedback?.scores,
                totalScore: feedback?.totalScore,
                corrections: feedback?.corrections,
                missingPoints: feedback?.missingPoints,
                improvedExplanation: feedback?.improvedExplanation,
            });
            toast.success('Session saved successfully.');
        } catch (error) {
            toast.error('Failed to save session.');
        } finally {
            setLoading(false);
        }
    };

    const handleRetry = () => {
        updateLearnState({
            step: 3,
            userExplanation: '',
            qaTranscript: [],
            currentQuestionIndex: 0
        });
        setFeedback(null);
    };

    const handleNewTopic = () => {
        resetLearnState();
        setFeedback(null);
    };

    const handleCopyImprovedExplanation = () => {
        if (feedback?.improvedExplanation) {
            navigator.clipboard.writeText(feedback.improvedExplanation);
            toast.success('Copied to clipboard.');
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Stepper */}
            <Stepper steps={STEPS} currentStep={learnState.step} className="mb-8" />

            <AnimatePresence mode="wait">
                {/* Step 1: Setup */}
                {learnState.step === 1 && (
                    <motion.div
                        key="setup"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle>Choose Your Topic</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Search */}
                                <Input
                                    placeholder="Search topics..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    icon={<Search className="h-4 w-4" />}
                                />

                                {/* Topic list */}
                                <div className="grid gap-3 max-h-64 overflow-y-auto">
                                    {filteredTopics.map(topic => (
                                        <button
                                            key={topic.id}
                                            onClick={() => handleTopicSelect(topic.id)}
                                            className={cn(
                                                'flex items-center justify-between p-4 rounded-xl border transition-all text-left',
                                                learnState.topicId === topic.id
                                                    ? 'border-cyan-500 bg-cyan-500/10'
                                                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                                            )}
                                        >
                                            <div>
                                                <p className="font-medium text-white">{topic.title}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Badge className={getLevelColor(topic.level)}>{topic.level}</Badge>
                                                    <Badge variant="muted">{topic.category}</Badge>
                                                    <span className="text-xs text-slate-400 flex items-center gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        {topic.estimatedMinutes} min
                                                    </span>
                                                </div>
                                            </div>
                                            {learnState.topicId === topic.id && (
                                                <Check className="h-5 w-5 text-cyan-400" />
                                            )}
                                        </button>
                                    ))}
                                </div>

                                {/* Session settings */}
                                <div className="space-y-4 pt-4 border-t border-white/10">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-white">Session length</p>
                                            <p className="text-xs text-slate-400">Estimated duration</p>
                                        </div>
                                        <Select
                                            value={String(learnState.sessionLength)}
                                            onValueChange={(v) => updateLearnState({ sessionLength: Number(v) })}
                                        >
                                            <SelectTrigger className="w-32">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="5">5 minutes</SelectItem>
                                                <SelectItem value="10">10 minutes</SelectItem>
                                                <SelectItem value="15">15 minutes</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-white">Show hints</p>
                                            <p className="text-xs text-slate-400">Brief native-language hints</p>
                                        </div>
                                        <Switch
                                            checked={learnState.showHints}
                                            onCheckedChange={(checked) => updateLearnState({ showHints: checked })}
                                        />
                                    </div>
                                </div>

                                <Button
                                    onClick={handleGenerateLesson}
                                    disabled={!learnState.topicId || loading}
                                    loading={loading}
                                    className="w-full"
                                >
                                    Generate Lesson
                                    <ArrowRight className="h-4 w-4 ml-2" />
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {/* Step 2: Lesson */}
                {learnState.step === 2 && (
                    <motion.div
                        key="lesson"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                    >
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>{learnState.lesson?.title || 'Lesson'}</CardTitle>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleRegenerateLesson}
                                    disabled={loading}
                                >
                                    <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
                                    Regenerate
                                </Button>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {loading ? (
                                    <SkeletonLesson />
                                ) : learnState.lesson ? (
                                    <>
                                        {learnState.lesson.sections.map((section, i) => (
                                            <div key={i} className="space-y-3">
                                                <h3 className="text-lg font-semibold text-cyan-400">
                                                    {section.heading}
                                                </h3>
                                                <p className="text-slate-300 leading-relaxed">
                                                    {section.content}
                                                </p>
                                                {section.examples.length > 0 && (
                                                    <div className="bg-white/5 rounded-xl p-4 space-y-2">
                                                        {section.examples.map((example, j) => (
                                                            <p key={j} className="text-sm text-slate-400 flex items-start gap-2">
                                                                <span className="text-cyan-400">•</span>
                                                                {example}
                                                            </p>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}

                                        {/* Common mistake */}
                                        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
                                            <p className="text-sm text-amber-400 font-medium mb-1">⚠️ Common Mistake</p>
                                            <p className="text-sm text-slate-300">{learnState.lesson.commonMistake}</p>
                                        </div>

                                        {/* Mini exercise */}
                                        <MiniExercise exercises={learnState.lesson.miniExercises} />
                                    </>
                                ) : null}

                                <div className="flex gap-3 pt-4">
                                    <Button variant="outline" onClick={prevStep}>
                                        <ArrowLeft className="h-4 w-4 mr-2" />
                                        Back
                                    </Button>
                                    <Button onClick={nextStep} className="flex-1">
                                        Switch Roles
                                        <RefreshCw className="h-4 w-4 ml-2" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {/* Step 3: Voice Teaching */}
                {learnState.step === 3 && (
                    <motion.div
                        key="teach"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                    >
                        <Card className="overflow-hidden">
                            <CardHeader className="border-b border-white/10">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="flex items-center gap-2">
                                            🎤 Your Turn to Teach
                                        </CardTitle>
                                        <p className="text-sm text-slate-400 mt-1">
                                            Explain by speaking. The AI student will ask questions until they understand.
                                        </p>
                                    </div>
                                    {teachingComplete && (
                                        <Badge variant="success">Complete!</Badge>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                {isAIProcessing && !studentQuestion ? (
                                    <div className="flex items-center justify-center py-20">
                                        <div className="text-center">
                                            <div className="animate-spin h-8 w-8 border-2 border-cyan-400 border-t-transparent rounded-full mx-auto mb-4" />
                                            <p className="text-slate-400">AI student is preparing a question...</p>
                                        </div>
                                    </div>
                                ) : (
                                    <VoiceChat
                                        studentQuestion={studentQuestion}
                                        onUserResponse={handleVoiceResponse}
                                        onRequestHint={handleRequestHint}
                                        isProcessing={isAIProcessing}
                                        className="h-[500px]"
                                    />
                                )}
                            </CardContent>

                            {/* Footer actions */}
                            <div className="border-t border-white/10 p-4 flex items-center justify-between">
                                <Button variant="outline" onClick={prevStep}>
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Back to Lesson
                                </Button>

                                <div className="flex gap-2">
                                    <Button variant="ghost" size="sm" onClick={handleRetryTeaching}>
                                        <RotateCcw className="h-4 w-4 mr-2" />
                                        Start Over
                                    </Button>
                                    {teachingComplete && (
                                        <Button onClick={() => goToStep(5)}>
                                            See Feedback
                                            <ArrowRight className="h-4 w-4 ml-2" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </Card>

                        {/* Key points reference */}
                        <Card className="mt-4">
                            <details className="group">
                                <summary className="flex items-center gap-2 cursor-pointer p-4 text-sm text-cyan-400 hover:text-cyan-300">
                                    <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                                    Show key points for reference
                                </summary>
                                <CardContent className="pt-0 pb-4">
                                    <div className="space-y-2 text-sm text-slate-400">
                                        {learnState.lesson?.sections.map((section, i) => (
                                            <p key={i}>• {section.heading}</p>
                                        ))}
                                    </div>
                                </CardContent>
                            </details>
                        </Card>
                    </motion.div>
                )}

                {/* Step 4: Questions */}
                {learnState.step === 4 && (
                    <motion.div
                        key="questions"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                    >
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>AI Student Questions</CardTitle>
                                    <Badge variant="secondary">
                                        Question {Math.min(learnState.currentQuestionIndex + 1, 5)} of 5
                                    </Badge>
                                </div>
                                <Progress
                                    value={(learnState.currentQuestionIndex / 5) * 100}
                                    className="mt-2"
                                />
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {questionLoading ? (
                                    <div className="space-y-3">
                                        <Skeleton className="h-20 w-full" />
                                    </div>
                                ) : learnState.currentQuestionIndex < 5 ? (
                                    <>
                                        {/* AI Question */}
                                        <div className="flex gap-3">
                                            <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center flex-shrink-0">
                                                <span className="text-xs font-medium text-violet-400">AI</span>
                                            </div>
                                            <div className="rounded-2xl rounded-tl-none bg-white/5 p-4 flex-1">
                                                <p className="text-slate-300">{currentQuestion}</p>
                                            </div>
                                        </div>

                                        {/* Coach note */}
                                        {coachNote && (
                                            <div className="ml-11 rounded-xl bg-cyan-500/10 border border-cyan-500/30 p-3">
                                                <p className="text-xs text-cyan-400 font-medium">Coach note</p>
                                                <p className="text-sm text-slate-300">{coachNote}</p>
                                            </div>
                                        )}

                                        {/* Answer input */}
                                        <div className="flex gap-3">
                                            <div className="flex-1">
                                                <textarea
                                                    value={currentAnswer}
                                                    onChange={(e) => setCurrentAnswer(e.target.value)}
                                                    placeholder="Type your answer..."
                                                    className="w-full h-24 rounded-xl border border-white/10 bg-[#101B2D] p-4 text-white placeholder:text-slate-500 resize-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex gap-3">
                                            <Button variant="ghost" size="sm" onClick={handleGetHint} disabled={loading}>
                                                <Lightbulb className="h-4 w-4 mr-1" />
                                                Need a hint?
                                            </Button>
                                            <Button variant="ghost" size="sm" onClick={handleSkipQuestion}>
                                                Skip
                                            </Button>
                                            <div className="flex-1" />
                                            <Button
                                                onClick={handleSubmitAnswer}
                                                disabled={!currentAnswer.trim() || loading}
                                                loading={loading}
                                            >
                                                Answer
                                                <Send className="h-4 w-4 ml-2" />
                                            </Button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="text-lg text-white mb-2">All questions answered!</p>
                                        <p className="text-slate-400">Generating your feedback...</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {/* Step 5: Feedback */}
                {learnState.step === 5 && (
                    <motion.div
                        key="feedback"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        {loading || !feedback ? (
                            <Card>
                                <CardContent className="py-12 text-center">
                                    <div className="animate-spin h-8 w-8 border-2 border-cyan-400 border-t-transparent rounded-full mx-auto mb-4" />
                                    <p className="text-white">Analyzing your explanation...</p>
                                    <p className="text-sm text-slate-400">This may take a moment</p>
                                </CardContent>
                            </Card>
                        ) : (
                            <>
                                {/* Score card */}
                                <Card className="border-none bg-gradient-to-br from-[#101B2D] to-[#162035]">
                                    <CardContent className="py-8">
                                        <div className="text-center mb-6">
                                            <p className={`text-6xl font-bold ${getScoreColor(feedback.totalScore)}`}>
                                                {feedback.totalScore}%
                                            </p>
                                            <p className="text-lg text-white mt-2">{feedback.grade}</p>
                                        </div>

                                        {/* Score breakdown */}
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {[
                                                { label: 'Correctness', value: feedback.scores.correctness },
                                                { label: 'Coverage', value: feedback.scores.coverage },
                                                { label: 'Clarity', value: feedback.scores.clarity },
                                                { label: 'English', value: feedback.scores.english },
                                            ].map(score => (
                                                <div key={score.label} className="text-center">
                                                    <p className="text-sm text-slate-400 mb-1">{score.label}</p>
                                                    <Progress
                                                        value={score.value}
                                                        variant={score.value >= 70 ? 'success' : score.value >= 50 ? 'warning' : 'danger'}
                                                        className="h-2 mb-1"
                                                    />
                                                    <p className={cn('text-sm font-medium', getScoreColor(score.value))}>
                                                        {score.value}%
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Top fixes */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Top Fixes</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-2">
                                            {feedback.topFixes.map((fix, i) => (
                                                <li key={i} className="flex items-start gap-2 text-slate-300">
                                                    <span className="text-amber-400">•</span>
                                                    {fix}
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>

                                {/* Corrections */}
                                {feedback.corrections.length > 0 && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Corrections</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-sm">
                                                    <thead>
                                                        <tr className="border-b border-white/10">
                                                            <th className="text-left py-2 px-3 text-slate-400 font-medium">You wrote</th>
                                                            <th className="text-left py-2 px-3 text-slate-400 font-medium">Better</th>
                                                            <th className="text-left py-2 px-3 text-slate-400 font-medium">Why</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {feedback.corrections.map((correction, i) => (
                                                            <tr key={i} className="border-b border-white/5">
                                                                <td className="py-3 px-3 text-red-400">{correction.bad}</td>
                                                                <td className="py-3 px-3 text-green-400">{correction.good}</td>
                                                                <td className="py-3 px-3 text-slate-400">{correction.why}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}

                                {/* Missing points */}
                                {feedback.missingPoints.length > 0 && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Missing Key Points</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <ul className="space-y-2">
                                                {feedback.missingPoints.map((point, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-slate-300">
                                                        <span className="text-slate-500">☐</span>
                                                        {point}
                                                    </li>
                                                ))}
                                            </ul>
                                        </CardContent>
                                    </Card>
                                )}

                                {/* Improved explanation */}
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between">
                                        <CardTitle>Improved Explanation</CardTitle>
                                        <Button variant="ghost" size="sm" onClick={handleCopyImprovedExplanation}>
                                            <Copy className="h-4 w-4 mr-2" />
                                            Copy
                                        </Button>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-slate-300 leading-relaxed bg-white/5 rounded-xl p-4">
                                            {feedback.improvedExplanation}
                                        </p>
                                    </CardContent>
                                </Card>

                                {/* Next suggestion */}
                                <Card className="border-cyan-500/30 bg-gradient-to-r from-cyan-500/10 to-transparent">
                                    <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4">
                                        <div>
                                            <p className="text-sm text-cyan-400 font-medium">Next suggested topic</p>
                                            <p className="text-white font-semibold">{feedback.nextSuggestion.title}</p>
                                        </div>
                                        <Button onClick={() => router.push(`/app/learn?topic=${feedback.nextSuggestion.id}`)}>
                                            Start Next
                                            <ArrowRight className="h-4 w-4 ml-2" />
                                        </Button>
                                    </CardContent>
                                </Card>

                                {/* Actions */}
                                <div className="flex flex-wrap gap-3">
                                    <Button onClick={handleSaveSession} disabled={loading} variant="outline">
                                        <Save className="h-4 w-4 mr-2" />
                                        Save Session
                                    </Button>
                                    <Button onClick={handleRetry} variant="outline">
                                        <RotateCcw className="h-4 w-4 mr-2" />
                                        Retry Teach-back
                                    </Button>
                                    <Button onClick={handleNewTopic} variant="ghost">
                                        New Topic
                                    </Button>
                                </div>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// Mini Exercise Component
function MiniExercise({ exercises }: { exercises: Lesson['miniExercises'] }) {
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
    const [checkedAnswers, setCheckedAnswers] = useState<Record<number, boolean>>({});
    const [showExplanations, setShowExplanations] = useState<Record<number, boolean>>({});

    const handleCheck = (index: number, correctAnswer: string) => {
        setCheckedAnswers({ ...checkedAnswers, [index]: selectedAnswers[index] === correctAnswer });
        setShowExplanations({ ...showExplanations, [index]: true });
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Quick Check</h3>
            {exercises.map((exercise, i) => (
                <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
                    <p className="text-white">{exercise.question}</p>

                    {exercise.type === 'multiple-choice' && exercise.options && (
                        <div className="grid gap-2">
                            {exercise.options.map((option, j) => (
                                <button
                                    key={j}
                                    onClick={() => setSelectedAnswers({ ...selectedAnswers, [i]: option })}
                                    disabled={showExplanations[i]}
                                    className={cn(
                                        'text-left px-4 py-2 rounded-lg border transition-colors',
                                        selectedAnswers[i] === option
                                            ? showExplanations[i]
                                                ? option === exercise.correctAnswer
                                                    ? 'border-green-500 bg-green-500/20 text-green-400'
                                                    : 'border-red-500 bg-red-500/20 text-red-400'
                                                : 'border-cyan-500 bg-cyan-500/20 text-cyan-400'
                                            : 'border-white/10 hover:bg-white/10 text-slate-300',
                                        showExplanations[i] && option === exercise.correctAnswer && 'border-green-500 bg-green-500/20 text-green-400'
                                    )}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    )}

                    {!showExplanations[i] && (
                        <Button
                            size="sm"
                            onClick={() => handleCheck(i, exercise.correctAnswer)}
                            disabled={!selectedAnswers[i]}
                        >
                            Check
                        </Button>
                    )}

                    {showExplanations[i] && (
                        <div className={cn(
                            'rounded-lg p-3 text-sm',
                            checkedAnswers[i] ? 'bg-green-500/10 text-green-400' : 'bg-amber-500/10 text-amber-400'
                        )}>
                            {checkedAnswers[i] ? '✓ Correct! ' : '✗ Not quite. '}
                            {exercise.explanation}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
