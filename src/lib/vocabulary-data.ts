// Vocabulary words data for games

export interface VocabWord {
    id: string;
    word: string;
    definition: string;
    example: string;
    category: 'SAT' | 'IELTS' | 'Academic' | 'Daily';
    level: 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
    synonyms?: string[];
    antonyms?: string[];
}

export const vocabularyWords: VocabWord[] = [
    // SAT Words
    {
        id: 'vocab-1',
        word: 'Ephemeral',
        definition: 'Lasting for a very short time',
        example: 'Fame can be ephemeral in the age of social media.',
        category: 'SAT',
        level: 'C1',
        synonyms: ['transient', 'fleeting', 'temporary'],
        antonyms: ['permanent', 'lasting', 'enduring'],
    },
    {
        id: 'vocab-2',
        word: 'Ubiquitous',
        definition: 'Present, appearing, or found everywhere',
        example: 'Smartphones have become ubiquitous in modern society.',
        category: 'SAT',
        level: 'C1',
        synonyms: ['omnipresent', 'universal', 'pervasive'],
        antonyms: ['rare', 'scarce', 'uncommon'],
    },
    {
        id: 'vocab-3',
        word: 'Pragmatic',
        definition: 'Dealing with things sensibly and realistically',
        example: 'Her pragmatic approach helped solve the problem quickly.',
        category: 'SAT',
        level: 'B2',
        synonyms: ['practical', 'realistic', 'sensible'],
        antonyms: ['idealistic', 'impractical', 'unrealistic'],
    },
    {
        id: 'vocab-4',
        word: 'Benevolent',
        definition: 'Well-meaning and kindly',
        example: 'The benevolent donor funded the entire hospital wing.',
        category: 'SAT',
        level: 'B2',
        synonyms: ['kind', 'generous', 'charitable'],
        antonyms: ['malevolent', 'cruel', 'unkind'],
    },
    {
        id: 'vocab-5',
        word: 'Ambiguous',
        definition: 'Open to more than one interpretation',
        example: 'The politician gave an ambiguous answer to avoid controversy.',
        category: 'SAT',
        level: 'B2',
        synonyms: ['unclear', 'vague', 'equivocal'],
        antonyms: ['clear', 'unambiguous', 'definite'],
    },

    // IELTS Words
    {
        id: 'vocab-6',
        word: 'Sustainable',
        definition: 'Able to be maintained at a certain level',
        example: 'We need to develop sustainable energy sources.',
        category: 'IELTS',
        level: 'B2',
        synonyms: ['viable', 'maintainable', 'renewable'],
    },
    {
        id: 'vocab-7',
        word: 'Innovative',
        definition: 'Featuring new methods; creative',
        example: 'The company is known for its innovative products.',
        category: 'IELTS',
        level: 'B1',
        synonyms: ['creative', 'original', 'groundbreaking'],
        antonyms: ['traditional', 'conventional'],
    },
    {
        id: 'vocab-8',
        word: 'Significant',
        definition: 'Sufficiently great or important',
        example: 'There has been a significant increase in sales.',
        category: 'IELTS',
        level: 'B1',
        synonyms: ['important', 'major', 'notable'],
        antonyms: ['insignificant', 'minor', 'trivial'],
    },
    {
        id: 'vocab-9',
        word: 'Fluctuate',
        definition: 'Rise and fall irregularly',
        example: 'Stock prices fluctuate daily.',
        category: 'IELTS',
        level: 'B2',
        synonyms: ['vary', 'change', 'oscillate'],
        antonyms: ['stabilize', 'remain constant'],
    },
    {
        id: 'vocab-10',
        word: 'Predominantly',
        definition: 'Mainly; for the most part',
        example: 'The audience was predominantly young adults.',
        category: 'IELTS',
        level: 'B2',
        synonyms: ['mainly', 'largely', 'primarily'],
    },

    // Academic Words
    {
        id: 'vocab-11',
        word: 'Hypothesis',
        definition: 'A proposed explanation based on limited evidence',
        example: 'The scientist tested her hypothesis through experiments.',
        category: 'Academic',
        level: 'B2',
        synonyms: ['theory', 'assumption', 'proposition'],
    },
    {
        id: 'vocab-12',
        word: 'Analyze',
        definition: 'Examine in detail to understand',
        example: 'We need to analyze the data before drawing conclusions.',
        category: 'Academic',
        level: 'B1',
        synonyms: ['examine', 'study', 'investigate'],
    },
    {
        id: 'vocab-13',
        word: 'Comprehensive',
        definition: 'Including all elements; complete',
        example: 'The report provides a comprehensive overview.',
        category: 'Academic',
        level: 'B2',
        synonyms: ['complete', 'thorough', 'extensive'],
        antonyms: ['partial', 'incomplete', 'limited'],
    },
    {
        id: 'vocab-14',
        word: 'Correlate',
        definition: 'Have a mutual relationship or connection',
        example: 'Higher education levels correlate with higher income.',
        category: 'Academic',
        level: 'C1',
        synonyms: ['relate', 'connect', 'correspond'],
    },
    {
        id: 'vocab-15',
        word: 'Implication',
        definition: 'A possible effect or result',
        example: 'The implications of this discovery are enormous.',
        category: 'Academic',
        level: 'B2',
        synonyms: ['consequence', 'effect', 'ramification'],
    },

    // Daily/Common Words
    {
        id: 'vocab-16',
        word: 'Accomplish',
        definition: 'Achieve or complete successfully',
        example: 'She accomplished all her goals this year.',
        category: 'Daily',
        level: 'B1',
        synonyms: ['achieve', 'complete', 'fulfill'],
        antonyms: ['fail', 'abandon'],
    },
    {
        id: 'vocab-17',
        word: 'Appreciate',
        definition: 'Recognize the value of; be grateful for',
        example: 'I really appreciate your help.',
        category: 'Daily',
        level: 'A2',
        synonyms: ['value', 'treasure', 'be grateful for'],
    },
    {
        id: 'vocab-18',
        word: 'Communicate',
        definition: 'Share or exchange information',
        example: 'Good leaders communicate effectively.',
        category: 'Daily',
        level: 'A2',
        synonyms: ['convey', 'express', 'share'],
    },
    {
        id: 'vocab-19',
        word: 'Exaggerate',
        definition: 'Represent as larger or greater than it really is',
        example: 'Don\'t exaggerate—it wasn\'t that bad!',
        category: 'Daily',
        level: 'B1',
        synonyms: ['overstate', 'amplify', 'embellish'],
        antonyms: ['understate', 'minimize'],
    },
    {
        id: 'vocab-20',
        word: 'Hesitate',
        definition: 'Pause before saying or doing something',
        example: 'She hesitated before answering the question.',
        category: 'Daily',
        level: 'B1',
        synonyms: ['pause', 'waver', 'delay'],
        antonyms: ['act decisively', 'proceed'],
    },
];

// Helper functions
export function getWordsByCategory(category: VocabWord['category']): VocabWord[] {
    return vocabularyWords.filter(w => w.category === category);
}

export function getWordsByLevel(level: VocabWord['level']): VocabWord[] {
    return vocabularyWords.filter(w => w.level === level);
}

export function getRandomWords(count: number, category?: VocabWord['category']): VocabWord[] {
    const pool = category ? getWordsByCategory(category) : [...vocabularyWords];
    const shuffled = pool.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

export function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}
