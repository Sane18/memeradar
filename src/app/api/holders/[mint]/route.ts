import { NextResponse } from "next/server";
import { fetchHolders } from "@/lib/birdeye";
import { synthHolders } from "@/lib/mock";

export const revalidate = 60;

export async function GET(
  _req: Request,
  { params }: { params: { mint: string } }
) {
  const holders = await fetchHolders(params.mint, 20);
  if (holders.length) return NextResponse.json({ holders, source: "birdeye" });
  return NextResponse.json({ holders: synthHolders(20), source: "synthetic" });
}
