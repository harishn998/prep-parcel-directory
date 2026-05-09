-- Enable required extensions
create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────
-- PARTNERS TABLE
-- ─────────────────────────────────────
create table public.partners (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name text not null,
  tagline text,
  description text,
  about text[],                         -- array of paragraphs
  logo_placeholder text,
  logo_url text,
  cover_gradient text,
  cover_image_url text,

  -- Location (primary HQ)
  location text,                        -- display string e.g. "Toronto, ON"
  country text,                         -- 'USA' | 'Canada' | 'UK'
  country_code text,                    -- 'US' | 'CA' | 'GB'
  state text,                           -- slug e.g. 'california'
  state_full_name text,                 -- display e.g. 'California'
  city text,                            -- slug e.g. 'los-angeles'
  city_full_name text,                  -- display e.g. 'Los Angeles'
  region text,                          -- internal field, kept for compat
  served_states text[] default '{}',    -- multi-state coverage

  -- Business details
  year_founded int,
  years_in_business int,
  employee_count text,
  active_brands_served int,
  minimum_order_volume text,
  pricing_model text,
  response_time text,
  fulfillment_speed text,
  order_accuracy numeric(4,2),

  -- Tags / arrays
  services text[] default '{}',          -- display names
  service_categories text[] default '{}',-- slugs
  integrations text[] default '{}',
  certifications text[] default '{}',
  specialties text[] default '{}',

  -- Ratings (denormalized for fast lookup; will be recalculated when reviews change)
  rating numeric(3,2),
  review_count int default 0,
  rating_breakdown jsonb,                -- {"1":4,"2":8,"3":18,"4":64,"5":218}

  -- Detailed services
  detailed_services jsonb,               -- array of {name, description, included}

  -- Contact
  contact jsonb,                         -- {phone, email, website}

  -- Status
  verified boolean default false,
  is_featured boolean default false,
  is_active boolean default true,
  is_claimed boolean default false,
  profile_score int default 0,
  plan text default 'free',

  -- SEO
  meta_title text,
  meta_description text,

  -- Timestamps
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_partners_country on public.partners(country);
create index idx_partners_state on public.partners(state);
create index idx_partners_city on public.partners(city);
create index idx_partners_served_states on public.partners using gin(served_states);
create index idx_partners_service_categories on public.partners using gin(service_categories);
create index idx_partners_is_active on public.partners(is_active);

-- ─────────────────────────────────────
-- REVIEWS TABLE
-- ─────────────────────────────────────
create table public.reviews (
  id uuid primary key default uuid_generate_v4(),
  partner_id uuid not null references public.partners(id) on delete cascade,
  reviewer_name text not null,
  reviewer_company text,
  reviewer_avatar_url text,
  rating int not null check (rating between 1 and 5),
  text text not null,
  verified boolean default false,
  helpful_count int default 0,
  reviewed_at date not null,             -- date of review (we store as date, not timestamp, since sample data is date-only)
  created_at timestamptz default now()
);

create index idx_reviews_partner_id on public.reviews(partner_id);
create index idx_reviews_rating on public.reviews(rating);
create index idx_reviews_reviewed_at on public.reviews(reviewed_at desc);

-- ─────────────────────────────────────
-- WAREHOUSES TABLE
-- ─────────────────────────────────────
create table public.warehouses (
  id uuid primary key default uuid_generate_v4(),
  partner_id uuid not null references public.partners(id) on delete cascade,
  city text not null,
  address text,
  sqft int,
  hours text,
  services text[] default '{}',
  lat numeric(10,7),
  lng numeric(10,7),
  is_primary boolean default false,
  created_at timestamptz default now()
);

create index idx_warehouses_partner_id on public.warehouses(partner_id);
create index idx_warehouses_city on public.warehouses(city);

-- ─────────────────────────────────────
-- updated_at trigger for partners
-- ─────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_partners_updated_at
  before update on public.partners
  for each row execute function public.set_updated_at();

-- ─────────────────────────────────────
-- RLS — read-only public access for now
-- ─────────────────────────────────────
alter table public.partners enable row level security;
alter table public.reviews enable row level security;
alter table public.warehouses enable row level security;

-- Public can read active partners and their related rows
create policy "Public can read active partners"
  on public.partners for select
  using (is_active = true);

create policy "Public can read reviews of active partners"
  on public.reviews for select
  using (
    exists (
      select 1 from public.partners
      where partners.id = reviews.partner_id
        and partners.is_active = true
    )
  );

create policy "Public can read warehouses of active partners"
  on public.warehouses for select
  using (
    exists (
      select 1 from public.partners
      where partners.id = warehouses.partner_id
        and partners.is_active = true
    )
  );

-- No write policies yet — Phase 1E adds those for authenticated users
