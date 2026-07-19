import { NextResponse } from "next/server";
import { fetchOhlcv, fetchHistoryPrice, fetchOverview } from "@/lib/birdeye";
import { fetchPrices } from "@/lib/jupiter";
import { synthCandles } from "@/lib/mock";

export const revalidate = 30;

export async function GET(
  req: Request,
  { params }: { params: { mint: string } }
) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") || "15m";

  // 1. Real candlesticks (BirdEye OHLCV — paid tier).
  const candles = await fetchOhlcv(params.mint, type, 48);
  if (candles.length > 2) {
    return NextResponse.json({ kind: "candle", points: candles, source: "birdeye" });
  }

  // 2. Real price line (BirdEye history_price — free tier).
  const line = await fetchHistoryPrice(params.mint, type, 48);
  if (line.length > 2) {
    return NextResponse.json({ kind: "line", points: line, source: "birdeye" });
  }

  // 3. Last resort: synthetic candles anchored to the real price.
  const overview = await fetchOverview(params.mint);
  const prices = await fetchPrices([params.mint]);
  const price = overview?.price || prices[params.mint] || 1;
  return NextResponse.json({
    kind: "candle",
    points: synthCandles(price),
    source: "synthetic",
  });
}
