# VibeHub — Independent Community & Course Academy (Skool Alternative)

A lightning-fast, 100% custom-owned community and course platform built with **React 19**, **Vite 6**, **Tailwind CSS v4**, **Lucide Icons**, and **Supabase**.

---

## ⚡ What’s Inside

1. **Community Discussions**:
   - Channel categorization (Announcements, General, Wins, Q&A, Resources, Introductions).
   - Hot / New / Top feed sorting + real-time search.
   - Pinned posts, rich markdown post creator, and threaded comment discussions.
   - Skool-style **Upvote Reaction** (+1 XP to author when liked).

2. **Classroom (LMS)**:
   - Structured Course Catalog with cover images and progress tracking.
   - **Level-Locked Courses**: Lock exclusive courses behind gamified levels (e.g. Unlocks at Level 4).
   - Interactive Syllabus Player with collapsible modules, lesson checkmarks, video player, and downloadable resources.
   - **"Mark as Complete"**: Awards +5 XP and updates completion percentage instantly.

3. **Gamification & Leaderboard**:
   - **XP Engine**: +1 XP per upvote, +5 XP per lesson completed, +3 XP per published post.
   - **9-Tier Level Milestones**: Newcomer (Lvl 1) through Grandmaster (Lvl 9) with unlockable perks.
   - Top 3 Podium (Gold #1, Silver #2, Bronze #3) and real-time member rankings.
   - Timeframe filtering (Past 7 Days, Past 30 Days, All-Time).

4. **Members Directory**:
   - Search by name or username with role filtering (Admin, Moderator, Member).
   - Member level badges and contribution stats.

5. **Stripe Paywall & Membership Simulation**:
   - Compares the free standard tier vs. Pro Mastermind ($49/mo).
   - One-click Stripe webhook simulation that upgrades the user and grants +50 bonus XP.

6. **Admin Studio**:
   - Add new Courses, Modules, Lessons, and Channels directly inside the app.

7. **Zero-Setup Demo Mode vs. Live Supabase Mode**:
   - Works immediately out of the box with local reactive state and realistic seed data.
   - Seamlessly connect to live Supabase by providing `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

---

## 🚀 Quick Start

### 1. Run Locally
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 2. Connect Live Supabase
1. Create a project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in Supabase and run the migration script located in:
   ```bash
   supabase/schema.sql
   ```
3. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
4. Fill in your project URL and public Anon Key:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key
   ```
5. Restart your dev server (`npm run dev`).

---

## 🔒 100% Data Isolation Guarantee
This project lives in its own repository and database. It does **not** share any tables, sessions, or schemas with your personal Super App, ensuring complete data privacy for your personal finances and journals.
