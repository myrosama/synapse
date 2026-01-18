'use client';

import { motion } from 'framer-motion';
import { HelpCircle, CheckCircle, Mail, ExternalLink } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

export default function HelpPage() {
    const faqs = [
        {
            question: 'Why does teach-back work?',
            answer: 'Teaching is one of the most effective ways to learn. When you explain a concept to someone else, you must organize your thoughts, identify gaps in your understanding, and articulate ideas clearly. This process strengthens memory and deepens comprehension. It\'s often called the "Feynman Technique," named after physicist Richard Feynman who advocated learning by teaching.',
        },
        {
            question: 'How does scoring work?',
            answer: 'After you teach back and answer the AI\'s questions, you receive a score from 0-100% based on four criteria: Correctness (did you state the rules accurately?), Coverage (did you cover all key points?), Clarity (was your explanation easy to understand?), and English (was your grammar and vocabulary appropriate?). Each criterion contributes equally to your total score.',
        },
        {
            question: 'What do the four scores mean?',
            answer: 'Correctness measures factual accuracy—are your grammar rules and examples correct? Coverage checks if you mentioned all the key points from the lesson. Clarity evaluates how understandable your explanation would be to a learner. English assesses your grammar, word choice, and natural expression. Focus on your lowest score to improve fastest.',
        },
        {
            question: 'How can I get better scores faster?',
            answer: 'Follow the "1 rule + 2 examples" formula: state the core rule clearly, then give two concrete examples. Anticipate confusion points and address them. Use simple language—if you can\'t explain it simply, you don\'t understand it well enough. Practice consistently; even 10 minutes daily beats irregular long sessions.',
        },
        {
            question: 'What topics are available?',
            answer: 'Synapse covers Grammar (tenses, conditionals, articles, etc.), Vocabulary (phrasal verbs, academic words, idioms), Speaking (fluency patterns, polite expressions), and Writing (cohesion, formal style, essay structure). Topics are organized by CEFR level from A1 (beginner) to C2 (proficient). We continuously add new content.',
        },
        {
            question: 'Can I use Synapse for exam preparation?',
            answer: 'Yes! Synapse is designed to help with IELTS, TOEFL, SAT, and other English exams. The teach-back method reinforces grammar and vocabulary retention—key for exam success. Select your goal in your profile settings to get relevant topic recommendations.',
        },
        {
            question: 'How is my data used?',
            answer: 'Your session data helps personalize your learning experience by identifying weak areas and suggesting relevant topics. We don\'t share your personal data with third parties. You can delete all your session data anytime from your Profile settings.',
        },
    ];

    const bestPractices = [
        'Use the "1 rule + 2 examples" formula in your explanations',
        'Keep language simple—avoid jargon unless teaching it',
        'Anticipate what might confuse a learner and address it',
        'Use contrast ("This is X, not Y") to clarify distinctions',
        'Include edge cases and common mistakes',
        'Practice daily, even if only for 10 minutes',
        'Review your corrections after each session',
        'Focus on your lowest scores to improve fastest',
    ];

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-2xl md:text-3xl font-bold text-white">Help & FAQ</h1>
                <p className="text-slate-400 mt-1">Learn how Synapse works and get the most out of your sessions.</p>
            </motion.div>

            {/* FAQ */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <HelpCircle className="h-5 w-5 text-cyan-400" />
                            Frequently Asked Questions
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Accordion type="single" collapsible>
                            {faqs.map((faq, i) => (
                                <AccordionItem key={i} value={`faq-${i}`}>
                                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                                    <AccordionContent>{faq.answer}</AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Best Practices */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-400" />
                            Best Practices for Teaching Back
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3">
                            {bestPractices.map((practice, i) => (
                                <li key={i} className="flex items-start gap-3 text-slate-300">
                                    <span className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center text-xs text-cyan-400 flex-shrink-0 mt-0.5">
                                        {i + 1}
                                    </span>
                                    {practice}
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Contact */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <Card className="bg-gradient-to-r from-[#101B2D] to-[#162035]">
                    <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-6">
                        <div>
                            <h3 className="text-lg font-semibold text-white">Still have questions?</h3>
                            <p className="text-sm text-slate-400 mt-1">
                                We&apos;re here to help. Reach out and we&apos;ll get back to you soon.
                            </p>
                        </div>
                        <Button variant="outline" asChild>
                            <a href="mailto:support@synapse.ai">
                                <Mail className="h-4 w-4 mr-2" />
                                Contact Support
                            </a>
                        </Button>
                    </CardContent>
                </Card>
            </motion.div>

            {/* About */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <Card>
                    <CardContent className="py-6 text-center">
                        <p className="text-sm text-slate-400">
                            Synapse is an AI-powered English learning platform using the teach-back method.
                        </p>
                        <p className="text-xs text-slate-500 mt-2">
                            Built for hackathon / demo purposes. Version 1.0.0
                        </p>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
