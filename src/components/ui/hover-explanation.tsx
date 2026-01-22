'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Info } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface HoverExplanationProps {
    label?: string;
    title: string;
    description: string;
    icon?: React.ReactNode;
    className?: string;
}

export function HoverExplanation({
    label = 'Explain',
    title,
    description,
    icon,
    className = '',
}: HoverExplanationProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={`relative inline-block ${className}`}
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            <motion.button
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 text-xs font-medium transition-colors border border-amber-500/20"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
            >
                {icon || <Lightbulb className="h-3 w-3" />}
                {label}
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 md:w-80 z-50 pointer-events-none"
                    >
                        <Card className="bg-slate-900/95 backdrop-blur-xl border-amber-500/30 shadow-2xl overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5" />
                            <div className="p-4 relative">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="p-1.5 rounded-lg bg-amber-500/20">
                                        <Lightbulb className="h-4 w-4 text-amber-400" />
                                    </div>
                                    <h4 className="font-semibold text-white text-sm">{title}</h4>
                                </div>
                                <p className="text-xs text-slate-300 leading-relaxed">
                                    {description}
                                </p>
                            </div>
                        </Card>

                        {/* Triangular arrow */}
                        <div className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-4 h-4 bg-slate-900/95 border-r border-b border-amber-500/30 rotate-45 transform" />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
