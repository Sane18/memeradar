import { NextResponse } from "next/server";
import { TOKEN_BY_MINT } from "@/lib/tokens";
import { fetchPrices, fetchTokenMeta } from "@/lib/jupiter";
import { fetchOverview } from "@/lib/birdeye";

export const revalidate = 15;

export async function GET(
  _req: Request,
  { params }: { params: { mint: string } }
) {
  const mint = params.mint;
  const overview = await fetchOverview(mint);
  if (overview && overview.price) {
    return NextResponse.json({ token: overview });
  }

  // Fallback: Jupiter price + metadata + curated info. No BirdEye overview
  // means no real change/volume/liquidity/marketCap source — leave undefined.
  const base = TOKEN_BY_MINT[mint];
  const meta = base ? null : await fetchTokenMeta(mint);
  const prices = await fetchPrices([mint]);
  const price = prices[mint];

  const ext = meta?.extensions ?? {};
  return NextResponse.json({
    token: {
      mint,
      symbol: base?.symbol ?? meta?.symbol ?? mint.slice(0, 4),
      name: base?.name ?? meta?.name ?? "Unknown token",
      decimals: base?.decimals ?? meta?.decimals ?? 9,
      logoURI: base?.logoURI ?? meta?.logoURI,
      price,
      website: ext.website || undefined,
      twitter: ext.twitter || undefined,
    },
  });
}
