import React, { useState } from 'react'
import {
  MessageSquare,
  GraduationCap,
  Trophy,
  Users,
  Info,
  Shield,
  Database,
  ChevronDown,
  Sparkles,
  Sun,
  Moon,
  ExternalLink
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { LEVEL_TIERS } from '../data/mockData'

export function Navbar() {
  const {
    activeTab,
    setActiveTab,
    user,
    userProgress,
    setIsAdminModalOpen,
    setIsAuthModalOpen,
    setIsSupabaseModalOpen,
    isSupabaseConfigured,
    theme,
    toggleTheme
  } = useApp()

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)

  const navItems = [
    { id: 'community', label: 'Community', icon: MessageSquare },
    { id: 'classroom', label: 'Classroom', icon: GraduationCap },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'about', label: 'About', icon: Info },
  ]

  const currentLevelObj = LEVEL_TIERS.find(t => t.level === user.level) || LEVEL_TIERS[0]

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0a0e1a]/90 backdrop-blur-md border-b border-slate-200 dark:border-white/10 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setActiveTab('community')}
              className="flex items-center gap-3 text-left focus:outline-none group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-500 flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">VibeHub</span>
                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 font-bold">PRO</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Community & Academy</p>
              </div>
            </button>

            {/* Desktop Navigation Tabs */}
            <nav className="hidden md:flex items-center gap-1 ml-4">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = activeTab === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-slate-100 dark:bg-white/15 text-slate-900 dark:text-white shadow-xs border border-slate-200 dark:border-white/15'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-white/5'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-amber-500 dark:text-amber-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Right Header Area */}
          <div className="flex items-center gap-2.5 sm:gap-3">

            {/* Theme Toggle Button (Light / Dark) */}
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center w-9 h-9 rounded-xl bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-white/20 transition-all"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            {/* Supabase Status Pill */}
            <button
              onClick={() => setIsSupabaseModalOpen(true)}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 transition-colors"
              title="Click to view Supabase setup & schema"
            >
              <div className={`w-2 h-2 rounded-full ${isSupabaseConfigured ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
              <Database className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span className="text-slate-700 dark:text-slate-300">{isSupabaseConfigured ? 'Supabase Live' : 'Supabase Ready'}</span>
            </button>

            {/* Admin Studio Trigger */}
            {user.role === 'admin' && (
              <button
                onClick={() => setIsAdminModalOpen(true)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-all"
              >
                <Shield className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                <span>Admin Studio</span>
              </button>
            )}

            {/* User Gamification XP Pill */}
            <div 
              onClick={() => setActiveTab('leaderboard')}
              className="cursor-pointer flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 transition-all"
            >
              <div className="flex items-center justify-center px-1.5 py-0.5 rounded-md bg-gradient-to-r from-amber-500 to-rose-500 text-white font-mono text-xs font-bold shadow-xs">
                Lvl {user.level}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center justify-between gap-3 text-[11px]">
                  <span className="text-slate-500 dark:text-slate-400">{currentLevelObj.title}</span>
                  <span className="font-mono text-amber-600 dark:text-amber-300 font-bold">{user.xp} XP</span>
                </div>
                <div className="w-16 sm:w-20 h-1.5 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden mt-1">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-rose-400 rounded-full transition-all duration-500"
                    style={{ width: `${userProgress.percent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* User Profile Dropdown Trigger */}
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-1.5 p-1 pl-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-200/60 dark:hover:bg-white/10 transition-colors"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-7 h-7 rounded-lg object-cover border border-slate-300 dark:border-white/15"
                />
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 mr-1" />
              </button>

              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-[#111728] border border-slate-200 dark:border-white/15 shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="flex items-center gap-3 p-2 border-b border-slate-100 dark:border-white/10 pb-3 mb-2">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-white/20"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">@{user.username}</p>
                    </div>
                  </div>

                  <div className="px-2 py-1.5 text-xs text-slate-600 dark:text-slate-400 space-y-1">
                    <div className="flex justify-between">
                      <span>Rank Role:</span>
                      <span className="text-slate-900 dark:text-white capitalize font-medium">{user.role}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Completed Lessons:</span>
                      <span className="text-slate-900 dark:text-white font-mono">{user.completedLessons.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Earned XP:</span>
                      <span className="text-amber-600 dark:text-amber-300 font-mono font-bold">{user.xp} pts</span>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 dark:border-white/10 mt-2 pt-2 space-y-1">
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false)
                        setIsAuthModalOpen(true)
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 flex items-center justify-between"
                    >
                      <span>Switch Profile / Login</span>
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false)
                        setIsSupabaseModalOpen(true)
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 flex items-center justify-between"
                    >
                      <span>Supabase Settings & SQL</span>
                      <Database className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-200 dark:border-white/10">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-xs font-medium ${
                  isActive ? 'text-amber-600 dark:text-amber-400 font-semibold' : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            )
          })}
        </div>

      </div>
    </header>
  )
}
