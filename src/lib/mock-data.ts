import { User, Topic, Lesson, Session, LanguageLevel, TopicCategory } from './types';

// Mock user
export const mockUser: User = {
    id: 'user-1',
    name: 'Alex Chen',
    email: 'alex.chen@example.com',
    level: 'B1',
    goal: 'IELTS',
    nativeLanguage: 'Spanish',
    streakDays: 6,
    totalSessions: 24,
    avatarUrl: undefined,
};

// Mock topics
export const mockTopics: Topic[] = [
    {
        id: 'topic-1',
        title: 'Present Perfect vs Past Simple',
        category: 'Grammar',
        level: 'B1',
        estimatedMinutes: 10,
        tags: ['tenses', 'verbs', 'common-mistakes'],
        starred: true,
    },
    {
        id: 'topic-2',
        title: 'Conditional Sentences Type 2',
        category: 'Grammar',
        level: 'B1',
        estimatedMinutes: 12,
        tags: ['conditionals', 'hypothetical', 'if-clauses'],
        starred: false,
    },
    {
        id: 'topic-3',
        title: 'Academic Writing: Cohesive Devices',
        category: 'Writing',
        level: 'B2',
        estimatedMinutes: 15,
        tags: ['academic', 'linking-words', 'paragraphs'],
        starred: true,
    },
    {
        id: 'topic-4',
        title: 'Phrasal Verbs with "Get"',
        category: 'Vocabulary',
        level: 'B1',
        estimatedMinutes: 8,
        tags: ['phrasal-verbs', 'informal', 'get'],
        starred: false,
    },
    {
        id: 'topic-5',
        title: 'Expressing Opinions Politely',
        category: 'Speaking',
        level: 'B1',
        estimatedMinutes: 10,
        tags: ['fluency', 'formal', 'debate'],
        starred: false,
    },
    {
        id: 'topic-6',
        title: 'Articles: A, An, and The',
        category: 'Grammar',
        level: 'A2',
        estimatedMinutes: 8,
        tags: ['articles', 'determiners', 'basics'],
        starred: false,
    },
    {
        id: 'topic-7',
        title: 'Reported Speech',
        category: 'Grammar',
        level: 'B2',
        estimatedMinutes: 12,
        tags: ['reporting', 'say-tell', 'tense-shift'],
        starred: false,
    },
    {
        id: 'topic-8',
        title: 'Business English: Email Etiquette',
        category: 'Writing',
        level: 'B2',
        estimatedMinutes: 10,
        tags: ['business', 'formal', 'professional'],
        starred: false,
    },
];

// Mock lesson for Present Perfect vs Past Simple
export const mockLesson: Lesson = {
    id: 'lesson-1',
    topicId: 'topic-1',
    title: 'Present Perfect vs Past Simple',
    sections: [
        {
            heading: 'When to Use Present Perfect',
            content: 'Use present perfect when the exact time of the action is not important, or when the action has a connection to the present moment.',
            examples: [
                'I have visited Paris three times. (experience, time not specified)',
                'She has lost her keys. (result affects now: she can\'t get in)',
                'We have lived here since 2020. (started in past, continues now)',
            ],
        },
        {
            heading: 'When to Use Past Simple',
            content: 'Use past simple when you are talking about a completed action at a specific time in the past. The time is often mentioned or clear from context.',
            examples: [
                'I visited Paris last summer. (specific time: last summer)',
                'She lost her keys yesterday. (specific time: yesterday)',
                'We moved here in 2020. (specific time: 2020)',
            ],
        },
        {
            heading: 'Key Signal Words',
            content: 'Certain words often indicate which tense to use.',
            examples: [
                'Present Perfect: ever, never, already, yet, just, since, for, recently',
                'Past Simple: yesterday, last week, ago, in 2019, when I was young',
            ],
        },
    ],
    commonMistake: 'Using present perfect with specific past times: "I have seen him yesterday" ❌ → "I saw him yesterday" ✓',
    miniExercises: [
        {
            question: 'Choose the correct form: "I _____ to London last year."',
            type: 'multiple-choice',
            options: ['have been', 'went', 'have gone', 'was going'],
            correctAnswer: 'went',
            explanation: 'We use past simple with "last year" because it\'s a specific past time.',
        },
        {
            question: 'Choose the correct form: "She _____ her homework yet."',
            type: 'multiple-choice',
            options: ['didn\'t finish', 'hasn\'t finished', 'not finished', 'don\'t finish'],
            correctAnswer: 'hasn\'t finished',
            explanation: 'We use present perfect with "yet" because it indicates an action expected but not completed.',
        },
    ],
};

// Mock Q&A for teach-back
export const mockQuestions: string[] = [
    'Can you give me an example of when I would use present perfect instead of past simple?',
    'What if I want to say something happened "already"? Which tense should I use?',
    'I\'m confused about "since" and "for". Can you explain the difference?',
    'Why can\'t I say "I have seen that movie yesterday"?',
    'How do I know if the action is connected to the present?',
];

// Mock completed session
export const mockCompletedSession: Session = {
    id: 'session-1',
    date: '2026-01-17T14:30:00Z',
    topicId: 'topic-1',
    topic: mockTopics[0],
    level: 'B1',
    lesson: mockLesson,
    userExplanation: 'Present perfect is when action still matters now. Like "I have lost my keys" means I still don\'t have them. Past simple is for finished things with exact time, like "I lost my keys yesterday".',
    qaTranscript: [
        {
            question: 'Can you give me an example of when I would use present perfect instead of past simple?',
            answer: 'You use present perfect when you don\'t say exactly when. Like "I have been to Japan" - you don\'t say when, just that it happened.',
        },
        {
            question: 'What if I want to say something happened "already"? Which tense should I use?',
            answer: 'Use present perfect with already. "I have already finished my homework."',
        },
        {
            question: 'Why can\'t I say "I have seen that movie yesterday"?',
            answer: 'Because yesterday is a specific time, so you have to use past simple. Say "I saw that movie yesterday."',
        },
    ],
    scores: {
        correctness: 85,
        coverage: 75,
        clarity: 80,
        english: 70,
    },
    totalScore: 78,
    missingPoints: [
        'Did not mention the connection between present perfect and phrases like "since" and "for"',
        'Could expand on when experiences are relevant to use present perfect',
    ],
    corrections: [
        {
            bad: 'Present perfect is when action still matters now',
            good: 'We use the present perfect when an action has a connection to the present moment',
            why: 'More precise and uses correct grammatical terms',
        },
        {
            bad: 'past simple is for finished things',
            good: 'Past simple is used for completed actions at a specific time in the past',
            why: 'More formal and complete description',
        },
    ],
    improvedExplanation: 'The present perfect tense is used when an action has a connection to the present moment—either because the time isn\'t specified, the action continues to now, or the result still matters. For example, "I have lost my keys" suggests I still can\'t find them. In contrast, past simple is used for completed actions at a specific past time. "I lost my keys yesterday" mentions exactly when it happened. Key words like "already," "yet," and "ever" signal present perfect, while "yesterday," "last week," and "ago" signal past simple.',
    nextLessonSuggestion: mockTopics[1],
    status: 'completed',
};

// Mock sessions list
export const mockSessions: Session[] = [
    mockCompletedSession,
    {
        ...mockCompletedSession,
        id: 'session-2',
        date: '2026-01-15T10:00:00Z',
        topicId: 'topic-4',
        topic: mockTopics[3],
        totalScore: 82,
        status: 'completed',
    },
    {
        ...mockCompletedSession,
        id: 'session-3',
        date: '2026-01-13T16:45:00Z',
        topicId: 'topic-6',
        topic: mockTopics[5],
        totalScore: 65,
        status: 'completed',
    },
];

// Helper functions
export function getTopicsByCategory(category: TopicCategory): Topic[] {
    return mockTopics.filter(t => t.category === category);
}

export function getTopicsByLevel(level: LanguageLevel): Topic[] {
    return mockTopics.filter(t => t.level === level);
}

export function searchTopics(query: string): Topic[] {
    const q = query.toLowerCase();
    return mockTopics.filter(t =>
        t.title.toLowerCase().includes(q) ||
        t.tags.some(tag => tag.toLowerCase().includes(q))
    );
}
