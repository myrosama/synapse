import { cn } from '@/lib/utils';
import { FileQuestion, Inbox, SearchX, AlertCircle } from 'lucide-react';
import { Button } from './button';

interface EmptyStateProps {
    icon?: 'empty' | 'search' | 'error' | 'question';
    title: string;
    description?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
    className?: string;
}

const icons = {
    empty: Inbox,
    search: SearchX,
    error: AlertCircle,
    question: FileQuestion,
};

export function EmptyState({
    icon = 'empty',
    title,
    description,
    action,
    className
}: EmptyStateProps) {
    const Icon = icons[icon];

    return (
        <div className={cn(
            'flex flex-col items-center justify-center py-12 px-6 text-center',
            className
        )}>
            <div className="rounded-full bg-white/5 p-4 mb-4">
                <Icon className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-white mb-1">{title}</h3>
            {description && (
                <p className="text-sm text-slate-400 max-w-sm mb-4">{description}</p>
            )}
            {action && (
                <Button onClick={action.onClick} size="sm">
                    {action.label}
                </Button>
            )}
        </div>
    );
}
