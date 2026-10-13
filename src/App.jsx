import React from 'react'
import { AppProvider, useApp } from './context/AppContext'
import { Navbar } from './components/Navbar'
import { CommunityView } from './components/Community/CommunityView'
import { ClassroomView } from './components/Classroom/ClassroomView'
import { LeaderboardView } from './components/Leaderboard/LeaderboardView'
import { MembersView } from './components/Members/MembersView'
import { AboutView } from './components/About/AboutView'
import { AdminModal } from './components/Admin/AdminModal'
import { AuthModal } from './components/Auth/AuthModal'
import { SupabaseModal } from './components/SupabaseModal'
import { Sparkles, CheckCircle2 } from 'lucide-react'

function AppContent() {
  const {
    activeTab,
    toastMessage,
    isAdminModalOpen,
    setIsAdminModalOpen,
    isAuthModalOpen,
    setIsAuthModalOpen,
    isSupabaseModalOpen,
    setIsSupabaseModalOpen
  } = useApp()

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col antialiased">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <div className="flex-1">
        {activeTab === 'community' && <CommunityView />}
        {activeTab === 'classroom' && <ClassroomView />}
        {activeTab === 'leaderboard' && <LeaderboardView />}
        {activeTab === 'members' && <MembersView />}
        {activeTab === 'about' && <AboutView />}
      </div>

      {/* Global Toast Message */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-[#121829] border border-white/20 text-white shadow-2xl animate-in slide-in-from-bottom-3 duration-200">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-xs font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Global Modals */}
      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <SupabaseModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 mt-12 bg-black/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 VibeHub Community. Built with React, Vite, Supabase & Tailwind.</p>
          <div className="flex items-center gap-6">
            <span>Zero Platform Fees</span>
            <span>100% Owned Platform</span>
            <span>Gamified LMS</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}
