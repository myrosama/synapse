'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen,
    Clock,
    Target,
    Trophy,
    CheckCircle,
    XCircle,
    ArrowRight,
    Play,
    RotateCcw,
    Filter,
    Zap,
    AlertCircle,
    ChevronRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
    questionBank,
    getQuestionsByCategory,
    getRandomQuestions,
    calculateScore,
    TestQuestion,
    TestResult,
    QuestionCategory,
    QuestionDifficulty,
} from '@/lib/question-data';

type QuizState = 'select' | 'quiz' | 'results';

export default function TestlarPage() {
    const [quizState, setQuizState] = useState<QuizState>('select');
    const [selectedCategory, setSelectedCategory] = useState<QuestionCategory | 'all'>('all');
    const [questions, setQuestions] = useState<TestQuestion[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [results, setResults] = useState<TestResult[]>([]);
    const [timeLeft, setTimeLeft] = useState(0);
    const [questionStartTime, setQuestionStartTime] = useState(0);

    // Failed questions vault
    const [failedQuestions, setFailedQuestions] = useState<string[]>([]);

    // Load failed questions from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('recito_failed_questions');
        if (saved) setFailedQuestions(JSON.parse(saved));
    }, []);

    // Save failed questions
    useEffect(() => {
        localStorage.setItem('recito_failed_questions', JSON.stringify(failedQuestions));
    }, [failedQuestions]);

    // Timer
    useEffect(() => {
        if (quizState !== 'quiz' || showExplanation) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    handleSubmitAnswer(null);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [quizState, showExplanation, currentIndex]);

    const startQuiz = (count: number = 10) => {
        const category = selectedCategory === 'all' ? undefined : selectedCategory;
        const quizQuestions = getRandomQuestions(count, category);
        setQuestions(quizQuestions);
        setCurrentIndex(0);
        setResults([]);
        setSelectedAnswer(null);
        setShowExplanation(false);
        setTimeLeft(quizQuestions[0]?.timeLimit || 60);
        setQuestionStartTime(Date.now());
        setQuizState('quiz');
    };

    const startVaultQuiz = () => {
        const vaultQuestions = questionBank.filter(q => failedQuestions.includes(q.id));
        if (vaultQuestions.length === 0) return;
        setQuestions(vaultQuestions);
        setCurrentIndex(0);
        setResults([]);
        setSelectedAnswer(null);
        setShowExplanation(false);
        setTimeLeft(vaultQuestions[0]?.timeLimit || 60);
        setQuestionStartTime(Date.now());
        setQuizState('quiz');
    };

    const handleSubmitAnswer = useCallback((answer: string | null) => {
        const currentQuestion = questions[currentIndex];
        const isCorrect = answer === currentQuestion.correctAnswer;
        const timeTaken = (Date.now() - questionStartTime) / 1000;

        // Add to results
        const result: TestResult = {
            questionId: currentQuestion.id,
            userAnswer: answer || 'No answer',
            isCorrect,
            timeTaken,
        };
        setResults([...results, result]);

        // Track failed questions
        if (!isCorrect && !failedQuestions.includes(currentQuestion.id)) {
            setFailedQuestions([...failedQuestions, currentQuestion.id]);
        } else if (isCorrect && failedQuestions.includes(currentQuestion.id)) {
            setFailedQuestions(failedQuestions.filter(id => id !== currentQuestion.id));
        }

        setSelectedAnswer(answer);
        setShowExplanation(true);
    }, [currentIndex, questions, results, questionStartTime, failedQuestions]);

    const goToNextQuestion = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setSelectedAnswer(null);
            setShowExplanation(false);
            setTimeLeft(questions[currentIndex + 1]?.timeLimit || 60);
            setQuestionStartTime(Date.now());
        } else {
            setQuizState('results');
        }
    };

    const resetQuiz = () => {
        setQuizState('select');
        setQuestions([]);
        setCurrentIndex(0);
        setResults([]);
        setSelectedAnswer(null);
        setShowExplanation(false);
    };

    const currentQuestion = questions[currentIndex];
    const { score, correct, total } = calculateScore(results);

    // Category stats
    const getCategoryStats = (category: QuestionCategory) => {
        const catQuestions = getQuestionsByCategory(category);
        const failed = catQuestions.filter(q => failedQuestions.includes(q.id)).length;
        return { total: catQuestions.length, failed };
    };

    const categories: { id: QuestionCategory; name: string; icon: React.ReactNode; color: string }[] = [
        { id: 'SAT', name: 'SAT', icon: <Target className="h-5 w-5" />, color: 'from-blue-500 to-cyan-500' },
        { id: 'IELTS', name: 'IELTS', icon: <BookOpen className="h-5 w-5" />, color: 'from-purple-500 to-pink-500' },
        { id: 'Grammar', name: 'Grammar', icon: <Zap className="h-5 w-5" />, color: 'from-green-500 to-emerald-500' },
        { id: 'Vocabulary', name: 'Vocabulary', icon: <BookOpen className="h-5 w-5" />, color: 'from-orange-500 to-amber-500' },
        { id: 'Reading', name: 'Reading', icon: <BookOpen className="h-5 w-5" />, color: 'from-red-500 to-rose-500' },
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-2xl md:text-3xl font-bold text-white">Testlar Toplami</h1>
                <p className="text-slate-400 mt-1">Practice with challenging questions across categories</p>
            </motion.div>

            <AnimatePresence mode="wait">
                {/* Category Selection */}
                {quizState === 'select' && (
                    <motion.div
                        key="select"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                    >
                        {/* Failed Questions Vault */}
                        {failedQuestions.length > 0 && (
                            <Card className="border-orange-500/30 bg-orange-500/5">
                                <CardContent className="pt-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
                                                <AlertCircle className="h-6 w-6 text-orange-400" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-white">Questions Vault</p>
                                                <p className="text-sm text-slate-400">
                                                    {failedQuestions.length} question{failedQuestions.length !== 1 ? 's' : ''} to master
                                                </p>
                                            </div>
                                        </div>
                                        <Button onClick={startVaultQuiz} className="bg-orange-500 hover:bg-orange-600">
                                            <RotateCcw className="h-4 w-4 mr-2" />
                                            Practice
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Category Cards */}
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {categories.map((cat) => {
                                const stats = getCategoryStats(cat.id);
                                return (
                                    <Card
                                        key={cat.id}
                                        className={`cursor-pointer transition-all hover:scale-[1.02] ${selectedCategory === cat.id ? 'ring-2 ring-cyan-500' : ''
                                            }`}
                                        onClick={() => setSelectedCategory(cat.id)}
                                    >
                                        <CardContent className="pt-4">
                                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-white mb-3`}>
                                                {cat.icon}
                                            </div>
                                            <h3 className="font-semibold text-white">{cat.name}</h3>
                                            <div className="flex items-center gap-2 mt-2 text-sm">
                                                <Badge variant="secondary">{stats.total} questions</Badge>
                                                {stats.failed > 0 && (
                                                    <Badge variant="warning">{stats.failed} to review</Badge>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}

                            {/* All Categories */}
                            <Card
                                className={`cursor-pointer transition-all hover:scale-[1.02] ${selectedCategory === 'all' ? 'ring-2 ring-cyan-500' : ''
                                    }`}
                                onClick={() => setSelectedCategory('all')}
                            >
                                <CardContent className="pt-4">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center text-white mb-3">
                                        <Trophy className="h-5 w-5" />
                                    </div>
                                    <h3 className="font-semibold text-white">All Categories</h3>
                                    <div className="flex items-center gap-2 mt-2 text-sm">
                                        <Badge variant="secondary">{questionBank.length} questions</Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Start Quiz Button */}
                        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                            <Button size="lg" onClick={() => startQuiz(5)}>
                                <Play className="h-4 w-4 mr-2" />
                                Quick Quiz (5 questions)
                            </Button>
                            <Button size="lg" variant="secondary" onClick={() => startQuiz(10)}>
                                <Target className="h-4 w-4 mr-2" />
                                Full Test (10 questions)
                            </Button>
                        </div>
                    </motion.div>
                )}

                {/* Quiz Mode */}
                {quizState === 'quiz' && currentQuestion && (
                    <motion.div
                        key="quiz"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                    >
                        {/* Progress & Timer */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Badge variant="secondary">
                                    Question {currentIndex + 1}/{questions.length}
                                </Badge>
                                <Badge className={getDifficultyColor(currentQuestion.difficulty)}>
                                    {currentQuestion.difficulty}
                                </Badge>
                                <Badge variant="muted">{currentQuestion.category}</Badge>
                            </div>
                            <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${timeLeft <= 10 ? 'bg-red-500/20 text-red-400' : 'bg-slate-800 text-slate-300'
                                }`}>
                                <Clock className="h-4 w-4" />
                                <span className="font-mono font-medium">{timeLeft}s</span>
                            </div>
                        </div>

                        {/* Progress bar */}
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                                className="h-full bg-gradient-to-r from-cyan-500 to-violet-500"
                            />
                        </div>

                        {/* Question Card */}
                        <Card>
                            <CardContent className="pt-6">
                                <p className="text-lg text-white mb-6">{currentQuestion.question}</p>

                                {/* Options */}
                                {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
                                    <div className="space-y-3">
                                        {currentQuestion.options.map((option, index) => {
                                            const isSelected = selectedAnswer === option;
                                            const isCorrect = option === currentQuestion.correctAnswer;
                                            const showResult = showExplanation;

                                            return (
                                                <motion.button
                                                    key={index}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                    onClick={() => !showExplanation && setSelectedAnswer(option)}
                                                    disabled={showExplanation}
                                                    className={`w-full p-4 rounded-xl text-left transition-all ${showResult
                                                            ? isCorrect
                                                                ? 'bg-green-500/20 border-2 border-green-500'
                                                                : isSelected
                                                                    ? 'bg-red-500/20 border-2 border-red-500'
                                                                    : 'bg-slate-800/50 border border-white/5'
                                                            : isSelected
                                                                ? 'bg-cyan-500/20 border-2 border-cyan-500'
                                                                : 'bg-slate-800/50 border border-white/10 hover:bg-slate-800'
                                                        }`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-white">{option}</span>
                                                        {showResult && isCorrect && (
                                                            <CheckCircle className="h-5 w-5 text-green-400" />
                                                        )}
                                                        {showResult && isSelected && !isCorrect && (
                                                            <XCircle className="h-5 w-5 text-red-400" />
                                                        )}
                                                    </div>
                                                </motion.button>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* Fill in the blank */}
                                {currentQuestion.type === 'fill-blank' && (
                                    <div className="space-y-4">
                                        <input
                                            type="text"
                                            value={selectedAnswer || ''}
                                            onChange={(e) => !showExplanation && setSelectedAnswer(e.target.value)}
                                            disabled={showExplanation}
                                            placeholder="Type your answer..."
                                            className="w-full p-4 rounded-xl bg-slate-800 border border-white/10 text-white focus:border-cyan-500 focus:outline-none"
                                        />
                                        {showExplanation && (
                                            <p className={`text-sm ${selectedAnswer?.toLowerCase() === currentQuestion.correctAnswer.toLowerCase() ? 'text-green-400' : 'text-red-400'}`}>
                                                Correct answer: <strong>{currentQuestion.correctAnswer}</strong>
                                            </p>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Explanation */}
                        {showExplanation && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <Card className="bg-slate-800/50 border-white/5">
                                    <CardContent className="pt-4">
                                        <p className="text-sm font-medium text-cyan-400 mb-2">Explanation</p>
                                        <p className="text-slate-300">{currentQuestion.explanation}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}

                        {/* Actions */}
                        <div className="flex justify-between">
                            <Button variant="outline" onClick={resetQuiz}>
                                Exit Quiz
                            </Button>
                            {!showExplanation ? (
                                <Button
                                    onClick={() => handleSubmitAnswer(selectedAnswer)}
                                    disabled={!selectedAnswer}
                                >
                                    Submit Answer
                                    <ChevronRight className="h-4 w-4 ml-1" />
                                </Button>
                            ) : (
                                <Button onClick={goToNextQuestion}>
                                    {currentIndex < questions.length - 1 ? 'Next Question' : 'See Results'}
                                    <ArrowRight className="h-4 w-4 ml-1" />
                                </Button>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* Results */}
                {quizState === 'results' && (
                    <motion.div
                        key="results"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-6"
                    >
                        <Card className="text-center py-8">
                            <CardContent>
                                <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-4 ${score >= 80 ? 'bg-green-500/20' :
                                        score >= 60 ? 'bg-yellow-500/20' :
                                            'bg-red-500/20'
                                    }`}>
                                    <span className={`text-4xl font-bold ${score >= 80 ? 'text-green-400' :
                                            score >= 60 ? 'text-yellow-400' :
                                                'text-red-400'
                                        }`}>
                                        {score}%
                                    </span>
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-2">
                                    {score >= 80 ? 'Excellent!' : score >= 60 ? 'Good Job!' : 'Keep Practicing!'}
                                </h2>
                                <p className="text-slate-400">
                                    You got {correct} out of {total} questions correct
                                </p>
                            </CardContent>
                        </Card>

                        {/* Question Review */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Question Review</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {questions.map((q, i) => {
                                    const result = results[i];
                                    return (
                                        <div
                                            key={q.id}
                                            className={`p-3 rounded-lg flex items-center gap-3 ${result?.isCorrect ? 'bg-green-500/10' : 'bg-red-500/10'
                                                }`}
                                        >
                                            {result?.isCorrect ? (
                                                <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                                            ) : (
                                                <XCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-white truncate">{q.question}</p>
                                                {!result?.isCorrect && (
                                                    <p className="text-xs text-slate-400">
                                                        Correct: {q.correctAnswer}
                                                    </p>
                                                )}
                                            </div>
                                            <Badge variant="muted" className="text-xs">{q.category}</Badge>
                                        </div>
                                    );
                                })}
                            </CardContent>
                        </Card>

                        {/* Actions */}
                        <div className="flex justify-center gap-3">
                            <Button variant="outline" onClick={resetQuiz}>
                                Back to Categories
                            </Button>
                            <Button onClick={() => startQuiz(questions.length)}>
                                <RotateCcw className="h-4 w-4 mr-2" />
                                Try Again
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function getDifficultyColor(difficulty: QuestionDifficulty): string {
    switch (difficulty) {
        case 'easy': return 'bg-green-500/20 text-green-400';
        case 'medium': return 'bg-yellow-500/20 text-yellow-400';
        case 'hard': return 'bg-red-500/20 text-red-400';
    }
}
