import React, { useState, useMemo } from 'react'
import { Users, Search, Shield, Sparkles, MessageSquare, Award } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export function MembersView() {
  const { leaderboard, posts } = useApp()
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all') // 'all' | 'admin' | 'moderator' | 'member'

  const filteredMembers = useMemo(() => {
    return leaderboard.filter(member => {
      const matchesSearch =
        !searchQuery.trim() ||
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.username.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesRole = roleFilter === 'all' || member.role === roleFilter

      return matchesSearch && matchesRole
    })
  }, [leaderboard, searchQuery, roleFilter])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Users className="w-7 h-7 text-amber-400" />
            <span>Members Directory</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Connect with founders, vibe coders, and students in our community ({leaderboard.length} total members).
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search members..."
              className="w-full skool-input pl-9 pr-4 py-2 rounded-xl text-xs placeholder:text-slate-500"
            />
          </div>

          <div className="flex items-center p-1 rounded-xl bg-black/40 border border-white/10 text-xs w-full sm:w-auto">
            {['all', 'admin', 'moderator', 'member'].map(role => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-all ${
                  roleFilter === role ? 'bg-white/15 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredMembers.map((member) => {
          const memberPosts = posts.filter(p => p.author.id === member.id)

          return (
            <div
              key={member.id}
              className="skool-card rounded-3xl p-5 flex flex-col justify-between space-y-4 hover:border-white/20 transition-all group"
            >
              <div className="flex items-start justify-between">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-14 h-14 rounded-2xl object-cover border border-white/15 group-hover:scale-105 transition-transform"
                />
                <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 font-mono text-xs text-slate-300">
                  Lvl {member.level}
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors">
                    {member.name}
                  </h3>
                  {member.role === 'admin' && (
                    <span className="px-1.5 py-0.2 rounded bg-indigo-500/20 text-[10px] font-medium text-indigo-300 border border-indigo-500/30">
                      Admin
                    </span>
                  )}
                  {member.role === 'moderator' && (
                    <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-[10px] font-medium text-emerald-300 border border-emerald-500/30">
                      Mod
                    </span>
                  )}
                </div>
                <span className="text-xs text-slate-400 font-mono">@{member.username}</span>
                <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  Building next-generation tools and learning full-stack development with Supabase.
                </p>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-amber-300 font-semibold">{member.xp} XP</span>
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{memberPosts.length} posts</span>
                </span>
              </div>
            </div>
          )
        })}
      </div>

    </div>
  )
}
