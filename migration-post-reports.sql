-- Post reporting and automatic moderation
create table if not exists public.post_reports (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (post_id, reporter_id)
);

alter table public.post_reports enable row level security;

drop policy if exists "Members can report posts" on public.post_reports;
create policy "Members can report posts" on public.post_reports
  for insert to authenticated
  with check ((select auth.uid()) = reporter_id);

drop policy if exists "Members can see their reports" on public.post_reports;
create policy "Members can see their reports" on public.post_reports
  for select to authenticated
  using ((select auth.uid()) = reporter_id);

create or replace function public.delete_reported_post()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (select count(*) from public.post_reports where post_id = new.post_id) >= 3 then
    delete from public.posts where id = new.post_id;
  end if;
  return new;
end;
$$;

drop trigger if exists post_reports_auto_delete on public.post_reports;
create trigger post_reports_auto_delete
after insert on public.post_reports
for each row execute function public.delete_reported_post();

create index if not exists post_reports_post_id_idx on public.post_reports(post_id);

-- Allow only the author of a post to delete it.
drop policy if exists "Authors can delete their own posts" on public.posts;
create policy "Authors can delete their own posts" on public.posts
  for delete to authenticated
  using ((select auth.uid()) = author_id);
