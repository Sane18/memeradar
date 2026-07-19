import { Connection, PublicKey } from "@solana/web3.js";

/**
 * Solana RPC connection. Uses your Alchemy endpoint when configured,
 * otherwise the public mainnet RPC (rate-limited but works for demos).
 */
export const RPC_URL =
  process.env.NEXT_PUBLIC_SOLANA_RPC ||
  "https://api.mainnet-beta.solana.com";

let _conn: Connection | null = null;
export function getConnection(): Connection {
  if (!_conn) _conn = new Connection(RPC_URL, "confirmed");
  return _conn;
}

export async function getSolBalance(address: string): Promise<number> {
  try {
    const conn = getConnection();
    const lamports = await conn.getBalance(new PublicKey(address));
    return lamports / 1e9;
  } catch {
    return 0;
  }
}
