import React, { useState } from 'react'
import {
  X,
  ThumbsUp,
  MessageSquare,
  Clock,
  Send,
  Sparkles,
  CornerDownRight
} from 'lucide-react'
import { useApp } from '../../context/AppContext'

export function PostDetailModal({ post, onClose }) {
  const { user, togglePostUpvote, addComment } = useApp()
  const [commentText, setCommentText] = useState('')

  if (!post) return null

  const isUpvoted = user.upvotedPostIds.includes(post.id)

  const handleCommentSubmit = (e) => {
    e.preventDefault()
    if (!commentText.trim()) return

    addComment(post.id, commentText.trim())
    setCommentText('')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150 overflow-y-auto">
      <div className="w-full max-w-3xl bg-[#0e1424] border border-white/15 rounded-3xl shadow-2xl p-6 relative animate-in zoom-in-95 duration-150 my-8 max-h-[90vh] flex flex-col">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5 shrink-0">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-white/5 text-xs text-slate-300 font-medium border border-white/10">
              #{post.channelName}
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{post.createdAt}</span>
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto pr-1 flex-1 space-y-6">
          
          {/* Author */}
          <div className="flex items-center gap-3">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-12 h-12 rounded-2xl object-cover border border-white/20"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-white">{post.author.name}</span>
                <span className="px-2 py-0.5 rounded bg-white/10 text-[11px] font-mono text-slate-300 border border-white/10">
                  Lvl {post.author.level}
                </span>
                {post.author.role === 'admin' && (
                  <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-[11px] font-medium text-indigo-300 border border-indigo-500/30">
                    Admin
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 font-mono">@{post.author.username || 'member'}</p>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-xl font-bold text-white leading-snug">
            {post.title}
          </h1>

          {/* Post Content */}
          <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-line border-b border-white/10 pb-6">
            {post.content}
          </div>

          {/* Upvote Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <button
              onClick={() => togglePostUpvote(post.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                isUpvoted
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/10'
              }`}
            >
              <ThumbsUp className={`w-4 h-4 ${isUpvoted ? 'text-amber-400 fill-amber-400' : ''}`} />
              <span className="font-mono text-sm">{post.likesCount} Likes</span>
            </button>

            <span className="text-xs text-slate-400 flex items-center gap-1.5 font-mono">
              <MessageSquare className="w-4 h-4" />
              <span>{post.comments ? post.comments.length : 0} Comments</span>
            </span>
          </div>

          {/* Comment Form */}
          <form onSubmit={handleCommentSubmit} className="space-y-3">
            <div className="flex items-start gap-3">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-9 h-9 rounded-xl object-cover border border-white/15"
              />
              <div className="flex-1 space-y-2">
                <textarea
                  rows={3}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a constructive reply (+1 XP)..."
                  className="w-full skool-input px-3.5 py-2.5 rounded-2xl text-xs placeholder:text-slate-500 resize-none"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={!commentText.trim()}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 disabled:opacity-40 transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Post Reply</span>
                  </button>
                </div>
              </div>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-4 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Discussion ({post.comments ? post.comments.length : 0})
            </h4>

            {post.comments && post.comments.length > 0 ? (
              post.comments.map((comment) => (
                <div key={comment.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={comment.author.avatar}
                        alt={comment.author.name}
                        className="w-7 h-7 rounded-lg object-cover"
                      />
                      <span className="text-xs font-semibold text-white">{comment.author.name}</span>
                      <span className="px-1.5 py-0.2 rounded bg-white/10 text-[10px] font-mono text-slate-300">
                        Lvl {comment.author.level}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500">{comment.createdAt}</span>
                  </div>
                  <p className="text-xs text-slate-300 pl-9 leading-relaxed">
                    {comment.content}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 text-center py-6">
                No replies yet. Be the first to share your thoughts!
              </p>
            )}
          </div>

        </div>

      </div>
    </div>
  )
}
