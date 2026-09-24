-- 0004 · W-09 the enquiry pipeline: the ONLY write path from the public
-- internet into the database.
--
-- anon may EXECUTE submit_enquiry() and has NO grant of any kind on the
-- enquiries table. An anon select grant here would publish every name, phone
-- number and travel date ever collected. Review any change to this file's
-- grants line by line.

create table if not exists enquiries (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,                -- ENQ-YYYYMMDD-NNNN
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  phone text,
  country text,
  preferred_date date,
  party_adults int not null default 1 check (party_adults between 1 and 500),
  party_children int not null default 0 check (party_children between 0 and 500),
  message text,
  interest_type text not null
    check (interest_type in ('activity', 'package', 'resource', 'operator', 'general')),
  interest_id uuid,             -- nullable, deliberately NO foreign key: enquiries outlive products
  interest_label text not null, -- what the visitor saw, frozen
  source_page text,
  utm jsonb,
  status text not null default 'new'
    check (status in ('new', 'contacted', 'quoted', 'converted', 'closed')),
  assigned_to uuid,
  internal_notes text,
  converted_booking_id uuid references bookings(id) on delete set null,
  ip_hash text not null,        -- sha256 of salted IP, for rate limiting only
  user_agent text
);

create index if not exists enquiries_ip_recent on enquiries (ip_hash, created_at desc);
create index if not exists enquiries_status on enquiries (status, created_at desc);

alter table enquiries enable row level security;
-- Staff policies (select/update for admin, accountant, receptionist; no delete)
-- are added by the operations platform in WP-22.

create table if not exists enquiry_counters (
  day date primary key,
  n int not null
);
alter table enquiry_counters enable row level security;

create or replace function submit_enquiry(payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_day date := (now() at time zone 'Indian/Mauritius')::date;
  v_n int;
  v_ref text;
  v_ip text := nullif(trim(payload->>'ip_hash'), '');
  v_email text := lower(trim(payload->>'email'));
  v_name text := trim(payload->>'name');
  v_type text := payload->>'interest_type';
  v_label text := trim(payload->>'interest_label');
  v_date date;
begin
  -- validate: the Server Action checks too, but the database is the boundary
  if v_ip is null or length(v_ip) <> 64 then raise exception 'invalid: ip_hash'; end if;
  if v_name is null or length(v_name) not between 2 and 120 then raise exception 'invalid: name'; end if;
  if v_email is null or length(v_email) > 200 or v_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
    raise exception 'invalid: email';
  end if;
  if v_type is null or v_type not in ('activity', 'package', 'resource', 'operator', 'general') then
    raise exception 'invalid: interest_type';
  end if;
  if v_label is null or length(v_label) not between 1 and 160 then raise exception 'invalid: interest_label'; end if;
  if length(coalesce(payload->>'message', '')) > 4000 then raise exception 'invalid: message'; end if;
  v_date := nullif(payload->>'preferred_date', '')::date;
  if v_date is not null and v_date < v_day then raise exception 'invalid: preferred_date'; end if;

  -- rate limit, enforced here so it cannot be bypassed by calling the RPC directly
  if (select count(*) from enquiries
      where ip_hash = v_ip and created_at > now() - interval '1 hour') >= 5 then
    raise exception 'rate_limited';
  end if;

  insert into enquiry_counters as c (day, n) values (v_day, 1)
  on conflict (day) do update set n = c.n + 1
  returning n into v_n;
  v_ref := 'ENQ-' || to_char(v_day, 'YYYYMMDD') || '-' || lpad(v_n::text, 4, '0');

  insert into enquiries (
    reference, name, email, phone, country, preferred_date, party_adults, party_children,
    message, interest_type, interest_id, interest_label, source_page, utm, ip_hash, user_agent
  ) values (
    v_ref, v_name, v_email,
    left(nullif(trim(payload->>'phone'), ''), 40),
    left(nullif(trim(payload->>'country'), ''), 80),
    v_date,
    coalesce((payload->>'party_adults')::int, 1),
    coalesce((payload->>'party_children')::int, 0),
    nullif(payload->>'message', ''),
    v_type,
    nullif(payload->>'interest_id', '')::uuid,
    v_label,
    left(payload->>'source_page', 200),
    case when jsonb_typeof(payload->'utm') = 'object' then payload->'utm' end,
    v_ip,
    left(payload->>'user_agent', 300)
  );

  return jsonb_build_object('reference', v_ref);
end;
$$;

-- ---------------------------------------------------------------- grants
revoke all on enquiries, enquiry_counters from anon, authenticated, public;
revoke all on function submit_enquiry(jsonb) from public;
grant execute on function submit_enquiry(jsonb) to anon;
