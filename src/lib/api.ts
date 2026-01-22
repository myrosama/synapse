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

// Voice Conversation API
const studentQuestions = [
    "I'm struggling to understand when to use present perfect instead of past simple. Can you explain?",
    "So if I say 'I ate breakfast' vs 'I have eaten breakfast', what's the difference? When would I use each?",
    "What about with words like 'yesterday' or 'last week'? Can I use present perfect with those?",
    "Hmm, I think I get it. But what if I want to say I did something recently but I don't say when exactly?",
    "Oh! So it's about whether the exact time matters or not? Can you give me one more example to make sure I understand?",
];

const followUpQuestions = [
    "That helps, but can you give me a specific example?",
    "I see, but why does that matter for choosing the tense?",
    "Okay, what about this sentence: 'I've seen that movie yesterday' - is that correct?",
    "Got it! So the connection to 'now' is the key difference?",
    "Thanks! I think I understand now. Just to confirm: 'I have lived here for 5 years' means I still live here, right?",
];

const understandingResponses = [
    { understood: false, message: "I'm not quite sure I follow. Can you explain it differently?" },
    { understood: false, message: "Hmm, could you give me an example to make it clearer?" },
    { understood: true, message: "Oh, that makes sense! So it's about the connection to the present moment." },
    { understood: true, message: "I get it now! The specific time vs. the result/experience distinction." },
];

export async function getStudentInitialQuestion(topicId: string): Promise<string> {
    await randomDelay(500, 1000);
    // Return a question based on topic - for now use the first one
    return studentQuestions[0];
}

export async function getStudentFollowUp(
    transcript: { role: 'user' | 'student'; content: string }[],
    userResponse: string
): Promise<{
    question: string;
    understood: boolean;
    feedbackNote?: string;
}> {
    await randomDelay(600, 1200);

    const exchangeCount = transcript.filter(m => m.role === 'user').length;
    const wordCount = userResponse.split(' ').length;

    // Dynamic follow-up questions based on conversation depth
    const dynamicQuestions = [
        "Hmm, that's interesting! Can you give me a specific example to help me understand better?",
        "I think I'm starting to get it. But what would happen in this situation: if I said 'I eat breakfast' vs 'I have eaten breakfast', what's the difference?",
        "Oh! So the time matters? What about words like 'already' or 'just' - which tense do they go with?",
        "That makes more sense now. So if I want to talk about my life experiences, which tense should I use?",
        "Wait, I have another question - can you explain what 'signal words' are? My teacher mentioned them.",
        "I see! So 'since' and 'for' are different too? Can you explain that?",
        "This is really helpful! One more thing - what about 'ever' and 'never'? When do I use those?",
    ];

    // After 6+ exchanges, student understands
    if (exchangeCount >= 6) {
        return {
            question: "Wow, thank you so much! I really understand now. The key is whether the action connects to the present moment, and specific time words tell us which tense to use. This was so helpful! 🎉",
            understood: true,
            feedbackNote: "Excellent teaching! You explained the concept thoroughly with great examples.",
        };
    }

    // If user gives short response, ask for more detail
    if (wordCount < 15 && exchangeCount < 3) {
        return {
            question: "Could you explain that a bit more? Maybe with an example? I learn better with examples.",
            understood: false,
            feedbackNote: "Try to give more detailed explanations with examples.",
        };
    }

    // Progress through follow-up questions
    const questionIndex = Math.min(exchangeCount, dynamicQuestions.length - 1);

    // Check if response quality is good enough to advance understanding
    const isGoodResponse = wordCount > 20 || userResponse.includes('example') || userResponse.includes('because');

    return {
        question: dynamicQuestions[questionIndex],
        understood: false,
        feedbackNote: isGoodResponse && exchangeCount >= 3 ? "Good explanation! Keep it up." : undefined,
    };
}

export async function evaluateVoiceSession(
    transcript: { role: 'user' | 'student'; content: string }[]
): Promise<{
    scores: Scores;
    totalScore: number;
    grade: string;
    feedback: string[];
}> {
    await randomDelay(1500, 2500);

    const userMessages = transcript.filter(m => m.role === 'user');
    const totalWords = userMessages.reduce((sum, m) => sum + m.content.split(' ').length, 0);
    const exchangeCount = userMessages.length;

    // Calculate scores based on conversation quality
    const baseScore = Math.min(95, 50 + totalWords / 5 + exchangeCount * 5);
    const scores: Scores = {
        correctness: Math.round(baseScore + Math.random() * 10),
        coverage: Math.round(baseScore - 5 + exchangeCount * 3 + Math.random() * 10),
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
        feedback: [
            exchangeCount >= 3 ? '✓ Engaged in meaningful dialogue' : '⚠ Try to provide more detailed responses',
            totalWords > 100 ? '✓ Thorough explanations' : '⚠ Expand your explanations with more examples',
            '✓ Responded to student questions',
        ],
    };
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

// Sessions API - localStorage-based
const SESSIONS_STORAGE_KEY = 'recito_sessions';

function getStoredSessions(): Session[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(SESSIONS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

function saveStoredSessions(sessions: Session[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
}

export async function fetchSessions(filters?: {
    status?: 'in_progress' | 'completed';
    dateFrom?: string;
    dateTo?: string;
}): Promise<Session[]> {
    await randomDelay(200, 400);

    let sessions = getStoredSessions();

    if (filters?.status) {
        sessions = sessions.filter(s => s.status === filters.status);
    }

    // Sort by date, newest first
    sessions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return sessions;
}

export async function fetchSession(id: string): Promise<Session | null> {
    await randomDelay(200, 400);
    const sessions = getStoredSessions();
    return sessions.find(s => s.id === id) || null;
}

export async function saveSession(session: Partial<Session>): Promise<Session> {
    await randomDelay(300, 600);

    const sessions = getStoredSessions();
    const newSession: Session = {
        ...mockCompletedSession,
        ...session,
        id: session.id || `session-${Date.now()}`,
        date: session.date || new Date().toISOString(),
        status: session.status || 'completed',
    };

    // Check if session exists and update, or add new
    const existingIndex = sessions.findIndex(s => s.id === newSession.id);
    if (existingIndex >= 0) {
        sessions[existingIndex] = newSession;
    } else {
        sessions.push(newSession);
    }

    saveStoredSessions(sessions);
    return newSession;
}

export async function deleteSession(id: string): Promise<boolean> {
    await randomDelay(200, 400);
    const sessions = getStoredSessions();
    const filtered = sessions.filter(s => s.id !== id);
    saveStoredSessions(filtered);
    return true;
}

export async function deleteAllSessions(): Promise<boolean> {
    await randomDelay(300, 500);
    saveStoredSessions([]);
    return true;
}

// Auth API with localStorage-based user management
const USERS_STORAGE_KEY = 'recito_users';

interface StoredUser {
    id: string;
    name: string;
    email: string;
    password: string;
    level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
    goal: 'IELTS' | 'SAT' | 'Conversation' | 'School' | 'Business';
    nativeLanguage: string;
    streakDays: number;
    totalSessions: number;
    createdAt: string;
}

function getStoredUsers(): StoredUser[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(USERS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

function saveStoredUsers(users: StoredUser[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

export async function signIn(email: string, password: string): Promise<User> {
    await randomDelay(800, 1500);

    const users = getStoredUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
        throw new Error('No account found with this email');
    }

    if (user.password !== password) {
        throw new Error('Invalid password');
    }

    // Return user without password
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        level: user.level,
        goal: user.goal,
        nativeLanguage: user.nativeLanguage,
        streakDays: user.streakDays,
        totalSessions: user.totalSessions,
    };
}

export async function signUp(name: string, email: string, password: string): Promise<User> {
    await randomDelay(1000, 1800);

    if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
    }

    if (!name.trim()) {
        throw new Error('Name is required');
    }

    if (!email.includes('@')) {
        throw new Error('Please enter a valid email address');
    }

    const users = getStoredUsers();

    // Check if email already exists
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error('An account with this email already exists');
    }

    const newUser: StoredUser = {
        id: `user-${Date.now()}`,
        name: name.trim(),
        email: email.toLowerCase(),
        password,
        level: 'B1',
        goal: 'IELTS',
        nativeLanguage: 'Not specified',
        streakDays: 0,
        totalSessions: 0,
        createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveStoredUsers(users);

    // Return user without password
    return {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        level: newUser.level,
        goal: newUser.goal,
        nativeLanguage: newUser.nativeLanguage,
        streakDays: newUser.streakDays,
        totalSessions: newUser.totalSessions,
    };
}

export async function signOut(): Promise<void> {
    await randomDelay(300, 500);
}

// Admin function to reset all data
export async function resetAllData(): Promise<void> {
    await randomDelay(500, 1000);
    if (typeof window === 'undefined') return;
    localStorage.removeItem('recito_users');
    localStorage.removeItem('recito_sessions');
    localStorage.removeItem('recito_auth');
    localStorage.removeItem('recito_learn_state');
}
