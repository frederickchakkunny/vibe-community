import React, { useState } from 'react'
import {
  Info,
  ShieldCheck,
  CheckCircle2,
  CreditCard,
  Sparkles,
  Zap,
  Lock,
  ArrowRight,
  ExternalLink
} from 'lucide-react'
import { useApp } from '../../context/AppContext'

export function AboutView() {
  const { user, awardXp, showToast } = useApp()
  const [isSimulatingStripe, setIsSimulatingStripe] = useState(false)

  const handleSimulateStripe = () => {
    setIsSimulatingStripe(true)
    setTimeout(() => {
      setIsSimulatingStripe(false)
      awardXp(50, 'Subscribed to Pro Mastermind via Stripe')
      showToast('💳 Stripe Webhook verified! You unlocked Pro Mastermind +50 XP!')
    }, 1200)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Hero Section */}
      <div className="skool-card rounded-3xl p-8 sm:p-12 relative overflow-hidden border-white/15">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-500/10 via-rose-500/10 to-indigo-500/10 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Independent Vibe-Coded Platform</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Build, Learn, and Scale Together.
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Welcome to our private community. Instead of paying hefty $99/month SaaS fees to third-party tools, this platform is 100% custom-built with React, Supabase, and Stripe. You get real-time discussions, gamified leveling, and structured video courses.
          </p>
        </div>
      </div>

      {/* Pricing / Stripe Paywall Section */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Membership Tiers & Stripe Paywall
          </h2>
          <p className="text-xs text-slate-400">
            Automate membership access with Stripe Webhooks. 100% of revenue goes directly to your bank account with zero platform cut.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          
          {/* Free Tier */}
          <div className="skool-card rounded-3xl p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Standard Access</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-white font-mono">$0</span>
                <span className="text-xs text-slate-400">/ forever</span>
              </div>
              <p className="text-xs text-slate-300">
                Full access to public discussion channels and introductory course modules.
              </p>

              <ul className="space-y-2.5 text-xs text-slate-300 pt-4 border-t border-white/10">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Access to General & Q&A channels</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Classroom access up to Level 3 courses</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Earn XP and leaderboard rank</span>
                </li>
              </ul>
            </div>

            <button
              disabled
              className="w-full py-3 rounded-2xl text-xs font-semibold bg-white/10 text-slate-300 cursor-default"
            >
              Current Active Tier
            </button>
          </div>

          {/* Pro Mastermind Tier */}
          <div className="rounded-3xl p-8 flex flex-col justify-between space-y-6 relative bg-gradient-to-b from-indigo-500/10 via-[#0e1424] to-[#0e1424] border-2 border-indigo-500/40 shadow-2xl shadow-indigo-500/10">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-indigo-300 font-bold">Pro Mastermind</span>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-mono border border-indigo-500/40">
                  RECOMMENDED
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-white font-mono">$49</span>
                <span className="text-xs text-slate-400">/ month</span>
              </div>
              <p className="text-xs text-slate-300">
                Unlocks all advanced masterclasses, direct Discord/Slack webhook sync, and weekly code reviews.
              </p>

              <ul className="space-y-2.5 text-xs text-slate-300 pt-4 border-t border-white/10">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Everything in Free, plus:</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>All Advanced Level 4+ Masterclass Courses</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Instant +50 Bonus XP boost</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Direct private mastermind channel access</span>
                </li>
              </ul>
            </div>

            <button
              onClick={handleSimulateStripe}
              disabled={isSimulatingStripe}
              className="w-full py-3 rounded-2xl text-xs font-bold bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-500 hover:opacity-90 text-white shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all"
            >
              <CreditCard className="w-4 h-4" />
              <span>{isSimulatingStripe ? 'Processing Stripe Checkout...' : 'Simulate Stripe Checkout ($49)'}</span>
            </button>
          </div>

        </div>
      </div>

      {/* Community Rules */}
      <div className="skool-card rounded-3xl p-8 space-y-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span>Community Guidelines & Code of Conduct</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300">
          <div className="p-4 rounded-2xl bg-white/5 space-y-1.5">
            <strong className="text-white block text-sm">1. High Signal Only</strong>
            <p className="text-slate-400 leading-relaxed">
              Share actionable lessons, actual code, and real experiments. Avoid generic self-promotion or affiliate link spam.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 space-y-1.5">
            <strong className="text-white block text-sm">2. Respectful Collaboration</strong>
            <p className="text-slate-400 leading-relaxed">
              We have beginners and veteran engineers alike. Provide kind, constructive feedback on everyone's projects.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 space-y-1.5">
            <strong className="text-white block text-sm">3. Earn Upvotes Honestly</strong>
            <p className="text-slate-400 leading-relaxed">
              Gamification points unlock real privileges. Win them by answering questions and shipping genuine value.
            </p>
          </div>
        </div>
      </div>

    </div>
  )
}
