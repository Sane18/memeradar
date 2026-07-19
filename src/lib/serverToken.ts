import { TOKEN_BY_MINT } from "./tokens";
import { fetchOverview } from "./birdeye";
import { fetchPrices, fetchTokenMeta } from "./jupiter";
import type { Token } from "./types";

/**
 * Server-side token resolver used by page.tsx files.
 * Returns a fully-populated Token (with live price/marketCap/etc.) so the
 * client has real data on first render, before the polling useEffect fires.
 * All errors are swallowed — callers fall back to TOKEN_BY_MINT or undefined.
 */
export async function resolveToken(mint: string): Promise<Token | undefined> {
  try {
    const overview = await fetchOverview(mint);
    if (overview?.price) return overview as Token;

    const base = TOKEN_BY_MINT[mint];
    const [meta, prices] = await Promise.all([
      base ? Promise.resolve(null) : fetchTokenMeta(mint),
      fetchPrices([mint]),
    ]);
    const price = prices[mint];
    // No BirdEye overview for this mint means no real market-cap/volume/liquidity/
    // change source is available — leave them undefined rather than invent numbers.
    return {
      mint,
      symbol: base?.symbol ?? meta?.symbol ?? mint.slice(0, 4),
      name: base?.name ?? meta?.name ?? "Unknown token",
      decimals: base?.decimals ?? meta?.decimals ?? 9,
      logoURI: base?.logoURI ?? meta?.logoURI,
      price,
    };
  } catch {
    return TOKEN_BY_MINT[mint];
  }
}
