import { NextResponse } from "next/server";
import { CURATED_TOKENS } from "@/lib/tokens";
import { fetchTrending, fetchOverview, birdeyeEnabled } from "@/lib/birdeye";
import { fetchPriceViaQuote } from "@/lib/jupiter";
import type { Token } from "@/lib/types";

export const dynamic = "force-dynamic";

/** Fill in any missing prices using Jupiter's quote API (100 USDC → token). */
async function enrichWithQuotePrices<T extends { mint: string; decimals?: number; price?: number }>(
  tokens: T[]
): Promise<T[]> {
  const needPrice = tokens.filter((t) => t.price == null);
  if (!needPrice.length) return tokens;
  const quotes = await Promise.all(
    needPrice.map((t) => fetchPriceViaQuote(t.mint, t.decimals ?? 9))
  );
  const quoteMap: Record<string, number> = {};
  needPrice.forEach((t, i) => {
    if (quotes[i] != null) quoteMap[t.mint] = quotes[i]!;
  });
  return tokens.map((t) =>
    t.price == null && quoteMap[t.mint] != null
      ? { ...t, price: quoteMap[t.mint] }
      : t
  );
}

// Below this real liquidity, "trending" tokens are thin enough that normal
// trades swing price/percent numbers wildly — filter them out, not fabricated,
// just noise. Keep the unfiltered list if the floor would wipe out everything.
const MIN_LIQUIDITY_USD = 10_000;

export async function GET() {
  try {
    // Primary: BirdEye trending — already has price field for most tokens.
    // Jupiter quote fills any gaps (works without an API key).
    if (birdeyeEnabled()) {
      // BirdEye's rank sort is real but has no built-in size/liquidity floor,
      // and every tab in TrendingList shares this one pool — pull the max (50)
      // instead of 24 so tab-specific sorts (market cap, liquidity) have a
      // real, varied pool to work with instead of reshuffling the same 24.
      const trending = await fetchTrending(50);
      if (trending.length) {
        const filtered = trending.filter((t) => (t.liquidity ?? Infinity) >= MIN_LIQUIDITY_USD);
        return NextResponse.json({
          tokens: await enrichWithQuotePrices(filtered.length ? filtered : trending),
        });
      }
    }

    // Fallback: curated list. Sequential BirdEye overview (avoids concurrent
    // request rate limits). Jupiter quote catches any tokens overview can't price.
    const priceMap: Record<string, number> = {};
    const mcMap: Record<string, number> = {};
    const changeMap: Record<string, number> = {};
    if (birdeyeEnabled()) {
      for (const t of CURATED_TOKENS) {
        const ov = await fetchOverview(t.mint);
        if (ov?.price != null) priceMap[t.mint] = ov.price;
        if (ov?.marketCap != null) mcMap[t.mint] = ov.marketCap;
        if (ov?.change24h != null) changeMap[t.mint] = ov.change24h;
      }
    }

    // No fake fallback here — if BirdEye didn't have a change figure for this
    // mint, leave it undefined and let the UI show "—" instead of a made-up number.
    const tokens: Token[] = CURATED_TOKENS.map((t) => ({
      ...t,
      price: priceMap[t.mint],
      marketCap: mcMap[t.mint],
      change24h: changeMap[t.mint],
    }));

    return NextResponse.json({ tokens: await enrichWithQuotePrices(tokens) });
  } catch (e) {
    console.error("[/api/tokens]", e);
    return NextResponse.json({ tokens: CURATED_TOKENS });
  }
}
