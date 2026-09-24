# Database: the public data contract

The website runs as Postgres `anon`. It can read three views and execute one
function, and nothing else. **The public site displays no prices**, so no view
exposes `price_rules` or any figure derived from it.

| Object | anon | Purpose |
|---|---|---|
| `public_activities` | select | published, active activities |
| `public_packages` | select | published packages, `included_activities` built from the join |
| `public_resources` | select | published vessels only, with `serves_activity_ids` and price-free `charter_terms` |
| `submit_enquiry(jsonb)` | execute | the only write path; validates, rate-limits 5/hour per IP hash |
| every table | **none** | including `price_rules`, `bookings`, `clients`, `payments`, `enquiries` |

## Migrations

- `0001_catalogue_base.sql` — **stand-in** for the operations platform's catalogue (WP-01..03). Delete once theirs exist.
- `0002_marketing_columns.sql` — slug, summary, description_long, hero_image, gallery, show_on_website, SEO fields.
- `0003_public_views.sql` — the three views and the grants that revoke Supabase's default anon privileges.
- `0004_enquiries.sql` — `enquiries`, `enquiry_counters`, `submit_enquiry()`.

`supabase/seed.sql` is generated from `src/lib/seed.ts`. Its `price_rules` rows
exist only so the contract test can prove anon cannot reach them.

## Verifying without Supabase

```sh
docker run -d --rm --name aq-pg -e POSTGRES_PASSWORD=pg postgres:16-alpine
PSQL="docker exec -i aq-pg psql -U postgres -v ON_ERROR_STOP=1 -q"
$PSQL <<'SQL'
create role anon nologin; create role authenticated nologin;
alter default privileges in schema public grant all on tables to anon, authenticated;
alter default privileges in schema public grant all on functions to anon, authenticated;
SQL
for f in supabase/migrations/*.sql supabase/seed.sql; do $PSQL < $f; done
$PSQL < tests/contract.sql     # ends with CONTRACT PASSED
```

The role setup mimics Supabase's permissive defaults, so the test proves the
migrations revoke them. It fails if anon can select anything beyond the three
views (for example a re-added price view), or if any public row contains a
price-like value.

## With Supabase

```sh
supabase start && supabase db reset          # applies migrations + seed.sql
npm run test:contract                        # anon-key test with supabase-js
```
