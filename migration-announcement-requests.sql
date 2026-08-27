-- Store community announcement requests submitted from Contact Us.
create table if not exists public.announcement_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  email text not null,
  query text not null,
  created_at timestamptz not null default now()
);

alter table public.announcement_requests enable row level security;

drop policy if exists "Members can submit announcement requests" on public.announcement_requests;
create policy "Members can submit announcement requests"
  on public.announcement_requests for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Members can view their announcement requests" on public.announcement_requests;
create policy "Members can view their announcement requests"
  on public.announcement_requests for select to authenticated
  using ((select auth.uid()) = user_id);

create index if not exists announcement_requests_created_at_idx
  on public.announcement_requests(created_at desc);