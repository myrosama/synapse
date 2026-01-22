import { MiniExercise } from '@/lib/types';

// Question categories
export type QuestionCategory = 'SAT' | 'IELTS' | 'Grammar' | 'Vocabulary' | 'Reading';
export type QuestionDifficulty = 'easy' | 'medium' | 'hard';

export interface TestQuestion {
    id: string;
    question: string;
    type: 'multiple-choice' | 'fill-blank' | 'true-false';
    options?: string[];
    correctAnswer: string;
    explanation: string;
    category: QuestionCategory;
    difficulty: QuestionDifficulty;
    topic: string;
    timeLimit?: number; // seconds
}

export interface TestResult {
    questionId: string;
    userAnswer: string;
    isCorrect: boolean;
    timeTaken: number;
}

// Question bank with categorized hard questions
export const questionBank: TestQuestion[] = [
    // SAT Questions
    {
        id: 'sat-1',
        question: 'Choose the word that best completes the sentence: The scientist\'s theory was so _______ that even experts struggled to understand it.',
        type: 'multiple-choice',
        options: ['abstruse', 'transparent', 'mundane', 'prevalent'],
        correctAnswer: 'abstruse',
        explanation: '"Abstruse" means difficult to understand or obscure. The context clue "even experts struggled to understand" indicates something complex.',
        category: 'SAT',
        difficulty: 'hard',
        topic: 'Vocabulary in Context',
        timeLimit: 60,
    },
    {
        id: 'sat-2',
        question: 'The author\'s primary purpose in the passage is to:',
        type: 'multiple-choice',
        options: [
            'Criticize a widely accepted theory',
            'Present evidence for a new hypothesis',
            'Compare two contrasting viewpoints',
            'Define a technical term for general readers'
        ],
        correctAnswer: 'Present evidence for a new hypothesis',
        explanation: 'Reading comprehension questions require analyzing the text structure and author\'s intent.',
        category: 'SAT',
        difficulty: 'medium',
        topic: 'Reading Comprehension',
        timeLimit: 90,
    },
    {
        id: 'sat-3',
        question: 'Which choice provides the most logical conclusion to the paragraph?',
        type: 'multiple-choice',
        options: [
            'Therefore, the experiment yielded unexpected results.',
            'However, further research is necessary.',
            'In conclusion, the hypothesis was confirmed.',
            'Consequently, scientists abandoned the theory.'
        ],
        correctAnswer: 'However, further research is necessary.',
        explanation: 'Transition words and logical flow are key to SAT writing questions.',
        category: 'SAT',
        difficulty: 'medium',
        topic: 'Writing & Language',
        timeLimit: 45,
    },

    // IELTS Questions
    {
        id: 'ielts-1',
        question: 'Complete the sentence: If I _______ (know) about the meeting, I would have attended.',
        type: 'fill-blank',
        correctAnswer: 'had known',
        explanation: 'This is a third conditional sentence expressing regret about a past situation. The structure is: If + past perfect, would have + past participle.',
        category: 'IELTS',
        difficulty: 'hard',
        topic: 'Conditionals',
        timeLimit: 30,
    },
    {
        id: 'ielts-2',
        question: 'Choose the correct option: The number of students _______ increased significantly.',
        type: 'multiple-choice',
        options: ['has', 'have', 'are', 'is'],
        correctAnswer: 'has',
        explanation: '"The number of" takes a singular verb (has), while "a number of" takes a plural verb.',
        category: 'IELTS',
        difficulty: 'medium',
        topic: 'Subject-Verb Agreement',
        timeLimit: 30,
    },
    {
        id: 'ielts-3',
        question: 'The graph shows a _______ increase in temperature over the decade.',
        type: 'multiple-choice',
        options: ['gradual', 'gradually', 'graduation', 'graduate'],
        correctAnswer: 'gradual',
        explanation: 'An adjective is needed before the noun "increase". "Gradual" is the adjective form.',
        category: 'IELTS',
        difficulty: 'easy',
        topic: 'Word Forms',
        timeLimit: 20,
    },

    // Grammar Questions
    {
        id: 'gram-1',
        question: 'Identify the error: "Neither the students nor the teacher were prepared for the exam."',
        type: 'multiple-choice',
        options: [
            'No error',
            '"were" should be "was"',
            '"Neither" should be "Either"',
            '"nor" should be "or"'
        ],
        correctAnswer: '"were" should be "was"',
        explanation: 'With "neither...nor" and "either...or", the verb agrees with the nearest subject. "Teacher" is singular, so "was" is correct.',
        category: 'Grammar',
        difficulty: 'hard',
        topic: 'Subject-Verb Agreement',
        timeLimit: 45,
    },
    {
        id: 'gram-2',
        question: 'Choose the correct relative pronoun: The book _______ I borrowed from the library is excellent.',
        type: 'multiple-choice',
        options: ['which', 'who', 'whose', 'whom'],
        correctAnswer: 'which',
        explanation: '"Which" is used for things. "Who/whom" for people, "whose" for possession.',
        category: 'Grammar',
        difficulty: 'easy',
        topic: 'Relative Clauses',
        timeLimit: 25,
    },
    {
        id: 'gram-3',
        question: 'Select the correct form: By this time next year, I _______ my degree.',
        type: 'multiple-choice',
        options: [
            'will complete',
            'will have completed',
            'am completing',
            'have completed'
        ],
        correctAnswer: 'will have completed',
        explanation: 'Future perfect tense is used for actions that will be completed before a specific point in the future.',
        category: 'Grammar',
        difficulty: 'medium',
        topic: 'Future Tenses',
        timeLimit: 30,
    },

    // Vocabulary Questions
    {
        id: 'vocab-1',
        question: 'What is the meaning of "ephemeral"?',
        type: 'multiple-choice',
        options: ['Permanent', 'Short-lived', 'Mysterious', 'Expensive'],
        correctAnswer: 'Short-lived',
        explanation: '"Ephemeral" means lasting for a very short time. Example: "Fame can be ephemeral."',
        category: 'Vocabulary',
        difficulty: 'hard',
        topic: 'Advanced Vocabulary',
        timeLimit: 30,
    },
    {
        id: 'vocab-2',
        question: 'Choose the synonym for "ubiquitous":',
        type: 'multiple-choice',
        options: ['Rare', 'Everywhere', 'Unique', 'Ancient'],
        correctAnswer: 'Everywhere',
        explanation: '"Ubiquitous" means present, appearing, or found everywhere.',
        category: 'Vocabulary',
        difficulty: 'medium',
        topic: 'Synonyms',
        timeLimit: 25,
    },
    {
        id: 'vocab-3',
        question: 'The antonym of "benevolent" is:',
        type: 'multiple-choice',
        options: ['Kind', 'Malevolent', 'Generous', 'Helpful'],
        correctAnswer: 'Malevolent',
        explanation: '"Benevolent" means well-meaning and kind. Its opposite is "malevolent" (having ill will).',
        category: 'Vocabulary',
        difficulty: 'medium',
        topic: 'Antonyms',
        timeLimit: 25,
    },

    // Reading Comprehension
    {
        id: 'read-1',
        question: 'In academic writing, "however" is used to:',
        type: 'multiple-choice',
        options: [
            'Add similar information',
            'Introduce a contrasting idea',
            'Give an example',
            'Conclude an argument'
        ],
        correctAnswer: 'Introduce a contrasting idea',
        explanation: '"However" is a transition word used to introduce a contrast or opposing viewpoint.',
        category: 'Reading',
        difficulty: 'easy',
        topic: 'Discourse Markers',
        timeLimit: 20,
    },
    {
        id: 'read-2',
        question: 'What does "the author implies" mean in reading questions?',
        type: 'multiple-choice',
        options: [
            'What the author directly states',
            'What can be inferred from the text',
            'What the reader thinks',
            'What is commonly believed'
        ],
        correctAnswer: 'What can be inferred from the text',
        explanation: '"Implies" means suggests indirectly. The answer won\'t be stated directly but can be understood from context.',
        category: 'Reading',
        difficulty: 'medium',
        topic: 'Inference',
        timeLimit: 30,
    },
];

// Get questions by category
export function getQuestionsByCategory(category: QuestionCategory): TestQuestion[] {
    return questionBank.filter(q => q.category === category);
}

// Get questions by difficulty
export function getQuestionsByDifficulty(difficulty: QuestionDifficulty): TestQuestion[] {
    return questionBank.filter(q => q.difficulty === difficulty);
}

// Get random questions for a quiz
export function getRandomQuestions(count: number, category?: QuestionCategory): TestQuestion[] {
    let pool = category ? getQuestionsByCategory(category) : [...questionBank];
    const shuffled = pool.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

// Calculate score
export function calculateScore(results: TestResult[]): { score: number; correct: number; total: number } {
    const correct = results.filter(r => r.isCorrect).length;
    const total = results.length;
    const score = Math.round((correct / total) * 100);
    return { score, correct, total };
}
