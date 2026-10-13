import React, { useState } from 'react'
import { X, Users, Check, Sparkles, Mail, Lock, Shield } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { INITIAL_USER, INITIAL_LEADERBOARD } from '../../data/mockData'

export function AuthModal({ isOpen, onClose }) {
  const { user, setUser, showToast } = useApp()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  if (!isOpen) return null

  // Switch to one of the mock personas
  const handleSelectPersona = (targetUser) => {
    setUser(prev => ({
      ...prev,
      id: targetUser.id,
      name: targetUser.name,
      username: targetUser.username,
      avatar: targetUser.avatar,
      level: targetUser.level,
      xp: targetUser.xp,
      role: targetUser.role
    }))
    showToast(`Switched active profile to ${targetUser.name} (Lvl ${targetUser.level})`)
    onClose()
  }

  const handleSupabaseAuth = (e) => {
    e.preventDefault()
    showToast(`Signed in as ${email}`)
    onClose()
  }

  const personas = [
    {
      ...INITIAL_USER,
      badge: 'Admin Creator (Lvl 3)'
    },
    {
      ...INITIAL_LEADERBOARD[0], // Elena (Lvl 5)
      badge: 'Top Champion (Lvl 5)'
    },
    {
      ...INITIAL_LEADERBOARD[5], // David (Lvl 1)
      badge: 'Newbie Student (Lvl 1)'
    }
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-[#0e1424] border border-white/15 rounded-3xl shadow-2xl p-6 relative animate-in zoom-in-95 duration-150 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center border border-amber-500/30">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Switch Active Persona</h2>
              <p className="text-xs text-slate-400">Test gamification & course locks instantly</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Persona Switcher */}
        <div className="space-y-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Quick Test Personas</span>
          
          <div className="space-y-2">
            {personas.map((p) => {
              const isSelected = user.id === p.id

              return (
                <button
                  key={p.id}
                  onClick={() => handleSelectPersona(p)}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all text-left ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-500/40 text-white shadow-sm'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={p.avatar}
                      alt={p.name}
                      className="w-10 h-10 rounded-xl object-cover border border-white/15"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{p.name}</span>
                        <span className="px-1.5 py-0.2 rounded bg-white/10 text-[10px] font-mono text-amber-300">
                          Lvl {p.level}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400">{p.badge}</span>
                    </div>
                  </div>

                  {isSelected && (
                    <Check className="w-4 h-4 text-amber-400" />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Live Supabase Auth Form */}
        <div className="pt-4 border-t border-white/10 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Supabase Auth Login</span>
          
          <form onSubmit={handleSupabaseAuth} className="space-y-3">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                className="w-full skool-input px-3.5 py-2 rounded-xl text-xs placeholder:text-slate-500"
              />
            </div>
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full skool-input px-3.5 py-2 rounded-xl text-xs placeholder:text-slate-500"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-white border border-white/10 transition-colors"
            >
              Sign In with Supabase
            </button>
          </form>
        </div>

      </div>
    </div>
  )
}
