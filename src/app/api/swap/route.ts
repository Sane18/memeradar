import { NextResponse } from "next/server";
import { buildSwapTx } from "@/lib/jupiter";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body?.quoteResponse || !body?.userPublicKey) {
      return NextResponse.json({ error: "missing params" }, { status: 400 });
    }
    const data = await buildSwapTx({
      quoteResponse: body.quoteResponse,
      userPublicKey: body.userPublicKey,
    });
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "swap build failed" },
      { status: 500 }
    );
  }
}
