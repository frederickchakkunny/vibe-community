import React from 'react'
import {
  MessageSquare,
  ThumbsUp,
  Pin,
  Sparkles,
  Share2,
  Clock,
  ChevronRight
} from 'lucide-react'
import { useApp } from '../../context/AppContext'

export function PostCard({ post, onOpenDetail }) {
  const { user, togglePostUpvote } = useApp()
  const isUpvoted = user.upvotedPostIds.includes(post.id)

  return (
    <article className="skool-card rounded-2xl p-5 transition-all hover:border-white/20 group">
      
      {/* Top Meta: Pinned & Channel */}
      <div className="flex items-center justify-between mb-3 text-xs">
        <div className="flex items-center gap-2">
          {post.pinned && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 font-medium border border-amber-500/20">
              <Pin className="w-3 h-3" /> Pinned
            </span>
          )}
          <span className="px-2.5 py-0.5 rounded-md bg-white/5 text-slate-300 font-medium border border-white/10">
            #{post.channelName}
          </span>
        </div>
        <div className="flex items-center gap-1 text-slate-400">
          <Clock className="w-3 h-3" />
          <span>{post.createdAt}</span>
        </div>
      </div>

      {/* Author Header */}
      <div className="flex items-center gap-3 mb-3">
        <img
          src={post.author.avatar}
          alt={post.author.name}
          className="w-10 h-10 rounded-xl object-cover border border-white/15"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-white group-hover:text-amber-300 transition-colors">
              {post.author.name}
            </span>
            <span className="px-1.5 py-0.2 rounded bg-white/10 text-[10px] font-mono text-slate-300 border border-white/10">
              Lvl {post.author.level}
            </span>
            {post.author.role === 'admin' && (
              <span className="px-1.5 py-0.2 rounded bg-indigo-500/20 text-[10px] font-medium text-indigo-300 border border-indigo-500/30">
                Admin
              </span>
            )}
          </div>
          <span className="text-xs text-slate-400 font-mono">@{post.author.username || 'member'}</span>
        </div>
      </div>

      {/* Post Title */}
      <h3 
        onClick={onOpenDetail}
        className="text-base font-bold text-white mb-2 leading-snug cursor-pointer hover:underline"
      >
        {post.title}
      </h3>

      {/* Post Content Snippet */}
      <div 
        onClick={onOpenDetail}
        className="text-sm text-slate-300 mb-4 line-clamp-3 leading-relaxed whitespace-pre-line cursor-pointer"
      >
        {post.content}
      </div>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {post.tags.map((tag, idx) => (
            <span key={idx} className="text-[11px] px-2 py-0.5 rounded-md bg-white/5 text-slate-400 border border-white/5">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer Controls: Upvote & Comments */}
      <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs">
        <div className="flex items-center gap-2">
          
          {/* Upvote Button with Skool Gamification Vibe */}
          <button
            onClick={() => togglePostUpvote(post.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium transition-all ${
              isUpvoted
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/10'
            }`}
          >
            <ThumbsUp className={`w-3.5 h-3.5 ${isUpvoted ? 'text-amber-400 fill-amber-400' : ''}`} />
            <span className="font-mono font-semibold">{post.likesCount}</span>
            <span className="hidden sm:inline text-[11px] opacity-75">{isUpvoted ? 'Upvoted' : 'Like'}</span>
          </button>

          {/* Comments Button */}
          <button
            onClick={onOpenDetail}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/10 transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="font-mono font-semibold">{post.commentsCount}</span>
            <span className="hidden sm:inline text-[11px] opacity-75">Comments</span>
          </button>
        </div>

        <button 
          onClick={onOpenDetail}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
        >
          <span>View thread</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </article>
  )
}
