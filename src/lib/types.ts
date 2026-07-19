export interface Token {
  mint: string;
  symbol: string;
  name: string;
  logoURI?: string;
  decimals: number;
  price?: number;
  change24h?: number; // percent
  volume24h?: number;
  liquidity?: number;
  marketCap?: number;
  website?: string;
  twitter?: string;
  // Real BirdEye overview extras — only present when BirdEye has this mint.
  holderCount?: number;
  totalSupply?: number;
  circulatingSupply?: number;
  change5m?: number;
  change1h?: number;
  change4h?: number;
  buy24h?: number;
  sell24h?: number;
  buyVol24h?: number;
  sellVol24h?: number;
  uniqueWallets24h?: number;
}

export interface Candle {
  time: number; // unix seconds
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export interface Holder {
  owner: string;
  amount: number;
  uiAmount: number;
  percent?: number;
  rank: number;
}

export interface Trade {
  txHash?: string;
  side: "buy" | "sell";
  priceUsd: number;
  amountUsd: number;
  amountToken: number;
  owner: string;
  time: number; // unix seconds
}

export interface QuoteResult {
  inAmount: string;
  outAmount: string;
  priceImpactPct: string;
  routePlan?: any[];
  raw?: any;
}
