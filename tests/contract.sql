-- The public data contract, asserted in SQL as the anon role.
-- Runs against a database with migrations + supabase/seed.sql applied:
--   psql -v ON_ERROR_STOP=1 -f tests/contract.sql
-- Any failed assertion raises and stops the run.

set role anon;

do $$
declare n int; t text;
begin
  -- 1. the three views are readable and return rows
  foreach t in array array['public_activities', 'public_packages', 'public_resources'] loop
    execute format('select count(*) from %I', t) into n;
    if n = 0 then raise exception 'FAIL: % returned no rows', t; end if;
    raise notice 'ok  % readable (% rows)', t, n;
  end loop;

  -- 2. every base table and the enquiries table are closed to anon
  foreach t in array array['price_rules', 'bookings', 'clients', 'payments', 'tour_operators',
                           'enquiries', 'enquiry_counters', 'activities', 'packages', 'resources',
                           'package_activities', 'resource_activities'] loop
    begin
      execute format('select count(*) from %I', t) into n;
      raise exception 'FAIL: anon can read %', t;
    exception when insufficient_privilege then
      raise notice 'ok  anon denied on %', t;
    end;
  end loop;

  -- 3. anon cannot insert into enquiries directly
  begin
    insert into enquiries (reference, name, email, interest_type, interest_label, ip_hash)
    values ('X', 'x', 'x@x.x', 'general', 'x', 'x');
    raise exception 'FAIL: anon can insert into enquiries';
  exception when insufficient_privilege then
    raise notice 'ok  anon cannot insert into enquiries';
  end;

  -- 4. NO PRICES: the public site displays none, so anon must reach none
  select count(*) into n
  from information_schema.role_table_grants g
  where g.grantee = 'anon' and g.table_schema = 'public' and g.privilege_type = 'SELECT'
    and g.table_name not in ('public_activities', 'public_packages', 'public_resources');
  if n > 0 then raise exception 'FAIL: anon can select from % objects beyond the three views', n; end if;
  select count(*) into n
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name in ('public_activities', 'public_packages', 'public_resources')
    and c.column_name ~* '(price|cents|amount|rate|commission)';
  if n > 0 then raise exception 'FAIL: a public view has a price-like column'; end if;
  if exists (select 1 from public_activities a where to_jsonb(a)::text ~* '(cents|price|amount|\mrs\s*[0-9])')
     or exists (select 1 from public_packages p where to_jsonb(p)::text ~* '(cents|price|amount|\mrs\s*[0-9])')
     or exists (select 1 from public_resources r where to_jsonb(r)::text ~* '(cents|price|amount|\mrs\s*[0-9])') then
    raise exception 'FAIL: a public view row contains a price';
  end if;
  raise notice 'ok  no price is reachable through any public view';

  -- 5. views hide unpublished rows and non-vessel resources
  if exists (select 1 from public_activities where slug = 'unpublished-test') then
    raise exception 'FAIL: unpublished activity visible';
  end if;
  if exists (select 1 from public_resources where slug = 'parasail-winch') then
    raise exception 'FAIL: equipment visible in public_resources';
  end if;
  raise notice 'ok  unpublished and non-vessel rows are hidden';
end $$;

-- 6. submit_enquiry works for anon, and the sixth in an hour is refused
do $$
declare r jsonb; i int; ip text := repeat('a', 64);
begin
  for i in 1..5 loop
    r := submit_enquiry(jsonb_build_object(
      'name', 'Contract Test', 'email', 'test@example.com', 'interest_type', 'general',
      'interest_label', 'General enquiry', 'ip_hash', ip, 'party_adults', 2));
  end loop;
  if r->>'reference' !~ '^ENQ-\d{8}-\d{4}$' then raise exception 'FAIL: bad reference %', r; end if;
  raise notice 'ok  submit_enquiry returned %', r->>'reference';
  begin
    r := submit_enquiry(jsonb_build_object(
      'name', 'Contract Test', 'email', 'test@example.com', 'interest_type', 'general',
      'interest_label', 'General enquiry', 'ip_hash', ip, 'party_adults', 2));
    raise exception 'FAIL: sixth enquiry within the hour was accepted';
  exception when raise_exception then
    if sqlerrm <> 'rate_limited' then raise; end if;
    raise notice 'ok  sixth enquiry in an hour refused';
  end;
end $$;

reset role;
select 'CONTRACT PASSED' as result;
