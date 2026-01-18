import {
    User,
    Topic,
    Lesson,
    Session,
    Scores,
    Correction,
    QAItem,
    LanguageLevel,
    TopicCategory,
} from './types';
import {
    mockUser,
    mockTopics,
    mockLesson,
    mockSessions,
    mockQuestions,
    mockCompletedSession,
} from './mock-data';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Randomize delay for realism
const randomDelay = (min: number, max: number) => delay(Math.random() * (max - min) + min);

// User API
export async function fetchUser(): Promise<User> {
    await randomDelay(300, 600);
    return mockUser;
}

export async function updateUser(updates: Partial<User>): Promise<User> {
    await randomDelay(400, 800);
    return { ...mockUser, ...updates };
}

// Topics API
export async function fetchTopics(filters?: {
    category?: TopicCategory;
    level?: LanguageLevel;
    search?: string;
}): Promise<Topic[]> {
    await randomDelay(400, 800);

    let topics = [...mockTopics];

    if (filters?.category) {
        topics = topics.filter(t => t.category === filters.category);
    }
    if (filters?.level) {
        topics = topics.filter(t => t.level === filters.level);
    }
    if (filters?.search) {
        const q = filters.search.toLowerCase();
        topics = topics.filter(t =>
            t.title.toLowerCase().includes(q) ||
            t.tags.some(tag => tag.includes(q))
        );
    }

    return topics;
}

export async function fetchTopic(id: string): Promise<Topic | null> {
    await randomDelay(200, 400);
    return mockTopics.find(t => t.id === id) || null;
}

export async function toggleStarTopic(id: string): Promise<Topic | null> {
    await randomDelay(200, 400);
    const topic = mockTopics.find(t => t.id === id);
    if (topic) {
        topic.starred = !topic.starred;
        return topic;
    }
    return null;
}

// Lesson API
export async function generateLesson(topicId: string): Promise<Lesson> {
    await randomDelay(1500, 2500); // Longer delay to simulate AI generation
    // In real app, this would call the AI backend
    return { ...mockLesson, topicId };
}

export async function regenerateLesson(topicId: string): Promise<Lesson> {
    await randomDelay(1500, 2500);
    // Returns slightly modified lesson to simulate regeneration
    return {
        ...mockLesson,
        topicId,
        sections: mockLesson.sections.map(s => ({
            ...s,
            content: s.content + ' (Regenerated with fresh examples)',
        })),
    };
}

// Teach-back & Q&A API
export async function submitExplanation(explanation: string): Promise<{ success: boolean }> {
    await randomDelay(500, 1000);
    return { success: true };
}

export async function getNextQuestion(index: number): Promise<string> {
    await randomDelay(800, 1500);
    return mockQuestions[index % mockQuestions.length];
}

export async function submitAnswer(questionIndex: number, answer: string): Promise<{
    coachNote?: string;
    accepted: boolean;
}> {
    await randomDelay(600, 1200);
    // Simulate coach feedback
    const notes = [
        'Good example! Consider adding more details.',
        'Try using a more specific time expression.',
        undefined,
        'Great clarity. You could also mention signal words.',
        undefined,
    ];
    return {
        coachNote: notes[questionIndex % notes.length],
        accepted: answer.length > 5,
    };
}

export async function getHint(questionIndex: number): Promise<string> {
    await randomDelay(300, 600);
    const hints = [
        'Think about experiences vs. specific past events.',
        'Consider words like "already" and "yet".',
        '"Since" is for a point in time, "for" is for a duration.',
        'Remember: specific time = past simple.',
        'Does the action still matter now? That\'s the key.',
    ];
    return hints[questionIndex % hints.length];
}

// Feedback API
export async function generateFeedback(
    explanation: string,
    qaTranscript: QAItem[]
): Promise<{
    scores: Scores;
    totalScore: number;
    grade: string;
    topFixes: string[];
    corrections: Correction[];
    missingPoints: string[];
    improvedExplanation: string;
    nextSuggestion: Topic;
}> {
    await randomDelay(2000, 3000); // Longer for AI feedback

    // Calculate mock scores based on input length
    const baseScore = Math.min(95, 60 + explanation.length / 10);
    const scores: Scores = {
        correctness: Math.round(baseScore + Math.random() * 10),
        coverage: Math.round(baseScore - 5 + Math.random() * 10),
        clarity: Math.round(baseScore + Math.random() * 15),
        english: Math.round(baseScore - 10 + Math.random() * 10),
    };

    const totalScore = Math.round(
        (scores.correctness + scores.coverage + scores.clarity + scores.english) / 4
    );

    let grade = 'Needs Work';
    if (totalScore >= 85) grade = 'Excellent';
    else if (totalScore >= 70) grade = 'Strong';
    else if (totalScore >= 55) grade = 'Improving';

    return {
        scores,
        totalScore,
        grade,
        topFixes: [
            'Add more specific examples with time expressions',
            'Clarify the connection to the present moment',
            'Use more formal grammar terminology',
        ],
        corrections: mockCompletedSession.corrections,
        missingPoints: mockCompletedSession.missingPoints,
        improvedExplanation: mockCompletedSession.improvedExplanation,
        nextSuggestion: mockTopics[1],
    };
}

// Sessions API
export async function fetchSessions(filters?: {
    status?: 'in_progress' | 'completed';
    dateFrom?: string;
    dateTo?: string;
}): Promise<Session[]> {
    await randomDelay(400, 800);

    let sessions = [...mockSessions];

    if (filters?.status) {
        sessions = sessions.filter(s => s.status === filters.status);
    }

    return sessions;
}

export async function fetchSession(id: string): Promise<Session | null> {
    await randomDelay(300, 600);
    return mockSessions.find(s => s.id === id) || mockCompletedSession;
}

export async function saveSession(session: Partial<Session>): Promise<Session> {
    await randomDelay(500, 1000);
    return {
        ...mockCompletedSession,
        ...session,
        id: `session-${Date.now()}`,
        date: new Date().toISOString(),
        status: 'completed',
    };
}

export async function deleteSession(id: string): Promise<boolean> {
    await randomDelay(400, 800);
    return true;
}

export async function deleteAllSessions(): Promise<boolean> {
    await randomDelay(800, 1200);
    return true;
}

// Auth API (mock)
export async function signIn(email: string, password: string): Promise<User> {
    await randomDelay(800, 1500);
    if (password.length < 6) {
        throw new Error('Invalid credentials');
    }
    return mockUser;
}

export async function signUp(name: string, email: string, password: string): Promise<User> {
    await randomDelay(1000, 1800);
    if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
    }
    return { ...mockUser, name, email };
}

export async function signOut(): Promise<void> {
    await randomDelay(300, 500);
}
