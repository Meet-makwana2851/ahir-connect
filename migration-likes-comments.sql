-- =====================================================================
-- AhirConnect — Migration: Add likes & comments
-- Run this in: Supabase Dashboard → SQL Editor → New query → Run
-- =====================================================================

-- ---------- LIKES ----------
create table if not exists public.likes (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references public.posts(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(post_id, user_id)
);

alter table public.likes enable row level security;

create policy "Users see likes on visible posts"
  on public.likes for select
  using (auth.role() = 'authenticated');

create policy "Users can like posts"
  on public.likes for insert
  with check (auth.uid() = user_id);

create policy "Users can unlike"
  on public.likes for delete
  using (auth.uid() = user_id);

-- ---------- COMMENTS ----------
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references public.posts(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  text text not null,
  created_at timestamptz default now()
);

alter table public.comments enable row level security;

create policy "Users see comments on visible posts"
  on public.comments for select
  using (auth.role() = 'authenticated');

create policy "Users can comment"
  on public.comments for insert
  with check (auth.uid() = user_id);

-- ---------- REALTIME ----------
alter publication supabase_realtime add table public.likes;
alter publication supabase_realtime add table public.comments;
