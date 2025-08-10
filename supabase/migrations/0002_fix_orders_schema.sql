-- Fix orders table schema to properly store order details
-- This migration updates the orders table and adds order_items table

-- First, backup existing orders if any exist
create table if not exists orders_backup as select * from orders;

-- Drop existing orders table (this will cascade to any dependent data)
drop table if exists orders cascade;

-- Recreate orders table with proper schema
create table orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique, -- Human-readable order number like "ORD-2024-001"
  seller_id uuid references sellers(id) on delete cascade,
  
  -- Customer information (encrypted for privacy)
  customer_email_enc bytea,
  customer_name_enc bytea,
  customer_phone_enc bytea,
  
  -- Shipping address (encrypted)
  shipping_address_enc bytea, -- JSON: {line1, line2, city, state, postal_code, country}
  
  -- Order details
  status text check (status in ('pending','confirmed','processing','shipped','delivered','cancelled','returned')) default 'pending',
  payment_method text not null, -- 'stripe' | 'cod'
  payment_status text check (payment_status in ('pending','paid','failed','refunded')) default 'pending',
  
  -- Financial details
  subtotal numeric not null default 0,
  shipping_cost numeric not null default 0,
  tax_amount numeric not null default 0,
  discount_amount numeric not null default 0,
  total numeric not null default 0,
  
  -- Tracking and fulfillment
  tracking_number text,
  tracking_url text,
  shipped_at timestamptz,
  delivered_at timestamptz,
  
  -- Metadata
  notes text,
  stripe_session_id text, -- For Stripe orders
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Order items table to store individual line items
create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  product_id uuid references products(id) on delete restrict,
  
  -- Product details at time of order (snapshot)
  product_name text not null,
  product_description text,
  product_image_url text,
  
  -- Item specifics
  size text,
  quantity integer not null check (quantity > 0),
  unit_price numeric not null,
  total_price numeric not null, -- quantity * unit_price
  
  created_at timestamptz default now()
);

-- Create indexes
create index idx_orders_seller_status on orders(seller_id, status);
create index idx_orders_order_number on orders(order_number);
create index idx_orders_created_at on orders(created_at);
create index idx_order_items_order_id on order_items(order_id);
create index idx_order_items_product_id on order_items(product_id);

-- Enable RLS
alter table orders enable row level security;
alter table order_items enable row level security;

-- RLS policies
create policy "admin full access orders" on orders for all using (auth.jwt() ->> 'role' = 'admin');
create policy "seller read orders for own store" on orders for select using (seller_id::text = auth.jwt() ->> 'seller_id');

create policy "admin full access order_items" on order_items for all using (auth.jwt() ->> 'role' = 'admin');
create policy "seller read order items for own store" on order_items 
  for select using (
    exists (
      select 1 from orders 
      where orders.id = order_items.order_id 
      and orders.seller_id::text = auth.jwt() ->> 'seller_id'
    )
  );

-- Function to generate order numbers
create or replace function generate_order_number()
returns text as $$
declare
  year_part text;
  sequence_num integer;
  order_num text;
begin
  year_part := extract(year from now())::text;
  
  -- Get next sequence number for this year
  select coalesce(max(
    case 
      when order_number ~ ('^ORD-' || year_part || '-[0-9]+$') 
      then substring(order_number from '^ORD-' || year_part || '-([0-9]+)$')::integer
      else 0
    end
  ), 0) + 1
  into sequence_num
  from orders;
  
  order_num := 'ORD-' || year_part || '-' || lpad(sequence_num::text, 3, '0');
  
  return order_num;
end;
$$ language plpgsql;

-- Function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger to auto-update updated_at
create trigger update_orders_updated_at
  before update on orders
  for each row
  execute function update_updated_at_column();
