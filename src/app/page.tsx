'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  ArrowRight,
  BookOpen,
  RefreshCw,
  Trophy,
  Brain,
  Target,
  MessageSquare,
  History,
  Sparkles,
  Zap,
  CheckCircle,
  Users,
  Star,
  TrendingUp,
  Play,
  Quote,
  ChevronLeft,
  ChevronRight,
  Award,
  Flame,
  Globe,
} from 'lucide-react';
import { RecitoLogo } from '@/components/ui/recito-logo';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0B1220] overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-cyan-500/8 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-violet-500/8 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-2/3 left-1/3 w-[400px] h-[400px] bg-pink-500/5 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '2s' }} />

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/30 rounded-full"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
            }}
            animate={{
              y: [null, Math.random() * -200],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/8 bg-[#0B1220]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <RecitoLogo size="md" />
          <div className="flex items-center gap-4">
            <a href="#features" className="hidden md:block text-sm text-slate-400 hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hidden md:block text-sm text-slate-400 hover:text-white transition-colors">How it Works</a>
            <Link href="/auth">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link href="/auth">
              <Button size="sm" className="bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-600 hover:to-violet-600">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/10 to-violet-500/10 border border-cyan-500/20 mb-8"
            >
              <Sparkles className="h-4 w-4 text-cyan-400" />
              <span className="text-sm text-cyan-300">AI-Powered Learning Revolution</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
              Master English by{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                Teaching It Back
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10">
              Recito flips traditional learning. Learn a micro-lesson, then switch roles—
              <strong className="text-white">you become the teacher</strong>. Get instant AI feedback
              on clarity, accuracy, and fluency.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/auth">
                <Button size="lg" className="gap-2 bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-600 hover:to-violet-600 text-lg px-8 py-6 text-white">
                  Start Learning Free
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" asChild className="text-lg px-8 py-6 border-white/20 hover:bg-white/5 text-white">
                <a href="#demo">Watch Demo</a>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-cyan-400" />
                <span>Join 10,000+ learners</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-400" />
                <span>4.9/5 rating</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 px-4 bg-gradient-to-r from-cyan-500/5 via-violet-500/5 to-cyan-500/5 border-y border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '10K+', label: 'Active Learners', icon: Users },
              { value: '85%', label: 'Score Improvement', icon: TrendingUp },
              { value: '50+', label: 'Grammar Topics', icon: BookOpen },
              { value: '4.9★', label: 'User Rating', icon: Star },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center"
              >
                <stat.icon className="h-6 w-6 text-cyan-400 mb-2" />
                <p className="text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-slate-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-cyan-400 text-sm font-semibold tracking-wider uppercase">The Method</span>
            <h2 className="text-4xl font-bold text-white mt-2">
              Three Steps to Mastery
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: BookOpen,
                step: '01',
                title: 'Learn',
                description: 'AI delivers a focused 5-minute micro-lesson on grammar, vocabulary, or speaking patterns.',
                color: 'cyan',
              },
              {
                icon: RefreshCw,
                step: '02',
                title: 'Teach Back',
                description: 'Roles swap—explain the concept as if you are the teacher. Type or speak your explanation.',
                color: 'violet',
              },
              {
                icon: Trophy,
                step: '03',
                title: 'Get Scored',
                description: 'Receive detailed AI feedback: correctness, clarity, coverage. See exactly where to improve.',
                color: 'green',
              },
            ].map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative group"
              >
                <div className={`absolute inset-0 bg-${step.color}-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity`} />
                <div className="relative rounded-2xl border border-white/10 bg-[#101B2D]/80 backdrop-blur p-8 h-full hover:border-white/20 transition-colors">
                  <span className={`text-5xl font-bold text-${step.color}-500/20`}>{step.step}</span>
                  <div className={`w-14 h-14 rounded-xl bg-${step.color}-500/10 flex items-center justify-center mt-4 mb-4`}>
                    <step.icon className={`h-7 w-7 text-${step.color}-400`} />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-slate-400">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-24 px-4 bg-gradient-to-b from-transparent via-[#101B2D]/50 to-transparent">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-violet-400 text-sm font-semibold tracking-wider uppercase">See It In Action</span>
            <h2 className="text-4xl font-bold text-white mt-2">
              The Role-Swap Experience
            </h2>
          </motion.div>

          <div className="rounded-3xl border border-white/10 bg-[#101B2D]/80 backdrop-blur-sm p-8 md:p-10 shadow-2xl">
            <div className="space-y-5">
              {/* AI Tutor message */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex gap-4"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-cyan-500/20">
                  <Brain className="h-5 w-5 text-white" />
                </div>
                <div className="rounded-2xl rounded-tl-sm bg-white/5 border border-white/10 p-5 max-w-lg">
                  <p className="text-xs text-cyan-400 font-semibold mb-1">AI TUTOR</p>
                  <p className="text-slate-200">
                    Use &ldquo;present perfect&rdquo; when the action has a connection to now.
                    Example: &ldquo;I have lost my keys&rdquo; means I <em>still</em> don&apos;t have them.
                  </p>
                </div>
              </motion.div>

              {/* User teaching */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="flex gap-4 justify-end"
              >
                <div className="rounded-2xl rounded-tr-sm bg-gradient-to-r from-cyan-500/20 to-violet-500/20 border border-cyan-500/20 p-5 max-w-lg">
                  <p className="text-xs text-white/70 font-semibold mb-1">YOU TEACH</p>
                  <p className="text-slate-200">
                    Present perfect is for actions that still matter now. Like &ldquo;I have visited Paris&rdquo;—
                    the exact time isn&apos;t important, the experience is.
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center flex-shrink-0 text-sm font-bold shadow-lg shadow-violet-500/20">
                  YOU
                </div>
              </motion.div>

              {/* AI Student question */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="flex gap-4"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-violet-500/20">
                  <MessageSquare className="h-5 w-5 text-white" />
                </div>
                <div className="rounded-2xl rounded-tl-sm bg-white/5 border border-white/10 p-5 max-w-lg">
                  <p className="text-xs text-violet-400 font-semibold mb-1">AI STUDENT</p>
                  <p className="text-slate-200">
                    What about &ldquo;I saw him yesterday&rdquo;? Why can&apos;t I say
                    &ldquo;I have seen him yesterday&rdquo;?
                  </p>
                </div>
              </motion.div>

              {/* Score card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="mt-8 rounded-2xl border-2 border-green-500/30 bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-6"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Trophy className="h-7 w-7 text-green-400" />
                  </div>
                  <div>
                    <p className="text-4xl font-bold text-green-400">78%</p>
                    <p className="text-sm text-green-300/70">Strong Understanding</p>
                  </div>
                  <div className="ml-auto flex gap-2">
                    <span className="px-3 py-1 rounded-full text-xs bg-green-500/20 text-green-300">Clarity ✓</span>
                    <span className="px-3 py-1 rounded-full text-xs bg-green-500/20 text-green-300">Examples ✓</span>
                    <span className="px-3 py-1 rounded-full text-xs bg-yellow-500/20 text-yellow-300">Since/For</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-cyan-400 text-sm font-semibold tracking-wider uppercase">Why It Works</span>
            <h2 className="text-4xl font-bold text-white mt-2">
              Built for Real Learning
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-6">
            {[
              {
                icon: Brain,
                title: 'Feynman-style Learning',
                description: 'Teaching is the best way to learn. If you can explain it, you truly understand it.',
                gradient: 'from-cyan-500/20 to-blue-500/20',
              },
              {
                icon: Target,
                title: 'Weak-spot Detection',
                description: 'AI identifies exactly where your understanding breaks down and targets those gaps.',
                gradient: 'from-violet-500/20 to-purple-500/20',
              },
              {
                icon: MessageSquare,
                title: 'Writing + Speaking',
                description: 'Practice explaining in writing first, then graduate to voice-based teaching sessions.',
                gradient: 'from-green-500/20 to-emerald-500/20',
              },
              {
                icon: History,
                title: 'Progress Tracking',
                description: 'Track every session, review corrections, and watch your improvement over time.',
                gradient: 'from-orange-500/20 to-amber-500/20',
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`flex gap-5 p-6 rounded-2xl bg-gradient-to-br ${feature.gradient} border border-white/5 hover:border-white/10 transition-colors`}
              >
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                  <p className="text-sm text-slate-300">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-transparent via-violet-500/5 to-transparent">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-violet-400 text-sm font-semibold tracking-wider uppercase">Success Stories</span>
            <h2 className="text-4xl font-bold text-white mt-2">
              Loved by Learners Worldwide
            </h2>
            <p className="text-slate-400 mt-4 max-w-2xl mx-auto">
              Join thousands of students who've transformed their English skills with Recito
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Sarah Chen',
                role: 'IELTS Student',
                country: '🇨🇳 China',
                avatar: 'SC',
                rating: 5,
                quote: 'My IELTS speaking score improved from 6.0 to 7.5 in just 2 months. The teaching method really works!',
                gradient: 'from-cyan-500 to-blue-500',
              },
              {
                name: 'Ahmed Hassan',
                role: 'Business Professional',
                country: '🇪🇬 Egypt',
                avatar: 'AH',
                rating: 5,
                quote: 'I can now present confidently in English meetings. The AI feedback helped me fix grammar issues I never knew I had.',
                gradient: 'from-violet-500 to-purple-500',
              },
              {
                name: 'Maria Garcia',
                role: 'University Student',
                country: '🇲🇽 Mexico',
                avatar: 'MG',
                rating: 5,
                quote: 'Teaching concepts back to the AI student is genius. I finally understand when to use present perfect!',
                gradient: 'from-pink-500 to-rose-500',
              },
              {
                name: 'Yuki Tanaka',
                role: 'Software Engineer',
                country: '🇯🇵 Japan',
                avatar: 'YT',
                rating: 5,
                quote: 'The grammar games are addictive. I practice during my commute and my writing has improved dramatically.',
                gradient: 'from-green-500 to-emerald-500',
              },
              {
                name: 'Olga Petrova',
                role: 'English Teacher',
                country: '🇷🇺 Russia',
                avatar: 'OP',
                rating: 5,
                quote: 'I recommend Recito to all my students. The teach-back method reinforces concepts better than any textbook.',
                gradient: 'from-orange-500 to-amber-500',
              },
              {
                name: 'David Kim',
                role: 'MBA Candidate',
                country: '🇰🇷 South Korea',
                avatar: 'DK',
                rating: 5,
                quote: 'From hesitant speaker to confident presenter in 3 months. Recito changed how I approach language learning.',
                gradient: 'from-teal-500 to-cyan-500',
              },
            ].map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative rounded-2xl border border-white/10 bg-[#101B2D]/60 backdrop-blur p-6 h-full hover:border-white/20 transition-colors">
                  {/* Quote icon */}
                  <Quote className="h-8 w-8 text-white/10 absolute top-4 right-4" />

                  {/* Rating */}
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-slate-300 mb-6 leading-relaxed">"{testimonial.quote}"</p>

                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center text-white font-semibold text-sm`}>
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{testimonial.name}</p>
                      <p className="text-xs text-slate-400">{testimonial.role} • {testimonial.country}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 flex flex-wrap items-center justify-center gap-8 text-slate-400"
          >
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-cyan-400" />
              <span>50+ Countries</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-violet-400" />
              <span>EdTech Top 10</span>
            </div>
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-400" />
              <span>10,000+ Daily Active</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-400" />
              <span>4.9/5 App Store</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-500/10 via-violet-500/10 to-cyan-500/10 p-12 text-center overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.1),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(139,92,246,0.1),transparent_50%)]" />

            <div className="relative">
              <Zap className="h-12 w-12 text-cyan-400 mx-auto mb-6" />
              <h2 className="text-4xl font-bold text-white mb-4">
                Ready to Learn Differently?
              </h2>
              <p className="text-lg text-slate-300 mb-8 max-w-lg mx-auto">
                Join thousands of learners who&apos;ve discovered the power of teaching to master English faster.
              </p>
              <Link href="/auth">
                <Button size="lg" className="gap-2 bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-600 hover:to-violet-600 text-lg px-10 py-6 text-white">
                  Start Your First Lesson
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <p className="mt-4 text-sm text-slate-400">
                Free forever • No credit card required
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/8 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <RecitoLogo size="sm" />
            <div className="flex gap-8 text-sm text-slate-400">
              <a href="#" className="hover:text-white transition-colors">About</a>
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
            <p className="text-sm text-slate-500">
              © 2026 Recito. Built with ❤️
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
