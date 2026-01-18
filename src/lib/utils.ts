import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Merge Tailwind classes with clsx
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Format date for display
export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

// Format date with time
export function formatDateTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

// Get relative time (e.g., "2 days ago")
export function getRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return formatDate(dateString);
}

// Get score color based on value
export function getScoreColor(score: number): string {
    if (score >= 85) return 'text-green-400';
    if (score >= 70) return 'text-cyan-400';
    if (score >= 55) return 'text-amber-400';
    return 'text-red-400';
}

// Get score background color
export function getScoreBgColor(score: number): string {
    if (score >= 85) return 'bg-green-500/20';
    if (score >= 70) return 'bg-cyan-500/20';
    if (score >= 55) return 'bg-amber-500/20';
    return 'bg-red-500/20';
}

// Get grade label from score
export function getGradeLabel(score: number): string {
    if (score >= 85) return 'Excellent';
    if (score >= 70) return 'Strong';
    if (score >= 55) return 'Improving';
    return 'Needs Work';
}

// Truncate text with ellipsis
export function truncate(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '...';
}

// Get initials from name
export function getInitials(name: string): string {
    return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

// Level color mapping
export function getLevelColor(level: string): string {
    const colors: Record<string, string> = {
        A1: 'bg-emerald-500/20 text-emerald-400',
        A2: 'bg-green-500/20 text-green-400',
        B1: 'bg-cyan-500/20 text-cyan-400',
        B2: 'bg-blue-500/20 text-blue-400',
        C1: 'bg-violet-500/20 text-violet-400',
        C2: 'bg-purple-500/20 text-purple-400',
    };
    return colors[level] || 'bg-gray-500/20 text-gray-400';
}

// Category icon mapping (returns icon name for lucide-react)
export function getCategoryIcon(category: string): string {
    const icons: Record<string, string> = {
        Grammar: 'BookOpen',
        Vocabulary: 'Languages',
        Speaking: 'MessageCircle',
        Writing: 'PenTool',
    };
    return icons[category] || 'FileText';
}

// Debounce function
export function debounce<T extends (...args: unknown[]) => void>(
    fn: T,
    delay: number
): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    };
}
