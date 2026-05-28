-- Phase 2A: working full-text search + facet counts
--
-- Generated search_vector tsvector column (STORED, no trigger), GIN index,
-- and directory_facets() for real service+country counts with per-dimension
-- self-exclusion.
--
-- Immutability notes:
--   - to_tsvector(text, text) is only STABLE; cast config to ::regconfig to make it immutable.
--   - array_to_string is only STABLE; wrap array flattening in our own IMMUTABLE function.

-- Immutable helper: flatten a text[] to a space-joined string.
create or replace function public.immutable_array_to_string(arr text[])
returns text
language sql
immutable
as $$
  select coalesce(array_to_string(arr, ' '), '');
$$;

alter table public.partners
  add column if not exists search_vector tsvector
  generated always as (
    setweight(to_tsvector('english'::regconfig, coalesce(name, '')), 'A') ||
    setweight(to_tsvector('english'::regconfig, coalesce(tagline, '')), 'B') ||
    setweight(to_tsvector('english'::regconfig, coalesce(city_full_name, '')), 'B') ||
    setweight(to_tsvector('english'::regconfig, coalesce(state_full_name, '')), 'C') ||
    setweight(to_tsvector('english'::regconfig, coalesce(description, '')), 'D') ||
    setweight(to_tsvector('english'::regconfig, public.immutable_array_to_string(services)), 'C')
  ) stored;

create index if not exists idx_partners_search_vector
  on public.partners using gin(search_vector);

create or replace function public.directory_facets(
  p_q text default null,
  p_services text[] default null,
  p_country_code text default null,
  p_state_slug text default null,
  p_city_slug text default null
) returns jsonb
language sql
stable
as $$
  with base as (
    select country_code, service_categories
    from public.partners
    where is_active = true
      and (p_q is null or p_q = '' or search_vector @@ websearch_to_tsquery('english', p_q))
      and (p_state_slug is null or p_state_slug = '' or p_state_slug = any(served_states))
      and (p_city_slug is null or p_city_slug = '' or city = p_city_slug)
  ),
  base_for_services as (
    select * from base
    where (p_country_code is null or p_country_code = '' or country_code = p_country_code)
  ),
  service_counts as (
    select unnest(service_categories) as value, count(*) as count
    from base_for_services
    group by value
  ),
  base_for_countries as (
    select * from base
    where (
      p_services is null
      or array_length(p_services, 1) is null
      or service_categories && p_services
    )
  ),
  country_counts as (
    select country_code as value, count(*) as count
    from base_for_countries
    where country_code is not null
    group by value
  )
  select jsonb_build_object(
    'services', coalesce(
      (select jsonb_agg(jsonb_build_object('value', value, 'count', count) order by count desc)
       from service_counts),
      '[]'::jsonb
    ),
    'countries', coalesce(
      (select jsonb_agg(jsonb_build_object('value', value, 'count', count) order by count desc)
       from country_counts),
      '[]'::jsonb
    )
  );
$$;

grant execute on function public.directory_facets(text, text[], text, text, text) to anon, authenticated;

do $$ begin raise notice 'Phase 2A: search_vector + GIN + directory_facets() created'; end $$;
