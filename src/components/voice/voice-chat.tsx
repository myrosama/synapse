'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Keyboard, Volume2, Lightbulb, Send, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VoiceRecorder } from './voice-recorder';
import { SpeakingAvatar, AutoSpeakText } from './voice-player';
import { cn } from '@/lib/utils';

export interface ChatMessage {
    id: string;
    role: 'student' | 'user';
    content: string;
    timestamp: Date;
    isInterim?: boolean;
}

interface VoiceChatProps {
    studentQuestion: string;
    onUserResponse: (response: string) => void;
    onRequestHint?: () => void;
    onComplete?: (transcript: ChatMessage[]) => void;
    isProcessing?: boolean;
    className?: string;
}

export function VoiceChat({
    studentQuestion,
    onUserResponse,
    onRequestHint,
    onComplete,
    isProcessing = false,
    className,
}: VoiceChatProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [currentTranscript, setCurrentTranscript] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [inputMode, setInputMode] = useState<'voice' | 'text'>('voice');
    const [textInput, setTextInput] = useState('');

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textInputRef = useRef<HTMLTextAreaElement>(null);

    // Add student question as first message
    useEffect(() => {
        if (studentQuestion && messages.length === 0) {
            setMessages([{
                id: `student-${Date.now()}`,
                role: 'student',
                content: studentQuestion,
                timestamp: new Date(),
            }]);
        }
    }, [studentQuestion, messages.length]);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, currentTranscript]);

    const handleTranscript = (text: string, isFinal: boolean) => {
        if (isFinal) {
            // Add final message
            const newMessage: ChatMessage = {
                id: `user-${Date.now()}`,
                role: 'user',
                content: text,
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, newMessage]);
            setCurrentTranscript('');
            onUserResponse(text);
        } else {
            setCurrentTranscript(text);
        }
    };

    const handleTextSubmit = () => {
        if (!textInput.trim()) return;

        const newMessage: ChatMessage = {
            id: `user-${Date.now()}`,
            role: 'user',
            content: textInput.trim(),
            timestamp: new Date(),
        };
        setMessages(prev => [...prev, newMessage]);
        onUserResponse(textInput.trim());
        setTextInput('');
    };

    const addStudentMessage = (content: string) => {
        const newMessage: ChatMessage = {
            id: `student-${Date.now()}`,
            role: 'student',
            content,
            timestamp: new Date(),
        };
        setMessages(prev => [...prev, newMessage]);
    };

    // Expose method to parent
    useEffect(() => {
        (window as any).__addStudentMessage = addStudentMessage;
        return () => {
            delete (window as any).__addStudentMessage;
        };
    }, []);

    return (
        <div className={cn('flex flex-col h-full', className)}>
            {/* Messages area */}
            <div className="flex-1 overflow-y-auto space-y-4 p-4 min-h-[300px] max-h-[400px]">
                <AnimatePresence>
                    {messages.map((message) => (
                        <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className={cn(
                                'flex gap-3',
                                message.role === 'user' && 'justify-end'
                            )}
                        >
                            {message.role === 'student' && (
                                <SpeakingAvatar
                                    isSpeaking={isSpeaking && messages[messages.length - 1]?.id === message.id}
                                    name="AI"
                                />
                            )}

                            <div className={cn(
                                'rounded-2xl p-4 max-w-[80%]',
                                message.role === 'student'
                                    ? 'rounded-tl-none bg-white/5 border border-white/10'
                                    : 'rounded-tr-none bg-cyan-500/20 border border-cyan-500/30'
                            )}>
                                <p className="text-sm text-slate-300 leading-relaxed">
                                    {message.content}
                                </p>

                                {/* Auto-speak student messages */}
                                {message.role === 'student' && messages[messages.length - 1]?.id === message.id && (
                                    <AutoSpeakText
                                        text={message.content}
                                        onEnd={() => setIsSpeaking(false)}
                                    />
                                )}
                            </div>

                            {message.role === 'user' && (
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center text-sm font-medium flex-shrink-0">
                                    You
                                </div>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Interim transcript */}
                {currentTranscript && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex gap-3 justify-end"
                    >
                        <div className="rounded-2xl rounded-tr-none bg-cyan-500/10 border border-cyan-500/20 p-4 max-w-[80%]">
                            <p className="text-sm text-cyan-400/70 italic">
                                {currentTranscript}...
                            </p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center text-sm font-medium flex-shrink-0 animate-pulse">
                            You
                        </div>
                    </motion.div>
                )}

                {/* Processing indicator */}
                {isProcessing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex gap-3"
                    >
                        <SpeakingAvatar isSpeaking={false} name="AI" />
                        <div className="rounded-2xl rounded-tl-none bg-white/5 border border-white/10 p-4">
                            <div className="flex gap-1">
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                            </div>
                        </div>
                    </motion.div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="border-t border-white/10 p-4 space-y-4">
                {/* Mode toggle */}
                <div className="flex items-center justify-center gap-2">
                    <Button
                        size="sm"
                        variant={inputMode === 'voice' ? 'default' : 'ghost'}
                        onClick={() => setInputMode('voice')}
                        className="gap-2"
                    >
                        <Mic className="h-4 w-4" />
                        Voice
                    </Button>
                    <Button
                        size="sm"
                        variant={inputMode === 'text' ? 'default' : 'ghost'}
                        onClick={() => {
                            setInputMode('text');
                            setTimeout(() => textInputRef.current?.focus(), 100);
                        }}
                        className="gap-2"
                    >
                        <Keyboard className="h-4 w-4" />
                        Text
                    </Button>
                </div>

                {/* Voice input */}
                {inputMode === 'voice' && (
                    <VoiceRecorder
                        onTranscript={handleTranscript}
                        onRecordingStart={() => setIsRecording(true)}
                        onRecordingEnd={() => setIsRecording(false)}
                        disabled={isProcessing}
                    />
                )}

                {/* Text input */}
                {inputMode === 'text' && (
                    <div className="flex gap-2">
                        <textarea
                            ref={textInputRef}
                            value={textInput}
                            onChange={(e) => setTextInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleTextSubmit();
                                }
                            }}
                            placeholder="Type your explanation..."
                            className="flex-1 min-h-[80px] rounded-xl border border-white/10 bg-[#101B2D] p-3 text-white placeholder:text-slate-500 resize-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none"
                            disabled={isProcessing}
                        />
                        <Button
                            onClick={handleTextSubmit}
                            disabled={!textInput.trim() || isProcessing}
                            className="self-end"
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                )}

                {/* Hint button */}
                {onRequestHint && (
                    <div className="flex justify-center">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onRequestHint}
                            disabled={isProcessing}
                            className="gap-2 text-amber-400 hover:text-amber-300"
                        >
                            <Lightbulb className="h-4 w-4" />
                            Need a hint?
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}

// Export message type for use in other components
// ChatMessage type is exported from the interface definition above
