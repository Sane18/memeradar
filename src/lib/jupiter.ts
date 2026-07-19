import type { QuoteResult } from "./types";

/**
 * Jupiter — public APIs, NO key required.
 * Price API v2:   https://api.jup.ag/price/v2
 * Quote API v6:   https://quote-api.jup.ag/v6/quote
 * Token metadata: https://tokens.jup.ag/token/<mint>
 */

// Jupiter's free, keyless endpoints live under lite-api.jup.ag.
// (The old quote-api.jup.ag/v6 + api.jup.ag keyless routes were retired.)
const PRICE_API = "https://api.jup.ag/price/v2";
const QUOTE_API = "https://lite-api.jup.ag/swap/v1/quote";
const SWAP_API = "https://lite-api.jup.ag/swap/v1/swap";
const TOKEN_API = "https://lite-api.jup.ag/tokens/v1/token";

export async function fetchPrices(
  mints: string[]
): Promise<Record<string, number>> {
  if (!mints.length) return {};
  try {
    const url = `${PRICE_API}?ids=${mints.join(",")}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      console.warn(`[jupiter] fetchPrices HTTP ${res.status} for ${mints.length} mints`);
      return {};
    }
    const json = await res.json();
    const out: Record<string, number> = {};
    for (const mint of mints) {
      const p = json?.data?.[mint]?.price;
      if (p != null) out[mint] = Number(p);
    }
    return out;
  } catch (e) {
    console.error("[jupiter] fetchPrices error:", e);
    return {};
  }
}

const USDC_MINT = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
const HUNDRED_USDC = "100000000"; // 100 USDC in lamports (6 decimals)

/**
 * Derive USD price by quoting 100 USDC → token via Jupiter's free swap API.
 * Works without an API key. Cached for 30 s via Next.js data cache.
 */
export async function fetchPriceViaQuote(
  mint: string,
  decimals: number
): Promise<number | null> {
  if (mint === USDC_MINT) return 1.0;
  try {
    const url = `${QUOTE_API}?inputMint=${USDC_MINT}&outputMint=${mint}&amount=${HUNDRED_USDC}&slippageBps=100&swapMode=ExactIn`;
    const res = await fetch(url, { next: { revalidate: 30 } });
    if (!res.ok) return null;
    const json = await res.json();
    if (!json?.outAmount) return null;
    const tokensOut = Number(json.outAmount) / Math.pow(10, decimals);
    return tokensOut > 0 ? 100 / tokensOut : null;
  } catch {
    return null;
  }
}

export async function fetchTokenMeta(mint: string) {
  try {
    const res = await fetch(`${TOKEN_API}/${mint}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Get a swap quote. amount is in the input token's smallest units (lamports etc).
 */
export async function getQuote(params: {
  inputMint: string;
  outputMint: string;
  amount: string | number;
  slippageBps?: number;
}): Promise<QuoteResult | null> {
  try {
    const q = new URLSearchParams({
      inputMint: params.inputMint,
      outputMint: params.outputMint,
      amount: String(params.amount),
      slippageBps: String(params.slippageBps ?? 50),
      swapMode: "ExactIn",
    });
    const res = await fetch(`${QUOTE_API}?${q.toString()}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (!json?.outAmount) return null;
    return {
      inAmount: json.inAmount,
      outAmount: json.outAmount,
      priceImpactPct: json.priceImpactPct ?? "0",
      routePlan: json.routePlan,
      raw: json,
    };
  } catch {
    return null;
  }
}

/**
 * Build a swap transaction (base64) from a quote. Requires the user's wallet
 * pubkey. The returned tx is signed + sent client-side via Privy's Solana
 * wallet. See src/lib/swap.ts for the client helper.
 */
export async function buildSwapTx(params: {
  quoteResponse: any;
  userPublicKey: string;
}) {
  const res = await fetch(SWAP_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      quoteResponse: params.quoteResponse,
      userPublicKey: params.userPublicKey,
      wrapAndUnwrapSol: true,
      dynamicComputeUnitLimit: true,
      prioritizationFeeLamports: "auto",
    }),
  });
  if (!res.ok) throw new Error("Failed to build swap transaction");
  return res.json(); // { swapTransaction: base64 }
}
