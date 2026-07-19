import { createClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase client using the secret service_role key.
 * Used ONLY in API routes (never the browser). Returns null when Supabase
 * isn't configured, so the app still runs without it.
 */
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export const supabaseEnabled = () => Boolean(url && serviceKey);

export function getSupabaseAdmin() {
  if (!supabaseEnabled()) return null;
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
