import React, { useState, useMemo } from 'react'
import {
  MessageSquare,
  Flame,
  Clock,
  Trophy,
  Search,
  Plus,
  Hash,
  Filter,
  Sparkles,
  Megaphone,
  HelpCircle,
  BookOpen
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { PostCard } from './PostCard'
import { CreatePostModal } from './CreatePostModal'
import { PostDetailModal } from './PostDetailModal'

const CHANNEL_ICONS = {
  Megaphone: Megaphone,
  MessageSquare: MessageSquare,
  Trophy: Trophy,
  HelpCircle: HelpCircle,
  BookOpen: BookOpen,
  Sparkles: Sparkles
}

export function CommunityView() {
  const {
    posts,
    channels,
    activeChannel,
    setActiveChannel,
    user
  } = useApp()

  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('hot') // 'hot' | 'new' | 'top'
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedPost, setSelectedPost] = useState(null)

  // Filter & Sort Logic
  const filteredPosts = useMemo(() => {
    return posts
      .filter((post) => {
        const matchesChannel =
          activeChannel === 'all' ||
          post.channelId === activeChannel ||
          channels.find(c => c.slug === activeChannel)?.id === post.channelId
        
        const matchesSearch =
          !searchQuery.trim() ||
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))

        return matchesChannel && matchesSearch
      })
      .sort((a, b) => {
        if (a.pinned && !b.pinned) return -1
        if (!a.pinned && b.pinned) return 1

        if (sortBy === 'hot') {
          return (b.likesCount * 2 + b.commentsCount * 3) - (a.likesCount * 2 + a.commentsCount * 3)
        }
        if (sortBy === 'top') {
          return b.likesCount - a.likesCount
        }
        if (sortBy === 'new') {
          return b.id.localeCompare(a.id)
        }
        return 0
      })
  }, [posts, activeChannel, searchQuery, sortBy, channels])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Sidebar: Channels */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="skool-card rounded-3xl p-4 sticky top-24">
            <div className="flex items-center justify-between px-3 py-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Channels</span>
              <span className="text-[11px] font-mono text-slate-500">{channels.length} spaces</span>
            </div>

            <div className="space-y-1">
              <button
                onClick={() => setActiveChannel('all')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  activeChannel === 'all'
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Hash className="w-4 h-4" />
                  <span>All Discussions</span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-slate-300">
                  {posts.length}
                </span>
              </button>

              {channels.map((channel) => {
                const IconComponent = CHANNEL_ICONS[channel.icon] || MessageSquare
                const isActive = activeChannel === channel.slug || activeChannel === channel.id
                const postCount = posts.filter(p => p.channelId === channel.id).length

                return (
                  <button
                    key={channel.id}
                    onClick={() => setActiveChannel(channel.slug)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <IconComponent className="w-4 h-4 shrink-0 text-slate-400" />
                      <span className="truncate">{channel.name}</span>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-slate-300 shrink-0">
                      {postCount}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Gamification Tip Card */}
          <div className="rounded-3xl p-5 bg-gradient-to-br from-amber-500/10 to-indigo-500/10 border border-white/10 text-xs space-y-2">
            <div className="flex items-center gap-2 text-amber-300 font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>How Points Work</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Every time someone upvotes your post or reply, you earn <strong className="text-white">+1 XP</strong>. Earn XP to climb levels and unlock courses!
            </p>
          </div>
        </aside>

        {/* Center Feed Column */}
        <main className="lg:col-span-3 space-y-6">
          
          {/* Top Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search discussions or tags..."
                className="w-full skool-input pl-10 pr-4 py-2 rounded-2xl text-xs placeholder:text-slate-500"
              />
            </div>

            {/* Sort Pills & Create Button */}
            <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
              <div className="flex items-center p-1 rounded-2xl bg-black/40 border border-white/10 text-xs">
                <button
                  onClick={() => setSortBy('hot')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium transition-all ${
                    sortBy === 'hot' ? 'bg-white/15 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>Hot</span>
                </button>
                <button
                  onClick={() => setSortBy('new')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium transition-all ${
                    sortBy === 'new' ? 'bg-white/15 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>New</span>
                </button>
                <button
                  onClick={() => setSortBy('top')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium transition-all ${
                    sortBy === 'top' ? 'bg-white/15 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Trophy className="w-3.5 h-3.5 text-rose-400" />
                  <span>Top</span>
                </button>
              </div>

              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-semibold bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-white shadow-lg shadow-rose-500/20 transition-all shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Write Post</span>
              </button>
            </div>

          </div>

          {/* Quick Create Trigger Box */}
          <div 
            onClick={() => setIsCreateModalOpen(true)}
            className="skool-card rounded-2xl p-4 flex items-center gap-3 cursor-pointer hover:border-white/20 transition-all"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-10 h-10 rounded-xl object-cover border border-white/15"
            />
            <div className="flex-1 skool-input px-4 py-2.5 rounded-xl text-xs text-slate-400 cursor-text">
              What are you building or learning today? Click to share...
            </div>
            <button className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-medium text-slate-300 hover:text-white transition-colors">
              Post (+3 XP)
            </button>
          </div>

          {/* Post Feed */}
          {filteredPosts.length > 0 ? (
            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onOpenDetail={() => setSelectedPost(post)}
                />
              ))}
            </div>
          ) : (
            <div className="skool-card rounded-3xl p-12 text-center space-y-3">
              <MessageSquare className="w-10 h-10 text-slate-500 mx-auto" />
              <h3 className="text-base font-bold text-white">No discussions found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                No posts match your current channel or search filters. Start the conversation!
              </p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="mt-2 px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 text-white hover:bg-white/15 transition-colors"
              >
                Create the First Post
              </button>
            </div>
          )}

        </main>

      </div>

      {/* Modals */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <PostDetailModal
        post={selectedPost}
        onClose={() => setSelectedPost(null)}
      />

    </div>
  )
}
