import { NextResponse } from "next/server";
import { getSolBalance } from "@/lib/solana";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address");
  if (!address) return NextResponse.json({ sol: 0 });
  const sol = await getSolBalance(address);
  return NextResponse.json({ sol });
}
