// Grammar formulas and tips data

export type FormulaCategory = 'Tenses' | 'Conditionals' | 'Modals' | 'Clauses' | 'Articles' | 'Prepositions' | 'Vocabulary' | 'Writing';
export type FormulaLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface Formula {
    id: string;
    title: string;
    category: FormulaCategory;
    level: FormulaLevel;
    formula: string;
    explanation: string;
    examples: string[];
    tips: string[];
    commonMistakes?: string[];
    tags: string[];
}

export const formulas: Formula[] = [
    // TENSES
    {
        id: 'tense-1',
        title: 'Present Simple',
        category: 'Tenses',
        level: 'A1',
        formula: 'Subject + V1 (+ s/es for he/she/it)',
        explanation: 'Used for habits, routines, general truths, and permanent states.',
        examples: [
            'She works at a bank. (routine)',
            'Water boils at 100°C. (general truth)',
            'I live in London. (permanent state)',
        ],
        tips: [
            'Add -s for he/she/it: he works, she plays',
            'Add -es after s, ch, sh, x, o: he watches, she goes',
            'Change y to -ies after consonant: study → studies',
        ],
        commonMistakes: [
            '❌ He work every day → ✅ He works every day',
            '❌ She don\'t like coffee → ✅ She doesn\'t like coffee',
        ],
        tags: ['basic', 'habits', 'routines', 'facts'],
    },
    {
        id: 'tense-2',
        title: 'Present Continuous',
        category: 'Tenses',
        level: 'A1',
        formula: 'Subject + am/is/are + V-ing',
        explanation: 'Used for actions happening now or temporary situations.',
        examples: [
            'I am studying English right now.',
            'She is working from home this week.',
            'They are building a new school.',
        ],
        tips: [
            'Use time expressions: now, at the moment, currently',
            'Not used with stative verbs: know, like, want, need',
        ],
        commonMistakes: [
            '❌ I am knowing the answer → ✅ I know the answer',
            '❌ She is have breakfast → ✅ She is having breakfast',
        ],
        tags: ['now', 'temporary', 'actions'],
    },
    {
        id: 'tense-3',
        title: 'Present Perfect',
        category: 'Tenses',
        level: 'B1',
        formula: 'Subject + have/has + V3 (past participle)',
        explanation: 'Connects past to present. Used for experiences, recent events, and unfinished time periods.',
        examples: [
            'I have visited Paris three times. (experience)',
            'She has just finished her homework. (recent)',
            'We have lived here for 10 years. (unfinished)',
        ],
        tips: [
            'Use "for" with duration: for 5 years, for a long time',
            'Use "since" with starting point: since 2020, since Monday',
            'Use "just/already/yet" for recent actions',
        ],
        commonMistakes: [
            '❌ I have seen him yesterday → ✅ I saw him yesterday',
            '❌ She has went home → ✅ She has gone home',
        ],
        tags: ['experience', 'result', 'since', 'for', 'yet', 'already'],
    },
    {
        id: 'tense-4',
        title: 'Past Simple vs Past Continuous',
        category: 'Tenses',
        level: 'B1',
        formula: 'Past Simple: Subject + V2 | Past Continuous: Subject + was/were + V-ing',
        explanation: 'Past Simple for completed actions. Past Continuous for ongoing actions interrupted by another event.',
        examples: [
            'I was sleeping when the phone rang.',
            'While she was cooking, he arrived home.',
            'They were watching TV when the power went out.',
        ],
        tips: [
            'Past Continuous = background action (longer)',
            'Past Simple = interrupting action (shorter)',
            'Use "when" with Past Simple, "while" with Past Continuous',
        ],
        commonMistakes: [
            '❌ I was slept when... → ✅ I was sleeping when...',
        ],
        tags: ['past', 'interrupted', 'background', 'when', 'while'],
    },
    {
        id: 'tense-5',
        title: 'Future Tenses Overview',
        category: 'Tenses',
        level: 'B2',
        formula: 'will + V1 | am/is/are going to + V1 | Present Continuous',
        explanation: 'Different ways to express future depending on context.',
        examples: [
            'I will help you. (offer/promise/decision)',
            'I\'m going to study medicine. (plan/intention)',
            'I\'m meeting John tomorrow. (fixed arrangement)',
        ],
        tips: [
            'WILL: predictions, promises, spontaneous decisions',
            'GOING TO: plans, intentions, evidence-based predictions',
            'Present Continuous: fixed arrangements with specific time',
        ],
        commonMistakes: [
            '❌ I will to go → ✅ I will go',
        ],
        tags: ['future', 'will', 'going to', 'plans'],
    },

    // CONDITIONALS
    {
        id: 'cond-1',
        title: 'Zero Conditional',
        category: 'Conditionals',
        level: 'B1',
        formula: 'If + Present Simple, Present Simple',
        explanation: 'Used for general truths and scientific facts. "If" can be replaced with "when".',
        examples: [
            'If you heat water to 100°C, it boils.',
            'If it rains, the ground gets wet.',
            'Plants die if they don\'t get water.',
        ],
        tips: [
            'Both clauses use Present Simple',
            '"If" and "When" are often interchangeable',
        ],
        tags: ['facts', 'truths', 'scientific'],
    },
    {
        id: 'cond-2',
        title: 'First Conditional',
        category: 'Conditionals',
        level: 'B1',
        formula: 'If + Present Simple, will + V1',
        explanation: 'Used for real/possible situations in the future.',
        examples: [
            'If it rains tomorrow, I will stay home.',
            'If you study hard, you will pass the exam.',
            'I will call you if I have time.',
        ],
        tips: [
            'The result is in the future, but the condition is in present',
            'Can use might/may/can instead of will',
        ],
        commonMistakes: [
            '❌ If it will rain... → ✅ If it rains...',
        ],
        tags: ['possible', 'future', 'likely'],
    },
    {
        id: 'cond-3',
        title: 'Second Conditional',
        category: 'Conditionals',
        level: 'B2',
        formula: 'If + Past Simple, would + V1',
        explanation: 'Used for unreal/hypothetical present or future situations.',
        examples: [
            'If I had a million dollars, I would travel the world.',
            'If she were the boss, she would change the rules.',
            'I would help you if I could.',
        ],
        tips: [
            'Use "were" for all subjects (formal): If I were, If she were',
            'Describes imaginary situations',
        ],
        commonMistakes: [
            '❌ If I would have... → ✅ If I had...',
        ],
        tags: ['hypothetical', 'unreal', 'imaginary'],
    },
    {
        id: 'cond-4',
        title: 'Third Conditional',
        category: 'Conditionals',
        level: 'B2',
        formula: 'If + Past Perfect, would have + V3',
        explanation: 'Used for unreal past situations—things that didn\'t happen.',
        examples: [
            'If I had studied harder, I would have passed.',
            'If she had left earlier, she wouldn\'t have been late.',
            'We would have won if we had played better.',
        ],
        tips: [
            'Expresses regret about the past',
            'The situation is impossible to change now',
        ],
        commonMistakes: [
            '❌ If I would have known → ✅ If I had known',
        ],
        tags: ['regret', 'past', 'impossible'],
    },

    // MODALS
    {
        id: 'modal-1',
        title: 'Modal Verbs of Obligation',
        category: 'Modals',
        level: 'B1',
        formula: 'must / have to / should + V1',
        explanation: 'Express different levels of obligation and advice.',
        examples: [
            'You must wear a seatbelt. (law/rule)',
            'I have to work tomorrow. (external obligation)',
            'You should see a doctor. (advice)',
        ],
        tips: [
            'MUST: personal/strong obligation, rules',
            'HAVE TO: external obligation, no choice',
            'SHOULD: advice, recommendation',
        ],
        tags: ['obligation', 'advice', 'rules'],
    },
    {
        id: 'modal-2',
        title: 'Modal Verbs of Possibility',
        category: 'Modals',
        level: 'B2',
        formula: 'might / may / could / must + V1',
        explanation: 'Express different degrees of certainty about present or future.',
        examples: [
            'She might be at home. (less certain)',
            'It may rain tomorrow. (possible)',
            'He could be the winner. (possible)',
            'He must be tired. (very certain)',
        ],
        tips: [
            'MUST: 95% certain (deduction)',
            'MAY/MIGHT: 50% certain (possibility)',
            'COULD: possibility or ability',
        ],
        tags: ['possibility', 'certainty', 'deduction'],
    },

    // CLAUSES
    {
        id: 'clause-1',
        title: 'Relative Clauses',
        category: 'Clauses',
        level: 'B1',
        formula: 'who (people) / which (things) / that (both) / whose (possession)',
        explanation: 'Used to give extra information about a noun.',
        examples: [
            'The woman who lives next door is a doctor.',
            'The book which I bought is interesting.',
            'That\'s the man whose car was stolen.',
        ],
        tips: [
            'WHO = people, WHICH = things, THAT = both',
            'WHOSE replaces his/her/their (possession)',
            'WHERE = places, WHEN = times',
        ],
        tags: ['who', 'which', 'that', 'whose', 'defining'],
    },
    {
        id: 'clause-2',
        title: 'Reported Speech',
        category: 'Clauses',
        level: 'B2',
        formula: 'Direct → Reported: Shift tense back one step',
        explanation: 'When reporting what someone said, shift tenses back.',
        examples: [
            '"I am tired" → He said he was tired.',
            '"I will call you" → She said she would call me.',
            '"I have finished" → He said he had finished.',
        ],
        tips: [
            'Present Simple → Past Simple',
            'Present Continuous → Past Continuous',
            'Will → Would',
            'Can → Could',
        ],
        tags: ['reported', 'indirect', 'said', 'told'],
    },

    // ARTICLES
    {
        id: 'article-1',
        title: 'Articles: a/an vs the',
        category: 'Articles',
        level: 'A2',
        formula: 'a/an = first mention, general | the = specific, known',
        explanation: 'A/AN introduce new information. THE refers to something specific or already mentioned.',
        examples: [
            'I saw a cat. The cat was black. (first mention → known)',
            'The sun rises in the east. (unique)',
            'She is a teacher. (profession)',
        ],
        tips: [
            'A before consonant sounds: a book, a university',
            'AN before vowel sounds: an apple, an hour',
            'THE for unique things: the moon, the president',
        ],
        commonMistakes: [
            '❌ a hour → ✅ an hour (silent h)',
            '❌ an university → ✅ a university (y sound)',
        ],
        tags: ['a', 'an', 'the', 'definite', 'indefinite'],
    },

    // VOCABULARY TIPS
    {
        id: 'vocab-1',
        title: 'Collocations with Make vs Do',
        category: 'Vocabulary',
        level: 'B1',
        formula: 'MAKE = create | DO = perform activity',
        explanation: 'These verbs often confuse learners. Learn common collocations.',
        examples: [
            'MAKE: a decision, a mistake, progress, money, friends',
            'DO: homework, research, business, housework, exercises',
        ],
        tips: [
            'MAKE often involves creating something',
            'DO often involves activities and tasks',
            'Some must be memorized: make the bed, do the dishes',
        ],
        tags: ['collocations', 'make', 'do'],
    },
    {
        id: 'vocab-2',
        title: 'Linking Words & Transitions',
        category: 'Writing',
        level: 'B2',
        formula: 'Contrast / Addition / Cause / Result',
        explanation: 'Use linking words to connect ideas smoothly.',
        examples: [
            'Contrast: however, nevertheless, on the other hand',
            'Addition: moreover, furthermore, in addition',
            'Cause: because, since, as, due to',
            'Result: therefore, consequently, as a result',
        ],
        tips: [
            'However = but (more formal)',
            'Furthermore = and (more formal)',
            'Use semicolon before: however, therefore, moreover',
        ],
        tags: ['transitions', 'linking', 'connectors', 'essay'],
    },
];

// Helper functions
export function getFormulasByCategory(category: FormulaCategory): Formula[] {
    return formulas.filter(f => f.category === category);
}

export function getFormulasByLevel(level: FormulaLevel): Formula[] {
    return formulas.filter(f => f.level === level);
}

export function searchFormulas(query: string): Formula[] {
    const q = query.toLowerCase();
    return formulas.filter(f =>
        f.title.toLowerCase().includes(q) ||
        f.explanation.toLowerCase().includes(q) ||
        f.tags.some(t => t.includes(q)) ||
        f.formula.toLowerCase().includes(q)
    );
}

export const FORMULA_CATEGORIES: FormulaCategory[] = [
    'Tenses', 'Conditionals', 'Modals', 'Clauses', 'Articles', 'Prepositions', 'Vocabulary', 'Writing'
];
