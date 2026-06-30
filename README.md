# NED University Mock Test Platform

A full-stack university mock test platform built with **Next.js 16**, **Supabase**, and deployable to **Netlify**.

---

## 🚀 Quick Setup

### 1. Clone & Install
```bash
git clone https://github.com/your-username/uni-mock-platform.git
cd uni-mock-platform
npm install
```

### 2. Set up Supabase
1. Go to [supabase.com](https://supabase.com) → Create new project
2. Go to **SQL Editor** → paste the entire contents of `supabase/schema.sql` → Run
3. Go to **Storage** → Create these buckets (all public): `avatars`, `logos`, `question-images`, `blog-images`
4. Create one private bucket: `documents`
5. Go to **Authentication** → Create an admin user via Supabase Auth
6. In the **profiles** table, set that user's `role` to `admin`

### 3. Environment Variables
```bash
cp .env.example .env.local
```
Fill in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run locally
```bash
npm run dev
```

---

## 🌐 Deploy to Netlify

1. Push to GitHub
2. Connect repo to [netlify.com](https://netlify.com)
3. Add environment variables in Netlify dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_APP_URL` → your Netlify URL
4. Deploy — done!

---

## 🔐 Admin Panel

- URL: `/admin/login`
- Login with your Supabase admin user credentials
- The footer of the main site has an "Admin" link

---

## 📁 Project Structure

```
src/
├── app/
│   ├── admin/          # Admin panel pages
│   ├── login/          # User login
│   ├── mock-tests/     # Mock tests listing
│   ├── pricing/        # Pricing page
│   └── page.tsx        # Home page
├── components/
│   ├── admin/          # Admin UI components
│   │   └── sections/   # Dashboard, Users, Tests, etc.
│   ├── Navbar.tsx
│   └── Footer.tsx
├── config/
│   └── university.ts   # Branding config — change here for other unis
├── lib/
│   ├── supabase/       # Client, server, auth, types
│   └── hooks/          # useSupabaseAuth, useAdmin
├── store/
│   └── adminStore.ts   # Zustand store (UI state only)
└── middleware.ts        # Route protection
supabase/
└── schema.sql          # Full DB schema with RLS
```

---

## 🔧 Rebrand for Another University

Edit `src/config/university.ts` — change name, colors, logo. Everything updates automatically.

---

## 🛡️ Security

- Row Level Security enabled on all Supabase tables
- Admin routes protected by middleware + client-side auth check
- No secrets in source code — all via environment variables
- Supabase anon key is safe to expose (RLS handles access control)
