import { Suspense } from 'react';
import SessionDetailClient from './session-client';
import { Skeleton, SkeletonCard } from '@/components/ui/skeleton';

// Generate static params for static export
export function generateStaticParams() {
    return [
        { id: 'session-1' },
        { id: 'session-2' },
        { id: 'session-3' },
        { id: 'session-4' },
        { id: 'session-5' },
    ];
}

// Allow fallback for unknown session IDs
export const dynamicParams = true;

export default function SessionDetailPage({ params }: { params: { id: string } }) {
    return (
        <Suspense fallback={
            <div className="max-w-4xl mx-auto space-y-6">
                <Skeleton className="h-8 w-64" />
                <SkeletonCard />
                <SkeletonCard />
            </div>
        }>
            <SessionDetailClient id={params.id} />
        </Suspense>
    );
}
