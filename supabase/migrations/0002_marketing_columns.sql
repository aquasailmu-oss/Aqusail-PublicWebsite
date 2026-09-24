-- 0002 · W-02 marketing columns, added to the EXISTING catalogue tables.
-- No parallel CMS: one row per activity, edited in the admin, rendered on the
-- website.

create or replace function slugify(v text) returns text
language sql immutable as $$
  select trim(both '-' from regexp_replace(lower(v), '[^a-z0-9]+', '-', 'g'))
$$;

do $$
declare t text;
begin
  foreach t in array array['activities', 'packages', 'resources'] loop
    execute format('alter table %I add column if not exists slug text', t);
    execute format('alter table %I add column if not exists summary text', t);
    execute format('alter table %I add column if not exists description_long text', t);
    execute format('alter table %I add column if not exists hero_image text', t);
    execute format($f$alter table %I add column if not exists gallery jsonb not null default '[]'::jsonb$f$, t);
    execute format('alter table %I add column if not exists show_on_website boolean not null default false', t);
    execute format('alter table %I add column if not exists seo_title text', t);
    execute format('alter table %I add column if not exists seo_description text', t);
    -- slug generated from name on first migration, then owned by the admin
    execute format('update %I set slug = slugify(name) where slug is null', t);
    execute format('alter table %I alter column slug set not null', t);
    execute format('create unique index if not exists %I on %I (slug)', t || '_slug_key', t);
  end loop;
end $$;

alter table activities
  add column if not exists min_age int check (min_age is null or min_age >= 0),
  add column if not exists restrictions text,
  add column if not exists activity_type text not null default 'boat'
    check (activity_type in ('underwater', 'air', 'boat', 'wildlife'));

alter table packages
  add column if not exists departs time,
  add column if not exists returns time;

alter table resources
  add column if not exists length_m numeric(5, 2),
  add column if not exists specs jsonb not null default '{}'::jsonb,
  -- {basis, includes[], excludes[]} — what a charter covers. NEVER a price:
  -- the public site displays no prices, and this column is published as is.
  add column if not exists charter_terms jsonb
    check (charter_terms is null or charter_terms::text !~* '(cents|price|amount|rs\s*[0-9])');
