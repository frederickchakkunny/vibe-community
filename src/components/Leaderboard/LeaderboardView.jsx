import React, { useState } from 'react'
import {
  Trophy,
  Medal,
  Crown,
  Sparkles,
  ArrowUpRight,
  Shield,
  CheckCircle2,
  Lock,
  Flame
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { LEVEL_TIERS } from '../../data/mockData'

export function LeaderboardView() {
  const { leaderboard, user, userProgress } = useApp()
  const [timeframe, setTimeframe] = useState('all') // '7d' | '30d' | 'all'

  // Top 3 Podium Members
  const top1 = leaderboard[0]
  const top2 = leaderboard[1]
  const top3 = leaderboard[2]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Trophy className="w-7 h-7 text-amber-400" />
            <span>Community Leaderboard</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Points (XP) are earned when members upvote your posts, replies, and when you finish course lessons.
          </p>
        </div>

        {/* Timeframe Filter Tabs */}
        <div className="flex items-center p-1 rounded-2xl bg-black/40 border border-white/10 text-xs self-start md:self-auto">
          <button
            onClick={() => setTimeframe('7d')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
              timeframe === '7d' ? 'bg-white/15 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Past 7 Days
          </button>
          <button
            onClick={() => setTimeframe('30d')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
              timeframe === '30d' ? 'bg-white/15 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Past 30 Days
          </button>
          <button
            onClick={() => setTimeframe('all')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
              timeframe === 'all' ? 'bg-white/15 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            All-Time High
          </button>
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        
        {/* Rank 2 (Silver) */}
        {top2 && (
          <div className="skool-card rounded-3xl p-6 flex flex-col items-center text-center relative border-white/15 order-2 md:order-1 self-end">
            <div className="absolute -top-3 px-3 py-0.5 rounded-full bg-slate-300 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-md">
              <Medal className="w-3.5 h-3.5" />
              <span>#2 Silver</span>
            </div>
            <img
              src={top2.avatar}
              alt={top2.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-300 mt-2 mb-3"
            />
            <h3 className="font-bold text-sm text-white">{top2.name}</h3>
            <span className="text-xs text-slate-400 font-mono">@{top2.username}</span>
            <div className="mt-3 flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-white/10 text-xs font-mono text-slate-300">
                Level {top2.level}
              </span>
              <span className="font-mono text-sm text-amber-300 font-bold">{top2.xp} XP</span>
            </div>
          </div>
        )}

        {/* Rank 1 (Gold) */}
        {top1 && (
          <div className="rounded-3xl p-6 flex flex-col items-center text-center relative bg-gradient-to-b from-amber-500/20 via-[#0e1424] to-[#0e1424] border-2 border-amber-500/40 shadow-2xl shadow-amber-500/10 order-1 md:order-2">
            <div className="absolute -top-3.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg">
              <Crown className="w-3.5 h-3.5 fill-slate-950" />
              <span>#1 Champion</span>
            </div>
            <img
              src={top1.avatar}
              alt={top1.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-400 mt-2 mb-3 shadow-lg"
            />
            <h3 className="font-bold text-base text-white">{top1.name}</h3>
            <span className="text-xs text-slate-400 font-mono">@{top1.username}</span>
            <div className="mt-3 flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-xs font-mono border border-amber-500/30">
                Level {top1.level}
              </span>
              <span className="font-mono text-base text-amber-300 font-bold">{top1.xp} XP</span>
            </div>
          </div>
        )}

        {/* Rank 3 (Bronze) */}
        {top3 && (
          <div className="skool-card rounded-3xl p-6 flex flex-col items-center text-center relative border-white/15 order-3 self-end">
            <div className="absolute -top-3 px-3 py-0.5 rounded-full bg-amber-700 text-amber-100 font-bold text-xs flex items-center gap-1 shadow-md">
              <Medal className="w-3.5 h-3.5" />
              <span>#3 Bronze</span>
            </div>
            <img
              src={top3.avatar}
              alt={top3.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-700 mt-2 mb-3"
            />
            <h3 className="font-bold text-sm text-white">{top3.name}</h3>
            <span className="text-xs text-slate-400 font-mono">@{top3.username}</span>
            <div className="mt-3 flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-white/10 text-xs font-mono text-slate-300">
                Level {top3.level}
              </span>
              <span className="font-mono text-sm text-amber-300 font-bold">{top3.xp} XP</span>
            </div>
          </div>
        )}

      </div>

      {/* Your Current Level Status Card */}
      <div className="skool-card rounded-3xl p-6 border-white/15 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-14 h-14 rounded-2xl object-cover border border-white/20"
          />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-white">{user.name} (You)</h3>
              <span className="px-2 py-0.5 rounded bg-gradient-to-r from-amber-500 to-rose-500 text-white font-mono text-xs font-bold">
                Level {user.level}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {userProgress.isMax
                ? 'You have reached the pinnacle level!'
                : `${userProgress.remaining} XP needed to reach Level ${user.level + 1} (${userProgress.nextTitle})`}
            </p>
          </div>
        </div>

        <div className="w-full sm:w-64 space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-400">Level Progress</span>
            <span className="text-amber-300 font-bold">{userProgress.percent}%</span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-rose-400 rounded-full transition-all duration-500"
              style={{ width: `${userProgress.percent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Level Perks Roadmap (Level 1 to 9) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>Level Perks & Unlocks Roadmap</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Climb through the ranks to unlock exclusive community privileges and hidden courses.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {LEVEL_TIERS.map((tier) => {
            const isUnlocked = user.level >= tier.level
            const isCurrent = user.level === tier.level

            return (
              <div
                key={tier.level}
                className={`rounded-2xl p-4 border transition-all ${
                  isCurrent
                    ? 'bg-amber-500/10 border-amber-500/40 shadow-lg'
                    : isUnlocked
                    ? 'bg-white/5 border-white/10'
                    : 'bg-black/20 border-white/5 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-white/10 text-white">
                      Lvl {tier.level}
                    </span>
                    <span className="font-bold text-sm text-white">{tier.title}</span>
                  </div>
                  {isUnlocked ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Lock className="w-4 h-4 text-slate-500" />
                  )}
                </div>

                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {tier.perk}
                </p>

                <div className="mt-3 pt-2 border-t border-white/5 flex justify-between text-[11px] font-mono text-slate-400">
                  <span>Req. XP</span>
                  <span className="text-amber-300 font-semibold">{tier.minXp} pts</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Ranked Members List */}
      <div className="skool-card rounded-3xl p-6 border-white/15 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider text-slate-400">
          Rankings ({leaderboard.length} Members)
        </h3>

        <div className="divide-y divide-white/5">
          {leaderboard.map((member, index) => {
            const isMe = member.id === user.id

            return (
              <div
                key={member.id}
                className={`py-3.5 px-3 flex items-center justify-between rounded-xl transition-colors ${
                  isMe ? 'bg-white/10' : 'hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <span className="font-mono text-xs font-bold text-slate-400 w-5 text-center">
                    {index + 1}
                  </span>
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-10 h-10 rounded-xl object-cover border border-white/15"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-white">
                        {member.name} {isMe && '(You)'}
                      </span>
                      {member.role === 'admin' && (
                        <span className="px-1.5 py-0.2 rounded bg-indigo-500/20 text-[10px] font-medium text-indigo-300">
                          Admin
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-400 font-mono">@{member.username}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="px-2 py-0.5 rounded bg-white/5 text-xs font-mono text-slate-300 border border-white/10">
                    Lvl {member.level}
                  </span>
                  <span className="font-mono text-sm font-bold text-amber-300 w-16 text-right">
                    {member.xp} XP
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

    </div>
  )
}
