import React, { useState } from 'react'
import { X, Sparkles, Send, Hash, AlertCircle } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export function CreatePostModal({ isOpen, onClose }) {
  const { channels, addPost, activeChannel } = useApp()

  const defaultChannelSlug = activeChannel !== 'all' ? activeChannel : 'general'
  const [selectedChannelSlug, setSelectedChannelSlug] = useState(defaultChannelSlug)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState([])

  if (!isOpen) return null

  const handleAddTag = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const cleanTag = tagInput.trim().replace(/^#/, '')
      if (cleanTag && !tags.includes(cleanTag)) {
        setTags([...tags, cleanTag])
        setTagInput('')
      }
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(t => t !== tagToRemove))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return

    addPost({
      title: title.trim(),
      content: content.trim(),
      channelSlug: selectedChannelSlug,
      tags
    })

    setTitle('')
    setContent('')
    setTags([])
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white dark:bg-[#0e1424] border border-slate-200 dark:border-white/15 rounded-3xl shadow-2xl p-6 relative animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/10 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-300 flex items-center justify-center border border-amber-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Create New Post</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Share knowledge, ask a question, or drop a win (+3 XP)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Channel Selector */}
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Select Channel</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {channels.map((ch) => (
                <button
                  type="button"
                  key={ch.id}
                  onClick={() => setSelectedChannelSlug(ch.slug)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium text-left border transition-all ${
                    selectedChannelSlug === ch.slug
                      ? 'bg-amber-500/15 border-amber-500/40 text-amber-800 dark:text-amber-300 font-semibold shadow-xs'
                      : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10'
                  }`}
                >
                  #{ch.name}
                </button>
              ))}
            </div>
          </div>

          {/* Title Input */}
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Post Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. How I built my custom course platform in 2 days..."
              className="w-full skool-input px-3.5 py-2.5 rounded-xl text-sm placeholder:text-slate-400"
            />
          </div>

          {/* Content Textarea */}
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Post Body (Markdown supported)</label>
            <textarea
              required
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your thoughts, breakdown, questions, or code snippets..."
              className="w-full skool-input px-3.5 py-2.5 rounded-xl text-sm placeholder:text-slate-400 resize-none"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Tags (Press Enter)</label>
            <div className="flex flex-wrap items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10">
              {tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-white/10 text-xs text-slate-800 dark:text-white"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-rose-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder={tags.length ? '' : 'Add tags e.g. SaaS, Supabase...'}
                className="bg-transparent text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none flex-1 min-w-[120px]"
              />
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-white/10">
            <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Earn +3 XP immediately on post</span>
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!title.trim() || !content.trim()}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-white shadow-md shadow-rose-500/20 disabled:opacity-50 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Publish Post</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  )
}
