import React, { useState } from 'react'
import { X, Database, Check, Copy, ShieldCheck, Terminal, FileCode, ExternalLink } from 'lucide-react'
import { useApp } from '../context/AppContext'

export function SupabaseModal({ isOpen, onClose }) {
  const { isSupabaseConfigured, showToast } = useApp()
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const handleCopyEnv = () => {
    const envText = `VITE_SUPABASE_URL=https://your-project.supabase.co\nVITE_SUPABASE_ANON_KEY=your-anon-public-key`
    navigator.clipboard.writeText(envText)
    setCopied(true)
    showToast('Copied .env template to clipboard')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCopySchemaPath = () => {
    navigator.clipboard.writeText('supabase/schema.sql')
    showToast('Schema file path copied (supabase/schema.sql)')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-[#0e1424] border border-white/15 rounded-3xl shadow-2xl p-6 relative animate-in zoom-in-95 duration-150 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${
              isSupabaseConfigured ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
            }`}>
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Supabase Architecture</h2>
              <p className="text-xs text-slate-400">
                {isSupabaseConfigured ? 'Connected to Live Supabase' : 'Running in Local Standalone Mode'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Security Isolation Notice */}
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3 text-xs">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="text-white block font-semibold">100% Data Isolation</strong>
            <p className="text-slate-300 leading-relaxed">
              This community app is a completely separate standalone project. Your personal Super App data, financial journals, and notes remain entirely private and untouched.
            </p>
          </div>
        </div>

        {/* How to Connect */}
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Step 1: Create Schema in Supabase</span>
          <p className="text-xs text-slate-300 leading-relaxed">
            We generated a production-ready SQL script at <code className="text-amber-300 bg-white/10 px-1.5 py-0.5 rounded font-mono">supabase/schema.sql</code> complete with RLS policies, automated XP triggers, and seed channels.
          </p>
          <button
            onClick={handleCopySchemaPath}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-300 hover:text-white transition-colors"
          >
            <FileCode className="w-4 h-4 text-amber-400" />
            <span>File location: supabase/schema.sql</span>
          </button>
        </div>

        {/* .env Setup */}
        <div className="space-y-3 pt-3 border-t border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Step 2: Add .env Variables</span>
            <button
              onClick={handleCopyEnv}
              className="flex items-center gap-1.5 text-xs text-amber-300 hover:underline"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Template'}</span>
            </button>
          </div>

          <pre className="p-3.5 rounded-2xl bg-black/60 border border-white/10 font-mono text-[11px] text-slate-300 overflow-x-auto">
{`VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key`}
          </pre>
          <p className="text-[11px] text-slate-400">
            Paste these into <code className="text-white font-mono">.env</code> in your project root to switch from local mock data to live cloud persistence!
          </p>
        </div>

      </div>
    </div>
  )
}
