import React, { useState } from 'react'
import { X, Shield, Plus, BookOpen, MessageSquare, Sparkles, Video, Paperclip, Link2 } from 'lucide-react'
import { useApp } from '../../context/AppContext'

// Helper to convert any standard video link (YouTube, Loom, Vimeo) into an embeddable iframe URL
export function formatVideoEmbedUrl(url) {
  if (!url) return ''
  const trimmed = url.trim()

  const ytMatch = trimmed.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i)
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube.com/embed/${ytMatch[1]}`
  }

  const loomMatch = trimmed.match(/loom\.com\/share\/([a-zA-Z0-9]+)/i)
  if (loomMatch && loomMatch[1]) {
    return `https://www.loom.com/embed/${loomMatch[1]}`
  }

  const vimeoMatch = trimmed.match(/vimeo\.com\/(\d+)/i)
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`
  }

  return trimmed
}

export function AdminModal({ isOpen, onClose }) {
  const { addCourse, addChannel } = useApp()
  const [activeTab, setActiveTab] = useState('course') // 'course' | 'channel'

  // Course Form State
  const [courseTitle, setCourseTitle] = useState('')
  const [courseDesc, setCourseDesc] = useState('')
  const [courseCover, setCourseCover] = useState('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80')
  const [requiredLevel, setRequiredLevel] = useState(1)
  
  // Lesson 1 Form State
  const [lessonTitle, setLessonTitle] = useState('')
  const [lessonDuration, setLessonDuration] = useState('15 mins')
  const [rawVideoUrl, setRawVideoUrl] = useState('')
  const [lessonNotes, setLessonNotes] = useState('')
  const [resourceTitle, setResourceTitle] = useState('')
  const [resourceUrl, setResourceUrl] = useState('')

  // Channel Form State
  const [channelName, setChannelName] = useState('')
  const [channelDesc, setChannelDesc] = useState('')

  if (!isOpen) return null

  const handleCreateCourse = (e) => {
    e.preventDefault()
    if (!courseTitle.trim()) return

    const embedUrl = formatVideoEmbedUrl(rawVideoUrl) || 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    const resources = resourceTitle && resourceUrl ? [{ title: resourceTitle, url: resourceUrl }] : []

    addCourse({
      title: courseTitle.trim(),
      slug: courseTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: courseDesc.trim() || 'Custom course created via Admin Studio.',
      coverImage: courseCover,
      requiredLevel: Number(requiredLevel),
      modules: [
        {
          id: `mod-${Date.now()}`,
          title: 'Module 1: Foundations',
          lessons: [
            {
              id: `les-${Date.now()}`,
              title: lessonTitle.trim() || '1.1 Getting Started',
              duration: lessonDuration,
              videoUrl: embedUrl,
              content: lessonNotes.trim() || `### Welcome to ${courseTitle}!\n\nWatch the lesson video above and practice the steps shown.`,
              resources: resources
            }
          ]
        }
      ]
    })

    setCourseTitle('')
    setCourseDesc('')
    setLessonTitle('')
    setRawVideoUrl('')
    setLessonNotes('')
    setResourceTitle('')
    setResourceUrl('')
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
      <div className="w-full max-w-xl bg-white dark:bg-[#0e1424] border border-slate-200 dark:border-white/15 rounded-3xl shadow-2xl p-6 relative animate-in zoom-in-95 duration-150 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/10 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 flex items-center justify-center border border-indigo-200 dark:border-indigo-500/30">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Admin Studio</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Add new courses, video lessons, resources & channels</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/10 text-xs mb-5">
          <button
            onClick={() => setActiveTab('course')}
            className={`flex-1 py-2 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${
              activeTab === 'course' ? 'bg-white dark:bg-white/15 text-slate-900 dark:text-white shadow-xs font-semibold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Create Course & Video Lesson</span>
          </button>
          <button
            onClick={() => setActiveTab('channel')}
            className={`flex-1 py-2 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${
              activeTab === 'channel' ? 'bg-white dark:bg-white/15 text-slate-900 dark:text-white shadow-xs font-semibold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Create Channel</span>
          </button>
        </div>

        {activeTab === 'course' ? (
          <form onSubmit={handleCreateCourse} className="space-y-4">
            
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Course Metadata</span>
              
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  placeholder="e.g. AI SaaS Blueprint 2026"
                  className="w-full skool-input px-3.5 py-2 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">Course Description</label>
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
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">Required Member Level</label>
                  <select
                    value={requiredLevel}
                    onChange={(e) => setRequiredLevel(e.target.value)}
                    className="w-full skool-input px-3.5 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  >
                    {[1, 2, 3, 4, 5, 6, 7].map(lvl => (
                      <option key={lvl} value={lvl}>Level {lvl} (Gamified lock)</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">Cover Image URL</label>
                  <input
                    type="url"
                    value={courseCover}
                    onChange={(e) => setCourseCover(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full skool-input px-3.5 py-2 rounded-xl text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Video Lesson Setup */}
            <div className="pt-3 border-t border-slate-100 dark:border-white/10 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5 text-amber-500" />
                <span>First Lesson & Video Embed</span>
              </span>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">Lesson Title</label>
                  <input
                    type="text"
                    value={lessonTitle}
                    onChange={(e) => setLessonTitle(e.target.value)}
                    placeholder="1.1 Overview & Architecture"
                    className="w-full skool-input px-3.5 py-2 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">Lesson Duration</label>
                  <input
                    type="text"
                    value={lessonDuration}
                    onChange={(e) => setLessonDuration(e.target.value)}
                    placeholder="e.g. 18 mins"
                    className="w-full skool-input px-3.5 py-2 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">
                  Video URL (YouTube, Loom, Vimeo, or direct MP4)
                </label>
                <input
                  type="url"
                  value={rawVideoUrl}
                  onChange={(e) => setRawVideoUrl(e.target.value)}
                  placeholder="https://youtu.be/... or https://loom.com/share/..."
                  className="w-full skool-input px-3.5 py-2 rounded-xl text-xs placeholder:text-slate-400"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Auto-converts standard YouTube or Loom share links into responsive video player embeds.
                </span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">Lesson Notes (Markdown supported)</label>
                <textarea
                  rows={3}
                  value={lessonNotes}
                  onChange={(e) => setLessonNotes(e.target.value)}
                  placeholder="Key takeaways, instructions, and checklist for students..."
                  className="w-full skool-input px-3.5 py-2 rounded-xl text-xs resize-none placeholder:text-slate-400"
                />
              </div>

              {/* Downloadable Attachment */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">Attachment Title (PDF/Template)</label>
                  <input
                    type="text"
                    value={resourceTitle}
                    onChange={(e) => setResourceTitle(e.target.value)}
                    placeholder="e.g. Course Slides PDF"
                    className="w-full skool-input px-3.5 py-2 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">File/Resource Link</label>
                  <input
                    type="url"
                    value={resourceUrl}
                    onChange={(e) => setResourceUrl(e.target.value)}
                    placeholder="https://drive.google.com/..."
                    className="w-full skool-input px-3.5 py-2 rounded-xl text-xs"
                  />
                </div>
              </div>

            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-white/10 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-white shadow-md shadow-rose-500/20"
              >
                Publish Course to Classroom
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleCreateChannel} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">Channel Name</label>
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
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">Channel Description</label>
              <textarea
                rows={3}
                value={channelDesc}
                onChange={(e) => setChannelDesc(e.target.value)}
                placeholder="Purpose of this channel and guidelines..."
                className="w-full skool-input px-3.5 py-2 rounded-xl text-xs resize-none"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-white/10 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-500/20"
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
