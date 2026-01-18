'use client';

import { cn } from '@/lib/utils';

interface SynapseLogoProps {
    className?: string;
    showText?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

export function SynapseLogo({ className, showText = true, size = 'md' }: SynapseLogoProps) {
    const sizes = {
        sm: { icon: 24, text: 'text-lg' },
        md: { icon: 32, text: 'text-xl' },
        lg: { icon: 48, text: 'text-3xl' },
    };

    const { icon, text } = sizes[size];

    return (
        <div className={cn('flex items-center gap-2', className)}>
            {/* Neural node icon */}
            <svg
                width={icon}
                height={icon}
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="flex-shrink-0"
            >
                {/* Connections */}
                <line
                    x1="12"
                    y1="24"
                    x2="36"
                    y2="12"
                    stroke="url(#gradient1)"
                    strokeWidth="2"
                    strokeLinecap="round"
                />
                <line
                    x1="12"
                    y1="24"
                    x2="36"
                    y2="36"
                    stroke="url(#gradient1)"
                    strokeWidth="2"
                    strokeLinecap="round"
                />
                <line
                    x1="36"
                    y1="12"
                    x2="36"
                    y2="36"
                    stroke="url(#gradient1)"
                    strokeWidth="2"
                    strokeLinecap="round"
                />

                {/* Nodes */}
                <circle cx="12" cy="24" r="6" fill="#22D3EE" />
                <circle cx="36" cy="12" r="5" fill="#8B5CF6" />
                <circle cx="36" cy="36" r="5" fill="#8B5CF6" />

                {/* Node inner glow */}
                <circle cx="12" cy="24" r="3" fill="#0B1220" opacity="0.3" />
                <circle cx="36" cy="12" r="2.5" fill="#0B1220" opacity="0.3" />
                <circle cx="36" cy="36" r="2.5" fill="#0B1220" opacity="0.3" />

                <defs>
                    <linearGradient id="gradient1" x1="12" y1="24" x2="36" y2="24" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#22D3EE" />
                        <stop offset="1" stopColor="#8B5CF6" />
                    </linearGradient>
                </defs>
            </svg>

            {showText && (
                <span className={cn('font-semibold tracking-tight', text)}>
                    <span className="text-cyan-400">Syn</span>
                    <span className="text-white">apse</span>
                </span>
            )}
        </div>
    );
}
