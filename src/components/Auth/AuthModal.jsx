import React, { useState } from 'react'
import { X, Users, Check, Sparkles, Mail, Lock, Shield, UserPlus, LogIn, AlertCircle } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { INITIAL_USER, INITIAL_LEADERBOARD } from '../../data/mockData'
import { isSupabaseConfigured, supabase } from '../../lib/supabase'

export function AuthModal({ isOpen, onClose }) {
  const { user, setUser, showToast } = useApp()
  const [authMode, setAuthMode] = useState('signin') // 'signin' | 'signup'
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

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

  // Real Supabase Auth (Sign In or Sign Up)
  const handleSupabaseAuth = async (e) => {
    e.preventDefault()
    setErrorMessage('')
    setLoading(true)

    if (!isSupabaseConfigured || !supabase) {
      setUser(prev => ({
        ...prev,
        name: fullName || email.split('@')[0],
        email: email,
        username: email.split('@')[0],
        role: 'member'
      }))
      showToast(`Logged in as ${email}`)
      setLoading(false)
      onClose()
      return
    }

    try {
      if (authMode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password: password,
          options: {
            data: {
              full_name: fullName.trim() || email.split('@')[0]
            }
          }
        })

        if (error) throw error

        if (data?.user) {
          showToast('Account created! Welcome to the community.')
          setUser(prev => ({
            ...prev,
            id: data.user.id,
            name: fullName.trim() || email.split('@')[0],
            email: email,
            username: email.split('@')[0],
            role: 'member',
            level: 1,
            xp: 0
          }))
          onClose()
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password
        })

        if (error) throw error

        if (data?.user) {
          // Fetch user profile from Supabase
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single()

          setUser(prev => ({
            ...prev,
            id: data.user.id,
            email: data.user.email,
            name: profile?.full_name || data.user.user_metadata?.full_name || data.user.email.split('@')[0],
            username: profile?.username || data.user.email.split('@')[0],
            avatar: profile?.avatar_url || prev.avatar,
            level: profile?.level || 1,
            xp: profile?.xp || 0,
            role: profile?.role || 'member'
          }))

          showToast(`Welcome back, ${profile?.full_name || data.user.email}!`)
          onClose()
        }
      }
    } catch (err) {
      setErrorMessage(err.message || 'Authentication error')
    } finally {
      setLoading(false)
    }
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
      <div className="w-full max-w-md bg-[#0e1424] border border-white/15 rounded-3xl shadow-2xl p-6 relative animate-in zoom-in-95 duration-150 space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center border border-amber-500/30">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Member Access & Accounts</h2>
              <p className="text-xs text-slate-400">Sign in with Supabase Auth or test personas</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Real Supabase Auth Section */}
        <div className="space-y-3">
          {/* Sign In vs Sign Up Tabs */}
          <div className="flex items-center p-1 rounded-2xl bg-black/40 border border-white/10 text-xs">
            <button
              onClick={() => { setAuthMode('signin'); setErrorMessage('') }}
              className={`flex-1 py-1.5 rounded-xl font-medium flex items-center justify-center gap-1.5 transition-all ${
                authMode === 'signin' ? 'bg-white/15 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
            <button
              onClick={() => { setAuthMode('signup'); setErrorMessage('') }}
              className={`flex-1 py-1.5 rounded-xl font-medium flex items-center justify-center gap-1.5 transition-all ${
                authMode === 'signup' ? 'bg-white/15 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create Account</span>
            </button>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSupabaseAuth} className="space-y-2.5">
            {authMode === 'signup' && (
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full skool-input px-3.5 py-2 rounded-xl text-xs placeholder:text-slate-500"
                />
              </div>
            )}

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@example.com"
                className="w-full skool-input px-3.5 py-2 rounded-xl text-xs placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full skool-input px-3.5 py-2 rounded-xl text-xs placeholder:text-slate-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-white shadow-lg shadow-rose-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Connecting...</span>
              ) : authMode === 'signup' ? (
                <>
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Join Community (Free Account)</span>
                </>
              ) : (
                <>
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Quick Persona Switcher for Creator Testing */}
        <div className="pt-3 border-t border-white/10 space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Quick Test Personas (Preview as)</span>
          
          <div className="space-y-1.5">
            {personas.map((p) => {
              const isSelected = user.id === p.id

              return (
                <button
                  key={p.id}
                  onClick={() => handleSelectPersona(p)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl border transition-all text-left ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-500/40 text-white shadow-sm'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={p.avatar}
                      alt={p.name}
                      className="w-8 h-8 rounded-lg object-cover border border-white/15"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white">{p.name}</span>
                        <span className="px-1.5 py-0.2 rounded bg-white/10 text-[10px] font-mono text-amber-300">
                          Lvl {p.level}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400">{p.badge}</span>
                    </div>
                  </div>

                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-amber-400" />
                  )}
                </button>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}
