'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, RefreshCw, Trophy, Brain, Target, MessageSquare, History } from 'lucide-react';
import { SynapseLogo } from '@/components/ui/synapse-logo';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0B1220]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/8 bg-[#0B1220]/90 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <SynapseLogo size="md" />
          <div className="flex items-center gap-4">
            <Link href="/auth">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link href="/auth">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
              Learn English by{' '}
              <span className="gradient-text">Teaching It Back</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-8">
              Synapse flips the classroom. After every micro-lesson, the AI becomes the student
              and you teach. Get scored, corrected, and guided—fast.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth">
                <Button size="lg" className="gap-2">
                  Start Learning
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" asChild>
                <a href="#how-it-works">See How It Works</a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 bg-[#101B2D]/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: BookOpen,
                title: '1. Micro-lesson',
                description: 'AI teaches you a focused grammar rule, vocabulary set, or speaking pattern in 5-10 minutes.',
                color: 'text-cyan-400',
                bg: 'bg-cyan-500/10',
              },
              {
                icon: RefreshCw,
                title: '2. Role Swap',
                description: 'Roles switch—now YOU teach the AI. Explain the concept as if teaching a student.',
                color: 'text-violet-400',
                bg: 'bg-violet-500/10',
              },
              {
                icon: Trophy,
                title: '3. Score & Adapt',
                description: 'Receive detailed feedback: correctness, clarity, and suggestions. Move to your next weak spot.',
                color: 'text-green-400',
                bg: 'bg-green-500/10',
              },
            ].map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="rounded-2xl border border-white/8 bg-[#101B2D] p-6"
              >
                <div className={`w-12 h-12 rounded-xl ${step.bg} flex items-center justify-center mb-4`}>
                  <step.icon className={`h-6 w-6 ${step.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-slate-400 text-sm">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Mock */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            The Role-Swap in Action
          </h2>
          <div className="rounded-2xl border border-white/8 bg-[#101B2D] p-6 md:p-8">
            <div className="space-y-4">
              {/* AI Tutor message */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                  <Brain className="h-4 w-4 text-cyan-400" />
                </div>
                <div className="rounded-2xl rounded-tl-none bg-white/5 p-4 max-w-md">
                  <p className="text-sm text-slate-300">
                    <span className="font-medium text-cyan-400">AI Tutor:</span> Use &ldquo;present perfect&rdquo; when
                    the action has a connection to now. Example: &ldquo;I have lost my keys&rdquo; means I still
                    don&apos;t have them.
                  </p>
                </div>
              </motion.div>

              {/* User teaching */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="flex gap-3 justify-end"
              >
                <div className="rounded-2xl rounded-tr-none bg-cyan-500/20 p-4 max-w-md">
                  <p className="text-sm text-slate-300">
                    <span className="font-medium text-white">You teach:</span> Present perfect is for
                    actions that still matter now. Like &ldquo;I have visited Paris&rdquo;—time not important,
                    experience is.
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center flex-shrink-0 text-xs font-medium">
                  AC
                </div>
              </motion.div>

              {/* AI Student question */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="flex gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="h-4 w-4 text-violet-400" />
                </div>
                <div className="rounded-2xl rounded-tl-none bg-white/5 p-4 max-w-md">
                  <p className="text-sm text-slate-300">
                    <span className="font-medium text-violet-400">AI Student:</span> What about &ldquo;I saw him
                    yesterday&rdquo;? Why can&apos;t I say &ldquo;I have seen him yesterday&rdquo;?
                  </p>
                </div>
              </motion.div>

              {/* Score card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="mt-6 rounded-xl border border-green-500/30 bg-green-500/10 p-4"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Trophy className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-400">78%</p>
                    <p className="text-xs text-slate-400">Strong understanding</p>
                  </div>
                </div>
                <div className="text-xs text-slate-400">
                  ✓ Good examples &nbsp; ✓ Clear explanation &nbsp; ⚠ Add &ldquo;since/for&rdquo; usage
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-4 bg-[#101B2D]/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Why Synapse Works
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              {
                icon: Brain,
                title: 'Feynman-style Learning',
                description: 'Teaching is the best way to learn. If you can explain it, you understand it.',
              },
              {
                icon: Target,
                title: 'Personalized Weak-spot Detection',
                description: 'AI identifies exactly where your understanding breaks down and targets it.',
              },
              {
                icon: MessageSquare,
                title: 'Writing + Speaking Friendly',
                description: 'Practice explaining in writing first, then graduate to speaking sessions.',
              },
              {
                icon: History,
                title: 'Session History & Progress',
                description: 'Track every session, review corrections, and see your improvement over time.',
              },
            ].map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-4 p-4"
              >
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                  <benefit.icon className="h-5 w-5 text-cyan-400" />
                </div>
                <div>
                  <h3 className="font-medium text-white mb-1">{benefit.title}</h3>
                  <p className="text-sm text-slate-400">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to learn differently?
          </h2>
          <p className="text-slate-400 mb-8">
            Start your first teach-back session in under a minute.
          </p>
          <Link href="/auth">
            <Button size="lg" className="gap-2">
              Start Learning Free
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/8 py-8 px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <SynapseLogo size="sm" />
          <div className="flex gap-6 text-sm text-slate-400">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
          <p className="text-xs text-slate-500">
            Built for hackathon / demo purposes.
          </p>
        </div>
      </footer>
    </div>
  );
}
