create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin_user()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
  );
$$;

create type public.resume_entry_kind as enum ('experience', 'education', 'certification');

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  short_name text not null,
  role text not null,
  tagline text not null,
  description text not null,
  url text not null,
  email text not null,
  phone text not null,
  whatsapp text not null,
  location text not null,
  facebook_url text,
  linkedin_url text,
  gtm_id text,
  ga_id text,
  og_image_url text,
  keywords jsonb not null default '[]'::jsonb,
  navigation_cta_label text not null,
  navigation_cta_href text not null,
  footer_explore_title text not null,
  footer_contact_title text not null,
  footer_copyright_text text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.navigation_links (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  href text not null,
  sort_order integer not null default 0
);
create index if not exists navigation_links_sort_idx on public.navigation_links (sort_order);

create table if not exists public.hero_sections (
  id uuid primary key default gen_random_uuid(),
  availability text not null,
  eyebrow text not null,
  headline text not null,
  description text not null,
  primary_cta_label text not null,
  primary_cta_href text not null,
  secondary_cta_label text not null,
  secondary_cta_href text not null,
  image_src text not null,
  image_alt text not null,
  stat_value text not null,
  stat_label text not null
);

create table if not exists public.about_sections (
  id uuid primary key default gen_random_uuid(),
  kicker text not null,
  title text not null,
  intro text not null,
  body text not null,
  organizations_kicker text not null,
  organizations_title text not null
);

create table if not exists public.about_stats (
  id uuid primary key default gen_random_uuid(),
  value text not null,
  label text not null,
  sort_order integer not null default 0
);
create index if not exists about_stats_sort_idx on public.about_stats (sort_order);

create table if not exists public.highlight_cards (
  id uuid primary key default gen_random_uuid(),
  icon text not null,
  title text not null,
  description text not null,
  sort_order integer not null default 0
);
create index if not exists highlight_cards_sort_idx on public.highlight_cards (sort_order);

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text not null,
  alt text not null,
  href text,
  sort_order integer not null default 0
);
create index if not exists organizations_sort_idx on public.organizations (sort_order);

create table if not exists public.services_sections (
  id uuid primary key default gen_random_uuid(),
  kicker text not null,
  title text not null
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  icon text not null,
  title text not null,
  description text not null,
  sort_order integer not null default 0
);
create index if not exists services_sort_idx on public.services (sort_order);

create table if not exists public.projects_sections (
  id uuid primary key default gen_random_uuid(),
  kicker text not null,
  title text not null,
  intro text not null,
  locked_title text not null,
  locked_description text not null,
  locked_cta_label text not null,
  locked_cta_href text not null
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  description text not null,
  image_src text not null,
  image_alt text not null,
  result text,
  href text,
  cta_label text,
  is_locked boolean not null default false,
  sort_order integer not null default 0
);
create index if not exists projects_sort_idx on public.projects (sort_order);

create table if not exists public.project_tags (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  tag text not null,
  sort_order integer not null default 0
);
create index if not exists project_tags_project_idx on public.project_tags (project_id, sort_order);

create table if not exists public.resume_sections (
  id uuid primary key default gen_random_uuid(),
  kicker text not null,
  experience_title text not null,
  education_title text not null,
  certifications_title text not null
);

create table if not exists public.resume_entries (
  id uuid primary key default gen_random_uuid(),
  kind public.resume_entry_kind not null,
  title text not null,
  subtitle text not null,
  href text,
  sort_order integer not null default 0
);
create index if not exists resume_entries_kind_sort_idx on public.resume_entries (kind, sort_order);

create table if not exists public.resume_entry_points (
  id uuid primary key default gen_random_uuid(),
  resume_entry_id uuid not null references public.resume_entries (id) on delete cascade,
  point text not null,
  sort_order integer not null default 0
);
create index if not exists resume_entry_points_idx on public.resume_entry_points (resume_entry_id, sort_order);

create table if not exists public.blog_settings (
  id uuid primary key default gen_random_uuid(),
  kicker text not null,
  title text not null,
  listing_title text not null,
  description text not null,
  view_all_label text not null,
  read_more_label text not null,
  open_post_label text not null,
  back_to_blog_label text not null,
  faq_title text not null
);

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  display_date text not null,
  category text not null,
  excerpt text not null,
  meta_description text not null,
  read_time text not null,
  hero_intro text not null,
  content_html text not null,
  cta_title text not null,
  cta_button_label text not null,
  cta_button_href text not null,
  is_published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists blog_posts_sort_idx on public.blog_posts (is_published, sort_order);

create table if not exists public.blog_post_faqs (
  id uuid primary key default gen_random_uuid(),
  blog_post_id uuid not null references public.blog_posts (id) on delete cascade,
  question text not null,
  answer text not null,
  sort_order integer not null default 0
);
create index if not exists blog_post_faqs_idx on public.blog_post_faqs (blog_post_id, sort_order);

create table if not exists public.contact_sections (
  id uuid primary key default gen_random_uuid(),
  kicker text not null,
  title text not null,
  intro text not null,
  whatsapp_title text not null,
  whatsapp_description text not null,
  whatsapp_button_label text not null,
  footer_note text not null
);

alter table public.admin_users enable row level security;
alter table public.site_settings enable row level security;
alter table public.navigation_links enable row level security;
alter table public.hero_sections enable row level security;
alter table public.about_sections enable row level security;
alter table public.about_stats enable row level security;
alter table public.highlight_cards enable row level security;
alter table public.organizations enable row level security;
alter table public.services_sections enable row level security;
alter table public.services enable row level security;
alter table public.projects_sections enable row level security;
alter table public.projects enable row level security;
alter table public.project_tags enable row level security;
alter table public.resume_sections enable row level security;
alter table public.resume_entries enable row level security;
alter table public.resume_entry_points enable row level security;
alter table public.blog_settings enable row level security;
alter table public.blog_posts enable row level security;
alter table public.blog_post_faqs enable row level security;
alter table public.contact_sections enable row level security;

create policy "public_read_site_settings" on public.site_settings for select using (true);
create policy "public_read_navigation_links" on public.navigation_links for select using (true);
create policy "public_read_hero_sections" on public.hero_sections for select using (true);
create policy "public_read_about_sections" on public.about_sections for select using (true);
create policy "public_read_about_stats" on public.about_stats for select using (true);
create policy "public_read_highlight_cards" on public.highlight_cards for select using (true);
create policy "public_read_organizations" on public.organizations for select using (true);
create policy "public_read_services_sections" on public.services_sections for select using (true);
create policy "public_read_services" on public.services for select using (true);
create policy "public_read_projects_sections" on public.projects_sections for select using (true);
create policy "public_read_projects" on public.projects for select using (true);
create policy "public_read_project_tags" on public.project_tags for select using (true);
create policy "public_read_resume_sections" on public.resume_sections for select using (true);
create policy "public_read_resume_entries" on public.resume_entries for select using (true);
create policy "public_read_resume_entry_points" on public.resume_entry_points for select using (true);
create policy "public_read_blog_settings" on public.blog_settings for select using (true);
create policy "public_read_blog_posts" on public.blog_posts for select using (is_published = true);
create policy "public_read_blog_post_faqs" on public.blog_post_faqs for select using (true);
create policy "public_read_contact_sections" on public.contact_sections for select using (true);

create policy "admin_manage_site_settings" on public.site_settings for all using (public.is_admin_user()) with check (public.is_admin_user());
create policy "admin_manage_navigation_links" on public.navigation_links for all using (public.is_admin_user()) with check (public.is_admin_user());
create policy "admin_manage_hero_sections" on public.hero_sections for all using (public.is_admin_user()) with check (public.is_admin_user());
create policy "admin_manage_about_sections" on public.about_sections for all using (public.is_admin_user()) with check (public.is_admin_user());
create policy "admin_manage_about_stats" on public.about_stats for all using (public.is_admin_user()) with check (public.is_admin_user());
create policy "admin_manage_highlight_cards" on public.highlight_cards for all using (public.is_admin_user()) with check (public.is_admin_user());
create policy "admin_manage_organizations" on public.organizations for all using (public.is_admin_user()) with check (public.is_admin_user());
create policy "admin_manage_services_sections" on public.services_sections for all using (public.is_admin_user()) with check (public.is_admin_user());
create policy "admin_manage_services" on public.services for all using (public.is_admin_user()) with check (public.is_admin_user());
create policy "admin_manage_projects_sections" on public.projects_sections for all using (public.is_admin_user()) with check (public.is_admin_user());
create policy "admin_manage_projects" on public.projects for all using (public.is_admin_user()) with check (public.is_admin_user());
create policy "admin_manage_project_tags" on public.project_tags for all using (public.is_admin_user()) with check (public.is_admin_user());
create policy "admin_manage_resume_sections" on public.resume_sections for all using (public.is_admin_user()) with check (public.is_admin_user());
create policy "admin_manage_resume_entries" on public.resume_entries for all using (public.is_admin_user()) with check (public.is_admin_user());
create policy "admin_manage_resume_entry_points" on public.resume_entry_points for all using (public.is_admin_user()) with check (public.is_admin_user());
create policy "admin_manage_blog_settings" on public.blog_settings for all using (public.is_admin_user()) with check (public.is_admin_user());
create policy "admin_manage_blog_posts" on public.blog_posts for all using (public.is_admin_user()) with check (public.is_admin_user());
create policy "admin_manage_blog_post_faqs" on public.blog_post_faqs for all using (public.is_admin_user()) with check (public.is_admin_user());
create policy "admin_manage_contact_sections" on public.contact_sections for all using (public.is_admin_user()) with check (public.is_admin_user());
