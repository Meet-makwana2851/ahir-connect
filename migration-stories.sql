-- =====================================================================
-- AhirConnect — Migration: Add stories & story views
-- Run this in: Supabase Dashboard → SQL Editor → New query → Run
-- =====================================================================

-- ---------- STORIES (expire after 24 hours) ----------
create table if not exists public.stories (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references public.profiles(id) on delete cascade not null,
  media_url text not null,
  media_type text default 'image',
  created_at timestamptz default now()
);

alter table public.stories enable row level security;

create policy "Logged-in users can see stories"
  on public.stories for select
  using (auth.role() = 'authenticated');

create policy "Users can create their own stories"
  on public.stories for insert
  with check (auth.uid() = author_id);

create policy "Users can delete their own stories"
  on public.stories for delete
  using (auth.uid() = author_id);

-- ---------- STORY VIEWS (track who saw which story) ----------
create table if not exists public.story_views (
  id uuid primary key default gen_random_uuid(),
  story_id uuid references public.stories(id) on delete cascade not null,
  viewer_id uuid references public.profiles(id) on delete cascade not null,
  viewed_at timestamptz default now(),
  unique(story_id, viewer_id)
);

alter table public.story_views enable row level security;

create policy "Users can see views on stories"
  on public.story_views for select
  using (auth.role() = 'authenticated');

create policy "Users can mark stories as viewed"
  on public.story_views for insert
  with check (auth.uid() = viewer_id);

-- ---------- STORAGE ----------
-- Make sure you have a 'stories' bucket in Storage (public).
-- Dashboard → Storage → New bucket → name: "stories", toggle Public ON

create policy "Anyone logged in can view story media"
  on storage.objects for select
  using (bucket_id = 'stories' and auth.role() = 'authenticated');

create policy "Users can upload their own story media"
  on storage.objects for insert
  with check (bucket_id = 'stories' and auth.uid()::text = (storage.foldername(name))[1]);
