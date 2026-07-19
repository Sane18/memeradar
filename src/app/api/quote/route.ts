import { NextResponse } from "next/server";
import { getQuote } from "@/lib/jupiter";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const inputMint = searchParams.get("inputMint");
  const outputMint = searchParams.get("outputMint");
  const amount = searchParams.get("amount");
  const slippageBps = Number(searchParams.get("slippageBps") || 50);
  if (!inputMint || !outputMint || !amount) {
    return NextResponse.json({ error: "missing params" }, { status: 400 });
  }
  const quote = await getQuote({ inputMint, outputMint, amount, slippageBps });
  if (!quote) return NextResponse.json({ error: "no route" }, { status: 404 });
  return NextResponse.json(quote);
}
