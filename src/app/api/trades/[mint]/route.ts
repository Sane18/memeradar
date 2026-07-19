import { NextResponse } from "next/server";
import { fetchTrades } from "@/lib/birdeye";
import { fetchPrices } from "@/lib/jupiter";
import { synthTrades } from "@/lib/mock";

export const revalidate = 5;

export async function GET(
  _req: Request,
  { params }: { params: { mint: string } }
) {
  const trades = await fetchTrades(params.mint, 30);
  if (trades.length) return NextResponse.json({ trades, source: "birdeye" });
  const prices = await fetchPrices([params.mint]);
  const price = prices[params.mint] || 1;
  return NextResponse.json({ trades: synthTrades(price), source: "synthetic" });
}
