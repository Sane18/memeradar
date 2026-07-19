import type { Candle, Holder, Trade } from "./types";

/**
 * Deterministic-ish synthetic data used ONLY as a fallback when BirdEye
 * has no key. Seeded around a real price so charts/holders/trades look
 * plausible. Swap in real BirdEye data by adding BIRDEYE_API_KEY.
 */
export function synthCandles(price: number, points = 96): Candle[] {
  const out: Candle[] = [];
  let p = price * (0.85 + Math.random() * 0.1);
  const now = Math.floor(Date.now() / 1000);
  const step = 15 * 60;
  for (let i = points; i > 0; i--) {
    const drift = (price - p) * 0.04;
    const vol = p * 0.02;
    const open = p;
    const close = Math.max(0.0000001, p + drift + (Math.random() - 0.5) * vol);
    const high = Math.max(open, close) * (1 + Math.random() * 0.01);
    const low = Math.min(open, close) * (1 - Math.random() * 0.01);
    out.push({
      time: now - i * step,
      open,
      high,
      low,
      close,
      volume: Math.random() * 50000,
    });
    p = close;
  }
  return out;
}

function randAddr(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz123456789";
  let s = "";
  for (let i = 0; i < 44; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

export function synthHolders(count = 20): Holder[] {
  const out: Holder[] = [];
  let remaining = 100;
  for (let i = 0; i < count; i++) {
    const pct = i === 0 ? 8 + Math.random() * 6 : remaining * (0.04 + Math.random() * 0.08);
    remaining -= pct;
    out.push({
      owner: randAddr(),
      amount: Math.floor(pct * 1e7),
      uiAmount: Math.floor(pct * 1e7),
      percent: Math.max(0.1, pct),
      rank: i + 1,
    });
  }
  return out;
}

export function synthTrades(price: number, count = 25): Trade[] {
  const out: Trade[] = [];
  const now = Math.floor(Date.now() / 1000);
  for (let i = 0; i < count; i++) {
    const side: "buy" | "sell" = Math.random() > 0.45 ? "buy" : "sell";
    const amountUsd = Math.random() * 5000 + 20;
    out.push({
      side,
      priceUsd: price * (1 + (Math.random() - 0.5) * 0.01),
      amountUsd,
      amountToken: amountUsd / Math.max(price, 1e-9),
      owner: randAddr(),
      time: now - i * Math.floor(Math.random() * 90 + 10),
    });
  }
  return out;
}
