// User types
export type LanguageLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export type LearningGoal = 'IELTS' | 'SAT' | 'Conversation' | 'School' | 'Business';

export interface User {
    id: string;
    name: string;
    email: string;
    level: LanguageLevel;
    goal: LearningGoal;
    nativeLanguage: string;
    streakDays: number;
    totalSessions: number;
    avatarUrl?: string;
}

// Topic and lesson types
export type TopicCategory = 'Grammar' | 'Vocabulary' | 'Speaking' | 'Writing';

export interface Topic {
    id: string;
    title: string;
    category: TopicCategory;
    level: LanguageLevel;
    estimatedMinutes: number;
    tags: string[];
    starred?: boolean;
}

export interface LessonSection {
    heading: string;
    content: string;
    examples: string[];
}

export interface MiniExercise {
    question: string;
    type: 'multiple-choice' | 'short-input';
    options?: string[];
    correctAnswer: string;
    explanation: string;
}

export interface Lesson {
    id: string;
    topicId: string;
    title: string;
    sections: LessonSection[];
    commonMistake: string;
    miniExercises: MiniExercise[];
}

// Session types
export interface QAItem {
    question: string;
    answer: string;
    coachNote?: string;
    hintUsed?: boolean;
    skipped?: boolean;
}

export interface Scores {
    correctness: number;
    coverage: number;
    clarity: number;
    english: number;
}

export interface Correction {
    bad: string;
    good: string;
    why: string;
}

export type SessionStatus = 'in_progress' | 'completed';

export interface Session {
    id: string;
    date: string;
    topicId: string;
    topic: Topic;
    level: LanguageLevel;
    lesson: Lesson;
    userExplanation: string;
    qaTranscript: QAItem[];
    scores: Scores;
    totalScore: number;
    missingPoints: string[];
    corrections: Correction[];
    improvedExplanation: string;
    nextLessonSuggestion: Topic;
    status: SessionStatus;
    currentStep?: number;
}

// Learn flow types
export interface LearnSessionState {
    step: number;
    topicId?: string;
    topic?: Topic;
    sessionLength: number;
    showHints: boolean;
    strictCorrections: boolean;
    harderQuestions: boolean;
    lesson?: Lesson;
    userExplanation?: string;
    qaTranscript: QAItem[];
    currentQuestionIndex: number;
    scores?: Scores;
    feedback?: {
        totalScore: number;
        grade: string;
        topFixes: string[];
        corrections: Correction[];
        missingPoints: string[];
        improvedExplanation: string;
        nextSuggestion: Topic;
    };
}

// Auth types
export interface AuthFormData {
    name?: string;
    email: string;
    password: string;
    confirmPassword?: string;
    rememberMe?: boolean;
}
