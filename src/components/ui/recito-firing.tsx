'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface RecitoFiringProps {
    trigger: boolean;
    onComplete?: () => void;
    intensity?: 'low' | 'medium' | 'high';
    className?: string;
}

// Connection/neuron points for the animation
const connectionPoints = [
    { x: 20, y: 50 },
    { x: 40, y: 20 },
    { x: 60, y: 80 },
    { x: 80, y: 30 },
    { x: 50, y: 50 },
    { x: 30, y: 70 },
    { x: 70, y: 60 },
];

// Generate paths between points
function generatePaths() {
    const paths: { from: number; to: number }[] = [];
    for (let i = 0; i < connectionPoints.length; i++) {
        for (let j = i + 1; j < connectionPoints.length; j++) {
            if (Math.random() > 0.5) {
                paths.push({ from: i, to: j });
            }
        }
    }
    return paths;
}

export function RecitoFiring({
    trigger,
    onComplete,
    intensity = 'medium',
    className = '',
}: RecitoFiringProps) {
    const [isAnimating, setIsAnimating] = useState(false);
    const [paths] = useState(generatePaths());

    const particleCount = intensity === 'low' ? 10 : intensity === 'medium' ? 20 : 30;
    const duration = intensity === 'low' ? 1 : intensity === 'medium' ? 1.5 : 2;

    useEffect(() => {
        if (trigger) {
            setIsAnimating(true);
            const timer = setTimeout(() => {
                setIsAnimating(false);
                onComplete?.();
            }, duration * 1000);
            return () => clearTimeout(timer);
        }
    }, [trigger, duration, onComplete]);

    if (!isAnimating) return null;

    return (
        <div className={`fixed inset-0 pointer-events-none z-50 overflow-hidden ${className}`}>
            {/* Central burst */}
            <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0, 1, 0], scale: [0, 2, 3] }}
                transition={{ duration: duration * 0.8, ease: 'easeOut' }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-gradient-to-br from-cyan-500/30 via-violet-500/20 to-transparent blur-2xl"
            />

            {/* Connection lines SVG */}
            <svg className="absolute inset-0 w-full h-full">
                {paths.map((path, i) => {
                    const from = connectionPoints[path.from];
                    const to = connectionPoints[path.to];
                    return (
                        <motion.line
                            key={i}
                            x1={`${from.x}%`}
                            y1={`${from.y}%`}
                            x2={`${to.x}%`}
                            y2={`${to.y}%`}
                            stroke="url(#recito-gradient)"
                            strokeWidth="2"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{
                                pathLength: [0, 1],
                                opacity: [0, 1, 0],
                            }}
                            transition={{
                                duration: duration * 0.6,
                                delay: i * 0.05,
                                ease: 'easeOut',
                            }}
                        />
                    );
                })}
                <defs>
                    <linearGradient id="recito-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#22d3ee" />
                        <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                </defs>
            </svg>

            {/* Node points */}
            {connectionPoints.map((point, i) => (
                <motion.div
                    key={i}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                        scale: [0, 1.5, 1],
                        opacity: [0, 1, 0],
                    }}
                    transition={{
                        duration: duration,
                        delay: i * 0.08,
                        ease: 'easeOut',
                    }}
                    style={{
                        left: `${point.x}%`,
                        top: `${point.y}%`,
                    }}
                    className="absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 shadow-[0_0_20px_rgba(34,211,238,0.5)]"
                />
            ))}

            {/* Particles */}
            {[...Array(particleCount)].map((_, i) => {
                const angle = (Math.PI * 2 * i) / particleCount;
                const radius = 100 + Math.random() * 200;
                const endX = Math.cos(angle) * radius;
                const endY = Math.sin(angle) * radius;

                return (
                    <motion.div
                        key={i}
                        initial={{
                            x: '50vw',
                            y: '50vh',
                            scale: 1,
                            opacity: 1,
                        }}
                        animate={{
                            x: `calc(50vw + ${endX}px)`,
                            y: `calc(50vh + ${endY}px)`,
                            scale: 0,
                            opacity: 0,
                        }}
                        transition={{
                            duration: duration * 0.8,
                            delay: Math.random() * 0.2,
                            ease: 'easeOut',
                        }}
                        className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500"
                        style={{
                            boxShadow: '0 0 10px rgba(34, 211, 238, 0.8)',
                        }}
                    />
                );
            })}

            {/* "Recito!" text flash */}
            <motion.div
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={{
                    opacity: [0, 1, 1, 0],
                    scale: [0.5, 1.1, 1, 1],
                    y: [20, 0, 0, -20],
                }}
                transition={{
                    duration: duration,
                    times: [0, 0.2, 0.8, 1],
                    ease: 'easeOut',
                }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            >
                <span className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(34,211,238,0.5)]">
                    Recito!
                </span>
            </motion.div>
        </div>
    );
}

// Hook to easily trigger the animation
export function useRecitoFiring() {
    const [trigger, setTrigger] = useState(false);

    const fire = () => {
        setTrigger(true);
        setTimeout(() => setTrigger(false), 100);
    };

    return { trigger, fire };
}

// Success stamp animation component
export function StampApproval({
    show,
    type = 'approved',
    onComplete,
}: {
    show: boolean;
    type?: 'approved' | 'excellent' | 'perfect';
    onComplete?: () => void;
}) {
    const stamps = {
        approved: { text: 'APPROVED', color: 'from-green-400 to-emerald-500', bgColor: 'bg-green-500/20' },
        excellent: { text: 'EXCELLENT', color: 'from-cyan-400 to-blue-500', bgColor: 'bg-cyan-500/20' },
        perfect: { text: 'PERFECT!', color: 'from-violet-400 to-purple-500', bgColor: 'bg-violet-500/20' },
    };

    const stamp = stamps[type];

    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => onComplete?.(), 1500);
            return () => clearTimeout(timer);
        }
    }, [show, onComplete]);

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0, scale: 3, rotate: -15 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 15,
                    }}
                    className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
                >
                    <div className={`relative p-8 rounded-2xl border-4 border-dashed ${stamp.bgColor} backdrop-blur-sm`}>
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className={`text-5xl md:text-7xl font-black bg-gradient-to-r ${stamp.color} bg-clip-text text-transparent tracking-wider`}
                            style={{
                                textShadow: '0 0 40px rgba(34, 211, 238, 0.3)',
                            }}
                        >
                            {stamp.text}
                        </motion.span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
