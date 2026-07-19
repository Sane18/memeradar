import { NextResponse } from "next/server";
import { getSupabaseAdmin, supabaseEnabled } from "@/lib/supabase";

export const dynamic = "force-dynamic";

/**
 * Watchlist API — backed by Supabase.
 * GET    /api/watchlist?userId=<addr>   -> { mints: string[] }
 * POST   /api/watchlist  { userId, mint } -> star a token
 * DELETE /api/watchlist  { userId, mint } -> unstar a token
 *
 * All endpoints degrade gracefully (no-op) when Supabase isn't configured.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  // `configured` lets us confirm the env vars are actually loaded.
  if (!supabaseEnabled() || !userId)
    return NextResponse.json({ mints: [], configured: supabaseEnabled() });

  const sb = getSupabaseAdmin()!;
  const { data, error } = await sb
    .from("watchlist")
    .select("mint")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ mints: [], error: error.message });
  return NextResponse.json({ mints: (data ?? []).map((r) => r.mint) });
}

export async function POST(req: Request) {
  if (!supabaseEnabled())
    return NextResponse.json({ ok: true }); // local-only when no Supabase
  const { userId, mint } = await req.json();
  if (!userId || !mint)
    return NextResponse.json({ ok: false }, { status: 400 });

  const sb = getSupabaseAdmin()!;
  const { error } = await sb
    .from("watchlist")
    .upsert({ user_id: userId, mint }, { onConflict: "user_id,mint" });
  return NextResponse.json({ ok: !error, error: error?.message });
}

export async function DELETE(req: Request) {
  if (!supabaseEnabled()) return NextResponse.json({ ok: true }); // local-only when no Supabase
  const { userId, mint } = await req.json();
  if (!userId || !mint)
    return NextResponse.json({ ok: false }, { status: 400 });

  const sb = getSupabaseAdmin()!;
  const { error } = await sb
    .from("watchlist")
    .delete()
    .eq("user_id", userId)
    .eq("mint", mint);
  return NextResponse.json({ ok: !error, error: error?.message });
}
