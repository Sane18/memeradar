import { VersionedTransaction } from "@solana/web3.js";
import { getConnection } from "./solana";

/**
 * Client-side swap execution using Jupiter + a Privy Solana wallet.
 * `sendTransaction` is the function returned by Privy's
 * useSendTransaction / wallet.signAndSendTransaction.
 *
 * Flow: get quote (server) -> build swap tx (server) -> sign+send (wallet).
 */
export async function executeSwap(opts: {
  inputMint: string;
  outputMint: string;
  amount: string | number;
  slippageBps?: number;
  userPublicKey: string;
  signAndSend: (tx: VersionedTransaction) => Promise<string>;
}): Promise<{ signature: string }> {
  // 1. quote
  const qres = await fetch(
    `/api/quote?inputMint=${opts.inputMint}&outputMint=${opts.outputMint}&amount=${opts.amount}&slippageBps=${opts.slippageBps ?? 50}`
  );
  const quote = await qres.json();
  if (!quote?.raw) throw new Error("No route found for this swap");

  // 2. build swap tx (server proxies Jupiter /swap)
  const sres = await fetch("/api/swap", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      quoteResponse: quote.raw,
      userPublicKey: opts.userPublicKey,
    }),
  });
  const { swapTransaction } = await sres.json();
  if (!swapTransaction) throw new Error("Failed to build transaction");

  // 3. deserialize, sign + send via the embedded wallet
  const tx = VersionedTransaction.deserialize(
    Buffer.from(swapTransaction, "base64")
  );
  const signature = await opts.signAndSend(tx);

  // 4. (optional) confirm
  try {
    await getConnection().confirmTransaction(signature, "confirmed");
  } catch {
    /* best-effort */
  }
  return { signature };
}
