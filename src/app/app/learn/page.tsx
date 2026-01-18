import { Suspense } from 'react';
import LearnClient from './learn-client';
import { SkeletonLesson } from '@/components/ui/skeleton';

export default function LearnPage() {
    return (
        <Suspense fallback={
            <div className="max-w-4xl mx-auto space-y-6">
                <SkeletonLesson />
            </div>
        }>
            <LearnClient />
        </Suspense>
    );
}
