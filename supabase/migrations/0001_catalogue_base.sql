-- 0001 · STAND-IN for the operations platform's WP-01..WP-03 catalogue.
--
-- The public website is being built before the operations platform, so this
-- migration creates the minimum of the operations tables the website depends
-- on, with the columns it needs. When the operations platform's own
-- migrations exist, DELETE THIS FILE and run theirs instead; 0002 onwards only
-- ADD to these tables.

create extension if not exists pgcrypto;

create table if not exists activities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  duration_minutes int not null check (duration_minutes > 0),
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists packages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists package_activities (
  package_id uuid not null references packages(id) on delete cascade,
  activity_id uuid not null references activities(id) on delete restrict,
  position int not null default 0,
  primary key (package_id, activity_id)
);

create table if not exists resources (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  kind text not null check (kind in ('vessel', 'equipment', 'platform')),
  capacity int not null check (capacity > 0),
  is_active boolean not null default true,
  sort_order int not null default 0
);

create table if not exists resource_activities (
  resource_id uuid not null references resources(id) on delete cascade,
  activity_id uuid not null references activities(id) on delete cascade,
  primary key (resource_id, activity_id)
);

create table if not exists tour_operators (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  commission_pct numeric(5, 2)
);

-- Every price the business uses. Only ONE slice of this is ever public, via
-- public_from_prices: walk-in, retail, adult, effective today.
create table if not exists price_rules (
  id uuid primary key default gen_random_uuid(),
  target_type text not null check (target_type in ('activity', 'package', 'resource')),
  target_id uuid not null,
  channel text not null check (channel in ('walk_in', 'hotel', 'operator')),
  rate_type text not null check (rate_type in ('retail', 'net')),
  age_band text not null check (age_band in ('adult', 'child', 'infant')),
  amount_cents int not null check (amount_cents >= 0),
  valid_from date not null,
  valid_to date not null,
  tour_operator_id uuid references tour_operators(id),
  check (valid_to >= valid_from)
);

create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text
);

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id),
  created_at timestamptz not null default now()
);

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references bookings(id),
  amount_cents int not null
);

-- RLS on everything. Staff policies belong to the operations platform.
alter table activities enable row level security;
alter table packages enable row level security;
alter table package_activities enable row level security;
alter table resources enable row level security;
alter table resource_activities enable row level security;
alter table tour_operators enable row level security;
alter table price_rules enable row level security;
alter table clients enable row level security;
alter table bookings enable row level security;
alter table payments enable row level security;
