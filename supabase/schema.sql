-- Greatest Moments Events gallery schema
-- Run this entire script in Supabase Dashboard > SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_gallery_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admin_users
    where user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_gallery_admin() from public;
grant execute on function public.is_gallery_admin() to anon, authenticated;

create table if not exists public.event_folders (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  event_date date,
  location text not null,
  description text,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.event_photos (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.event_folders(id) on delete cascade,
  storage_path text not null unique,
  public_url text not null,
  sort_order integer not null default 0,
  is_thumbnail boolean not null default false,
  created_at timestamptz not null default now()
);

-- Safe to run on an existing project: adds the thumbnail flag to existing photo records.
alter table public.event_photos add column if not exists is_thumbnail boolean not null default false;

-- Visitor analytics used by the admin dashboard.
create table if not exists public.gallery_views (
  id bigint generated always as identity primary key,
  event_id uuid references public.event_folders(id) on delete cascade,
  created_at timestamptz not null default now()
);
create index if not exists gallery_views_event_id_created_at_idx on public.gallery_views (event_id, created_at desc);
create index if not exists gallery_views_created_at_idx on public.gallery_views (created_at desc);
alter table public.gallery_views enable row level security;
drop policy if exists "Visitors can record published gallery views" on public.gallery_views;
create policy "Visitors can record published gallery views" on public.gallery_views
for insert to anon, authenticated
with check (event_id is null or exists (
  select 1 from public.event_folders f where f.id = event_id and f.published = true
));
drop policy if exists "Admins can read gallery views" on public.gallery_views;
create policy "Admins can read gallery views" on public.gallery_views
for select to authenticated using ((select public.is_gallery_admin()));
grant insert on public.gallery_views to anon, authenticated;
grant select on public.gallery_views to authenticated;

alter table public.admin_users enable row level security;
alter table public.event_folders enable row level security;
alter table public.event_photos enable row level security;

drop policy if exists "Admins can read admin list" on public.admin_users;
create policy "Admins can read admin list" on public.admin_users
for select to authenticated using (user_id = (select auth.uid()));

drop policy if exists "Public can view published events" on public.event_folders;
create policy "Public can view published events" on public.event_folders
for select to anon, authenticated using (published or (select public.is_gallery_admin()));

drop policy if exists "Admins manage events" on public.event_folders;
create policy "Admins manage events" on public.event_folders
for all to authenticated using ((select public.is_gallery_admin()))
with check ((select public.is_gallery_admin()));

drop policy if exists "Public can view photos for published events" on public.event_photos;
create policy "Public can view photos for published events" on public.event_photos
for select to anon, authenticated using (
  exists (select 1 from public.event_folders f where f.id = event_id and f.published)
  or (select public.is_gallery_admin())
);

drop policy if exists "Admins manage event photos" on public.event_photos;
create policy "Admins manage event photos" on public.event_photos
for all to authenticated using ((select public.is_gallery_admin()))
with check ((select public.is_gallery_admin()));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('event-photos', 'event-photos', true, 15728640, array['image/jpeg','image/png','image/webp','image/gif'])
on conflict (id) do update set public = true, file_size_limit = 15728640,
  allowed_mime_types = array['image/jpeg','image/png','image/webp','image/gif'];

drop policy if exists "Public can view event photos" on storage.objects;
create policy "Public can view event photos" on storage.objects
for select to anon, authenticated using (bucket_id = 'event-photos');

drop policy if exists "Admins upload event photos" on storage.objects;
create policy "Admins upload event photos" on storage.objects
for insert to authenticated with check (bucket_id = 'event-photos' and (select public.is_gallery_admin()));

drop policy if exists "Admins update event photos" on storage.objects;
create policy "Admins update event photos" on storage.objects
for update to authenticated using (bucket_id = 'event-photos' and (select public.is_gallery_admin()))
with check (bucket_id = 'event-photos' and (select public.is_gallery_admin()));

drop policy if exists "Admins delete event photos" on storage.objects;
create policy "Admins delete event photos" on storage.objects
for delete to authenticated using (bucket_id = 'event-photos' and (select public.is_gallery_admin()));

-- After creating your admin login under Authentication > Users, add its UUID:
-- insert into public.admin_users (user_id) values ('PASTE-YOUR-AUTH-USER-UUID-HERE');
