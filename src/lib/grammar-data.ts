// Grammar correction data - sentences with errors for correction exercises

export interface GrammarError {
    id: string;
    originalSentence: string;
    errorIndices: [number, number][]; // [start, end] indices of errors
    correctSentence: string;
    errorType: 'comma-splice' | 'parallelism' | 'subject-verb' | 'tense' | 'pronoun' | 'article' | 'word-choice';
    explanation: string;
    difficulty: 'easy' | 'medium' | 'hard';
    rule: string;
}

export const grammarExercises: GrammarError[] = [
    // COMMA SPLICES
    {
        id: 'cs-1',
        originalSentence: 'I went to the store, I bought some milk.',
        errorIndices: [[21, 22]],
        correctSentence: 'I went to the store, and I bought some milk.',
        errorType: 'comma-splice',
        explanation: 'A comma splice occurs when two independent clauses are joined only by a comma. Use a coordinating conjunction (and, but, so) or a semicolon.',
        difficulty: 'easy',
        rule: 'Comma Splice: Two independent clauses cannot be joined with just a comma.'
    },
    {
        id: 'cs-2',
        originalSentence: 'She loves reading, he prefers watching movies.',
        errorIndices: [[16, 17]],
        correctSentence: 'She loves reading; he prefers watching movies.',
        errorType: 'comma-splice',
        explanation: 'Use a semicolon to join two related independent clauses, or add a conjunction.',
        difficulty: 'easy',
        rule: 'Use semicolon or conjunction to join independent clauses.'
    },
    {
        id: 'cs-3',
        originalSentence: 'The project was difficult, we finished it on time.',
        errorIndices: [[26, 27]],
        correctSentence: 'The project was difficult, but we finished it on time.',
        errorType: 'comma-splice',
        explanation: 'Adding "but" creates proper coordination between contrasting ideas.',
        difficulty: 'easy',
        rule: 'Use "but" to connect contrasting independent clauses.'
    },

    // PARALLELISM
    {
        id: 'par-1',
        originalSentence: 'She likes hiking, swimming, and to ride bikes.',
        errorIndices: [[32, 45]],
        correctSentence: 'She likes hiking, swimming, and riding bikes.',
        errorType: 'parallelism',
        explanation: 'Items in a list should have the same grammatical form. Use all gerunds (-ing) or all infinitives.',
        difficulty: 'medium',
        rule: 'Parallelism: List items should match in grammatical form.'
    },
    {
        id: 'par-2',
        originalSentence: 'The job requires creativity, dedication, and being punctual.',
        errorIndices: [[43, 58]],
        correctSentence: 'The job requires creativity, dedication, and punctuality.',
        errorType: 'parallelism',
        explanation: 'Replace "being punctual" with the noun "punctuality" to match the other nouns.',
        difficulty: 'medium',
        rule: 'Use parallel nouns in a series.'
    },
    {
        id: 'par-3',
        originalSentence: 'He promised to study hard, complete all assignments, and that he would pass the exam.',
        errorIndices: [[53, 83]],
        correctSentence: 'He promised to study hard, complete all assignments, and pass the exam.',
        errorType: 'parallelism',
        explanation: 'Keep infinitive structure consistent without adding "that he would."',
        difficulty: 'hard',
        rule: 'Maintain consistent infinitive structure in series.'
    },

    // SUBJECT-VERB AGREEMENT
    {
        id: 'sv-1',
        originalSentence: 'The group of students are studying for the exam.',
        errorIndices: [[24, 27]],
        correctSentence: 'The group of students is studying for the exam.',
        errorType: 'subject-verb',
        explanation: '"Group" is a singular collective noun, so it takes a singular verb "is."',
        difficulty: 'medium',
        rule: 'Collective nouns are usually singular.'
    },
    {
        id: 'sv-2',
        originalSentence: 'Neither the teacher nor the students was prepared.',
        errorIndices: [[40, 43]],
        correctSentence: 'Neither the teacher nor the students were prepared.',
        errorType: 'subject-verb',
        explanation: 'With "neither...nor," the verb agrees with the nearest subject ("students" = plural).',
        difficulty: 'hard',
        rule: 'Verb agrees with the nearer subject in neither/nor constructions.'
    },
    {
        id: 'sv-3',
        originalSentence: 'Everyone in the class have submitted their assignments.',
        errorIndices: [[22, 26]],
        correctSentence: 'Everyone in the class has submitted their assignments.',
        errorType: 'subject-verb',
        explanation: '"Everyone" is singular and takes a singular verb "has."',
        difficulty: 'easy',
        rule: 'Indefinite pronouns like "everyone" are singular.'
    },

    // TENSE CONSISTENCY
    {
        id: 'tense-1',
        originalSentence: 'She walked to the store and buys some groceries.',
        errorIndices: [[27, 31]],
        correctSentence: 'She walked to the store and bought some groceries.',
        errorType: 'tense',
        explanation: 'Keep verb tenses consistent. Since "walked" is past tense, "buys" should be "bought."',
        difficulty: 'easy',
        rule: 'Maintain consistent verb tenses within a sentence.'
    },
    {
        id: 'tense-2',
        originalSentence: 'By the time I arrived, the movie already starts.',
        errorIndices: [[37, 43]],
        correctSentence: 'By the time I arrived, the movie had already started.',
        errorType: 'tense',
        explanation: 'Use past perfect "had started" to show an action completed before another past action.',
        difficulty: 'hard',
        rule: 'Use past perfect for actions completed before other past actions.'
    },

    // PRONOUN REFERENCE
    {
        id: 'pron-1',
        originalSentence: 'When John met Mike, he was very happy.',
        errorIndices: [[21, 23]],
        correctSentence: 'When John met Mike, John was very happy.',
        errorType: 'pronoun',
        explanation: '"He" is ambiguous—it could refer to John or Mike. Replace with a clear reference.',
        difficulty: 'medium',
        rule: 'Pronouns must have clear antecedents.'
    },

    // ARTICLE USAGE
    {
        id: 'art-1',
        originalSentence: 'I want to become a engineer.',
        errorIndices: [[19, 20]],
        correctSentence: 'I want to become an engineer.',
        errorType: 'article',
        explanation: 'Use "an" before words that start with a vowel sound.',
        difficulty: 'easy',
        rule: 'Use "an" before vowel sounds, "a" before consonant sounds.'
    },
    {
        id: 'art-2',
        originalSentence: 'The honesty is the best policy.',
        errorIndices: [[0, 3]],
        correctSentence: 'Honesty is the best policy.',
        errorType: 'article',
        explanation: 'Abstract nouns used in a general sense don\'t need "the."',
        difficulty: 'medium',
        rule: 'Abstract nouns in general statements don\'t need articles.'
    },

    // WORD CHOICE
    {
        id: 'wc-1',
        originalSentence: 'The affect of the new policy was significant.',
        errorIndices: [[4, 10]],
        correctSentence: 'The effect of the new policy was significant.',
        errorType: 'word-choice',
        explanation: '"Effect" is the noun (result); "affect" is the verb (to influence).',
        difficulty: 'medium',
        rule: 'Effect = noun (result), Affect = verb (to influence).'
    },
    {
        id: 'wc-2',
        originalSentence: 'Their going to the party tonight.',
        errorIndices: [[0, 5]],
        correctSentence: 'They\'re going to the party tonight.',
        errorType: 'word-choice',
        explanation: '"They\'re" = "they are"; "their" shows possession; "there" is a place.',
        difficulty: 'easy',
        rule: 'They\'re = they are, Their = possessive, There = place.'
    },
];

// Helper functions
export function getExercisesByType(type: GrammarError['errorType']): GrammarError[] {
    return grammarExercises.filter(e => e.errorType === type);
}

export function getExercisesByDifficulty(difficulty: GrammarError['difficulty']): GrammarError[] {
    return grammarExercises.filter(e => e.difficulty === difficulty);
}

export function getRandomExercises(count: number, type?: GrammarError['errorType']): GrammarError[] {
    const pool = type ? getExercisesByType(type) : [...grammarExercises];
    const shuffled = pool.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

export const ERROR_TYPES = [
    { id: 'comma-splice', label: 'Comma Splice', color: 'from-red-500 to-rose-500' },
    { id: 'parallelism', label: 'Parallelism', color: 'from-purple-500 to-violet-500' },
    { id: 'subject-verb', label: 'Subject-Verb Agreement', color: 'from-blue-500 to-cyan-500' },
    { id: 'tense', label: 'Tense Consistency', color: 'from-green-500 to-emerald-500' },
    { id: 'pronoun', label: 'Pronoun Reference', color: 'from-orange-500 to-amber-500' },
    { id: 'article', label: 'Article Usage', color: 'from-pink-500 to-rose-500' },
    { id: 'word-choice', label: 'Word Choice', color: 'from-teal-500 to-cyan-500' },
];
