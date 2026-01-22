'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    Settings,
    ChevronLeft,
    ChevronRight,
    Bookmark,
    Highlighter,
    BookOpen,
    Type,
    Sun,
    Moon,
    Plus,
    Trash2,
    Volume2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// Types
export interface EBook {
    id: string;
    title: string;
    author: string;
    coverImage: string;
    level: string;
    genre: string;
    chapters: Chapter[];
    totalPages: number;
}

export interface Chapter {
    id: string;
    title: string;
    content: string;
    pageStart: number;
}

export interface Highlight {
    id: string;
    bookId: string;
    chapterId: string;
    text: string;
    startOffset: number;
    endOffset: number;
    color: 'yellow' | 'green' | 'blue' | 'pink';
    note?: string;
    createdAt: string;
}

export interface VocabularyWord {
    id: string;
    word: string;
    definition?: string;
    bookId: string;
    context: string;
    createdAt: string;
}

// Highlight colors
const HIGHLIGHT_COLORS = {
    yellow: 'bg-yellow-300/40 border-yellow-400',
    green: 'bg-green-300/40 border-green-400',
    blue: 'bg-blue-300/40 border-blue-400',
    pink: 'bg-pink-300/40 border-pink-400',
};

interface EBookReaderProps {
    book: EBook;
    onClose: () => void;
}

export function EBookReader({ book, onClose }: EBookReaderProps) {
    const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
    const [fontSize, setFontSize] = useState(18);
    const [readerTheme, setReaderTheme] = useState<'light' | 'sepia' | 'dark'>('dark');
    const [showSettings, setShowSettings] = useState(false);
    const [showVocabulary, setShowVocabulary] = useState(false);
    const [highlights, setHighlights] = useState<Highlight[]>([]);
    const [vocabulary, setVocabulary] = useState<VocabularyWord[]>([]);
    const [selectedText, setSelectedText] = useState<string>('');
    const [selectionRange, setSelectionRange] = useState<{ start: number; end: number } | null>(null);
    const [showHighlightMenu, setShowHighlightMenu] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
    const [currentHighlightColor, setCurrentHighlightColor] = useState<keyof typeof HIGHLIGHT_COLORS>('yellow');

    const currentChapter = book.chapters[currentChapterIndex];

    // Load saved data from localStorage
    useEffect(() => {
        const savedHighlights = localStorage.getItem(`ebook_highlights_${book.id}`);
        const savedVocabulary = localStorage.getItem(`ebook_vocabulary_${book.id}`);
        if (savedHighlights) setHighlights(JSON.parse(savedHighlights));
        if (savedVocabulary) setVocabulary(JSON.parse(savedVocabulary));
    }, [book.id]);

    // Save highlights to localStorage
    useEffect(() => {
        localStorage.setItem(`ebook_highlights_${book.id}`, JSON.stringify(highlights));
    }, [highlights, book.id]);

    // Save vocabulary to localStorage
    useEffect(() => {
        localStorage.setItem(`ebook_vocabulary_${book.id}`, JSON.stringify(vocabulary));
    }, [vocabulary, book.id]);

    const handleTextSelection = useCallback((e: React.MouseEvent) => {
        const selection = window.getSelection();
        const text = selection?.toString().trim();

        if (text && text.length > 0) {
            setSelectedText(text);
            const range = selection?.getRangeAt(0);
            if (range) {
                const rect = range.getBoundingClientRect();
                setMenuPosition({ x: rect.left + rect.width / 2, y: rect.top - 50 });
                setShowHighlightMenu(true);
                setSelectionRange({ start: range.startOffset, end: range.endOffset });
            }
        } else {
            setShowHighlightMenu(false);
        }
    }, []);

    const addHighlight = (color: keyof typeof HIGHLIGHT_COLORS) => {
        if (!selectedText || !selectionRange) return;

        const newHighlight: Highlight = {
            id: `highlight-${Date.now()}`,
            bookId: book.id,
            chapterId: currentChapter.id,
            text: selectedText,
            startOffset: selectionRange.start,
            endOffset: selectionRange.end,
            color,
            createdAt: new Date().toISOString(),
        };

        setHighlights([...highlights, newHighlight]);
        setShowHighlightMenu(false);
        window.getSelection()?.removeAllRanges();
    };

    const addToVocabulary = () => {
        if (!selectedText) return;

        const newWord: VocabularyWord = {
            id: `vocab-${Date.now()}`,
            word: selectedText,
            bookId: book.id,
            context: currentChapter.content.slice(
                Math.max(0, (selectionRange?.start || 0) - 50),
                Math.min(currentChapter.content.length, (selectionRange?.end || 0) + 50)
            ),
            createdAt: new Date().toISOString(),
        };

        setVocabulary([...vocabulary, newWord]);
        setShowHighlightMenu(false);
        window.getSelection()?.removeAllRanges();
    };

    const removeHighlight = (id: string) => {
        setHighlights(highlights.filter(h => h.id !== id));
    };

    const removeVocabulary = (id: string) => {
        setVocabulary(vocabulary.filter(v => v.id !== id));
    };

    const goToNextChapter = () => {
        if (currentChapterIndex < book.chapters.length - 1) {
            setCurrentChapterIndex(currentChapterIndex + 1);
        }
    };

    const goToPrevChapter = () => {
        if (currentChapterIndex > 0) {
            setCurrentChapterIndex(currentChapterIndex - 1);
        }
    };

    // Theme styles
    const themeStyles = {
        light: 'bg-white text-gray-900',
        sepia: 'bg-[#f4ecd8] text-[#5c4b37]',
        dark: 'bg-[#1a1a2e] text-gray-200',
    };

    // Render content with highlights
    const renderContentWithHighlights = () => {
        const chapterHighlights = highlights.filter(h => h.chapterId === currentChapter.id);
        let content = currentChapter.content;

        // For simplicity, we'll just render the content and use CSS to highlight selected text visually
        // In a production app, you'd parse and insert highlight spans
        return content.split('\n\n').map((paragraph, index) => (
            <p key={index} className="mb-4 leading-relaxed">
                {paragraph}
            </p>
        ));
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90"
        >
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 h-14 bg-black/50 backdrop-blur-md flex items-center justify-between px-4 z-10">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="sm" onClick={onClose}>
                        <X className="h-5 w-5" />
                    </Button>
                    <div>
                        <p className="text-sm font-medium text-white truncate max-w-[200px]">{book.title}</p>
                        <p className="text-xs text-slate-400">{currentChapter.title}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowVocabulary(!showVocabulary)}
                        className={showVocabulary ? 'bg-cyan-500/20 text-cyan-400' : ''}
                    >
                        <BookOpen className="h-4 w-4" />
                        <span className="ml-1 text-xs">{vocabulary.length}</span>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setShowSettings(!showSettings)}>
                        <Settings className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Settings Panel */}
            <AnimatePresence>
                {showSettings && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-14 right-4 z-20 w-64 bg-slate-900 rounded-xl border border-white/10 p-4 shadow-xl"
                    >
                        <h3 className="text-sm font-medium text-white mb-4">Reading Settings</h3>

                        {/* Font Size */}
                        <div className="mb-4">
                            <label className="text-xs text-slate-400 mb-2 block">Font Size</label>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setFontSize(Math.max(12, fontSize - 2))}
                                >
                                    <Type className="h-3 w-3" />
                                </Button>
                                <span className="text-sm text-white flex-1 text-center">{fontSize}px</span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setFontSize(Math.min(28, fontSize + 2))}
                                >
                                    <Type className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Theme */}
                        <div>
                            <label className="text-xs text-slate-400 mb-2 block">Theme</label>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setReaderTheme('light')}
                                    className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${readerTheme === 'light'
                                            ? 'bg-white text-gray-900'
                                            : 'bg-white/10 text-white hover:bg-white/20'
                                        }`}
                                >
                                    Light
                                </button>
                                <button
                                    onClick={() => setReaderTheme('sepia')}
                                    className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${readerTheme === 'sepia'
                                            ? 'bg-[#f4ecd8] text-[#5c4b37]'
                                            : 'bg-white/10 text-white hover:bg-white/20'
                                        }`}
                                >
                                    Sepia
                                </button>
                                <button
                                    onClick={() => setReaderTheme('dark')}
                                    className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${readerTheme === 'dark'
                                            ? 'bg-[#1a1a2e] text-gray-200 border border-white/20'
                                            : 'bg-white/10 text-white hover:bg-white/20'
                                        }`}
                                >
                                    Dark
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Vocabulary Panel */}
            <AnimatePresence>
                {showVocabulary && (
                    <motion.div
                        initial={{ opacity: 0, x: 300 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 300 }}
                        className="absolute top-14 right-0 bottom-14 w-80 bg-slate-900 border-l border-white/10 z-20 overflow-y-auto"
                    >
                        <div className="p-4">
                            <h3 className="text-lg font-semibold text-white mb-4">
                                My Vocabulary ({vocabulary.length})
                            </h3>
                            {vocabulary.length === 0 ? (
                                <p className="text-sm text-slate-400">
                                    Select text in the reader and tap &quot;Add to Vocabulary&quot; to save words.
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {vocabulary.map((word) => (
                                        <div
                                            key={word.id}
                                            className="p-3 bg-slate-800/50 rounded-lg"
                                        >
                                            <div className="flex items-start justify-between">
                                                <p className="font-medium text-cyan-400">{word.word}</p>
                                                <button
                                                    onClick={() => removeVocabulary(word.id)}
                                                    className="text-slate-500 hover:text-red-400"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                            <p className="text-xs text-slate-400 mt-1 italic">
                                                &quot;...{word.context}...&quot;
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Reader Content */}
            <div
                className={`absolute top-14 bottom-14 left-0 right-0 ${showVocabulary ? 'right-80' : ''} overflow-y-auto transition-all`}
            >
                <div
                    className={`max-w-3xl mx-auto px-6 py-8 min-h-full ${themeStyles[readerTheme]}`}
                    style={{ fontSize: `${fontSize}px` }}
                    onMouseUp={handleTextSelection}
                >
                    <h2 className="text-2xl font-bold mb-6">{currentChapter.title}</h2>
                    {renderContentWithHighlights()}
                </div>
            </div>

            {/* Highlight Menu (appears on text selection) */}
            <AnimatePresence>
                {showHighlightMenu && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="fixed z-30 bg-slate-800 rounded-xl shadow-xl border border-white/10 p-2 flex items-center gap-1"
                        style={{
                            left: menuPosition.x,
                            top: menuPosition.y,
                            transform: 'translateX(-50%)',
                        }}
                    >
                        {/* Highlight colors */}
                        {(Object.keys(HIGHLIGHT_COLORS) as Array<keyof typeof HIGHLIGHT_COLORS>).map((color) => (
                            <button
                                key={color}
                                onClick={() => addHighlight(color)}
                                className={`w-6 h-6 rounded-full ${HIGHLIGHT_COLORS[color]} border hover:scale-110 transition-transform`}
                            />
                        ))}
                        <div className="w-px h-6 bg-white/20 mx-1" />
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={addToVocabulary}
                            className="text-xs px-2"
                        >
                            <Plus className="h-3 w-3 mr-1" />
                            Vocab
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Footer Navigation */}
            <div className="absolute bottom-0 left-0 right-0 h-14 bg-black/50 backdrop-blur-md flex items-center justify-between px-4">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={goToPrevChapter}
                    disabled={currentChapterIndex === 0}
                >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                </Button>
                <div className="text-center">
                    <p className="text-xs text-slate-400">
                        Chapter {currentChapterIndex + 1} of {book.chapters.length}
                    </p>
                    <p className="text-xs text-slate-500">
                        Page {currentChapter.pageStart} / {book.totalPages}
                    </p>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={goToNextChapter}
                    disabled={currentChapterIndex === book.chapters.length - 1}
                >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
            </div>
        </motion.div>
    );
}

// E-Book Card Component
interface EBookCardProps {
    book: EBook;
    onOpen: (book: EBook) => void;
}

export function EBookCard({ book, onOpen }: EBookCardProps) {
    return (
        <Card
            className="group cursor-pointer hover:border-cyan-500/50 transition-all duration-300 overflow-hidden"
            onClick={() => onOpen(book)}
        >
            <div className="relative aspect-[3/4] bg-gradient-to-br from-cyan-900/50 to-violet-900/50 flex items-center justify-center">
                <BookOpen className="h-16 w-16 text-cyan-400/50 group-hover:text-cyan-400 transition-colors" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                    <span className="text-xs px-2 py-0.5 bg-cyan-500/20 text-cyan-400 rounded">{book.level}</span>
                </div>
            </div>
            <div className="p-4">
                <h3 className="font-semibold text-white text-sm line-clamp-2">{book.title}</h3>
                <p className="text-xs text-slate-400 mt-1">{book.author}</p>
                <p className="text-xs text-slate-500 mt-2">{book.totalPages} pages • {book.genre}</p>
            </div>
        </Card>
    );
}
