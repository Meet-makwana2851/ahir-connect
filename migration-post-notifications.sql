-- AhirConnect — Migration: Like and comment notifications
-- Run this in Supabase Dashboard -> SQL Editor -> New query -> Run

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid references public.profiles(id) on delete cascade not null,
  actor_id uuid references public.profiles(id) on delete cascade not null,
  post_id uuid references public.posts(id) on delete cascade not null,
  like_id uuid references public.likes(id) on delete cascade,
  comment_id uuid references public.comments(id) on delete cascade,
  notification_type text not null check (notification_type in ('like', 'comment')),
  created_at timestamptz default now()
);

alter table public.notifications enable row level security;

drop policy if exists "Users see their notifications" on public.notifications;
create policy "Users see their notifications"
  on public.notifications for select
  using (auth.uid() = recipient_id);

drop policy if exists "Users can mark their notifications read" on public.notifications;
create policy "Users can mark their notifications read"
  on public.notifications for update
  using (auth.uid() = recipient_id);

create index if not exists notifications_recipient_created_idx
  on public.notifications (recipient_id, created_at desc);

create or replace function public.create_like_notification()
returns trigger as $$
declare
  owner_id uuid;
begin
  select author_id into owner_id from public.posts where id = new.post_id;
  if owner_id is not null and owner_id <> new.user_id then
    insert into public.notifications (recipient_id, actor_id, post_id, like_id, notification_type)
    values (owner_id, new.user_id, new.post_id, new.id, 'like');
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create or replace function public.create_comment_notification()
returns trigger as $$
declare
  owner_id uuid;
begin
  select author_id into owner_id from public.posts where id = new.post_id;
  if owner_id is not null and owner_id <> new.user_id then
    insert into public.notifications (recipient_id, actor_id, post_id, comment_id, notification_type)
    values (owner_id, new.user_id, new.post_id, new.id, 'comment');
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_like_created on public.likes;
create trigger on_like_created
after insert on public.likes
for each row execute function public.create_like_notification();

drop trigger if exists on_comment_created on public.comments;
create trigger on_comment_created
after insert on public.comments
for each row execute function public.create_comment_notification();

insert into public.notifications (recipient_id, actor_id, post_id, like_id, notification_type, created_at)
select p.author_id, l.user_id, l.post_id, l.id, 'like', l.created_at
from public.likes l
join public.posts p on p.id = l.post_id
where p.author_id <> l.user_id
  and not exists (
    select 1 from public.notifications n
    where n.like_id = l.id
  );

insert into public.notifications (recipient_id, actor_id, post_id, comment_id, notification_type, created_at)
select p.author_id, c.user_id, c.post_id, c.id, 'comment', c.created_at
from public.comments c
join public.posts p on p.id = c.post_id
where p.author_id <> c.user_id
  and not exists (
    select 1 from public.notifications n
    where n.comment_id = c.id
  );

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'notifications'
  ) then
    alter publication supabase_realtime add table public.notifications;
  end if;
end
$$;
