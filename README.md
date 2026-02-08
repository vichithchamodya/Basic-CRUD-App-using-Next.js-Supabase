# Next.js + Supabase CRUD Application

## Entity Implemented

**Products** - with title, description, cost, and image upload

## Setup Steps

1. Install dependencies:

```bash
pnpm install
```

1. Create Supabase project at [supabase.com](https://supabase.com)

2. Run SQL in Supabase SQL Editor (from `supabase-setup.sql`)

3. Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

## How to Run

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)
