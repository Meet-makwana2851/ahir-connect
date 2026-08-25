-- =====================================================================
-- AhirConnect — Supabase schema
-- Run this in: Supabase Dashboard → SQL Editor → New query → Run
-- =====================================================================

-- ---------- PROFILES ----------
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  bio text default '',
  avatar_url text default '',
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are viewable by any logged-in member"
  on public.profiles for select
  using (auth.role() = 'authenticated');

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create a profile row whenever someone signs up
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', 'New Member'));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------- FRIEND REQUESTS ----------
create table public.friend_requests (
  id uuid primary key default gen_random_uuid(),
  from_id uuid references public.profiles(id) on delete cascade not null,
  to_id uuid references public.profiles(id) on delete cascade not null,
  status text default 'pending' check (status in ('pending','accepted','declined')),
  created_at timestamptz default now(),
  unique(from_id, to_id)
);

alter table public.friend_requests enable row level security;

create policy "Users see requests they sent or received"
  on public.friend_requests for select
  using (auth.uid() = from_id or auth.uid() = to_id);

create policy "Users can send requests as themselves"
  on public.friend_requests for insert
  with check (auth.uid() = from_id);

create policy "Recipient can update request status"
  on public.friend_requests for update
  using (auth.uid() = to_id);

-- ---------- FRIENDSHIPS (mutual, one row per direction for simple querying) ----------
create table public.friendships (
  user_id uuid references public.profiles(id) on delete cascade not null,
  friend_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamptz default now(),
  primary key (user_id, friend_id)
);

alter table public.friendships enable row level security;

create policy "Users see their own friendships"
  on public.friendships for select
  using (auth.uid() = user_id or auth.uid() = friend_id);

create policy "Users can create their own friendship rows"
  on public.friendships for insert
  with check (auth.uid() = user_id or auth.uid() = friend_id);

-- Function to accept a request: writes both directions of the friendship
-- and marks the request accepted, in one transaction.
create function public.accept_friend_request(request_id uuid)
returns void as $$
declare
  req record;
begin
  select * into req from public.friend_requests where id = request_id;
  if req.to_id <> auth.uid() then
    raise exception 'Not authorized to accept this request';
  end if;

  update public.friend_requests set status = 'accepted' where id = request_id;
  insert into public.friendships (user_id, friend_id) values (req.from_id, req.to_id)
    on conflict do nothing;
  insert into public.friendships (user_id, friend_id) values (req.to_id, req.from_id)
    on conflict do nothing;
end;
$$ language plpgsql security definer;

-- ---------- POSTS ----------
create table public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references public.profiles(id) on delete cascade not null,
  caption text default '',
  media_url text default '',
  media_type text default '',
  created_at timestamptz default now()
);

alter table public.posts enable row level security;

create policy "Users can view posts by themselves or their friends"
  on public.posts for select
  using (
    auth.uid() = author_id
    or exists (
      select 1 from public.friendships
      where user_id = auth.uid() and friend_id = author_id
    )
  );

create policy "Users can create their own posts"
  on public.posts for insert
  with check (auth.uid() = author_id);

-- ---------- MESSAGES (1-to-1 chat) ----------
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  chat_id text not null,              -- format: smaller_uuid_larger_uuid
  sender_id uuid references public.profiles(id) on delete cascade not null,
  recipient_id uuid references public.profiles(id) on delete cascade not null,
  text text not null,
  created_at timestamptz default now()
);

alter table public.messages enable row level security;

create policy "Users see messages they sent or received"
  on public.messages for select
  using (auth.uid() = sender_id or auth.uid() = recipient_id);

create policy "Users can send messages as themselves"
  on public.messages for insert
  with check (auth.uid() = sender_id);

-- ---------- REALTIME ----------
-- Enable realtime streaming for chat and live feed updates
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.posts;
alter publication supabase_realtime add table public.friend_requests;

-- =====================================================================
-- STORAGE BUCKETS
-- After running the SQL above, also create these two buckets manually:
-- Dashboard → Storage → New bucket
--   1) "posts"   (public bucket)
--   2) "avatars" (public bucket)
-- Then run the policies below (Storage → Policies, or just run this SQL).
-- =====================================================================

create policy "Anyone logged in can view post media"
  on storage.objects for select
  using (bucket_id = 'posts' and auth.role() = 'authenticated');

create policy "Users can upload their own post media"
  on storage.objects for insert
  with check (bucket_id = 'posts' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Anyone logged in can view avatars"
  on storage.objects for select
  using (bucket_id = 'avatars' and auth.role() = 'authenticated');

create policy "Users can upload their own avatar"
  on storage.objects for insert
  with check (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);
