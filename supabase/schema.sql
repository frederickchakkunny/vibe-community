-- ==============================================================================
-- SKOOL-STYLE COMMUNITY PLATFORM: PRODUCTION SUPABASE SCHEMA
-- Complete with RLS policies, gamification triggers, XP auto-leveling & Seed Data
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. PROFILES TABLE (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    avatar_url TEXT,
    bio TEXT DEFAULT '',
    role TEXT DEFAULT 'member' CHECK (role IN ('member', 'moderator', 'admin')),
    xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CHANNELS TABLE (Discussion Categories)
CREATE TABLE IF NOT EXISTS public.channels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    icon TEXT DEFAULT 'MessageSquare',
    order_index INTEGER DEFAULT 0,
    is_admin_only BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. POSTS TABLE
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    channel_id UUID REFERENCES public.channels(id) ON DELETE CASCADE NOT NULL,
    author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    pinned BOOLEAN DEFAULT FALSE,
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. COMMENTS TABLE (Supports nested replies)
CREATE TABLE IF NOT EXISTS public.comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
    author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. LIKES TABLES (Unique per user to prevent duplicate votes)
CREATE TABLE IF NOT EXISTS public.post_likes (
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (post_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.comment_likes (
    comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (comment_id, user_id)
);

-- 7. COURSES & LMS TABLES
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    cover_image TEXT,
    required_level INTEGER DEFAULT 1,
    is_published BOOLEAN DEFAULT TRUE,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID REFERENCES public.modules(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    video_url TEXT,
    content TEXT,
    duration_minutes INTEGER DEFAULT 5,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.lesson_progress (
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE NOT NULL,
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, lesson_id)
);

-- ==============================================================================
-- 8. GAMIFICATION & LEVEL LOGIC (AUTOMATIC LEVEL TIER CALCULATION)
-- ==============================================================================
CREATE OR REPLACE FUNCTION calculate_level(xp INTEGER)
RETURNS INTEGER AS $$
BEGIN
    IF xp >= 1000 THEN RETURN 9;
    ELSIF xp >= 600 THEN RETURN 8;
    ELSIF xp >= 350 THEN RETURN 7;
    ELSIF xp >= 200 THEN RETURN 6;
    ELSIF xp >= 100 THEN RETURN 5;
    ELSIF xp >= 50 THEN RETURN 4;
    ELSIF xp >= 20 THEN RETURN 3;
    ELSIF xp >= 5 THEN RETURN 2;
    ELSE RETURN 1;
    END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- TRIGGER: AUTO-CALCULATE LEVEL ON XP UPDATE
CREATE OR REPLACE FUNCTION update_profile_level()
RETURNS TRIGGER AS $$
BEGIN
    NEW.level = calculate_level(NEW.xp);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_profile_level ON public.profiles;
CREATE TRIGGER trigger_update_profile_level
BEFORE UPDATE OF xp ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION update_profile_level();

-- ==============================================================================
-- 9. LIKE & XP TRIGGERS
-- ==============================================================================

-- When post is liked: +1 like to post, +1 XP to author
CREATE OR REPLACE FUNCTION handle_post_like()
RETURNS TRIGGER AS $$
DECLARE
    target_author_id UUID;
BEGIN
    SELECT author_id INTO target_author_id FROM public.posts WHERE id = NEW.post_id;
    
    -- Increment post like count
    UPDATE public.posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
    
    -- Increment author XP
    IF target_author_id IS NOT NULL THEN
        UPDATE public.profiles SET xp = xp + 1 WHERE id = target_author_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION handle_post_unlike()
RETURNS TRIGGER AS $$
DECLARE
    target_author_id UUID;
BEGIN
    SELECT author_id INTO target_author_id FROM public.posts WHERE id = OLD.post_id;
    
    UPDATE public.posts SET likes_count = GREATEST(0, likes_count - 1) WHERE id = OLD.post_id;
    
    IF target_author_id IS NOT NULL THEN
        UPDATE public.profiles SET xp = GREATEST(0, xp - 1) WHERE id = target_author_id;
    END IF;
    
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_post_like ON public.post_likes;
CREATE TRIGGER trigger_post_like AFTER INSERT ON public.post_likes
FOR EACH ROW EXECUTE FUNCTION handle_post_like();

DROP TRIGGER IF EXISTS trigger_post_unlike ON public.post_likes;
CREATE TRIGGER trigger_post_unlike AFTER DELETE ON public.post_likes
FOR EACH ROW EXECUTE FUNCTION handle_post_unlike();

-- When comment is added: increment post comments_count
CREATE OR REPLACE FUNCTION handle_comment_added()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION handle_comment_deleted()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.posts SET comments_count = GREATEST(0, comments_count - 1) WHERE id = OLD.post_id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_comment_added ON public.comments;
CREATE TRIGGER trigger_comment_added AFTER INSERT ON public.comments
FOR EACH ROW EXECUTE FUNCTION handle_comment_added();

DROP TRIGGER IF EXISTS trigger_comment_deleted ON public.comments;
CREATE TRIGGER trigger_comment_deleted AFTER DELETE ON public.comments
FOR EACH ROW EXECUTE FUNCTION handle_comment_deleted();

-- When lesson is completed: +5 XP to user
CREATE OR REPLACE FUNCTION handle_lesson_completed()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.profiles SET xp = xp + 5 WHERE id = NEW.user_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_lesson_completed ON public.lesson_progress;
CREATE TRIGGER trigger_lesson_completed AFTER INSERT ON public.lesson_progress
FOR EACH ROW EXECUTE FUNCTION handle_lesson_completed();

-- ==============================================================================
-- 10. AUTH TRIGGER (Auto-create profile when user registers via Supabase Auth)
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    derived_name TEXT;
    derived_username TEXT;
BEGIN
    derived_name := COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1));
    derived_username := LOWER(REGEXP_REPLACE(split_part(NEW.email, '@', 1), '[^a-zA-Z0-9_]', '', 'g')) || '_' || SUBSTRING(NEW.id::text, 1, 4);
    
    INSERT INTO public.profiles (id, email, full_name, username, avatar_url, role, xp, level)
    VALUES (
        NEW.id,
        NEW.email,
        derived_name,
        derived_username,
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://api.dicebear.com/7.x/bottts/svg?seed=' || NEW.id),
        'member',
        0,
        1
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 11. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comment_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;

-- Profiles: Public read, self update
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Channels: Public read, admins manage
CREATE POLICY "Channels are viewable by everyone" ON public.channels FOR SELECT USING (true);

-- Posts: Public read, authenticated users insert/update own
CREATE POLICY "Posts viewable by everyone" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create posts" ON public.posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update own posts" ON public.posts FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Users can delete own posts" ON public.posts FOR DELETE USING (auth.uid() = author_id);

-- Comments: Public read, authenticated users insert/update own
CREATE POLICY "Comments viewable by everyone" ON public.comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create comments" ON public.comments FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can delete own comments" ON public.comments FOR DELETE USING (auth.uid() = author_id);

-- Likes: Viewable by all, insert/delete own
CREATE POLICY "Post likes viewable by all" ON public.post_likes FOR SELECT USING (true);
CREATE POLICY "Users can insert own post likes" ON public.post_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove own post likes" ON public.post_likes FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Comment likes viewable by all" ON public.comment_likes FOR SELECT USING (true);
CREATE POLICY "Users can insert own comment likes" ON public.comment_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove own comment likes" ON public.comment_likes FOR DELETE USING (auth.uid() = user_id);

-- Courses, Modules, Lessons: Viewable by all
CREATE POLICY "Published courses viewable by all" ON public.courses FOR SELECT USING (is_published = true);
CREATE POLICY "Modules viewable by all" ON public.modules FOR SELECT USING (true);
CREATE POLICY "Lessons viewable by all" ON public.lessons FOR SELECT USING (true);

-- Lesson Progress: Read and manage own progress
CREATE POLICY "Users can view own progress" ON public.lesson_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can record own progress" ON public.lesson_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove own progress" ON public.lesson_progress FOR DELETE USING (auth.uid() = user_id);

-- ==============================================================================
-- 12. DEFAULT SEED DATA (Channels & Initial Content)
-- ==============================================================================
INSERT INTO public.channels (name, slug, description, icon, order_index) VALUES
('Announcements', 'announcements', 'Official community updates and major news', 'Megaphone', 1),
('General Discussion', 'general', 'Casual chat, ideas, and daily networking', 'MessageSquare', 2),
('Wins & Milestones', 'wins', 'Share your successes, course breakthroughs, and progress', 'Trophy', 3),
('Ask Questions', 'qna', 'Get quick help and feedback from the community and mentors', 'HelpCircle', 4),
('Resources & Templates', 'resources', 'Useful links, toolkits, scripts, and downloads', 'BookOpen', 5)
ON CONFLICT (slug) DO NOTHING;
