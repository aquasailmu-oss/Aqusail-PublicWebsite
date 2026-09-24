/**
 * The public data contract, asserted with the ANON key only, against a real
 * Supabase project (local `supabase start` or staging).
 *
 *   NEXT_PUBLIC_SUPABASE_URL=… NEXT_PUBLIC_SUPABASE_ANON_KEY=… npm run test:contract
 *
 * Skips when the env vars are unset. tests/contract.sql asserts the same rules
 * directly in Postgres and runs without Supabase.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const skip = !url || !key ? "Supabase env not set" : false;
const db = () => createClient(url!, key!, { auth: { persistSession: false } });
const VIEWS = ["public_activities", "public_packages", "public_resources"];

test("the three public views return rows", { skip }, async () => {
  for (const view of VIEWS) {
    const { data, error } = await db().from(view).select("*");
    assert.equal(error, null, `${view}: ${error?.message}`);
    assert.ok(data && data.length > 0, `${view} returned no rows`);
  }
});

test("anon cannot read base tables, enquiries or any price", { skip }, async () => {
  for (const table of [
    "price_rules",
    "public_from_prices",
    "bookings",
    "clients",
    "payments",
    "tour_operators",
    "enquiries",
  ]) {
    const { data, error } = await db().from(table).select("*").limit(1);
    assert.ok(error || (data ?? []).length === 0, `anon can read ${table}`);
  }
});

test("no public view carries a price", { skip }, async () => {
  for (const view of VIEWS) {
    const { data } = await db().from(view).select("*");
    assert.doesNotMatch(JSON.stringify(data), /cents|price|amount|\bRs\s*\d/i, `${view} exposes a price`);
  }
});
