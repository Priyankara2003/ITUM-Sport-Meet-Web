-- Admin access table
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
set row_security = off
as $$
  select exists (
    select 1 from public.admin_users where user_id = auth.uid()
  );
$$;

drop policy if exists "Admin read admins" on public.admin_users;
drop policy if exists "Admin insert admins" on public.admin_users;
drop policy if exists "Admin delete admins" on public.admin_users;

create policy "Admin read admins"
  on public.admin_users
  for select
  using (public.is_admin());

create policy "Admin insert admins"
  on public.admin_users
  for insert
  with check (public.is_admin());

create policy "Admin delete admins"
  on public.admin_users
  for delete
  using (public.is_admin());

-- Core tables (create if missing)
create table if not exists public.sports_events (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sport_type text not null,
  event_date timestamptz not null,
  location text,
  status text not null default 'scheduled',
  points_available integer not null default 0,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.houses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  display_name text not null,
  color text not null,
  logo_url text,
  total_points integer not null default 0,
  trophies_won integer not null default 0,
  members_count integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.match_participants (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.sports_events(id) on delete cascade,
  house_id uuid not null references public.houses(id) on delete cascade,
  score integer not null default 0,
  rank integer,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  image_url text not null,
  category text not null,
  event_id uuid references public.sports_events(id) on delete set null,
  house_id uuid references public.houses(id) on delete set null,
  uploaded_by text,
  upload_date timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.super_seniors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  house_id uuid not null references public.houses(id) on delete cascade,
  bio text,
  achievements text,
  photo_url text,
  year_graduated integer,
  created_at timestamptz not null default now()
);

create table if not exists public.hero_countdown (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  event_date timestamptz not null,
  location text,
  is_active boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.news_updates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  created_at timestamptz not null default now()
);

-- RLS enable + policies
alter table public.sports_events enable row level security;
alter table public.houses enable row level security;
alter table public.match_participants enable row level security;
alter table public.gallery_images enable row level security;
alter table public.super_seniors enable row level security;
alter table public.hero_countdown enable row level security;
alter table public.news_updates enable row level security;

drop policy if exists "Public read events" on public.sports_events;
drop policy if exists "Admin write events" on public.sports_events;
create policy "Public read events" on public.sports_events for select using (true);
create policy "Admin write events" on public.sports_events for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Public read houses" on public.houses;
drop policy if exists "Admin write houses" on public.houses;
create policy "Public read houses" on public.houses for select using (true);
create policy "Admin write houses" on public.houses for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Public read matches" on public.match_participants;
drop policy if exists "Admin write matches" on public.match_participants;
create policy "Public read matches" on public.match_participants for select using (true);
create policy "Admin write matches" on public.match_participants for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Public read gallery" on public.gallery_images;
drop policy if exists "Admin write gallery" on public.gallery_images;
create policy "Public read gallery" on public.gallery_images for select using (true);
create policy "Admin write gallery" on public.gallery_images for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Public read seniors" on public.super_seniors;
drop policy if exists "Admin write seniors" on public.super_seniors;
create policy "Public read seniors" on public.super_seniors for select using (true);
create policy "Admin write seniors" on public.super_seniors for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Public read hero" on public.hero_countdown;
drop policy if exists "Admin write hero" on public.hero_countdown;
create policy "Public read hero" on public.hero_countdown for select using (true);
create policy "Admin write hero" on public.hero_countdown for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Public read news" on public.news_updates;
drop policy if exists "Admin write news" on public.news_updates;
create policy "Public read news" on public.news_updates for select using (true);
create policy "Admin write news" on public.news_updates for all using (public.is_admin()) with check (public.is_admin());
