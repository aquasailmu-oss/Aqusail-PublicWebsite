-- 0003 · W-02 the public data contract.
--
-- The website runs as the anon role. It may read these three views and execute
-- submit_enquiry() (0004). Nothing else. The views run with their OWNER's
-- rights (security_invoker = off) so anon needs no grant on any base table.
--
-- The public site displays NO PRICES. No view exposes price_rules or any
-- figure derived from it, and none may be added. Quotes come from reception.

create or replace view public_activities with (security_invoker = off) as
select a.id, a.slug, a.name, a.activity_type, a.summary,
       a.description_long as description, a.duration_minutes, a.min_age, a.restrictions,
       a.hero_image, a.gallery, a.sort_order, a.seo_title, a.seo_description
from activities a
where a.show_on_website and a.is_active
order by a.sort_order;

create or replace view public_packages with (security_invoker = off) as
select p.id, p.slug, p.name, p.summary, p.description_long as description,
       to_char(p.departs, 'HH24:MI') as departs, to_char(p.returns, 'HH24:MI') as returns,
       p.hero_image, p.gallery,
       -- generated from the join, so the website never rebuilds this list
       coalesce((
         select jsonb_agg(jsonb_build_object(
                  'id', a.id, 'slug', a.slug, 'name', a.name,
                  'duration_minutes', a.duration_minutes) order by pa.position)
         from package_activities pa
         join activities a on a.id = pa.activity_id
         where pa.package_id = p.id and a.show_on_website and a.is_active
       ), '[]'::jsonb) as included_activities,
       p.sort_order, p.seo_title, p.seo_description
from packages p
where p.show_on_website and p.is_active
order by p.sort_order;

create or replace view public_resources with (security_invoker = off) as
select r.id, r.slug, r.name, r.summary, r.description_long as description,
       r.capacity, r.length_m, r.specs, r.hero_image, r.gallery, r.charter_terms,
       coalesce((
         select jsonb_agg(ra.activity_id)
         from resource_activities ra
         join activities a on a.id = ra.activity_id
         where ra.resource_id = r.id and a.show_on_website and a.is_active
       ), '[]'::jsonb) as serves_activity_ids,
       r.sort_order, r.seo_title, r.seo_description
from resources r
where r.kind = 'vessel' and r.show_on_website and r.is_active
order by r.sort_order;

-- ---------------------------------------------------------------- grants
-- Supabase grants anon broad default privileges on the public schema. Take
-- them all back, explicitly, then grant the three views and nothing else.
-- ASSERTED BY tests/contract.sql and tests/public-contract.test.ts:
-- anon has no access to price_rules, bookings, clients, payments,
-- tour_operators or any other base table.
revoke all on all tables in schema public from anon;
revoke all on all sequences in schema public from anon;
revoke execute on all functions in schema public from anon, public;
alter default privileges in schema public revoke all on tables from anon;
alter default privileges in schema public revoke all on sequences from anon;
alter default privileges in schema public revoke execute on functions from anon, public;

grant usage on schema public to anon, authenticated;
grant select on public_activities, public_packages, public_resources to anon, authenticated;
