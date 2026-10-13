import React, { useState } from 'react'
import { X, Shield, Plus, BookOpen, MessageSquare, Sparkles } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export function AdminModal({ isOpen, onClose }) {
  const { addCourse, addChannel } = useApp()
  const [activeTab, setActiveTab] = useState('course') // 'course' | 'channel'

  // Course Form State
  const [courseTitle, setCourseTitle] = useState('')
  const [courseDesc, setCourseDesc] = useState('')
  const [courseCover, setCourseCover] = useState('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80')
  const [requiredLevel, setRequiredLevel] = useState(1)
  const [lessonTitle, setLessonTitle] = useState('')
  const [lessonDuration, setLessonDuration] = useState('15 mins')
  const [lessonVideo, setLessonVideo] = useState('https://www.youtube.com/embed/dQw4w9WgXcQ')

  // Channel Form State
  const [channelName, setChannelName] = useState('')
  const [channelDesc, setChannelDesc] = useState('')

  if (!isOpen) return null

  const handleCreateCourse = (e) => {
    e.preventDefault()
    if (!courseTitle.trim()) return

    addCourse({
      title: courseTitle.trim(),
      slug: courseTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: courseDesc.trim() || 'Custom course created via Admin Studio.',
      coverImage: courseCover,
      requiredLevel: Number(requiredLevel),
      modules: [
        {
          id: `mod-${Date.now()}`,
          title: 'Module 1: Getting Started',
          lessons: [
            {
              id: `les-${Date.now()}`,
              title: lessonTitle.trim() || 'Introduction & Setup',
              duration: lessonDuration,
              videoUrl: lessonVideo,
              content: '### Welcome to this new course!\n\nWatch the video above and complete the assignment.',
              resources: []
            }
          ]
        }
      ]
    })

    setCourseTitle('')
    setCourseDesc('')
    onClose()
  }

  const handleCreateChannel = (e) => {
    e.preventDefault()
    if (!channelName.trim()) return

    addChannel({
      name: channelName.trim(),
      description: channelDesc.trim() || 'New discussion space.'
    })

    setChannelName('')
    setChannelDesc('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-[#0e1424] border border-white/15 rounded-3xl shadow-2xl p-6 relative animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center border border-indigo-500/30">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Admin Studio</h2>
              <p className="text-xs text-slate-400">Add new courses, lessons, and channels</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 rounded-2xl bg-black/40 border border-white/10 text-xs mb-5">
          <button
            onClick={() => setActiveTab('course')}
            className={`flex-1 py-2 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${
              activeTab === 'course' ? 'bg-white/15 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Create Course</span>
          </button>
          <button
            onClick={() => setActiveTab('channel')}
            className={`flex-1 py-2 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${
              activeTab === 'channel' ? 'bg-white/15 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Create Channel</span>
          </button>
        </div>

        {activeTab === 'course' ? (
          <form onSubmit={handleCreateCourse} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Course Title</label>
              <input
                type="text"
                required
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
                placeholder="e.g. Next.js & Supabase Mastery"
                className="w-full skool-input px-3.5 py-2 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Course Description</label>
              <textarea
                rows={2}
                value={courseDesc}
                onChange={(e) => setCourseDesc(e.target.value)}
                placeholder="What will students learn in this course?"
                className="w-full skool-input px-3.5 py-2 rounded-xl text-xs resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Required Member Level</label>
                <select
                  value={requiredLevel}
                  onChange={(e) => setRequiredLevel(e.target.value)}
                  className="w-full skool-input px-3.5 py-2 rounded-xl text-xs bg-slate-900 text-white"
                >
                  {[1, 2, 3, 4, 5, 6, 7].map(lvl => (
                    <option key={lvl} value={lvl}>Level {lvl} (Gamified lock)</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">First Lesson Duration</label>
                <input
                  type="text"
                  value={lessonDuration}
                  onChange={(e) => setLessonDuration(e.target.value)}
                  className="w-full skool-input px-3.5 py-2 rounded-xl text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">First Lesson Title</label>
              <input
                type="text"
                value={lessonTitle}
                onChange={(e) => setLessonTitle(e.target.value)}
                placeholder="1.1 Overview & Architecture"
                className="w-full skool-input px-3.5 py-2 rounded-xl text-xs"
              />
            </div>

            <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-500 hover:bg-indigo-400 text-white shadow-lg shadow-indigo-500/20"
              >
                Publish Course
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleCreateChannel} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Channel Name</label>
              <input
                type="text"
                required
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
                placeholder="e.g. AI Prompts, Design Critiques"
                className="w-full skool-input px-3.5 py-2 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Channel Description</label>
              <textarea
                rows={3}
                value={channelDesc}
                onChange={(e) => setChannelDesc(e.target.value)}
                placeholder="Purpose of this channel and guidelines..."
                className="w-full skool-input px-3.5 py-2 rounded-xl text-xs resize-none"
              />
            </div>

            <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-500 hover:bg-indigo-400 text-white shadow-lg shadow-indigo-500/20"
              >
                Create Channel
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  )
}
