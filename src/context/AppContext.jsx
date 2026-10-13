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

  // Theme state: 'light' by default
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('vibe_community_theme')
      return saved ? saved : 'light'
    } catch {
      return 'light'
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('vibe_community_theme', theme)
    } catch {}
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'))
  }

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

  // 6. Real Supabase Live Sync
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return

    async function loadSupabaseLive() {
      try {
        // Fetch Live Channels
        const { data: dbChannels } = await supabase
          .from('channels')
          .select('*')
          .order('order_index', { ascending: true })

        if (dbChannels && dbChannels.length > 0) {
          setChannels(dbChannels.map(c => ({
            id: c.id,
            name: c.name,
            slug: c.slug,
            icon: c.icon || 'MessageSquare',
            description: c.description || '',
            count: 0
          })))
        }

        // Fetch Live Posts
        const { data: dbPosts } = await supabase
          .from('posts')
          .select(`
            id,
            title,
            content,
            pinned,
            likes_count,
            comments_count,
            created_at,
            channel_id,
            channels (name, slug),
            author:author_id (id, full_name, username, avatar_url, level, role)
          `)
          .order('created_at', { ascending: false })

        if (dbPosts && dbPosts.length > 0) {
          setPosts(dbPosts.map(p => ({
            id: p.id,
            channelId: p.channel_id,
            channelName: p.channels?.name || 'General',
            author: {
              id: p.author?.id || 'anon',
              name: p.author?.full_name || 'Member',
              username: p.author?.username || 'member',
              avatar: p.author?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
              level: p.author?.level || 1,
              role: p.author?.role || 'member'
            },
            title: p.title,
            content: p.content,
            createdAt: new Date(p.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            pinned: p.pinned || false,
            likesCount: p.likes_count || 0,
            commentsCount: p.comments_count || 0,
            tags: [p.channels?.name || 'Discussion'],
            comments: []
          })))
        }
      } catch (e) {
        console.warn('Supabase sync note:', e)
      }
    }

    loadSupabaseLive()
  }, [])

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
  const togglePostUpvote = async (postId) => {
    const isUpvoted = user.upvotedPostIds.includes(postId)

    // Update post count optimistically
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

    // Live Supabase database persist if available
    if (isSupabaseConfigured && supabase && !postId.startsWith('post-')) {
      try {
        if (isUpvoted) {
          await supabase.from('post_likes').delete().match({ post_id: postId, user_id: user.id })
        } else {
          await supabase.from('post_likes').insert({ post_id: postId, user_id: user.id })
        }
      } catch (err) {
        console.warn('Live like error:', err)
      }
    }
  }

  // Add a new post
  const addPost = async ({ title, content, channelSlug, tags = [] }) => {
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

    // Write to Supabase if connected
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('posts').insert({
          channel_id: channel.id,
          author_id: user.id,
          title,
          content
        })
      } catch (err) {
        console.warn('Live post error:', err)
      }
    }
  }

  // Add comment to a post
  const addComment = async (postId, text) => {
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

    // Write to Supabase if connected
    if (isSupabaseConfigured && supabase && !postId.startsWith('post-')) {
      try {
        await supabase.from('comments').insert({
          post_id: postId,
          author_id: user.id,
          content: text
        })
      } catch (err) {
        console.warn('Live comment error:', err)
      }
    }
  }

  // Toggle lesson completed
  const toggleLessonComplete = async (lessonId) => {
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

    // Write to Supabase if connected
    if (isSupabaseConfigured && supabase && !lessonId.startsWith('les-')) {
      try {
        if (isCompleted) {
          await supabase.from('lesson_progress').delete().match({ lesson_id: lessonId, user_id: user.id })
        } else {
          await supabase.from('lesson_progress').insert({ lesson_id: lessonId, user_id: user.id })
        }
      } catch (err) {
        console.warn('Live progress error:', err)
      }
    }
  }

  // Add course (Admin)
  const addCourse = async (newCourseData) => {
    const newCourse = {
      id: `crs-${Date.now()}`,
      ...newCourseData,
      isPublished: true,
      modules: newCourseData.modules || []
    }
    setCourses(prev => [...prev, newCourse])
    showToast('New course added to Classroom')

    // Live Supabase insert if connected
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('courses').insert({
          title: newCourseData.title,
          slug: newCourseData.slug,
          description: newCourseData.description,
          cover_image: newCourseData.coverImage,
          required_level: newCourseData.requiredLevel
        })
      } catch (err) {
        console.warn('Live course insert error:', err)
      }
    }
  }

  // Add channel (Admin)
  const addChannel = async ({ name, description, icon = 'MessageSquare' }) => {
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

    // Live Supabase insert
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('channels').insert({
          name,
          slug,
          description,
          icon
        })
      } catch (err) {
        console.warn('Live channel insert error:', err)
      }
    }
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
        isSupabaseConfigured,
        theme,
        toggleTheme
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
