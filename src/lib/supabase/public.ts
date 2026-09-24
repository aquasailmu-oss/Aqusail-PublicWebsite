import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * The anon client. It can read the public_* views and execute submit_enquiry()
 * — nothing else, and that boundary is enforced by grants in Postgres, not here.
 */
let client: SupabaseClient | null = null;

export function hasSupabase(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export function publicClient(): SupabaseClient {
  if (!hasSupabase()) throw new Error("Supabase is not configured");
  client ??= createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
  return client;
}
