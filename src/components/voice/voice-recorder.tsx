'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff, Square, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Web Speech API - types are browser-specific, using any for cross-browser compat

interface VoiceRecorderProps {
    onTranscript: (text: string, isFinal: boolean) => void;
    onRecordingStart?: () => void;
    onRecordingEnd?: () => void;
    disabled?: boolean;
    className?: string;
}

export function VoiceRecorder({
    onTranscript,
    onRecordingStart,
    onRecordingEnd,
    disabled = false,
    className,
}: VoiceRecorderProps) {
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [volume, setVolume] = useState(0);

    const recognitionRef = useRef<any>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const streamRef = useRef<MediaStream | null>(null);

    // Check browser support
    const isSupported = typeof window !== 'undefined' &&
        ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

    // Initialize speech recognition
    useEffect(() => {
        if (!isSupported) return;

        const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognitionAPI();

        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
            let finalTranscript = '';
            let interimTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript;
                } else {
                    interimTranscript += transcript;
                }
            }

            if (finalTranscript) {
                onTranscript(finalTranscript.trim(), true);
            } else if (interimTranscript) {
                onTranscript(interimTranscript, false);
            }
        };

        recognition.onerror = (event: any) => {
            console.error('Speech recognition error:', event.error);
            if (event.error === 'not-allowed') {
                setError('Microphone access denied. Please enable it in your browser settings.');
            } else if (event.error === 'no-speech') {
                // Ignore no-speech errors, just continue
            } else {
                setError(`Error: ${event.error}`);
            }
        };

        recognition.onend = () => {
            if (isRecording) {
                // Auto-restart if still supposed to be recording
                try {
                    recognition.start();
                } catch (e) {
                    // Ignore restart errors
                }
            }
        };

        recognitionRef.current = recognition;

        return () => {
            recognition.stop();
        };
    }, [isSupported, onTranscript, isRecording]);

    // Audio visualization
    const startAudioVisualization = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;

            const audioContext = new AudioContext();
            audioContextRef.current = audioContext;

            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 256;
            analyserRef.current = analyser;

            const source = audioContext.createMediaStreamSource(stream);
            source.connect(analyser);

            const updateVolume = () => {
                if (!analyserRef.current) return;

                const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
                analyserRef.current.getByteFrequencyData(dataArray);

                const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
                setVolume(average / 255);

                animationFrameRef.current = requestAnimationFrame(updateVolume);
            };

            updateVolume();
        } catch (err) {
            console.error('Failed to access microphone:', err);
            setError('Could not access microphone');
        }
    }, []);

    const stopAudioVisualization = useCallback(() => {
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }
        if (audioContextRef.current) {
            audioContextRef.current.close();
        }
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }
        setVolume(0);
    }, []);

    const startRecording = async () => {
        if (!recognitionRef.current) return;

        setError(null);
        setIsProcessing(true);

        try {
            await startAudioVisualization();
            recognitionRef.current.start();
            setIsRecording(true);
            onRecordingStart?.();
        } catch (err) {
            setError('Failed to start recording');
        } finally {
            setIsProcessing(false);
        }
    };

    const stopRecording = () => {
        if (!recognitionRef.current) return;

        recognitionRef.current.stop();
        stopAudioVisualization();
        setIsRecording(false);
        onRecordingEnd?.();
    };

    const toggleRecording = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    if (!isSupported) {
        return (
            <div className={cn('text-center p-4', className)}>
                <p className="text-sm text-red-400">
                    Voice input is not supported in this browser. Please use Chrome, Edge, or Safari.
                </p>
            </div>
        );
    }

    return (
        <div className={cn('flex flex-col items-center gap-4', className)}>
            {/* Waveform visualization */}
            <div className="relative">
                {/* Pulse rings */}
                {isRecording && (
                    <>
                        <div
                            className="absolute inset-0 rounded-full bg-cyan-500/20 animate-ping"
                            style={{
                                transform: `scale(${1 + volume * 0.5})`,
                                opacity: 0.3 + volume * 0.4,
                            }}
                        />
                        <div
                            className="absolute inset-0 rounded-full bg-cyan-500/10"
                            style={{
                                transform: `scale(${1.2 + volume * 0.8})`,
                            }}
                        />
                    </>
                )}

                {/* Main button */}
                <Button
                    size="lg"
                    variant={isRecording ? 'danger' : 'default'}
                    onClick={toggleRecording}
                    disabled={disabled || isProcessing}
                    className={cn(
                        'relative w-20 h-20 rounded-full p-0 transition-all duration-200',
                        isRecording && 'scale-110'
                    )}
                >
                    {isProcessing ? (
                        <Loader2 className="h-8 w-8 animate-spin" />
                    ) : isRecording ? (
                        <Square className="h-8 w-8" />
                    ) : (
                        <Mic className="h-8 w-8" />
                    )}
                </Button>
            </div>

            {/* Status text */}
            <p className={cn(
                'text-sm transition-colors',
                isRecording ? 'text-cyan-400' : 'text-slate-400'
            )}>
                {isProcessing ? 'Starting...' : isRecording ? 'Listening... tap to stop' : 'Tap to speak'}
            </p>

            {/* Error message */}
            {error && (
                <p className="text-sm text-red-400 text-center max-w-xs">{error}</p>
            )}

            {/* Volume bar */}
            {isRecording && (
                <div className="w-32 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-violet-500 transition-all duration-75"
                        style={{ width: `${volume * 100}%` }}
                    />
                </div>
            )}
        </div>
    );
}

// Waveform bars visualization component
export function WaveformBars({ isActive, volume }: { isActive: boolean; volume: number }) {
    const bars = 5;

    return (
        <div className="flex items-center gap-1 h-8">
            {Array.from({ length: bars }).map((_, i) => {
                const delay = i * 0.1;
                const baseHeight = 0.3 + Math.random() * 0.3;
                const heightMultiplier = isActive ? baseHeight + volume * 0.7 : 0.2;

                return (
                    <div
                        key={i}
                        className={cn(
                            'w-1 rounded-full transition-all duration-150',
                            isActive ? 'bg-cyan-400' : 'bg-slate-600'
                        )}
                        style={{
                            height: `${heightMultiplier * 100}%`,
                            transitionDelay: `${delay}s`,
                        }}
                    />
                );
            })}
        </div>
    );
}
