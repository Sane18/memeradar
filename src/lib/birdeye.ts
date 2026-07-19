import type { Candle, Holder, Token, Trade } from "./types";

/**
 * BirdEye Data API — used server-side only (key is secret).
 * Free tier: https://birdeye.so/data-api
 * Every function returns null/[] gracefully when no key is configured,
 * so the app still runs on Jupiter-only data.
 */
const BASE = "https://public-api.birdeye.so";
const KEY = process.env.BIRDEYE_API_KEY || "";

function headers() {
  return {
    "X-API-KEY": KEY,
    "x-chain": "solana",
    accept: "application/json",
  } as Record<string, string>;
}

export const birdeyeEnabled = () => Boolean(KEY);

async function get(path: string, revalidate = 30): Promise<any | null> {
  if (!KEY) return null;
  try {
    const res = await fetch(`${BASE}${path}`, {
      headers: headers(),
      next: { revalidate },
    });
    if (!res.ok) {
      console.warn(`[birdeye] ${path} → HTTP ${res.status}`);
      return null;
    }
    const json = await res.json();
    if (json?.success === false) {
      console.warn(`[birdeye] ${path} → success:false`, JSON.stringify(json).slice(0, 300));
      return null;
    }
    return json?.data ?? json;
  } catch (e) {
    console.error(`[birdeye] ${path} → fetch error:`, e);
    return null;
  }
}

/** Trending tokens — returns [] when no key (caller falls back to curated list). */
export async function fetchTrending(limit = 20): Promise<Token[]> {
  const data = await get(
    `/defi/token_trending?sort_by=rank&sort_type=asc&offset=0&limit=${limit}`,
    60
  );
  const items = Array.isArray(data) ? data : (data?.tokens ?? data?.items ?? []);
  console.log(`[birdeye] fetchTrending: isArray=${Array.isArray(data)} topKeys=[${Object.keys(data ?? {}).slice(0, 6).join(",")}] items=${items.length} sample=${JSON.stringify(items[0] ?? data).slice(0, 150)}`);
  return items.map((t: any) => ({
    mint: t.address,
    symbol: t.symbol,
    name: t.name,
    decimals: t.decimals,
    logoURI: t.logoURI,
    price: t.price ?? t.priceUsd ?? t.lastPrice ?? t.currentPrice,
    change24h: t.price24hChangePercent ?? t.priceChange24hPercent ?? t.priceChange24h,
    volume24h: t.volume24hUSD ?? t.v24hUSD ?? t.volume24h,
    liquidity: t.liquidity,
    marketCap: t.marketCap ?? t.marketcap ?? t.mc ?? t.realMc,
  }));
}


export async function fetchOverview(mint: string): Promise<Partial<Token> | null> {
  const d = await get(`/defi/token_overview?address=${mint}`, 30);
  if (!d) return null;
  const ext = d.extensions ?? {};
  return {
    mint,
    symbol: d.symbol,
    name: d.name,
    decimals: d.decimals,
    logoURI: d.logoURI,
    price: d.price,
    change24h: d.priceChange24hPercent ?? d.price24hChangePercent,
    volume24h: d.v24hUSD ?? d.volume24hUSD ?? d.v24h,
    liquidity: d.liquidity,
    marketCap: d.marketCap ?? d.mc ?? d.realMc,
    website: ext.website || undefined,
    twitter: ext.twitter || undefined,
    holderCount: d.holder,
    totalSupply: d.totalSupply,
    circulatingSupply: d.circulatingSupply,
    change5m: d.priceChange5mPercent,
    change1h: d.priceChange1hPercent,
    change4h: d.priceChange4hPercent,
    buy24h: d.buy24h,
    sell24h: d.sell24h,
    buyVol24h: d.vBuy24hUSD,
    sellVol24h: d.vSell24hUSD,
    uniqueWallets24h: d.uniqueWallet24h,
  };
}

export async function fetchOhlcv(
  mint: string,
  type = "15m",
  hours = 48
): Promise<Candle[]> {
  const now = Math.floor(Date.now() / 1000);
  const from = now - hours * 3600;
  const d = await get(
    `/defi/ohlcv?address=${mint}&type=${type}&time_from=${from}&time_to=${now}`,
    60
  );
  const items = d?.items ?? [];
  return items.map((c: any) => ({
    time: c.unixTime,
    open: c.o,
    high: c.h,
    low: c.l,
    close: c.c,
    volume: c.v,
  }));
}

/** Real historical price line — usually available on the free tier (unlike OHLCV). */
export async function fetchHistoryPrice(
  mint: string,
  type = "15m",
  hours = 48
): Promise<{ time: number; value: number }[]> {
  const now = Math.floor(Date.now() / 1000);
  const from = now - hours * 3600;
  const d = await get(
    `/defi/history_price?address=${mint}&address_type=token&type=${type}&time_from=${from}&time_to=${now}`,
    60
  );
  const items = d?.items ?? [];
  return items
    .map((p: any) => ({ time: p.unixTime, value: p.value }))
    .filter((p: any) => p.value != null);
}

export async function fetchHolders(mint: string, limit = 20): Promise<Holder[]> {
  const d = await get(
    `/defi/v3/token/holder?address=${mint}&offset=0&limit=${limit}`,
    120
  );
  const items = d?.items ?? [];
  return items.map((h: any, i: number) => ({
    owner: h.owner,
    amount: Number(h.amount),
    uiAmount: Number(h.ui_amount ?? h.uiAmount ?? 0),
    rank: i + 1,
  }));
}

export async function fetchTrades(mint: string, limit = 30): Promise<Trade[]> {
  const d = await get(
    `/defi/txs/token?address=${mint}&tx_type=swap&sort_type=desc&offset=0&limit=${limit}`,
    10
  );
  const items = d?.items ?? [];
  return items.map((t: any) => {
    const side: "buy" | "sell" =
      (t.side ?? t.txType) === "buy" ? "buy" : "sell";
    return {
      txHash: t.txHash ?? t.tx_hash,
      side,
      priceUsd:
        t.priceUsd ?? t.tokenPrice ?? t.price ?? t.from?.price ?? t.to?.price ?? 0,
      amountUsd:
        t.volumeUSD ?? t.volumeUsd ?? t.volume_usd ?? t.volume ?? 0,
      amountToken: t.amount ?? t.from?.uiAmount ?? t.to?.uiAmount ?? 0,
      owner: t.owner ?? t.from?.owner ?? t.source ?? "",
      time: t.blockUnixTime ?? t.blockTime ?? t.time ?? 0,
    };
  });
}
