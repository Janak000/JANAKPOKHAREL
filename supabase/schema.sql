-- ============================================================
-- janakpokharel.com.np, CMS schema
-- Run this in Supabase: SQL Editor → New query → paste → Run
-- ============================================================

create extension if not exists pgcrypto;

-- ---------- Admin access ----------
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin_user()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users where user_id = auth.uid()
  );
$$;

-- ---------- Flexible page content (hero, about, contact, blog, settings) ----------
create table if not exists public.content_blocks (
  key text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- ---------- Services (each gets its own SEO page at /services/[slug]) ----------
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  icon text not null default 'sparkles',
  title text not null,
  short_description text not null default '',
  body_md text not null default '',
  meta_title text,
  meta_description text,
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists services_sort_idx on public.services (published, sort_order);

-- ---------- Portfolio projects ----------
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null default '',
  description text not null default '',
  image_src text not null default '',
  image_alt text not null default '',
  tags text[] not null default '{}',
  result text,
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists projects_sort_idx on public.projects (published, sort_order);

-- ---------- Resume ----------
do $$ begin
  create type public.resume_kind as enum ('experience', 'education', 'certification');
exception when duplicate_object then null; end $$;

create table if not exists public.resume_entries (
  id uuid primary key default gen_random_uuid(),
  kind public.resume_kind not null,
  title text not null,
  subtitle text not null default '',
  href text,
  points text[] not null default '{}',
  sort_order integer not null default 0
);
create index if not exists resume_entries_idx on public.resume_entries (kind, sort_order);

-- ---------- Blog posts ----------
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  category text not null default 'General',
  tags text[] not null default '{}',
  excerpt text not null default '',
  meta_title text,
  meta_description text not null default '',
  cover_image text,
  read_time text not null default '5 min read',
  hero_intro text not null default '',
  body_md text not null default '',
  faqs jsonb not null default '[]'::jsonb,
  featured boolean not null default false,
  published boolean not null default false,
  published_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
create index if not exists posts_published_idx on public.posts (published, published_at desc);

-- ---------- Contact form messages ----------
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  topic text,
  message text not null,
  created_at timestamptz not null default now()
);

-- ============================================================
-- Row Level Security
-- ============================================================
alter table public.admin_users enable row level security;
alter table public.content_blocks enable row level security;
alter table public.services enable row level security;
alter table public.projects enable row level security;
alter table public.resume_entries enable row level security;
alter table public.posts enable row level security;
alter table public.messages enable row level security;

-- Admins can see their own admin row (used to verify admin status)
drop policy if exists "own_admin_row" on public.admin_users;
create policy "own_admin_row" on public.admin_users
  for select using (auth.uid() = user_id);

-- Public read for site content
drop policy if exists "public_read_content_blocks" on public.content_blocks;
create policy "public_read_content_blocks" on public.content_blocks
  for select using (true);

drop policy if exists "public_read_services" on public.services;
create policy "public_read_services" on public.services
  for select using (published = true or public.is_admin_user());

drop policy if exists "public_read_projects" on public.projects;
create policy "public_read_projects" on public.projects
  for select using (published = true or public.is_admin_user());

drop policy if exists "public_read_resume" on public.resume_entries;
create policy "public_read_resume" on public.resume_entries
  for select using (true);

drop policy if exists "public_read_posts" on public.posts;
create policy "public_read_posts" on public.posts
  for select using (published = true or public.is_admin_user());

-- Anyone can submit a contact message; only admins can read/delete them
drop policy if exists "anon_insert_messages" on public.messages;
create policy "anon_insert_messages" on public.messages
  for insert with check (true);

drop policy if exists "admin_read_messages" on public.messages;
create policy "admin_read_messages" on public.messages
  for select using (public.is_admin_user());

drop policy if exists "admin_delete_messages" on public.messages;
create policy "admin_delete_messages" on public.messages
  for delete using (public.is_admin_user());

-- Admins manage everything
drop policy if exists "admin_all_content_blocks" on public.content_blocks;
create policy "admin_all_content_blocks" on public.content_blocks
  for all using (public.is_admin_user()) with check (public.is_admin_user());

drop policy if exists "admin_all_services" on public.services;
create policy "admin_all_services" on public.services
  for all using (public.is_admin_user()) with check (public.is_admin_user());

drop policy if exists "admin_all_projects" on public.projects;
create policy "admin_all_projects" on public.projects
  for all using (public.is_admin_user()) with check (public.is_admin_user());

drop policy if exists "admin_all_resume" on public.resume_entries;
create policy "admin_all_resume" on public.resume_entries
  for all using (public.is_admin_user()) with check (public.is_admin_user());

drop policy if exists "admin_all_posts" on public.posts;
create policy "admin_all_posts" on public.posts
  for all using (public.is_admin_user()) with check (public.is_admin_user());

-- ============================================================
-- Storage: public "media" bucket for CMS image uploads
-- ============================================================
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "public_read_media" on storage.objects;
create policy "public_read_media" on storage.objects
  for select using (bucket_id = 'media');

drop policy if exists "admin_insert_media" on storage.objects;
create policy "admin_insert_media" on storage.objects
  for insert with check (bucket_id = 'media' and public.is_admin_user());

drop policy if exists "admin_update_media" on storage.objects;
create policy "admin_update_media" on storage.objects
  for update using (bucket_id = 'media' and public.is_admin_user());

drop policy if exists "admin_delete_media" on storage.objects;
create policy "admin_delete_media" on storage.objects
  for delete using (bucket_id = 'media' and public.is_admin_user());

-- ============================================================
-- AFTER creating your login user (Authentication → Users → Add user),
-- grant it admin access by running (replace the email):
--
--   insert into public.admin_users (user_id)
--   select id from auth.users where email = 'janak.pokharel@nomor.tech'
--   on conflict do nothing;
-- ============================================================
