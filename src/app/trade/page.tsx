import { TradeWorkspace } from "@/components/trade/TradeWorkspace";
import { SOL_MINT } from "@/lib/tokens";
import { resolveToken } from "@/lib/serverToken";

// Live, real-time trading view — render per request rather than prerender.
export const dynamic = "force-dynamic";

export default async function TradePage() {
  const initialToken = await resolveToken(SOL_MINT);
  return <TradeWorkspace initialMint={SOL_MINT} initialToken={initialToken} />;
}
