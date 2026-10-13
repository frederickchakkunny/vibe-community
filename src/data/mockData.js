export const LEVEL_TIERS = [
  { level: 1, minXp: 0, title: 'Newcomer', perk: 'Read & react to discussions', color: 'from-slate-400 to-slate-200' },
  { level: 2, minXp: 5, title: 'Member', perk: 'Post in all public channels', color: 'from-emerald-400 to-teal-300' },
  { level: 3, minXp: 20, title: 'Contributor', perk: 'Post links, media & code snippets', color: 'from-cyan-400 to-blue-400' },
  { level: 4, minXp: 50, title: 'Achiever', perk: 'Unlocks "Advanced SaaS Architecture" Course', color: 'from-purple-400 to-indigo-300' },
  { level: 5, minXp: 100, title: 'Mentor', perk: 'Access to VIP Mastermind Channel', color: 'from-amber-400 to-orange-300' },
  { level: 6, minXp: 200, title: 'Champion', perk: 'Host weekly breakout sessions', color: 'from-orange-400 to-red-400' },
  { level: 7, minXp: 350, title: 'Master', perk: '1-on-1 Monthly Strategy Call', color: 'from-rose-400 to-pink-400' },
  { level: 8, minXp: 600, title: 'Legend', perk: 'Lifetime Pro Perks badge', color: 'from-fuchsia-400 to-purple-500' },
  { level: 9, minXp: 1000, title: 'Grandmaster', perk: 'Hall of Fame permanent spotlight', color: 'from-yellow-300 to-amber-500' },
]

export function getLevelForXp(xp) {
  for (let i = LEVEL_TIERS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_TIERS[i].minXp) {
      return LEVEL_TIERS[i]
    }
  }
  return LEVEL_TIERS[0]
}

export function getNextLevelProgress(xp) {
  const currentLevelObj = getLevelForXp(xp)
  const nextLevelObj = LEVEL_TIERS.find(t => t.level === currentLevelObj.level + 1)
  
  if (!nextLevelObj) {
    return { current: xp, next: xp, percent: 100, remaining: 0, isMax: true }
  }

  const range = nextLevelObj.minXp - currentLevelObj.minXp
  const progressInLevel = xp - currentLevelObj.minXp
  const percent = Math.min(100, Math.max(0, Math.round((progressInLevel / range) * 100)))

  return {
    current: xp,
    next: nextLevelObj.minXp,
    percent,
    remaining: nextLevelObj.minXp - xp,
    isMax: false,
    nextTitle: nextLevelObj.title
  }
}

export const INITIAL_USER = {
  id: 'usr-001',
  name: 'Frederick Cheeran',
  username: 'frederick',
  email: 'frederick@superapp.dev',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  bio: 'Building apps, custom tools, and automated community software with modern tech.',
  role: 'admin',
  xp: 38,
  level: 3,
  joinedDate: 'Joined Oct 2026',
  completedLessons: ['les-1', 'les-2'],
  upvotedPostIds: ['post-2'],
  upvotedCommentIds: []
}

export const INITIAL_CHANNELS = [
  { id: 'ch-announcements', name: 'Announcements', slug: 'announcements', icon: 'Megaphone', description: 'Official updates, course drops, and big news.', count: 4 },
  { id: 'ch-general', name: 'General Discussion', slug: 'general', icon: 'MessageSquare', description: 'Hang out, share ideas, network, and talk tech.', count: 28 },
  { id: 'ch-wins', name: 'Wins & Milestones', slug: 'wins', icon: 'Trophy', description: 'Share your revenue wins, shipped apps, and progress.', count: 19 },
  { id: 'ch-qna', name: 'Ask Questions', slug: 'qna', icon: 'HelpCircle', description: 'Troubleshoot code, get architecture reviews, and ask for help.', count: 42 },
  { id: 'ch-resources', name: 'Resources & Templates', slug: 'resources', icon: 'BookOpen', description: 'Prompts, starters, schemas, and design kits.', count: 15 },
  { id: 'ch-intros', name: 'Introductions', slug: 'intros', icon: 'Sparkles', description: 'New here? Introduce yourself and what you are building.', count: 54 },
]

export const INITIAL_POSTS = [
  {
    id: 'post-1',
    channelId: 'ch-announcements',
    channelName: 'Announcements',
    author: {
      id: 'usr-001',
      name: 'Frederick Cheeran',
      username: 'frederick',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      level: 3,
      role: 'admin'
    },
    title: '🚀 Welcome to the Community! Here is how we vibe code & level up.',
    content: `Welcome everyone to our custom-built platform!

Here are the 3 ground rules to get the most value out of this space:

1. **Take Action First**: Don't just watch course videos—code along and deploy something to a live URL every week.
2. **Help Others**: Every time someone likes your post or reply, you gain **+1 Point (XP)**. As your XP grows, you unlock higher levels and secret mastermind modules in the Classroom tab.
3. **Share Your Progress**: Drop your builds in #wins & milestones. No project is too small!

Check out the **Classroom** tab to begin Module 1 of Vibe Coding 101.`,
    createdAt: '2 hours ago',
    pinned: true,
    likesCount: 24,
    commentsCount: 6,
    tags: ['Welcome', 'Rules', 'Guide'],
    comments: [
      {
        id: 'c-1',
        author: {
          id: 'usr-002',
          name: 'Sarah Chen',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
          level: 4,
          role: 'member'
        },
        content: 'Love the look and feel of this custom platform! So clean and snappy.',
        createdAt: '1 hour ago',
        likesCount: 5
      },
      {
        id: 'c-2',
        author: {
          id: 'usr-003',
          name: 'Marcus Brody',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
          level: 2,
          role: 'member'
        },
        content: 'Starting lesson 1 right now. Ready to ship!',
        createdAt: '30 mins ago',
        likesCount: 2
      }
    ]
  },
  {
    id: 'post-2',
    channelId: 'ch-wins',
    channelName: 'Wins & Milestones',
    author: {
      id: 'usr-002',
      name: 'Sarah Chen',
      username: 'sarahchen',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      level: 4,
      role: 'member'
    },
    title: '🎉 Just hit my first $1,200 MRR with a custom micro-SaaS tool!',
    content: `Two months ago I had zero backend experience. Following the Supabase database architecture and auth flows taught in this community, I shipped a niche invoice tracker for design freelancers.

Key takeaways:
- Keep the MVP tiny. I launched with just 3 core tables.
- Use Supabase Row Level Security (RLS) from Day 1 to avoid data leaks.
- Tailwind and modern UI components made the app look like a $50k custom software build.

Huge thanks to Frederick and everyone here for answering my questions in the Q&A channel!`,
    createdAt: '4 hours ago',
    pinned: false,
    likesCount: 38,
    commentsCount: 9,
    tags: ['MRR', 'Launch', 'Supabase'],
    comments: [
      {
        id: 'c-3',
        author: {
          id: 'usr-001',
          name: 'Frederick Cheeran',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
          level: 3,
          role: 'admin'
        },
        content: 'Massive milestone Sarah! That 3-table discipline is what separates people who ship from people stuck in tutorial hell.',
        createdAt: '3 hours ago',
        likesCount: 8
      }
    ]
  },
  {
    id: 'post-3',
    channelId: 'ch-qna',
    channelName: 'Ask Questions',
    author: {
      id: 'usr-004',
      name: 'David Kim',
      username: 'davidk',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      level: 1,
      role: 'member'
    },
    title: 'Question: What is the best way to handle video hosting without high AWS costs?',
    content: `Building out my course lessons and looking at video hosting.
Should I use Vimeo OTT, Mux, or just unlisted YouTube / Cloudflare Stream?

I want to prevent people from easily downloading or copying the video links, but don't want a $200/mo bill while starting out.`,
    createdAt: '6 hours ago',
    pinned: false,
    likesCount: 14,
    commentsCount: 4,
    tags: ['Video', 'Hosting', 'Cloudflare'],
    comments: [
      {
        id: 'c-4',
        author: {
          id: 'usr-005',
          name: 'Elena Rostova',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
          level: 5,
          role: 'moderator'
        },
        content: 'Cloudflare Stream is unbeatable value for courses: $5/month base + $1 per 1,000 minutes viewed. Watermarking and domain restriction are built in!',
        createdAt: '5 hours ago',
        likesCount: 12
      }
    ]
  }
]

export const INITIAL_COURSES = [
  {
    id: 'crs-1',
    title: 'Vibe Coding 101: From Idea to Shipped SaaS',
    slug: 'vibe-coding-101',
    description: 'Learn how to architect, design, and deploy full-stack web platforms using AI-assisted coding, React, and Supabase.',
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
    requiredLevel: 1,
    isPublished: true,
    modules: [
      {
        id: 'mod-1',
        title: 'Module 1: Foundations & Tech Stack',
        lessons: [
          {
            id: 'les-1',
            title: '1.1 The Vibe Coding Mindset & Architecture Blueprint',
            duration: '14 mins',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            content: `### Welcome to Vibe Coding 101

In this opening masterclass, we break down how modern software is built in 2026:
- Why building custom platforms beats paying $99/mo to third-party tools.
- Selecting the right architecture: Frontend SPA vs Backend API vs Database.
- How Supabase replaces 5 distinct AWS services (Auth, Postgres, Realtime, Storage, Edge Functions).

#### Action Item for Today:
1. Create your Supabase project in the us-east or eu-central region.
2. Clone our starter schema from the resources tab.`,
            resources: [
              { title: 'Full Stack Architecture Diagram (PDF)', url: '#' },
              { title: 'Project Scaffolding Checklist', url: '#' }
            ]
          },
          {
            id: 'les-2',
            title: '1.2 Supabase Setup, Auth Flows & Row Level Security',
            duration: '22 mins',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            content: `### Security First: Mastering RLS

Row Level Security is the single most important concept when building multi-user applications with Supabase.

Key points covered:
- Why public API keys are safe when RLS is enabled properly.
- Writing policies for ` + '`auth.uid() = user_id`' + `.
- Testing policies directly in the Supabase Table Editor.`,
            resources: [
              { title: 'SQL Schema Snippet', url: '#' }
            ]
          },
          {
            id: 'les-3',
            title: '1.3 Rapid UI Design with Tailwind & SF Pro Typography',
            duration: '18 mins',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            content: `### Modern UI Craft

How to build clean, frictionless user interfaces inspired by Apple and Skool:
- Neutral dark palettes (` + '#080c14' + ` and ` + '#0e1422' + `)
- Strict typography rules: Clean SF Pro text, reserving monospace exclusively for technical digits.
- Micro-interactions on buttons and upvote counters.`,
            resources: []
          }
        ]
      },
      {
        id: 'mod-2',
        title: 'Module 2: Building the Community Feed & Realtime',
        lessons: [
          {
            id: 'les-4',
            title: '2.1 Real-time Posts & Nested Discussion Threads',
            duration: '26 mins',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            content: `### Realtime Sync

Implement instant feeds using Supabase Realtime WebSocket channels:
- Listening to INSERT and UPDATE events on ` + '`posts`' + ` and ` + '`comments`' + `.
- Optimistic UI updates for instant perceived speed.`,
            resources: []
          },
          {
            id: 'les-5',
            title: '2.2 Gamification Engine: XP Triggers & Level Auto-Upgrade',
            duration: '19 mins',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            content: `### The Skool Secret: Why Gamification Works

How points and levels keep members engaged:
- Postgres trigger that gives +1 XP when someone likes your post.
- Auto-evaluating member levels (Level 1 to 9).
- Locking exclusive courses behind level thresholds.`,
            resources: []
          }
        ]
      }
    ]
  },
  {
    id: 'crs-2',
    title: 'Stripe Paywalls & Automated SaaS Memberships',
    slug: 'stripe-memberships',
    description: 'Connect Stripe Checkout, handle webhook events gracefully, and automate community access tiers.',
    coverImage: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80',
    requiredLevel: 1,
    isPublished: true,
    modules: [
      {
        id: 'mod-3',
        title: 'Module 1: Payments & Subscriptions',
        lessons: [
          {
            id: 'les-6',
            title: '1.1 Stripe Checkout Session Creation',
            duration: '15 mins',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            content: 'Set up Stripe Customer Portal, monthly recurring subscriptions, and single-course purchases.',
            resources: []
          },
          {
            id: 'les-7',
            title: '1.2 Webhook Handling & Database Role Sync',
            duration: '21 mins',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            content: 'Verify Stripe webhook signatures and automatically grant pro status in Supabase.',
            resources: []
          }
        ]
      }
    ]
  },
  {
    id: 'crs-3',
    title: 'Advanced SaaS Architecture & AI Agent Workflows',
    slug: 'advanced-saas-architecture',
    description: 'Exclusive masterclass covering autonomous AI agents, background cron jobs, and scaling to 10,000+ members.',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    requiredLevel: 4, // LEVEL LOCKED!
    isPublished: true,
    modules: [
      {
        id: 'mod-4',
        title: 'Masterclass Modules (Unlocks at Level 4)',
        lessons: [
          {
            id: 'les-8',
            title: 'VIP: Multi-agent Orchestration & Code Generation',
            duration: '35 mins',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            content: 'Earn Level 4 by participating in the community to unlock this masterclass.',
            resources: []
          }
        ]
      }
    ]
  }
]

export const INITIAL_LEADERBOARD = [
  { id: 'usr-005', name: 'Elena Rostova', username: 'elena_r', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80', xp: 142, level: 5, role: 'moderator', rank: 1 },
  { id: 'usr-002', name: 'Sarah Chen', username: 'sarahchen', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', xp: 74, level: 4, role: 'member', rank: 2 },
  { id: 'usr-001', name: 'Frederick Cheeran', username: 'frederick', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80', xp: 38, level: 3, role: 'admin', rank: 3 },
  { id: 'usr-003', name: 'Marcus Brody', username: 'mbrody', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', xp: 26, level: 3, role: 'member', rank: 4 },
  { id: 'usr-006', name: 'Liam O’Connor', username: 'liamo', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80', xp: 18, level: 2, role: 'member', rank: 5 },
  { id: 'usr-004', name: 'David Kim', username: 'davidk', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', xp: 12, level: 2, role: 'member', rank: 6 },
  { id: 'usr-007', name: 'Jessica Taylor', username: 'jtaylor', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80', xp: 4, level: 1, role: 'member', rank: 7 }
]
