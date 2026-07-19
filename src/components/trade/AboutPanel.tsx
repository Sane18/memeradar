"use client";

import { fmtUsd, fmtNum, fmtPct } from "@/lib/format";
import type { Token } from "@/lib/types";

/** Renders "—" instead of a zero-width bar when neither real value is available. */
function Bar({ left, right, leftLabel, rightLabel }: { left?: number; right?: number; leftLabel: string; rightLabel: string }) {
  if (left == null && right == null) {
    return <p className="text-[11px] text-term-text3">—</p>;
  }
  const l = left ?? 0;
  const r = right ?? 0;
  const total = l + r || 1;
  return (
    <div>
      <div className="flex justify-between text-[11px]">
        <span className="font-medium text-term-up">{leftLabel}</span>
        <span className="font-medium text-term-down">{rightLabel}</span>
      </div>
      <div className="mt-1 flex h-1.5 overflow-hidden rounded-[2px] bg-term-down">
        <div className="h-full bg-term-up" style={{ width: `${(l / total) * 100}%` }} />
      </div>
    </div>
  );
}

export function AboutPanel({ token }: { token?: Token }) {
  if (!token) return null;
  // All real BirdEye overview fields — undefined (shown as "—") when BirdEye
  // has no overview for this mint, never a fabricated stand-in.
  const perf = [
    { k: "5M", v: token.change5m },
    { k: "1H", v: token.change1h },
    { k: "4H", v: token.change4h },
    { k: "1D", v: token.change24h },
  ];

  return (
    <div className="rounded-lg border border-term-border bg-term-bg2 p-4">
      <p className="text-[13px] font-semibold text-term-text">About {token.symbol}</p>
      <p className="mt-1 line-clamp-2 text-[12px] text-term-text2">
        {token.name} — trade {token.symbol} on MemeRadar with the best route across every Solana DEX.
      </p>

      <div className="mt-3 grid grid-cols-4 gap-1.5">
        {perf.map((p) => {
          const up = (p.v ?? 0) >= 0;
          return (
            <div key={p.k} className="rounded-lg border border-term-border bg-term-bg px-2 py-1.5 text-center">
              <p className="text-[10px] text-term-text3">{p.k}</p>
              <p className={`text-[11px] font-semibold ${p.v == null ? "text-term-text3" : up ? "text-term-up" : "text-term-down"}`}>{fmtPct(p.v)}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-4 space-y-3">
        <Bar left={token.buy24h} right={token.sell24h} leftLabel={`${fmtNum(token.buy24h)} buys`} rightLabel={`${fmtNum(token.sell24h)} sells`} />
        <Bar left={token.buyVol24h} right={token.sellVol24h} leftLabel={`${fmtUsd(token.buyVol24h, { compact: true })} vol`} rightLabel={`${fmtUsd(token.sellVol24h, { compact: true })} vol`} />
        <p className="text-[11px] text-term-text3">{fmtNum(token.uniqueWallets24h)} unique traders (24h)</p>
      </div>

      <a
        href={`https://birdeye.so/token/${token.mint}?chain=solana`}
        target="_blank"
        rel="noreferrer"
        className="mt-4 block w-full rounded-lg border border-term-border bg-term-bg py-2 text-center text-[12px] font-medium text-term-text2 transition hover:border-term-text3 hover:text-term-text"
      >
        View more
      </a>
    </div>
  );
}
