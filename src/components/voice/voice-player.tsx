'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface VoicePlayerProps {
    text: string;
    autoPlay?: boolean;
    onStart?: () => void;
    onEnd?: () => void;
    className?: string;
}

export function VoicePlayer({
    text,
    autoPlay = false,
    onStart,
    onEnd,
    className,
}: VoicePlayerProps) {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

    // Check browser support
    const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

    const speak = useCallback(() => {
        if (!isSupported || !text) return;

        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 0.95; // Slightly slower for clarity
        utterance.pitch = 1;

        // Try to get a good English voice
        const voices = window.speechSynthesis.getVoices();
        const englishVoice = voices.find(v =>
            v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural'))
        ) || voices.find(v => v.lang.startsWith('en'));

        if (englishVoice) {
            utterance.voice = englishVoice;
        }

        utterance.onstart = () => {
            setIsSpeaking(true);
            onStart?.();
        };

        utterance.onend = () => {
            setIsSpeaking(false);
            setIsPaused(false);
            onEnd?.();
        };

        utterance.onerror = (event) => {
            console.error('Speech synthesis error:', event);
            setIsSpeaking(false);
        };

        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
    }, [text, isSupported, onStart, onEnd]);

    const stop = () => {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        setIsPaused(false);
    };

    const togglePause = () => {
        if (isPaused) {
            window.speechSynthesis.resume();
            setIsPaused(false);
        } else {
            window.speechSynthesis.pause();
            setIsPaused(true);
        }
    };

    // Auto-play when text changes
    useEffect(() => {
        if (autoPlay && text) {
            // Small delay to ensure voices are loaded
            const timer = setTimeout(() => speak(), 100);
            return () => clearTimeout(timer);
        }
    }, [text, autoPlay, speak]);

    // Load voices
    useEffect(() => {
        if (!isSupported) return;

        // Voices may not be loaded immediately
        const loadVoices = () => {
            window.speechSynthesis.getVoices();
        };

        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;

        return () => {
            window.speechSynthesis.cancel();
        };
    }, [isSupported]);

    if (!isSupported) {
        return null;
    }

    return (
        <div className={cn('flex items-center gap-2', className)}>
            <Button
                size="sm"
                variant="ghost"
                onClick={isSpeaking ? stop : speak}
                className="gap-2"
            >
                {isSpeaking ? (
                    <>
                        <VolumeX className="h-4 w-4" />
                        Stop
                    </>
                ) : (
                    <>
                        <Volume2 className="h-4 w-4" />
                        Listen
                    </>
                )}
            </Button>
        </div>
    );
}

// Speaking avatar/indicator component
interface SpeakingAvatarProps {
    isSpeaking: boolean;
    name?: string;
    className?: string;
}

export function SpeakingAvatar({ isSpeaking, name = 'AI', className }: SpeakingAvatarProps) {
    return (
        <div className={cn('relative', className)}>
            {/* Pulse rings when speaking */}
            {isSpeaking && (
                <>
                    <div className="absolute inset-0 rounded-full bg-violet-500/30 animate-ping" />
                    <div className="absolute inset-[-4px] rounded-full bg-violet-500/20 animate-pulse" />
                </>
            )}

            {/* Avatar */}
            <div className={cn(
                'relative w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
                isSpeaking
                    ? 'bg-gradient-to-br from-violet-500 to-purple-600 text-white'
                    : 'bg-violet-500/20 text-violet-400'
            )}>
                {name.slice(0, 2)}
            </div>

            {/* Sound waves */}
            {isSpeaking && (
                <div className="absolute -right-1 top-1/2 -translate-y-1/2 flex gap-0.5">
                    {[0, 1, 2].map((i) => (
                        <div
                            key={i}
                            className="w-0.5 bg-violet-400 rounded-full animate-pulse"
                            style={{
                                height: `${8 + i * 4}px`,
                                animationDelay: `${i * 0.15}s`,
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

// Auto-speaking text component
interface AutoSpeakTextProps {
    text: string;
    onEnd?: () => void;
    className?: string;
}

export function AutoSpeakText({ text, onEnd, className }: AutoSpeakTextProps) {
    const [isSpeaking, setIsSpeaking] = useState(false);

    useEffect(() => {
        if (!text || typeof window === 'undefined' || !('speechSynthesis' in window)) return;

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 0.95;

        const voices = window.speechSynthesis.getVoices();
        const englishVoice = voices.find(v => v.lang.startsWith('en'));
        if (englishVoice) utterance.voice = englishVoice;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => {
            setIsSpeaking(false);
            onEnd?.();
        };

        // Small delay to ensure component is mounted
        const timer = setTimeout(() => {
            window.speechSynthesis.speak(utterance);
        }, 300);

        return () => {
            clearTimeout(timer);
            window.speechSynthesis.cancel();
        };
    }, [text, onEnd]);

    return (
        <div className={cn('flex items-center gap-2', className)}>
            {isSpeaking && (
                <div className="flex items-center gap-1">
                    <Volume2 className="h-4 w-4 text-violet-400 animate-pulse" />
                    <span className="text-xs text-violet-400">Speaking...</span>
                </div>
            )}
        </div>
    );
}
