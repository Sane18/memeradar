import { TradeWorkspace } from "@/components/trade/TradeWorkspace";
import { resolveToken } from "@/lib/serverToken";

// Live, real-time trading view — render per request rather than prerender.
export const dynamic = "force-dynamic";

export default async function TradeMintPage({
  params,
}: {
  params: { mint: string };
}) {
  const { mint } = params;
  const initialToken = await resolveToken(mint);
  return <TradeWorkspace initialMint={mint} initialToken={initialToken} />;
}
