-- Greatest Moments Events: visitor analytics
-- Run in Supabase Dashboard > SQL Editor. Safe to run more than once.

create table if not exists public.gallery_views (
  id bigint generated always as identity primary key,
  event_id uuid references public.event_folders(id) on delete cascade,
  created_at timestamptz not null default now()
);

create index if not exists gallery_views_event_id_created_at_idx
  on public.gallery_views (event_id, created_at desc);

create index if not exists gallery_views_created_at_idx
  on public.gallery_views (created_at desc);

alter table public.gallery_views enable row level security;

drop policy if exists "Visitors can record published gallery views" on public.gallery_views;
create policy "Visitors can record published gallery views"
on public.gallery_views
for insert
to anon, authenticated
with check (
  event_id is null
  or exists (
    select 1
    from public.event_folders f
    where f.id = event_id
      and f.published = true
  )
);

drop policy if exists "Admins can read gallery views" on public.gallery_views;
create policy "Admins can read gallery views"
on public.gallery_views
for select
to authenticated
using ((select public.is_gallery_admin()));

grant insert on public.gallery_views to anon, authenticated;
grant select on public.gallery_views to authenticated;
