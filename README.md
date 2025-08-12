# Miskre

Miskre is a multi-tenant e-commerce platform that allows sellers to create their own online stores.

## Features

*   **Multi-tenancy:** Each seller gets their own subdomain and a separate dashboard to manage their products and orders.
*   **Product Management:** Sellers can add, edit, and delete products.
*   **Order Management:** Sellers can view and manage their orders.
*   **Payments:** Supports both Stripe and Cash on Delivery (COD) payments.
*   **Email Notifications:** Sends email notifications for events like new orders.
*   **Analytics:** Integrated with PostHog for analytics.

## Technical Stack

*   **Framework:** [Next.js](https://nextjs.org/)
*   **Database:** [Supabase](https://supabase.io/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Payments:** [Stripe](https://stripe.com/)
*   **Email:** [Resend](https://resend.com/)
*   **Analytics:** [PostHog](https://posthog.com/)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   [Node.js](https://nodejs.org/) (v18 or later)
*   [npm](https://www.npmjs.com/)
*   [Supabase CLI](https://supabase.com/docs/guides/cli)

### Installation

1.  **Clone the repo**
    ```sh
    git clone https://github.com/phamvuhoang/miskre.git
    ```
2.  **Install NPM packages**
    ```sh
    cd miskre/web
    npm install
    ```
3.  **Set up environment variables**

    Create a `.env` file in the `web` directory by copying the example file:

    ```sh
    cp .env.example .env
    ```

    You will need to fill in the following variables in the `.env` file:

    *   `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL.
    *   `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase project anon key.
    *   `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase project service role key.
    *   `STRIPE_API_KEY`: Your Stripe API key.
    *   `STRIPE_WEBHOOK_SECRET`: Your Stripe webhook secret.
    *   `RESEND_API_KEY`: Your Resend API key.
    *   `DATA_ENCRYPTION_KEY`: A secret key for data encryption. You can generate one using `openssl rand -base64 32`.

4.  **Set up the database**

    You can set up the database in two ways: locally for development or on Supabase Cloud for production.

    <details>
    <summary>Option 1: Local Development Setup</summary>

    This is the recommended approach for local development.

    1.  **Start the local Supabase development server:**
        ```sh
        supabase start
        ```
    2.  **Apply the database migrations:**
        ```sh
        supabase db push
        ```
    </details>

    <details>
    <summary>Option 2: Production Setup (Supabase Cloud)</summary>

    Follow these steps to set up a production database on Supabase Cloud.

    1.  **Create a Supabase account**
        If you don't have an account, sign up at [supabase.com](https://supabase.com).

    2.  **Create a new project**
        Create a new project in the Supabase dashboard.

    3.  **Get your project credentials**
        Navigate to your project's settings and find the API settings. You will need the following:
        *   Project URL (`NEXT_PUBLIC_SUPABASE_URL`)
        *   `anon` public key (`NEXT_PUBLIC_SUPABASE_ANON_KEY`)
        *   `service_role` secret key (`SUPABASE_SERVICE_ROLE_KEY`)

    4.  **Run the database migrations**
        Go to the SQL Editor in the Supabase dashboard and run the following SQL queries from the migration files in order.

        **Migration 1: `0001_init.sql`**
        ```sql
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
        ```

        **Migration 2: `0002_fix_orders_schema.sql`**
        ```sql
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
        returns text as $
        declare
          year_part text;
          sequence_num integer;
          order_num text;
        begin
          year_part := extract(year from now())::text;
          
          -- Get next sequence number for this year
          select coalesce(max(
            case 
              when order_number ~ ('^ORD-' || year_part || '-[0-9]+

5.  **Run the development server**
    ```sh
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Running Tests

To run the available tests, you can use the following commands:

```sh
npm run lint
```

This will run the linter to check for any code quality issues.

```sh
npm run typecheck
```

This will run the TypeScript compiler to check for any type errors.
npm run typecheck
```

This will run the TypeScript compiler to check for any type errors.

