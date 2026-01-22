'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    BookOpen,
    Lightbulb,
    ChevronDown,
    ChevronUp,
    X,
    AlertTriangle,
    Check,
    Copy,
    Filter,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/lib/store';
import {
    formulas,
    searchFormulas,
    getFormulasByCategory,
    Formula,
    FormulaCategory,
    FORMULA_CATEGORIES,
} from '@/lib/formulas-data';

const categoryColors: Record<FormulaCategory, string> = {
    Tenses: 'from-blue-500 to-cyan-500',
    Conditionals: 'from-purple-500 to-pink-500',
    Modals: 'from-green-500 to-emerald-500',
    Clauses: 'from-orange-500 to-amber-500',
    Articles: 'from-red-500 to-rose-500',
    Prepositions: 'from-indigo-500 to-violet-500',
    Vocabulary: 'from-teal-500 to-cyan-500',
    Writing: 'from-pink-500 to-rose-500',
};

const levelColors: Record<string, string> = {
    A1: 'bg-green-500/20 text-green-400',
    A2: 'bg-emerald-500/20 text-emerald-400',
    B1: 'bg-blue-500/20 text-blue-400',
    B2: 'bg-purple-500/20 text-purple-400',
    C1: 'bg-orange-500/20 text-orange-400',
    C2: 'bg-red-500/20 text-red-400',
};

export default function FormulasPage() {
    const toast = useToast();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<FormulaCategory | 'all'>('all');
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const filteredFormulas = useMemo(() => {
        let result = formulas;

        if (selectedCategory !== 'all') {
            result = getFormulasByCategory(selectedCategory);
        }

        if (searchQuery) {
            const searchResults = searchFormulas(searchQuery);
            result = result.filter(f => searchResults.includes(f));
        }

        return result;
    }, [searchQuery, selectedCategory]);

    const copyFormula = (formula: string) => {
        navigator.clipboard.writeText(formula);
        toast.success('Formula copied to clipboard!');
    };

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-2xl md:text-3xl font-bold text-white">Formulas & Tips</h1>
                <p className="text-slate-400 mt-1">Quick reference for grammar rules and patterns</p>
            </motion.div>

            {/* Search and Filters */}
            <Card>
                <CardContent className="pt-4 space-y-4">
                    <Input
                        placeholder="Search formulas, rules, or topics..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        icon={<Search className="h-4 w-4" />}
                    />

                    {/* Category Pills */}
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setSelectedCategory('all')}
                            className={`px-3 py-1.5 rounded-full text-sm transition-all ${selectedCategory === 'all'
                                    ? 'bg-cyan-500 text-white'
                                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                }`}
                        >
                            All ({formulas.length})
                        </button>
                        {FORMULA_CATEGORIES.filter(cat =>
                            getFormulasByCategory(cat).length > 0
                        ).map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-3 py-1.5 rounded-full text-sm transition-all ${selectedCategory === cat
                                        ? `bg-gradient-to-r ${categoryColors[cat]} text-white`
                                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                    }`}
                            >
                                {cat} ({getFormulasByCategory(cat).length})
                            </button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Formula Cards */}
            <div className="space-y-4">
                <AnimatePresence>
                    {filteredFormulas.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-12"
                        >
                            <BookOpen className="h-12 w-12 mx-auto text-slate-600 mb-4" />
                            <p className="text-slate-400">No formulas found</p>
                            <p className="text-sm text-slate-500">Try a different search term or category</p>
                        </motion.div>
                    ) : (
                        filteredFormulas.map((formula, index) => (
                            <FormulaCard
                                key={formula.id}
                                formula={formula}
                                index={index}
                                isExpanded={expandedId === formula.id}
                                onToggle={() => toggleExpand(formula.id)}
                                onCopy={copyFormula}
                                categoryColor={categoryColors[formula.category]}
                            />
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

interface FormulaCardProps {
    formula: Formula;
    index: number;
    isExpanded: boolean;
    onToggle: () => void;
    onCopy: (formula: string) => void;
    categoryColor: string;
}

function FormulaCard({
    formula,
    index,
    isExpanded,
    onToggle,
    onCopy,
    categoryColor,
}: FormulaCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
        >
            <Card className="overflow-hidden">
                {/* Category color stripe */}
                <div className={`h-1 bg-gradient-to-r ${categoryColor}`} />

                <CardContent className="pt-4">
                    {/* Header */}
                    <div
                        className="flex items-start justify-between cursor-pointer"
                        onClick={onToggle}
                    >
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <Badge className={levelColors[formula.level]}>
                                    {formula.level}
                                </Badge>
                                <Badge variant="secondary">{formula.category}</Badge>
                            </div>
                            <h3 className="text-lg font-semibold text-white">{formula.title}</h3>
                            <p className="text-sm text-slate-400 mt-1">{formula.explanation}</p>
                        </div>
                        <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                            {isExpanded ? (
                                <ChevronUp className="h-5 w-5 text-slate-400" />
                            ) : (
                                <ChevronDown className="h-5 w-5 text-slate-400" />
                            )}
                        </button>
                    </div>

                    {/* Formula Box */}
                    <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-cyan-900/20 to-violet-900/20 border border-cyan-500/20">
                        <div className="flex items-center justify-between">
                            <code className="text-cyan-300 font-mono text-sm md:text-base">
                                {formula.formula}
                            </code>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onCopy(formula.formula);
                                }}
                                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                                title="Copy formula"
                            >
                                <Copy className="h-4 w-4 text-slate-400" />
                            </button>
                        </div>
                    </div>

                    {/* Expanded Content */}
                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                            >
                                <div className="mt-6 space-y-5">
                                    {/* Examples */}
                                    <div>
                                        <h4 className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                                            <BookOpen className="h-4 w-4 text-cyan-400" />
                                            Examples
                                        </h4>
                                        <ul className="space-y-2">
                                            {formula.examples.map((ex, i) => (
                                                <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                                                    <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                                                    <span>{ex}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Tips */}
                                    <div>
                                        <h4 className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                                            <Lightbulb className="h-4 w-4 text-amber-400" />
                                            Tips
                                        </h4>
                                        <ul className="space-y-2">
                                            {formula.tips.map((tip, i) => (
                                                <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                                                    <span className="text-amber-400">💡</span>
                                                    <span>{tip}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Common Mistakes */}
                                    {formula.commonMistakes && formula.commonMistakes.length > 0 && (
                                        <div>
                                            <h4 className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                                                <AlertTriangle className="h-4 w-4 text-red-400" />
                                                Common Mistakes
                                            </h4>
                                            <ul className="space-y-2">
                                                {formula.commonMistakes.map((mistake, i) => (
                                                    <li key={i} className="text-sm text-slate-400 bg-red-500/5 p-2 rounded-lg border border-red-500/20">
                                                        {mistake}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {formula.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="text-xs px-2 py-1 rounded-full bg-white/5 text-slate-400"
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </CardContent>
            </Card>
        </motion.div>
    );
}
