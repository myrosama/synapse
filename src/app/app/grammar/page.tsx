'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    PenTool,
    Check,
    X,
    RotateCcw,
    ChevronRight,
    Lightbulb,
    Award,
    Play,
    Target,
    BookOpen,
    Scissors,
    Scale,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/lib/store';
import {
    grammarExercises,
    getRandomExercises,
    getExercisesByType,
    GrammarError,
    ERROR_TYPES,
} from '@/lib/grammar-data';

type GameMode = 'select' | 'red-pen' | 'error-hunt' | 'comma-surgeon' | 'parallelism';

export default function GrammarPage() {
    const toast = useToast();
    const [mode, setMode] = useState<GameMode>('select');
    const [exercises, setExercises] = useState<GrammarError[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);

    const startGame = (gameMode: GameMode, errorType?: string) => {
        let exs: GrammarError[];
        if (errorType) {
            exs = getExercisesByType(errorType as GrammarError['errorType']);
        } else {
            exs = getRandomExercises(8);
        }
        setExercises(exs);
        setCurrentIndex(0);
        setScore(0);
        setMode(gameMode);
    };

    const endGame = () => {
        if (score > exercises.length / 2) {
            toast.success(`Great job! You scored ${score}/${exercises.length}`);
        }
        setMode('select');
        setExercises([]);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-2xl md:text-3xl font-bold text-white">Grammar Correction</h1>
                <p className="text-slate-400 mt-1">Master grammar rules with interactive correction exercises</p>
            </motion.div>

            <AnimatePresence mode="wait">
                {mode === 'select' && (
                    <GameSelection onStart={startGame} />
                )}

                {mode === 'red-pen' && exercises.length > 0 && (
                    <RedPenMode
                        exercises={exercises}
                        currentIndex={currentIndex}
                        score={score}
                        onNext={(correct) => {
                            if (correct) setScore(s => s + 1);
                            if (currentIndex < exercises.length - 1) {
                                setCurrentIndex(i => i + 1);
                            } else {
                                endGame();
                            }
                        }}
                        onExit={() => setMode('select')}
                    />
                )}

                {mode === 'error-hunt' && exercises.length > 0 && (
                    <ErrorHuntMode
                        exercises={exercises}
                        currentIndex={currentIndex}
                        score={score}
                        onNext={(correct) => {
                            if (correct) setScore(s => s + 1);
                            if (currentIndex < exercises.length - 1) {
                                setCurrentIndex(i => i + 1);
                            } else {
                                endGame();
                            }
                        }}
                        onExit={() => setMode('select')}
                    />
                )}

                {(mode === 'comma-surgeon' || mode === 'parallelism') && exercises.length > 0 && (
                    <SpecializedMode
                        exercises={exercises}
                        currentIndex={currentIndex}
                        score={score}
                        mode={mode}
                        onNext={(correct) => {
                            if (correct) setScore(s => s + 1);
                            if (currentIndex < exercises.length - 1) {
                                setCurrentIndex(i => i + 1);
                            } else {
                                endGame();
                            }
                        }}
                        onExit={() => setMode('select')}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

// Game Selection
function GameSelection({ onStart }: { onStart: (mode: GameMode, type?: string) => void }) {
    const games = [
        {
            id: 'red-pen',
            title: 'Red Pen Mode',
            description: 'Find and correct errors in sentences',
            icon: <PenTool className="h-6 w-6" />,
            color: 'from-red-500 to-rose-500',
        },
        {
            id: 'error-hunt',
            title: 'Error Hunt',
            description: 'Click on the word containing the error',
            icon: <Target className="h-6 w-6" />,
            color: 'from-orange-500 to-amber-500',
        },
        {
            id: 'comma-surgeon',
            title: 'Comma Surgeon',
            description: 'Fix comma splice errors specifically',
            icon: <Scissors className="h-6 w-6" />,
            color: 'from-purple-500 to-violet-500',
        },
        {
            id: 'parallelism',
            title: 'Parallelism Balancer',
            description: 'Master parallel structure in sentences',
            icon: <Scale className="h-6 w-6" />,
            color: 'from-blue-500 to-cyan-500',
        },
    ];

    return (
        <motion.div
            key="select"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
        >
            {/* Stats */}
            <Card className="bg-gradient-to-r from-red-900/20 to-orange-900/20 border-red-500/20">
                <CardContent className="py-6">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                            <PenTool className="h-7 w-7 text-white" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-white text-lg">Teacher's Toolkit</h3>
                            <p className="text-sm text-slate-400">
                                {grammarExercises.length} exercises across {ERROR_TYPES.length} grammar categories
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Game Cards */}
            <div className="grid gap-4 md:grid-cols-2">
                {games.map((game, index) => (
                    <motion.div
                        key={game.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card
                            className="cursor-pointer hover:scale-[1.02] transition-all"
                            onClick={() => {
                                if (game.id === 'comma-surgeon') {
                                    onStart('comma-surgeon', 'comma-splice');
                                } else if (game.id === 'parallelism') {
                                    onStart('parallelism', 'parallelism');
                                } else {
                                    onStart(game.id as GameMode);
                                }
                            }}
                        >
                            <CardContent className="pt-6 text-center">
                                <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${game.color} flex items-center justify-center text-white mb-4`}>
                                    {game.icon}
                                </div>
                                <h3 className="font-semibold text-white text-lg">{game.title}</h3>
                                <p className="text-sm text-slate-400 mt-1">{game.description}</p>
                                <Button className="mt-4 w-full">
                                    <Play className="h-4 w-4 mr-2" />
                                    Play
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Category Pills */}
            <div>
                <h3 className="text-sm font-medium text-slate-400 mb-3">Practice by Category</h3>
                <div className="flex flex-wrap gap-2">
                    {ERROR_TYPES.map((type) => (
                        <button
                            key={type.id}
                            onClick={() => onStart('red-pen', type.id)}
                            className={`px-4 py-2 rounded-full text-sm bg-gradient-to-r ${type.color} text-white hover:opacity-90 transition-opacity`}
                        >
                            {type.label}
                        </button>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

// Red Pen Mode - Type the correction
function RedPenMode({
    exercises,
    currentIndex,
    score,
    onNext,
    onExit,
}: {
    exercises: GrammarError[];
    currentIndex: number;
    score: number;
    onNext: (correct: boolean) => void;
    onExit: () => void;
}) {
    const [userInput, setUserInput] = useState('');
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    const current = exercises[currentIndex];
    const progress = ((currentIndex + 1) / exercises.length) * 100;

    const checkAnswer = () => {
        // Normalize strings for comparison
        const userNorm = userInput.trim().toLowerCase().replace(/\s+/g, ' ');
        const correctNorm = current.correctSentence.toLowerCase().replace(/\s+/g, ' ');

        const correct = userNorm === correctNorm;
        setIsCorrect(correct);
        setShowResult(true);
    };

    const handleNext = () => {
        onNext(isCorrect);
        setUserInput('');
        setShowResult(false);
    };

    return (
        <motion.div
            key="red-pen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
        >
            {/* Progress */}
            <div className="flex items-center justify-between">
                <Badge variant="secondary">
                    Question {currentIndex + 1}/{exercises.length}
                </Badge>
                <Badge className="bg-red-500/20 text-red-400">
                    Score: {score}
                </Badge>
            </div>

            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-gradient-to-r from-red-500 to-orange-500"
                />
            </div>

            {/* Exercise Card */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Badge>{current.difficulty}</Badge>
                        <Badge variant="secondary">{current.errorType}</Badge>
                    </div>

                    <h2 className="text-lg font-medium text-slate-300 mb-2">Find and correct the error:</h2>

                    <div className="p-4 rounded-xl bg-slate-800/50 border border-white/10 mb-4">
                        <p className="text-xl text-white font-mono">{current.originalSentence}</p>
                    </div>

                    <textarea
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Type the corrected sentence here..."
                        className="w-full p-4 rounded-xl bg-slate-800 border border-white/10 text-white placeholder-slate-500 resize-none h-24 focus:outline-none focus:ring-2 focus:ring-red-500"
                        disabled={showResult}
                    />

                    {showResult && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`mt-4 p-4 rounded-xl ${isCorrect ? 'bg-green-500/20 border-green-500' : 'bg-red-500/20 border-red-500'} border`}
                        >
                            <div className="flex items-center gap-2 mb-2">
                                {isCorrect ? (
                                    <Check className="h-5 w-5 text-green-400" />
                                ) : (
                                    <X className="h-5 w-5 text-red-400" />
                                )}
                                <span className={isCorrect ? 'text-green-400' : 'text-red-400'}>
                                    {isCorrect ? 'Correct!' : 'Not quite...'}
                                </span>
                            </div>

                            <p className="text-sm text-slate-300 mb-2">
                                <strong>Correct answer:</strong> {current.correctSentence}
                            </p>

                            <div className="flex items-start gap-2 mt-3">
                                <Lightbulb className="h-4 w-4 text-amber-400 mt-0.5" />
                                <p className="text-sm text-slate-400">{current.explanation}</p>
                            </div>

                            <div className="mt-3 p-2 rounded-lg bg-white/5">
                                <p className="text-xs text-cyan-400 font-medium">📘 Rule: {current.rule}</p>
                            </div>
                        </motion.div>
                    )}
                </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-3 justify-center">
                {!showResult ? (
                    <Button onClick={checkAnswer} disabled={!userInput.trim()}>
                        <Check className="h-4 w-4 mr-2" />
                        Check Answer
                    </Button>
                ) : (
                    <Button onClick={handleNext}>
                        {currentIndex < exercises.length - 1 ? (
                            <>
                                Next
                                <ChevronRight className="h-4 w-4 ml-2" />
                            </>
                        ) : (
                            <>
                                <Award className="h-4 w-4 mr-2" />
                                Finish
                            </>
                        )}
                    </Button>
                )}
            </div>

            <div className="text-center">
                <Button variant="outline" onClick={onExit}>
                    Exit Game
                </Button>
            </div>
        </motion.div>
    );
}

// Error Hunt - Click on the error
function ErrorHuntMode({
    exercises,
    currentIndex,
    score,
    onNext,
    onExit,
}: {
    exercises: GrammarError[];
    currentIndex: number;
    score: number;
    onNext: (correct: boolean) => void;
    onExit: () => void;
}) {
    const [selectedWord, setSelectedWord] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    const current = exercises[currentIndex];
    const words = current.originalSentence.split(/(\s+)/);
    const progress = ((currentIndex + 1) / exercises.length) * 100;

    // Find which word index contains the error
    const getErrorWordIndex = () => {
        let charIndex = 0;
        for (let i = 0; i < words.length; i++) {
            const wordEnd = charIndex + words[i].length;
            for (const [start, end] of current.errorIndices) {
                if (charIndex <= start && wordEnd >= end) {
                    return i;
                }
            }
            charIndex = wordEnd;
        }
        return -1;
    };

    const errorWordIndex = getErrorWordIndex();

    const handleWordClick = (index: number) => {
        if (showResult) return;
        setSelectedWord(index);
        setIsCorrect(index === errorWordIndex);
        setShowResult(true);
    };

    const handleNext = () => {
        onNext(isCorrect);
        setSelectedWord(null);
        setShowResult(false);
    };

    return (
        <motion.div
            key="error-hunt"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
        >
            <div className="flex items-center justify-between">
                <Badge variant="secondary">
                    Question {currentIndex + 1}/{exercises.length}
                </Badge>
                <Badge className="bg-orange-500/20 text-orange-400">
                    Score: {score}
                </Badge>
            </div>

            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-gradient-to-r from-orange-500 to-amber-500"
                />
            </div>

            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Badge>{current.difficulty}</Badge>
                        <Badge variant="secondary">{current.errorType}</Badge>
                    </div>

                    <h2 className="text-lg font-medium text-slate-300 mb-4">Click on the word containing the error:</h2>

                    <div className="p-6 rounded-xl bg-slate-800/50 border border-white/10">
                        <p className="text-xl leading-loose">
                            {words.map((word, i) => {
                                if (word.trim() === '') return <span key={i}>{word}</span>;

                                let bgColor = 'hover:bg-white/10';
                                if (showResult) {
                                    if (i === errorWordIndex) {
                                        bgColor = 'bg-green-500/30 text-green-300';
                                    } else if (i === selectedWord) {
                                        bgColor = 'bg-red-500/30 text-red-300';
                                    }
                                } else if (selectedWord === i) {
                                    bgColor = 'bg-cyan-500/30';
                                }

                                return (
                                    <span
                                        key={i}
                                        onClick={() => handleWordClick(i)}
                                        className={`cursor-pointer px-1 py-0.5 rounded transition-colors text-white ${bgColor}`}
                                    >
                                        {word}
                                    </span>
                                );
                            })}
                        </p>
                    </div>

                    {showResult && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`mt-4 p-4 rounded-xl ${isCorrect ? 'bg-green-500/20' : 'bg-red-500/20'} border ${isCorrect ? 'border-green-500' : 'border-red-500'}`}
                        >
                            <div className="flex items-center gap-2 mb-2">
                                {isCorrect ? <Check className="h-5 w-5 text-green-400" /> : <X className="h-5 w-5 text-red-400" />}
                                <span className={isCorrect ? 'text-green-400' : 'text-red-400'}>
                                    {isCorrect ? 'Correct!' : 'Wrong word!'}
                                </span>
                            </div>

                            <p className="text-sm text-slate-300">
                                <strong>Corrected:</strong> {current.correctSentence}
                            </p>

                            <div className="flex items-start gap-2 mt-3">
                                <Lightbulb className="h-4 w-4 text-amber-400 mt-0.5" />
                                <p className="text-sm text-slate-400">{current.explanation}</p>
                            </div>
                        </motion.div>
                    )}
                </CardContent>
            </Card>

            <div className="flex gap-3 justify-center">
                {showResult && (
                    <Button onClick={handleNext}>
                        {currentIndex < exercises.length - 1 ? 'Next' : 'Finish'}
                        <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                )}
            </div>

            <div className="text-center">
                <Button variant="outline" onClick={onExit}>
                    Exit Game
                </Button>
            </div>
        </motion.div>
    );
}

// Specialized Mode (Comma Surgeon / Parallelism)
function SpecializedMode({
    exercises,
    currentIndex,
    score,
    mode,
    onNext,
    onExit,
}: {
    exercises: GrammarError[];
    currentIndex: number;
    score: number;
    mode: string;
    onNext: (correct: boolean) => void;
    onExit: () => void;
}) {
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);

    const current = exercises[currentIndex];
    const progress = ((currentIndex + 1) / exercises.length) * 100;

    // Generate options with one correct and 2-3 wrong
    const options = useMemo(() => {
        const opts = [current.correctSentence];
        // Add wrong options (using the original as one wrong option)
        opts.push(current.originalSentence);

        // Generate another wrong option with a different fix attempt
        if (mode === 'comma-surgeon') {
            opts.push(current.originalSentence.replace(',', ';'));
        } else {
            opts.push(current.originalSentence.replace(/ing\b/g, 'ed'));
        }

        return opts.sort(() => Math.random() - 0.5);
    }, [current, mode]);

    const correctIndex = options.indexOf(current.correctSentence);
    const isCorrect = selectedOption === correctIndex;

    const handleSelect = (index: number) => {
        setSelectedOption(index);
        setShowResult(true);
    };

    const handleNext = () => {
        onNext(isCorrect);
        setSelectedOption(null);
        setShowResult(false);
    };

    const modeTitle = mode === 'comma-surgeon' ? 'Comma Surgeon' : 'Parallelism Balancer';
    const modeColor = mode === 'comma-surgeon' ? 'purple' : 'blue';

    return (
        <motion.div
            key={mode}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
        >
            <div className="flex items-center justify-between">
                <Badge variant="secondary">
                    Question {currentIndex + 1}/{exercises.length}
                </Badge>
                <Badge className={`bg-${modeColor}-500/20 text-${modeColor}-400`}>
                    Score: {score}
                </Badge>
            </div>

            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className={`h-full bg-gradient-to-r from-${modeColor}-500 to-${modeColor === 'purple' ? 'violet' : 'cyan'}-500`}
                />
            </div>

            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-4">
                        {mode === 'comma-surgeon' ? (
                            <Scissors className="h-5 w-5 text-purple-400" />
                        ) : (
                            <Scale className="h-5 w-5 text-blue-400" />
                        )}
                        <h2 className="text-lg font-semibold text-white">{modeTitle}</h2>
                    </div>

                    <p className="text-slate-400 mb-4">
                        {mode === 'comma-surgeon'
                            ? 'Select the correctly punctuated sentence:'
                            : 'Select the sentence with correct parallel structure:'}
                    </p>

                    <div className="space-y-3">
                        {options.map((option, i) => {
                            let bgColor = 'bg-slate-800 hover:bg-slate-700 border-white/10';
                            if (showResult) {
                                if (i === correctIndex) {
                                    bgColor = 'bg-green-500/20 border-green-500';
                                } else if (i === selectedOption) {
                                    bgColor = 'bg-red-500/20 border-red-500';
                                } else {
                                    bgColor = 'bg-slate-800/50 border-white/5';
                                }
                            } else if (selectedOption === i) {
                                bgColor = 'bg-cyan-500/20 border-cyan-500';
                            }

                            return (
                                <motion.button
                                    key={i}
                                    onClick={() => !showResult && handleSelect(i)}
                                    disabled={showResult}
                                    className={`w-full p-4 rounded-xl text-left border transition-all ${bgColor}`}
                                    whileHover={!showResult ? { scale: 1.01 } : {}}
                                    whileTap={!showResult ? { scale: 0.99 } : {}}
                                >
                                    <p className="text-white">{option}</p>
                                </motion.button>
                            );
                        })}
                    </div>

                    {showResult && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 p-4 rounded-xl bg-slate-800/50"
                        >
                            <div className="flex items-start gap-2">
                                <Lightbulb className="h-4 w-4 text-amber-400 mt-0.5" />
                                <div>
                                    <p className="text-sm text-slate-400">{current.explanation}</p>
                                    <p className="text-xs text-cyan-400 mt-2">📘 {current.rule}</p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </CardContent>
            </Card>

            <div className="flex gap-3 justify-center">
                {showResult && (
                    <Button onClick={handleNext}>
                        {currentIndex < exercises.length - 1 ? 'Next' : 'Finish'}
                        <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                )}
            </div>

            <div className="text-center">
                <Button variant="outline" onClick={onExit}>
                    Exit Game
                </Button>
            </div>
        </motion.div>
    );
}
