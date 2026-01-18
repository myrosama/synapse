'use client';

import * as React from 'react';
import * as ToastPrimitive from '@radix-ui/react-toast';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ToastProps {
    id: string;
    type: 'success' | 'error' | 'info';
    message: string;
    onDismiss: (id: string) => void;
}

const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
};

const styles = {
    success: 'border-green-500/30 bg-green-500/10',
    error: 'border-red-500/30 bg-red-500/10',
    info: 'border-cyan-500/30 bg-cyan-500/10',
};

const iconStyles = {
    success: 'text-green-400',
    error: 'text-red-400',
    info: 'text-cyan-400',
};

export function Toast({ id, type, message, onDismiss }: ToastProps) {
    const Icon = icons[type];

    return (
        <ToastPrimitive.Root
            className={cn(
                'flex items-center gap-3 rounded-xl border p-4 shadow-lg',
                'data-[state=open]:animate-in data-[state=closed]:animate-out',
                'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
                'data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-right-full',
                styles[type]
            )}
            duration={4000}
            onOpenChange={(open) => !open && onDismiss(id)}
        >
            <Icon className={cn('h-5 w-5 flex-shrink-0', iconStyles[type])} />
            <ToastPrimitive.Description className="text-sm text-white flex-1">
                {message}
            </ToastPrimitive.Description>
            <ToastPrimitive.Close asChild>
                <button
                    className="rounded-lg p-1 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
                    aria-label="Dismiss"
                >
                    <X className="h-4 w-4" />
                </button>
            </ToastPrimitive.Close>
        </ToastPrimitive.Root>
    );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
    return (
        <ToastPrimitive.Provider swipeDirection="right">
            {children}
            <ToastPrimitive.Viewport className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-full max-w-sm" />
        </ToastPrimitive.Provider>
    );
}

// Simple toast container that works with our store
export function ToastContainer({ toasts, onDismiss }: {
    toasts: Array<{ id: string; type: 'success' | 'error' | 'info'; message: string }>;
    onDismiss: (id: string) => void;
}) {
    return (
        <ToastProvider>
            {toasts.map((toast) => (
                <Toast key={toast.id} {...toast} onDismiss={onDismiss} />
            ))}
        </ToastProvider>
    );
}
