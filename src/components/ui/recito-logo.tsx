'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

interface RecitoLogoProps {
    className?: string;
    showText?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

export function RecitoLogo({ className, showText = true, size = 'md' }: RecitoLogoProps) {
    const sizes = {
        sm: { height: 28, width: showText ? 100 : 28 },
        md: { height: 36, width: showText ? 130 : 36 },
        lg: { height: 48, width: showText ? 170 : 48 },
    };

    const { height, width } = sizes[size];

    return (
        <div className={cn('flex items-center', className)}>
            <Image
                src="/recito-logo.png"
                alt="Recito"
                width={width}
                height={height}
                className="object-contain"
                priority
            />
        </div>
    );
}

