'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    Flame,
    Trophy,
    Target,
    Star,
    Award,
    Crown,
    Zap,
    TrendingUp,
    Calendar,
    Medal,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Types
export interface UserStats {
    totalSessions: number;
    totalXP: number;
    streakDays: number;
    longestStreak: number;
    averageScore: number;
    sessionsThisWeek: number;
    lastActiveDate: string;
}

export interface LeaderboardEntry {
    id: string;
    name: string;
    xp: number;
    streak: number;
    rank: string;
    avatar?: string;
    isCurrentUser?: boolean;
}

export interface ActivityDay {
    date: string;
    count: number;
    score?: number;
}

// Rank definitions
export const RANKS = [
    { name: 'Student', minXP: 0, icon: '📚', color: 'text-slate-400' },
    { name: 'Scholar', minXP: 100, icon: '🎓', color: 'text-blue-400' },
    { name: 'Teaching Assistant', minXP: 500, icon: '🧑‍🏫', color: 'text-green-400' },
    { name: 'Lecturer', minXP: 1500, icon: '👨‍🏫', color: 'text-purple-400' },
    { name: 'Professor', minXP: 5000, icon: '🎖️', color: 'text-amber-400' },
    { name: 'Master', minXP: 15000, icon: '👑', color: 'text-cyan-400' },
];

export function getRank(xp: number) {
    for (let i = RANKS.length - 1; i >= 0; i--) {
        if (xp >= RANKS[i].minXP) return RANKS[i];
    }
    return RANKS[0];
}

export function getNextRank(xp: number) {
    for (let i = 0; i < RANKS.length; i++) {
        if (xp < RANKS[i].minXP) return RANKS[i];
    }
    return null;
}

// Streak Tracker Component
interface StreakTrackerProps {
    currentStreak: number;
    longestStreak: number;
    lastActive: string;
    dailyGoal?: number;
    todayCount?: number;
}

export function StreakTracker({
    currentStreak,
    longestStreak,
    lastActive,
    dailyGoal = 1,
    todayCount = 0
}: StreakTrackerProps) {
    const isActiveToday = new Date(lastActive).toDateString() === new Date().toDateString();
    const goalProgress = Math.min((todayCount / dailyGoal) * 100, 100);

    // Check if streak is at risk (last active was yesterday)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const streakAtRisk = new Date(lastActive).toDateString() === yesterday.toDateString();

    return (
        <Card className="overflow-hidden">
            <div className={`h-1 ${isActiveToday ? 'bg-gradient-to-r from-orange-500 to-amber-400' : streakAtRisk ? 'bg-yellow-500' : 'bg-slate-700'}`} />
            <CardContent className="pt-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <motion.div
                            animate={isActiveToday ? { scale: [1, 1.1, 1] } : {}}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className={`w-14 h-14 rounded-xl flex items-center justify-center ${isActiveToday ? 'bg-gradient-to-br from-orange-500 to-amber-500' :
                                    streakAtRisk ? 'bg-yellow-500/20' : 'bg-slate-800'
                                }`}
                        >
                            <Flame className={`h-7 w-7 ${isActiveToday ? 'text-white' : streakAtRisk ? 'text-yellow-400' : 'text-slate-500'}`} />
                        </motion.div>
                        <div>
                            <p className="text-3xl font-bold text-white">{currentStreak}</p>
                            <p className="text-xs text-slate-400">day streak</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-slate-400">Best: {longestStreak} days</p>
                        {streakAtRisk && !isActiveToday && (
                            <Badge variant="warning" className="mt-1">
                                <Zap className="h-3 w-3 mr-1" />
                                At risk!
                            </Badge>
                        )}
                    </div>
                </div>

                {/* Daily Goal Progress */}
                <div className="mt-4">
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                        <span>Daily goal</span>
                        <span>{todayCount}/{dailyGoal} sessions</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${goalProgress}%` }}
                            transition={{ duration: 0.5 }}
                            className={`h-full rounded-full ${goalProgress >= 100
                                    ? 'bg-gradient-to-r from-green-500 to-emerald-400'
                                    : 'bg-gradient-to-r from-cyan-500 to-blue-500'
                                }`}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// Activity Heatmap Component (GitHub-style)
interface ActivityHeatmapProps {
    data: ActivityDay[];
    weeks?: number;
}

export function ActivityHeatmap({ data, weeks = 12 }: ActivityHeatmapProps) {
    const days = ['Mon', '', 'Wed', '', 'Fri', '', ''];

    // Generate grid data
    const gridData = useMemo(() => {
        const today = new Date();
        const startDate = new Date(today);
        startDate.setDate(startDate.getDate() - (weeks * 7));

        const grid: { date: string; count: number; score?: number }[][] = [];
        const dataMap = new Map(data.map(d => [d.date.split('T')[0], d]));

        for (let week = 0; week < weeks; week++) {
            const weekData: { date: string; count: number; score?: number }[] = [];
            for (let day = 0; day < 7; day++) {
                const date = new Date(startDate);
                date.setDate(date.getDate() + (week * 7) + day);
                const dateStr = date.toISOString().split('T')[0];
                const dayData = dataMap.get(dateStr);
                weekData.push({
                    date: dateStr,
                    count: dayData?.count || 0,
                    score: dayData?.score,
                });
            }
            grid.push(weekData);
        }
        return grid;
    }, [data, weeks]);

    const getColor = (count: number) => {
        if (count === 0) return 'bg-slate-800/50';
        if (count === 1) return 'bg-green-900';
        if (count === 2) return 'bg-green-700';
        if (count >= 3) return 'bg-green-500';
        return 'bg-slate-800/50';
    };

    const totalSessions = data.reduce((sum, d) => sum + d.count, 0);
    const activeDays = data.filter(d => d.count > 0).length;

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                    <Calendar className="h-5 w-5 text-green-400" />
                    Activity
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex gap-1">
                    {/* Day labels */}
                    <div className="flex flex-col gap-[3px] mr-2 text-[10px] text-slate-500">
                        {days.map((day, i) => (
                            <div key={i} className="h-3">{day}</div>
                        ))}
                    </div>

                    {/* Heatmap grid */}
                    <div className="flex gap-[3px] overflow-x-auto">
                        {gridData.map((week, weekIndex) => (
                            <div key={weekIndex} className="flex flex-col gap-[3px]">
                                {week.map((day, dayIndex) => (
                                    <motion.div
                                        key={dayIndex}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: (weekIndex * 7 + dayIndex) * 0.005 }}
                                        className={`w-3 h-3 rounded-sm ${getColor(day.count)} cursor-pointer hover:ring-1 hover:ring-white/50`}
                                        title={`${day.date}: ${day.count} session${day.count !== 1 ? 's' : ''}`}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Legend */}
                <div className="flex items-center justify-between mt-4 text-xs text-slate-400">
                    <span>{totalSessions} sessions in {activeDays} days</span>
                    <div className="flex items-center gap-1">
                        <span>Less</span>
                        <div className="w-3 h-3 rounded-sm bg-slate-800/50" />
                        <div className="w-3 h-3 rounded-sm bg-green-900" />
                        <div className="w-3 h-3 rounded-sm bg-green-700" />
                        <div className="w-3 h-3 rounded-sm bg-green-500" />
                        <span>More</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// Rank Progress Component
interface RankProgressProps {
    currentXP: number;
}

export function RankProgress({ currentXP }: RankProgressProps) {
    const currentRank = getRank(currentXP);
    const nextRank = getNextRank(currentXP);

    const progress = nextRank
        ? ((currentXP - currentRank.minXP) / (nextRank.minXP - currentRank.minXP)) * 100
        : 100;

    return (
        <Card>
            <CardContent className="pt-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="text-3xl">{currentRank.icon}</div>
                        <div>
                            <p className={`font-semibold ${currentRank.color}`}>{currentRank.name}</p>
                            <p className="text-xs text-slate-400">{currentXP.toLocaleString()} XP</p>
                        </div>
                    </div>
                    {nextRank && (
                        <div className="text-right">
                            <p className="text-sm text-slate-400">Next: {nextRank.name}</p>
                            <p className="text-xs text-slate-500">{(nextRank.minXP - currentXP).toLocaleString()} XP to go</p>
                        </div>
                    )}
                </div>

                {nextRank && (
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.8 }}
                            className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full"
                        />
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

// Leaderboard Component
interface LeaderboardProps {
    entries: LeaderboardEntry[];
    title?: string;
}

export function Leaderboard({ entries, title = "Leaderboard" }: LeaderboardProps) {
    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                    <Trophy className="h-5 w-5 text-amber-400" />
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    {entries.slice(0, 10).map((entry, index) => (
                        <motion.div
                            key={entry.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`flex items-center gap-3 p-2 rounded-lg ${entry.isCurrentUser
                                    ? 'bg-cyan-500/10 border border-cyan-500/30'
                                    : 'bg-slate-800/30'
                                }`}
                        >
                            {/* Rank number */}
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${index === 0 ? 'bg-amber-500 text-black' :
                                    index === 1 ? 'bg-slate-400 text-black' :
                                        index === 2 ? 'bg-amber-700 text-white' :
                                            'bg-slate-700 text-slate-300'
                                }`}>
                                {index + 1}
                            </div>

                            {/* Avatar */}
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center text-white text-sm font-medium">
                                {entry.name.charAt(0).toUpperCase()}
                            </div>

                            {/* Name and rank */}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">
                                    {entry.name}
                                    {entry.isCurrentUser && <span className="text-cyan-400 ml-1">(You)</span>}
                                </p>
                                <p className="text-xs text-slate-400">{entry.rank}</p>
                            </div>

                            {/* Stats */}
                            <div className="text-right">
                                <p className="text-sm font-semibold text-cyan-400">{entry.xp.toLocaleString()} XP</p>
                                <p className="text-xs text-slate-500 flex items-center justify-end gap-1">
                                    <Flame className="h-3 w-3 text-orange-400" />
                                    {entry.streak}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

// Achievement Badge Component
interface AchievementBadgeProps {
    name: string;
    description: string;
    icon: React.ReactNode;
    unlocked: boolean;
    unlockedDate?: string;
}

export function AchievementBadge({ name, description, icon, unlocked, unlockedDate }: AchievementBadgeProps) {
    return (
        <motion.div
            whileHover={{ scale: unlocked ? 1.05 : 1 }}
            className={`p-4 rounded-xl border ${unlocked
                    ? 'bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/30'
                    : 'bg-slate-800/30 border-white/5 opacity-50'
                }`}
        >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${unlocked
                    ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white'
                    : 'bg-slate-700 text-slate-500'
                }`}>
                {icon}
            </div>
            <p className={`font-medium text-sm ${unlocked ? 'text-white' : 'text-slate-500'}`}>{name}</p>
            <p className="text-xs text-slate-400 mt-1">{description}</p>
            {unlockedDate && (
                <p className="text-xs text-amber-400 mt-2">
                    Unlocked {new Date(unlockedDate).toLocaleDateString()}
                </p>
            )}
        </motion.div>
    );
}

// XP Gain Animation
interface XPGainProps {
    amount: number;
    show: boolean;
    onComplete?: () => void;
}

export function XPGain({ amount, show, onComplete }: XPGainProps) {
    if (!show) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 0, scale: 0.8 }}
            animate={{ opacity: 1, y: -30, scale: 1 }}
            exit={{ opacity: 0, y: -60 }}
            onAnimationComplete={onComplete}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
        >
            <div className="text-4xl font-bold text-cyan-400 flex items-center gap-2">
                <Star className="h-8 w-8 fill-cyan-400" />
                +{amount} XP
            </div>
        </motion.div>
    );
}
