'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen,
    RotateCcw,
    Check,
    X,
    ArrowRight,
    ArrowLeft,
    Shuffle,
    Star,
    Timer,
    Trophy,
    Play,
    Zap,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/lib/store';
import {
    vocabularyWords,
    getRandomWords,
    shuffleArray,
    VocabWord,
} from '@/lib/vocabulary-data';

type GameMode = 'select' | 'flashcards' | 'matching' | 'quiz';

export default function VocabPage() {
    const toast = useToast();
    const [gameMode, setGameMode] = useState<GameMode>('select');
    const [words, setWords] = useState<VocabWord[]>([]);
    const [score, setScore] = useState(0);

    const startGame = (mode: GameMode, count: number = 8) => {
        const gameWords = getRandomWords(count);
        setWords(gameWords);
        setScore(0);
        setGameMode(mode);
    };

    const exitGame = () => {
        setGameMode('select');
        setWords([]);
        setScore(0);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-2xl md:text-3xl font-bold text-white">Vocabulary Games</h1>
                <p className="text-slate-400 mt-1">Learn new words through interactive games</p>
            </motion.div>

            <AnimatePresence mode="wait">
                {gameMode === 'select' && (
                    <GameSelection onStart={startGame} />
                )}

                {gameMode === 'flashcards' && (
                    <FlashcardsGame
                        words={words}
                        onExit={exitGame}
                        onComplete={(s) => { setScore(s); setGameMode('select'); }}
                    />
                )}

                {gameMode === 'matching' && (
                    <MatchingGame
                        words={words}
                        onExit={exitGame}
                        onComplete={(s) => { setScore(s); toast.success(`Great job! Score: ${s}/${words.length}`); setGameMode('select'); }}
                    />
                )}

                {gameMode === 'quiz' && (
                    <VocabQuiz
                        words={words}
                        onExit={exitGame}
                        onComplete={(s) => { setScore(s); setGameMode('select'); }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

// Game Selection Screen
function GameSelection({ onStart }: { onStart: (mode: GameMode, count?: number) => void }) {
    const games = [
        {
            id: 'flashcards',
            title: 'Flashcards',
            description: 'Flip cards to learn word-definition pairs',
            icon: <RotateCcw className="h-6 w-6" />,
            color: 'from-cyan-500 to-blue-500',
        },
        {
            id: 'matching',
            title: 'Word Match',
            description: 'Match words with their definitions',
            icon: <Shuffle className="h-6 w-6" />,
            color: 'from-purple-500 to-pink-500',
        },
        {
            id: 'quiz',
            title: 'Vocab Quiz',
            description: 'Test your vocabulary knowledge',
            icon: <Zap className="h-6 w-6" />,
            color: 'from-orange-500 to-amber-500',
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
            {/* Stats Card */}
            <Card className="bg-gradient-to-r from-cyan-900/20 to-violet-900/20 border-cyan-500/20">
                <CardContent className="py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-400">Words Available</p>
                            <p className="text-3xl font-bold text-white">{vocabularyWords.length}</p>
                        </div>
                        <div className="flex gap-2">
                            <Badge>SAT</Badge>
                            <Badge variant="secondary">IELTS</Badge>
                            <Badge variant="muted">Academic</Badge>
                            <Badge variant="muted">Daily</Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Game Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                {games.map((game, index) => (
                    <motion.div
                        key={game.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card
                            className="cursor-pointer hover:scale-[1.02] transition-all"
                            onClick={() => onStart(game.id as GameMode)}
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
        </motion.div>
    );
}

// Flashcards Game
function FlashcardsGame({
    words,
    onExit,
    onComplete,
}: {
    words: VocabWord[];
    onExit: () => void;
    onComplete: (score: number) => void;
}) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [known, setKnown] = useState<string[]>([]);
    const [unknown, setUnknown] = useState<string[]>([]);

    const currentWord = words[currentIndex];
    const progress = ((currentIndex + 1) / words.length) * 100;

    const handleKnow = () => {
        setKnown([...known, currentWord.id]);
        nextCard();
    };

    const handleDontKnow = () => {
        setUnknown([...unknown, currentWord.id]);
        nextCard();
    };

    const nextCard = () => {
        setIsFlipped(false);
        if (currentIndex < words.length - 1) {
            setTimeout(() => setCurrentIndex(currentIndex + 1), 200);
        } else {
            onComplete(known.length);
        }
    };

    return (
        <motion.div
            key="flashcards"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
        >
            {/* Progress */}
            <div className="flex items-center justify-between">
                <Badge variant="secondary">
                    Card {currentIndex + 1}/{words.length}
                </Badge>
                <div className="flex gap-4">
                    <span className="text-sm text-green-400">✓ {known.length}</span>
                    <span className="text-sm text-red-400">✗ {unknown.length}</span>
                </div>
            </div>

            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-gradient-to-r from-cyan-500 to-violet-500"
                />
            </div>

            {/* Card */}
            <div className="perspective-1000 h-64">
                <motion.div
                    className={`relative w-full h-full cursor-pointer`}
                    onClick={() => setIsFlipped(!isFlipped)}
                    style={{ transformStyle: 'preserve-3d' }}
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.4 }}
                >
                    {/* Front */}
                    <Card className="absolute inset-0 backface-hidden flex items-center justify-center">
                        <CardContent className="text-center py-12">
                            <Badge className="mb-4">{currentWord.level}</Badge>
                            <h2 className="text-3xl font-bold text-white">{currentWord.word}</h2>
                            <p className="text-sm text-slate-400 mt-4">Tap to see definition</p>
                        </CardContent>
                    </Card>

                    {/* Back */}
                    <Card
                        className="absolute inset-0 backface-hidden flex items-center justify-center"
                        style={{ transform: 'rotateY(180deg)' }}
                    >
                        <CardContent className="text-center py-8 px-6">
                            <p className="text-xl text-white">{currentWord.definition}</p>
                            <p className="text-sm text-slate-400 mt-4 italic">"{currentWord.example}"</p>
                            {currentWord.synonyms && (
                                <p className="text-xs text-cyan-400 mt-3">
                                    Synonyms: {currentWord.synonyms.join(', ')}
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-center">
                <Button
                    onClick={handleDontKnow}
                    className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30"
                >
                    <X className="h-4 w-4 mr-2" />
                    Don't Know
                </Button>
                <Button onClick={handleKnow} className="bg-green-500 hover:bg-green-600">
                    <Check className="h-4 w-4 mr-2" />
                    I Know This
                </Button>
            </div>

            <div className="text-center">
                <Button variant="outline" onClick={onExit}>
                    Exit Game
                </Button>
            </div>
        </motion.div>
    );
}

// Matching Game
function MatchingGame({
    words,
    onExit,
    onComplete,
}: {
    words: VocabWord[];
    onExit: () => void;
    onComplete: (score: number) => void;
}) {
    const gameWords = words.slice(0, 6); // Use 6 words for matching
    const [selectedWord, setSelectedWord] = useState<string | null>(null);
    const [selectedDef, setSelectedDef] = useState<string | null>(null);
    const [matched, setMatched] = useState<string[]>([]);
    const [shuffledDefs, setShuffledDefs] = useState<VocabWord[]>([]);

    useEffect(() => {
        setShuffledDefs(shuffleArray(gameWords));
    }, []);

    useEffect(() => {
        if (selectedWord && selectedDef) {
            const wordObj = gameWords.find(w => w.id === selectedWord);
            if (wordObj && wordObj.id === selectedDef) {
                setMatched([...matched, selectedWord]);
                if (matched.length + 1 === gameWords.length) {
                    onComplete(gameWords.length);
                }
            }
            setTimeout(() => {
                setSelectedWord(null);
                setSelectedDef(null);
            }, 300);
        }
    }, [selectedWord, selectedDef]);

    return (
        <motion.div
            key="matching"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
        >
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">Match the Words</h2>
                <Badge variant="secondary">{matched.length}/{gameWords.length} matched</Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {/* Words Column */}
                <div className="space-y-3">
                    <p className="text-sm text-slate-400 mb-2">Words</p>
                    {gameWords.map((word) => (
                        <motion.button
                            key={word.id}
                            onClick={() => !matched.includes(word.id) && setSelectedWord(word.id)}
                            disabled={matched.includes(word.id)}
                            className={`w-full p-4 rounded-xl text-left transition-all ${matched.includes(word.id)
                                    ? 'bg-green-500/20 border-2 border-green-500 text-green-400'
                                    : selectedWord === word.id
                                        ? 'bg-cyan-500/20 border-2 border-cyan-500 text-white'
                                        : 'bg-slate-800 border border-white/10 text-white hover:bg-slate-700'
                                }`}
                            whileHover={{ scale: matched.includes(word.id) ? 1 : 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <p className="font-medium">{word.word}</p>
                        </motion.button>
                    ))}
                </div>

                {/* Definitions Column */}
                <div className="space-y-3">
                    <p className="text-sm text-slate-400 mb-2">Definitions</p>
                    {shuffledDefs.map((word) => (
                        <motion.button
                            key={`def-${word.id}`}
                            onClick={() => !matched.includes(word.id) && setSelectedDef(word.id)}
                            disabled={matched.includes(word.id)}
                            className={`w-full p-4 rounded-xl text-left transition-all ${matched.includes(word.id)
                                    ? 'bg-green-500/20 border-2 border-green-500 text-green-400'
                                    : selectedDef === word.id
                                        ? 'bg-cyan-500/20 border-2 border-cyan-500 text-white'
                                        : 'bg-slate-800 border border-white/10 text-white hover:bg-slate-700'
                                }`}
                            whileHover={{ scale: matched.includes(word.id) ? 1 : 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <p className="text-sm">{word.definition}</p>
                        </motion.button>
                    ))}
                </div>
            </div>

            <div className="text-center">
                <Button variant="outline" onClick={onExit}>
                    Exit Game
                </Button>
            </div>
        </motion.div>
    );
}

// Vocabulary Quiz
function VocabQuiz({
    words,
    onExit,
    onComplete,
}: {
    words: VocabWord[];
    onExit: () => void;
    onComplete: (score: number) => void;
}) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [options, setOptions] = useState<string[]>([]);

    const currentWord = words[currentIndex];

    useEffect(() => {
        // Generate answer options
        if (currentWord) {
            const wrongAnswers = vocabularyWords
                .filter(w => w.id !== currentWord.id)
                .sort(() => Math.random() - 0.5)
                .slice(0, 3)
                .map(w => w.definition);

            setOptions(shuffleArray([currentWord.definition, ...wrongAnswers]));
        }
    }, [currentIndex, currentWord]);

    const handleAnswer = (answer: string) => {
        setSelectedAnswer(answer);
        setShowResult(true);
        if (answer === currentWord.definition) {
            setScore(score + 1);
        }
    };

    const nextQuestion = () => {
        setSelectedAnswer(null);
        setShowResult(false);
        if (currentIndex < words.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            onComplete(score);
        }
    };

    return (
        <motion.div
            key="quiz"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
        >
            <div className="flex items-center justify-between">
                <Badge variant="secondary">
                    Question {currentIndex + 1}/{words.length}
                </Badge>
                <Badge className="bg-cyan-500/20 text-cyan-400">
                    Score: {score}
                </Badge>
            </div>

            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentIndex + 1) / words.length) * 100}%` }}
                    className="h-full bg-gradient-to-r from-orange-500 to-amber-500"
                />
            </div>

            <Card>
                <CardContent className="pt-8 pb-6 text-center">
                    <p className="text-sm text-slate-400 mb-2">What is the meaning of:</p>
                    <h2 className="text-3xl font-bold text-white">{currentWord.word}</h2>
                    <Badge className="mt-2">{currentWord.level}</Badge>
                </CardContent>
            </Card>

            <div className="space-y-3">
                {options.map((option, index) => {
                    const isCorrect = option === currentWord.definition;
                    const isSelected = selectedAnswer === option;

                    return (
                        <motion.button
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => !showResult && handleAnswer(option)}
                            disabled={showResult}
                            className={`w-full p-4 rounded-xl text-left transition-all ${showResult
                                    ? isCorrect
                                        ? 'bg-green-500/20 border-2 border-green-500 text-green-400'
                                        : isSelected
                                            ? 'bg-red-500/20 border-2 border-red-500 text-red-400'
                                            : 'bg-slate-800/50 border border-white/5 text-slate-500'
                                    : 'bg-slate-800 border border-white/10 hover:bg-slate-700 text-white'
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <span>{option}</span>
                                {showResult && isCorrect && <Check className="h-5 w-5 text-green-400" />}
                                {showResult && isSelected && !isCorrect && <X className="h-5 w-5 text-red-400" />}
                            </div>
                        </motion.button>
                    );
                })}
            </div>

            {showResult && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-center"
                >
                    <Button onClick={nextQuestion}>
                        {currentIndex < words.length - 1 ? 'Next Question' : 'See Results'}
                        <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                </motion.div>
            )}

            <div className="text-center">
                <Button variant="outline" onClick={onExit}>
                    Exit Quiz
                </Button>
            </div>
        </motion.div>
    );
}
