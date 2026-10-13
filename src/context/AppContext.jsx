import React, { createContext, useContext, useState, useEffect } from 'react'
import {
  INITIAL_USER,
  INITIAL_CHANNELS,
  INITIAL_POSTS,
  INITIAL_COURSES,
  INITIAL_LEADERBOARD,
  getLevelForXp,
  getNextLevelProgress,
  LEVEL_TIERS
} from '../data/mockData'
import { isSupabaseConfigured, supabase } from '../lib/supabase'

const AppContext = createContext(null)

const STORAGE_KEYS = {
  USER: 'vibe_community_user',
  POSTS: 'vibe_community_posts',
  COURSES: 'vibe_community_courses',
  CHANNELS: 'vibe_community_channels',
  LEADERBOARD: 'vibe_community_leaderboard',
}

export function AppProvider({ children }) {
  const [activeTab, setActiveTab] = useState('community') // 'community' | 'classroom' | 'leaderboard' | 'members' | 'about'
  const [activeChannel, setActiveChannel] = useState('all') // 'all' or channel slug
  const [toastMessage, setToastMessage] = useState(null)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false)
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false)
  const [selectedPost, setSelectedPost] = useState(null)
  const [activeCourseId, setActiveCourseId] = useState(null)
  const [activeLessonId, setActiveLessonId] = useState(null)

  // 1. User state with localStorage fallback
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER)
      return saved ? JSON.parse(saved) : INITIAL_USER
    } catch {
      return INITIAL_USER
    }
  })

  // 2. Posts state
  const [posts, setPosts] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.POSTS)
      return saved ? JSON.parse(saved) : INITIAL_POSTS
    } catch {
      return INITIAL_POSTS
    }
  })

  // 3. Channels state
  const [channels, setChannels] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CHANNELS)
      return saved ? JSON.parse(saved) : INITIAL_CHANNELS
    } catch {
      return INITIAL_CHANNELS
    }
  })

  // 4. Courses state
  const [courses, setCourses] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COURSES)
      return saved ? JSON.parse(saved) : INITIAL_COURSES
    } catch {
      return INITIAL_COURSES
    }
  })

  // 5. Leaderboard state
  const [leaderboard, setLeaderboard] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LEADERBOARD)
      return saved ? JSON.parse(saved) : INITIAL_LEADERBOARD
    } catch {
      return INITIAL_LEADERBOARD
    }
  })

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
  }, [user])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts))
  }, [posts])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses))
  }, [courses])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CHANNELS, JSON.stringify(channels))
  }, [channels])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(leaderboard))
  }, [leaderboard])

  // Toast helper
  const showToast = (message) => {
    setToastMessage(message)
    setTimeout(() => {
      setToastMessage(null)
    }, 3200)
  }

  // Award XP and check level advancement
  const awardXp = (amount, reason) => {
    setUser(prev => {
      const newXp = prev.xp + amount
      const currentLevelTier = getLevelForXp(prev.xp)
      const newLevelTier = getLevelForXp(newXp)
      
      if (newLevelTier.level > currentLevelTier.level) {
        showToast(`🎉 Level Up! You reached Level ${newLevelTier.level}: ${newLevelTier.title}!`)
      } else {
        showToast(`+${amount} XP ${reason ? `(${reason})` : ''}`)
      }

      return {
        ...prev,
        xp: newXp,
        level: newLevelTier.level
      }
    })

    // Update current user in leaderboard
    setLeaderboard(prev => {
      return prev.map(m => {
        if (m.id === user.id) {
          const updatedXp = m.xp + amount
          const updatedLevel = getLevelForXp(updatedXp).level
          return { ...m, xp: updatedXp, level: updatedLevel }
        }
        return m
      }).sort((a, b) => b.xp - a.xp).map((m, idx) => ({ ...m, rank: idx + 1 }))
    })
  }

  // Toggle Post Upvote (Like)
  const togglePostUpvote = (postId) => {
    const isUpvoted = user.upvotedPostIds.includes(postId)

    // Update post count
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const nextLikes = isUpvoted ? Math.max(0, p.likesCount - 1) : p.likesCount + 1
        return { ...p, likesCount: nextLikes }
      }
      return p
    }))

    // Update user upvoted list
    setUser(prev => {
      const nextUpvoted = isUpvoted
        ? prev.upvotedPostIds.filter(id => id !== postId)
        : [...prev.upvotedPostIds, postId]
      return { ...prev, upvotedPostIds: nextUpvoted }
    })

    if (!isUpvoted) {
      showToast('👍 Upvoted! +1 XP granted to author')
    }
  }

  // Add a new post
  const addPost = ({ title, content, channelSlug, tags = [] }) => {
    const channel = channels.find(c => c.slug === channelSlug) || channels[1]
    const newPost = {
      id: `post-${Date.now()}`,
      channelId: channel.id,
      channelName: channel.name,
      author: {
        id: user.id,
        name: user.name,
        username: user.username,
        avatar: user.avatar,
        level: user.level,
        role: user.role
      },
      title,
      content,
      createdAt: 'Just now',
      pinned: false,
      likesCount: 0,
      commentsCount: 0,
      tags: tags.length ? tags : [channel.name],
      comments: []
    }

    setPosts(prev => [newPost, ...prev])
    awardXp(3, 'Created new discussion post')
    showToast('Post published to ' + channel.name)
  }

  // Add comment to a post
  const addComment = (postId, text) => {
    if (!text.trim()) return

    const newComment = {
      id: `c-${Date.now()}`,
      author: {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        level: user.level,
        role: user.role
      },
      content: text,
      createdAt: 'Just now',
      likesCount: 0
    }

    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          commentsCount: p.commentsCount + 1,
          comments: [...p.comments, newComment]
        }
      }
      return p
    }))

    awardXp(1, 'Contributed comment')
    showToast('Comment posted! +1 XP')
  }

  // Toggle lesson completed
  const toggleLessonComplete = (lessonId) => {
    const isCompleted = user.completedLessons.includes(lessonId)

    setUser(prev => {
      const nextCompleted = isCompleted
        ? prev.completedLessons.filter(id => id !== lessonId)
        : [...prev.completedLessons, lessonId]
      return { ...prev, completedLessons: nextCompleted }
    })

    if (!isCompleted) {
      awardXp(5, 'Completed course lesson')
    } else {
      showToast('Lesson marked uncompleted')
    }
  }

  // Add course (Admin)
  const addCourse = (newCourseData) => {
    const newCourse = {
      id: `crs-${Date.now()}`,
      ...newCourseData,
      isPublished: true,
      modules: newCourseData.modules || []
    }
    setCourses(prev => [...prev, newCourse])
    showToast('New course added to Classroom')
  }

  // Add channel (Admin)
  const addChannel = ({ name, description, icon = 'MessageSquare' }) => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    const newChannel = {
      id: `ch-${Date.now()}`,
      name,
      slug,
      icon,
      description,
      count: 0
    }
    setChannels(prev => [...prev, newChannel])
    showToast(`Channel #${name} created`)
  }

  const userProgress = getNextLevelProgress(user.xp)

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        activeChannel,
        setActiveChannel,
        user,
        setUser,
        posts,
        channels,
        courses,
        leaderboard,
        userProgress,
        toastMessage,
        showToast,
        awardXp,
        togglePostUpvote,
        addPost,
        addComment,
        toggleLessonComplete,
        addCourse,
        addChannel,
        selectedPost,
        setSelectedPost,
        activeCourseId,
        setActiveCourseId,
        activeLessonId,
        setActiveLessonId,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isAdminModalOpen,
        setIsAdminModalOpen,
        isSupabaseModalOpen,
        setIsSupabaseModalOpen,
        isSupabaseConfigured
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
