import { cn } from '@/lib/utils';

interface SkeletonProps {
    className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
    return (
        <div
            className={cn(
                'skeleton rounded-lg bg-white/5',
                className
            )}
        />
    );
}

export function SkeletonText({ className, lines = 3 }: SkeletonProps & { lines?: number }) {
    return (
        <div className={cn('space-y-2', className)}>
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton
                    key={i}
                    className={cn(
                        'h-4',
                        i === lines - 1 ? 'w-3/4' : 'w-full'
                    )}
                />
            ))}
        </div>
    );
}

export function SkeletonCard({ className }: SkeletonProps) {
    return (
        <div className={cn('rounded-2xl border border-white/8 bg-[#101B2D] p-6', className)}>
            <div className="flex items-start gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-1/3" />
                    <Skeleton className="h-4 w-2/3" />
                </div>
            </div>
            <div className="mt-4 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
            </div>
        </div>
    );
}

export function SkeletonLesson({ className }: SkeletonProps) {
    return (
        <div className={cn('space-y-6', className)}>
            <Skeleton className="h-8 w-2/3" />
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="space-y-2">
                        <Skeleton className="h-5 w-1/4" />
                        <SkeletonText lines={3} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export function SkeletonTable({ rows = 5, className }: SkeletonProps & { rows?: number }) {
    return (
        <div className={cn('space-y-3', className)}>
            <div className="flex gap-4 pb-2 border-b border-white/10">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
            </div>
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="flex gap-4 py-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-20" />
                </div>
            ))}
        </div>
    );
}
