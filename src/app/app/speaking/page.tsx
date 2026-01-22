'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Mic,
    MicOff,
    Play,
    Pause,
    RotateCcw,
    Check,
    X,
    Volume2,
    ChevronRight,
    Star,
    Brain,
    MessageSquare,
    Timer,
    BookOpen,
    Award,
    Target,
    Lightbulb,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type SpeakingMode = 'select' | 'teach-back' | 'pronunciation' | 'scenario';

interface SpeakingPrompt {
    id: string;
    title: string;
    prompt: string;
    keywords: string[];
    level: 'A2' | 'B1' | 'B2' | 'C1';
    timeLimit: number; // seconds
    category: 'grammar' | 'vocabulary' | 'conversation' | 'ielts';
}

const speakingPrompts: SpeakingPrompt[] = [
    {
        id: 'teach-1',
        title: 'Present Perfect Tense',
        prompt: 'Explain when we use the Present Perfect tense. Give examples and mention the difference from Past Simple.',
        keywords: ['have', 'has', 'past participle', 'experience', 'since', 'for', 'yet', 'already', 'result'],
        level: 'B1',
        timeLimit: 90,
        category: 'grammar',
    },
    {
        id: 'teach-2',
        title: 'Conditionals',
        prompt: 'Explain the difference between First, Second, and Third Conditionals. Give an example for each.',
        keywords: ['if', 'will', 'would', 'had', 'real', 'unreal', 'hypothetical', 'past', 'future'],
        level: 'B2',
        timeLimit: 120,
        category: 'grammar',
    },
    {
        id: 'teach-3',
        title: 'Describe Your Hometown',
        prompt: 'Describe your hometown. Talk about its location, size, famous places, and what you like about it.',
        keywords: ['located', 'population', 'famous', 'traditional', 'modern', 'enjoy', 'recommend'],
        level: 'B1',
        timeLimit: 90,
        category: 'ielts',
    },
    {
        id: 'teach-4',
        title: 'Advantages of Technology',
        prompt: 'Discuss the advantages and disadvantages of technology in education.',
        keywords: ['benefit', 'drawback', 'access', 'interactive', 'distraction', 'efficient', 'however'],
        level: 'B2',
        timeLimit: 120,
        category: 'ielts',
    },
    {
        id: 'teach-5',
        title: 'Job Interview Introduction',
        prompt: 'Introduce yourself as if you were in a job interview. Talk about your background, skills, and why you\'re interested in the position.',
        keywords: ['experience', 'skills', 'passionate', 'team', 'contribute', 'opportunity', 'qualified'],
        level: 'B2',
        timeLimit: 90,
        category: 'conversation',
    },
];

export default function SpeakingPage() {
    const [mode, setMode] = useState<SpeakingMode>('select');
    const [currentPrompt, setCurrentPrompt] = useState<SpeakingPrompt | null>(null);

    const startSession = (prompt: SpeakingPrompt) => {
        setCurrentPrompt(prompt);
        setMode('teach-back');
    };

    const exitSession = () => {
        setMode('select');
        setCurrentPrompt(null);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-2xl md:text-3xl font-bold text-white">Speaking Simulator</h1>
                <p className="text-slate-400 mt-1">Practice speaking and teach concepts back</p>
            </motion.div>

            <AnimatePresence mode="wait">
                {mode === 'select' && (
                    <PromptSelection prompts={speakingPrompts} onStart={startSession} />
                )}

                {mode === 'teach-back' && currentPrompt && (
                    <TeachBackSession prompt={currentPrompt} onExit={exitSession} />
                )}
            </AnimatePresence>
        </div>
    );
}

// Prompt Selection Screen
function PromptSelection({
    prompts,
    onStart,
}: {
    prompts: SpeakingPrompt[];
    onStart: (prompt: SpeakingPrompt) => void;
}) {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    const categories = [
        { id: 'all', label: 'All Topics' },
        { id: 'grammar', label: 'Grammar' },
        { id: 'ielts', label: 'IELTS' },
        { id: 'conversation', label: 'Conversation' },
    ];

    const filteredPrompts = selectedCategory === 'all'
        ? prompts
        : prompts.filter(p => p.category === selectedCategory);

    const levelColors: Record<string, string> = {
        A2: 'bg-green-500/20 text-green-400',
        B1: 'bg-blue-500/20 text-blue-400',
        B2: 'bg-purple-500/20 text-purple-400',
        C1: 'bg-orange-500/20 text-orange-400',
    };

    return (
        <motion.div
            key="select"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
        >
            {/* Info Card */}
            <Card className="bg-gradient-to-r from-violet-900/20 to-pink-900/20 border-violet-500/20">
                <CardContent className="py-6">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center">
                            <Brain className="h-7 w-7 text-white" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-white text-lg">Teach It Back</h3>
                            <p className="text-sm text-slate-400">
                                The best way to learn is to teach. Record yourself explaining concepts!
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-4 py-2 rounded-full text-sm transition-all ${selectedCategory === cat.id
                            ? 'bg-violet-500 text-white'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                            }`}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Prompt Cards */}
            <div className="grid gap-4 md:grid-cols-2">
                {filteredPrompts.map((prompt, index) => (
                    <motion.div
                        key={prompt.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className="hover:scale-[1.02] transition-all cursor-pointer" onClick={() => onStart(prompt)}>
                            <CardContent className="pt-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <Badge className={levelColors[prompt.level]}>{prompt.level}</Badge>
                                    <Badge variant="secondary">{prompt.category}</Badge>
                                    <span className="text-xs text-slate-500 ml-auto flex items-center gap-1">
                                        <Timer className="h-3 w-3" />
                                        {prompt.timeLimit}s
                                    </span>
                                </div>
                                <h3 className="font-semibold text-white mb-2">{prompt.title}</h3>
                                <p className="text-sm text-slate-400 line-clamp-2">{prompt.prompt}</p>
                                <div className="mt-3 flex flex-wrap gap-1">
                                    {prompt.keywords.slice(0, 4).map((kw) => (
                                        <span key={kw} className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-slate-500">
                                            {kw}
                                        </span>
                                    ))}
                                    {prompt.keywords.length > 4 && (
                                        <span className="text-xs text-slate-500">+{prompt.keywords.length - 4}</span>
                                    )}
                                </div>
                                <Button className="w-full mt-4">
                                    <Mic className="h-4 w-4 mr-2" />
                                    Start Recording
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}

// Teach Back Session
function TeachBackSession({
    prompt,
    onExit,
}: {
    prompt: SpeakingPrompt;
    onExit: () => void;
}) {
    const [isRecording, setIsRecording] = useState(false);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [timeLeft, setTimeLeft] = useState(prompt.timeLimit);
    const [transcript, setTranscript] = useState('');
    const [feedback, setFeedback] = useState<{
        keywordsFound: string[];
        keywordsMissing: string[];
        score: number;
        tips: string[];
    } | null>(null);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const recognitionRef = useRef<any>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const animationRef = useRef<number>(0);

    // Timer
    useEffect(() => {
        if (!isRecording || timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    stopRecording();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isRecording, timeLeft]);

    // Waveform visualization
    const drawWaveform = useCallback(() => {
        if (!canvasRef.current || !analyserRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const analyser = analyserRef.current;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const draw = () => {
            animationRef.current = requestAnimationFrame(draw);
            analyser.getByteTimeDomainData(dataArray);

            ctx.fillStyle = 'rgba(15, 23, 42, 0.3)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.lineWidth = 2;
            ctx.strokeStyle = '#06b6d4';
            ctx.beginPath();

            const sliceWidth = canvas.width / bufferLength;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                const v = dataArray[i] / 128.0;
                const y = (v * canvas.height) / 2;

                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }

                x += sliceWidth;
            }

            ctx.lineTo(canvas.width, canvas.height / 2);
            ctx.stroke();
        };

        draw();
    }, []);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            // Set up audio analyser for waveform
            const audioContext = new AudioContext();
            const source = audioContext.createMediaStreamSource(stream);
            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 2048;
            source.connect(analyser);
            analyserRef.current = analyser;

            // Start waveform animation
            drawWaveform();

            // Set up MediaRecorder
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                chunksRef.current.push(e.data);
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                const url = URL.createObjectURL(blob);
                setAudioUrl(url);
                cancelAnimationFrame(animationRef.current);
            };

            mediaRecorder.start();

            // Set up Speech Recognition
            if ('webkitSpeechRecognition' in window) {
                const SpeechRecognition = (window as any).webkitSpeechRecognition;
                const recognition = new SpeechRecognition();
                recognition.continuous = true;
                recognition.interimResults = true;
                recognition.lang = 'en-US';

                recognition.onresult = (event: any) => {
                    let finalTranscript = '';
                    for (let i = 0; i < event.results.length; i++) {
                        finalTranscript += event.results[i][0].transcript;
                    }
                    setTranscript(finalTranscript);
                };

                recognition.start();
                recognitionRef.current = recognition;
            }

            setIsRecording(true);
        } catch (err) {
            console.error('Error accessing microphone:', err);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }

        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }

        setIsRecording(false);
        analyzeFeedback();
    };

    const analyzeFeedback = () => {
        const transcriptLower = transcript.toLowerCase();
        const keywordsFound = prompt.keywords.filter(kw =>
            transcriptLower.includes(kw.toLowerCase())
        );
        const keywordsMissing = prompt.keywords.filter(kw =>
            !transcriptLower.includes(kw.toLowerCase())
        );

        const score = Math.round((keywordsFound.length / prompt.keywords.length) * 100);

        const tips: string[] = [];
        if (score < 50) {
            tips.push('Try to include more key concepts in your explanation.');
        }
        if (transcript.length < 100) {
            tips.push('Your response was quite short. Try to elaborate more.');
        }
        if (score >= 70) {
            tips.push('Great job covering the main points!');
        }
        if (keywordsMissing.length > 0) {
            tips.push(`Consider mentioning: ${keywordsMissing.slice(0, 3).join(', ')}`);
        }

        setFeedback({ keywordsFound, keywordsMissing, score, tips });
    };

    const resetSession = () => {
        setAudioUrl(null);
        setTranscript('');
        setFeedback(null);
        setTimeLeft(prompt.timeLimit);
    };

    return (
        <motion.div
            key="teach-back"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid lg:grid-cols-2 gap-6"
        >
            {/* Left Column: Recording & Content */}
            < div className="space-y-6" >
                {/* Prompt Card */}
                < Card >
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-2 mb-3">
                            <Badge>{prompt.level}</Badge>
                            <Badge variant="secondary">{prompt.category}</Badge>
                        </div>
                        <h2 className="text-xl font-semibold text-white mb-2">{prompt.title}</h2>
                        <p className="text-slate-400">{prompt.prompt}</p>
                        <div className="mt-4 flex flex-wrap gap-2">
                            <span className="text-sm text-slate-500">Keywords to include:</span>
                            {prompt.keywords.map((kw) => (
                                <span
                                    key={kw}
                                    className={`text-xs px-2 py-1 rounded-full ${feedback?.keywordsFound.includes(kw)
                                        ? 'bg-green-500/20 text-green-400'
                                        : feedback?.keywordsMissing.includes(kw)
                                            ? 'bg-red-500/20 text-red-400'
                                            : 'bg-cyan-500/20 text-cyan-400'
                                        }`}
                                >
                                    {kw}
                                </span>
                            ))}
                        </div>
                    </CardContent>
                </Card >

                {/* Timer & Recording */}
                < Card className={isRecording ? 'border-red-500/50' : ''} >
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-slate-600'}`} />
                                <span className="text-sm text-slate-400">
                                    {isRecording ? 'Recording...' : audioUrl ? 'Recording complete' : 'Ready to record'}
                                </span>
                            </div>
                            <div className={`text-2xl font-mono font-bold ${timeLeft <= 10 ? 'text-red-400' : 'text-white'}`}>
                                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                            </div>
                        </div>

                        {/* Waveform */}
                        <canvas
                            ref={canvasRef}
                            width={600}
                            height={80}
                            className="w-full h-20 rounded-lg bg-slate-900/50"
                        />

                        {/* Controls */}
                        <div className="flex gap-3 justify-center mt-6">
                            {!audioUrl ? (
                                <Button
                                    onClick={isRecording ? stopRecording : startRecording}
                                    className={isRecording ? 'bg-red-500 hover:bg-red-600' : ''}
                                    size="lg"
                                >
                                    {isRecording ? (
                                        <>
                                            <MicOff className="h-5 w-5 mr-2" />
                                            Stop Recording
                                        </>
                                    ) : (
                                        <>
                                            <Mic className="h-5 w-5 mr-2" />
                                            Start Recording
                                        </>
                                    )}
                                </Button>
                            ) : (
                                <>
                                    <audio src={audioUrl} controls className="h-10" />
                                    <Button onClick={resetSession} variant="outline">
                                        <RotateCcw className="h-4 w-4 mr-2" />
                                        Try Again
                                    </Button>
                                </>
                            )}
                        </div>
                    </CardContent>
                </Card >

                {/* Transcript */}
                {
                    transcript && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <MessageSquare className="h-4 w-4 text-cyan-400" />
                                    Your Response
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-300 leading-relaxed font-content text-lg">{transcript || 'Listening...'}</p>
                            </CardContent>
                        </Card>
                    )
                }
            </div >

            {/* Right Column: Live Rubric / Content */}
            < div className="space-y-6" >
                <AnimatePresence mode="wait">
                    {!feedback ? (
                        <motion.div
                            key="criteria"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <Card className="h-full border-blue-500/20 bg-blue-900/5">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Brain className="h-5 w-5 text-blue-400" />
                                        Evaluation Criteria
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-2">
                                        <h4 className="font-semibold text-white text-sm">1. Key Concepts</h4>
                                        <p className="text-sm text-slate-400">Include all the highlighted keywords in your explanation.</p>
                                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-blue-500 w-1/3 opacity-30" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <h4 className="font-semibold text-white text-sm">2. Clarity & Detail</h4>
                                        <p className="text-sm text-slate-400">Speak clearly and elaborate on your points. Avoid short answers.</p>
                                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-violet-500 w-1/2 opacity-30" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <h4 className="font-semibold text-white text-sm">3. Pacing</h4>
                                        <p className="text-sm text-slate-400">Keep a steady pace. You have {Math.floor(prompt.timeLimit / 60)}m {(prompt.timeLimit % 60).toString().padStart(2, '0')}s.</p>
                                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-green-500 w-full opacity-30" />
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 mt-8">
                                        <p className="text-xs text-blue-300 italic">
                                            "Teaching it back is the ultimate test of understanding."
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="feedback"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <Card className="bg-gradient-to-br from-cyan-900/20 to-violet-900/20 border-cyan-500/30 shadow-lg shadow-cyan-900/20">
                                <CardHeader>
                                    <div className="flex items-center justify-between mb-2">
                                        <CardTitle className="flex items-center gap-2">
                                            <Award className="h-5 w-5 text-yellow-400" />
                                            Session Feedback
                                        </CardTitle>
                                        <div className="flex flex-col items-end">
                                            <span className="text-sm text-slate-400">Overall Score</span>
                                            <span className={`text-3xl font-bold ${feedback.score >= 70 ? 'text-green-400' :
                                                feedback.score >= 50 ? 'text-yellow-400' :
                                                    'text-red-400'
                                                }`}>
                                                {feedback.score}%
                                            </span>
                                        </div>
                                    </div>
                                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${feedback.score}%` }}
                                            transition={{ duration: 1, delay: 0.5 }}
                                            className={`h-full ${feedback.score >= 70 ? 'bg-green-500' : feedback.score >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                        />
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* Keywords Found */}
                                    <div>
                                        <p className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                                            <Check className="h-4 w-4 text-green-400" />
                                            Keywords Covered
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {feedback.keywordsFound.length > 0 ? feedback.keywordsFound.map(kw => (
                                                <span key={kw} className="text-xs px-2.5 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/20">
                                                    {kw}
                                                </span>
                                            )) : (
                                                <span className="text-xs text-slate-500 italic">No keywords detected yet.</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Keywords Missing */}
                                    {feedback.keywordsMissing.length > 0 && (
                                        <div>
                                            <p className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                                                <Target className="h-4 w-4 text-red-400" />
                                                Missing Concepts
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {feedback.keywordsMissing.map(kw => (
                                                    <span key={kw} className="text-xs px-2.5 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/20">
                                                        {kw}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Tips */}
                                    <div className="pt-4 border-t border-white/10">
                                        <p className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                                            <Lightbulb className="h-4 w-4 text-amber-400" />
                                            AI Suggestions
                                        </p>
                                        <ul className="space-y-2">
                                            {feedback.tips.map((tip, i) => (
                                                <motion.li
                                                    key={i}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.8 + (i * 0.1) }}
                                                    className="text-sm text-slate-300 flex items-start gap-2 p-2 rounded-lg bg-white/5"
                                                >
                                                    <span className="text-amber-400 mt-0.5">💡</span>
                                                    {tip}
                                                </motion.li>
                                            ))}
                                        </ul>
                                    </div>

                                    <Button onClick={onExit} className="w-full mt-4 bg-white/10 hover:bg-white/20">
                                        Finish Session
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div >
        </motion.div >
    );
}
