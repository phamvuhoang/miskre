-- MISKRE initial schema and RLS
-- Apply in Supabase SQL editor or CLI

create extension if not exists pgcrypto;

create table if not exists sellers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  subdomain text unique,
  custom_domain text unique,
  logo_url text,
  colors jsonb,
  phrases text[],
  payment_provider text not null default 'stripe',
  email_provider text not null default 'resend',
  created_at timestamptz default now()
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid references sellers(id) on delete cascade,
  name text not null,
  description text,
  price numeric not null,
  sizes text[],
  image_urls text[],
  is_limited boolean default false,
  created_at timestamptz default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid references sellers(id) on delete cascade,
  customer_email_enc bytea,
  status text check (status in ('pending','shipped','returned')) default 'pending',
  payment_method text not null,
  total numeric not null default 0,
  created_at timestamptz default now()
);

create table if not exists payouts (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid references sellers(id) on delete cascade,
  amount numeric not null,
  status text check (status in ('pending','completed')) default 'pending',
  provider text not null,
  statement_url text,
  created_at timestamptz default now()
);

create table if not exists hubs (
  id uuid primary key default gen_random_uuid(),
  hub_slug text unique,
  seller_ids uuid[]
);

create index if not exists idx_sellers_subdomain on sellers(subdomain);
create index if not exists idx_sellers_custom_domain on sellers(custom_domain);
create index if not exists idx_orders_seller_status on orders(seller_id, status);

alter table sellers enable row level security;
alter table products enable row level security;
alter table orders enable row level security;
alter table payouts enable row level security;

create policy "admin full access sellers" on sellers for all using (auth.jwt() ->> 'role' = 'admin');
create policy "seller read own seller" on sellers for select using (id::text = auth.jwt() ->> 'seller_id');
create policy "seller read own products" on products for select using (seller_id::text = auth.jwt() ->> 'seller_id');
create policy "seller read orders for own store" on orders for select using (seller_id::text = auth.jwt() ->> 'seller_id');

