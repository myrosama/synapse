'use client';

import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface StepperProps {
    steps: string[];
    currentStep: number;
    className?: string;
}

export function Stepper({ steps, currentStep, className }: StepperProps) {
    return (
        <div className={cn('w-full', className)}>
            <div className="flex items-center justify-between">
                {steps.map((step, index) => {
                    const stepNumber = index + 1;
                    const isCompleted = stepNumber < currentStep;
                    const isCurrent = stepNumber === currentStep;
                    const isUpcoming = stepNumber > currentStep;

                    return (
                        <div key={step} className="flex items-center flex-1">
                            <div className="flex flex-col items-center">
                                <div
                                    className={cn(
                                        'flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300',
                                        isCompleted && 'bg-cyan-500 border-cyan-500',
                                        isCurrent && 'border-cyan-400 bg-cyan-500/20',
                                        isUpcoming && 'border-white/20 bg-transparent'
                                    )}
                                >
                                    {isCompleted ? (
                                        <Check className="h-5 w-5 text-[#0B1220]" />
                                    ) : (
                                        <span
                                            className={cn(
                                                'text-sm font-medium',
                                                isCurrent && 'text-cyan-400',
                                                isUpcoming && 'text-slate-500'
                                            )}
                                        >
                                            {stepNumber}
                                        </span>
                                    )}
                                </div>
                                <span
                                    className={cn(
                                        'mt-2 text-xs font-medium text-center max-w-[80px]',
                                        isCompleted && 'text-cyan-400',
                                        isCurrent && 'text-white',
                                        isUpcoming && 'text-slate-500'
                                    )}
                                >
                                    {step}
                                </span>
                            </div>

                            {/* Connector line */}
                            {index < steps.length - 1 && (
                                <div
                                    className={cn(
                                        'flex-1 h-0.5 mx-2 transition-colors duration-300',
                                        isCompleted ? 'bg-cyan-500' : 'bg-white/10'
                                    )}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
