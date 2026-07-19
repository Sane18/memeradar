"use client";

import { useEffect, useState } from "react";
import { fmtUsd, fmtNum, shortAddr, timeAgo } from "@/lib/format";
import type { Holder, Trade } from "@/lib/types";

const NAMES = ["rodotfun", "BigBoyKrypto", "404flipped", "frankdegods", "cupsey", "tholos", "remusofmars", "logjam", "irulan", "saylo", "threadguy", "andy8082"];
const THESES = [
  "too much volume to ignore. if it was fake it'd be done by now.",
  "smart money still accumulating here, not selling the dip.",
  "narrative is strong, chart looks like early runner.",
  "aping a starter, will add if it holds this level.",
  "this is the one. screenshot it.",
  "liquidity deepening every hour, bullish structure.",
];

function pick<T>(arr: T[], seed: number) {
  return arr[seed % arr.length];
}
function avatarColor(seed: number) {
  const colors = ["#3B82F6", "#22C55E", "#EF4444", "#A855F7", "#F59E0B", "#06B6D4"];
  return colors[seed % colors.length];
}

const TABS = ["Holders", "Swaps", "Thesis"] as const;

export function HoldersAndTrades({ mint, price }: { mint: string; price?: number }) {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Holders");
  const [holders, setHolders] = useState<Holder[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);

  useEffect(() => {
    let alive = true;
    const loadTrades = () =>
      fetch(`/api/trades/${mint}`).then((x) => x.json()).then((r) => alive && setTrades(r.trades || []));
    fetch(`/api/holders/${mint}`).then((x) => x.json()).then((r) => alive && setHolders(r.holders || []));
    loadTrades();
    const id = setInterval(loadTrades, 6000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [mint]);

  return (
    <div className="flex flex-col bg-term-bg">
      {/* tabs — 36px */}
      <div className="flex h-9 shrink-0 items-stretch gap-3 border-b border-term-border px-3">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`relative text-[13px] font-medium transition ${
              tab === t ? "text-term-text" : "text-term-text2 hover:text-term-text"
            }`}
          >
            {t}
            {t === "Thesis" ? " (246)" : ""}
            {tab === t && <span className="absolute -bottom-px left-0 h-0.5 w-full rounded-full bg-term-up" />}
          </button>
        ))}
      </div>

      <div>
        {tab === "Holders" && (
          <table className="w-full text-[13px]">
            <thead className="sticky top-0 bg-term-bg text-[11px] text-term-text3">
              <tr>
                <th className="px-3 py-2 text-left font-medium">Trader</th>
                <th className="px-3 py-2 text-right font-medium">Position</th>
                <th className="px-3 py-2 text-right font-medium">PnL</th>
                <th className="px-3 py-2 text-right font-medium">Avg entry</th>
                <th className="hidden px-3 py-2 text-left font-medium lg:table-cell">Thesis</th>
              </tr>
            </thead>
            <tbody>
              {holders.map((h, i) => {
                // Real position size (real uiAmount from BirdEye × real price).
                // PnL/avg-entry stay placeholder — that needs full per-wallet
                // trade history, which is the per-trader-analytics work the
                // founder said not to worry about yet.
                const pos = price ? h.uiAmount * price : undefined;
                const pnl = ((i % 5) - 1.5) * (pos ?? 0) * 0.4;
                const pnlUp = pnl >= 0;
                return (
                  <tr key={h.rank} className="h-10 border-b border-term-border/60 hover:bg-term-surface">
                    <td className="px-3">
                      <div className="flex items-center gap-2">
                        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-[10px] font-bold text-black" style={{ background: avatarColor(h.rank) }}>
                          {pick(NAMES, h.rank)[0].toUpperCase()}
                        </span>
                        <div className="leading-tight">
                          <p className="text-term-text">{pick(NAMES, h.rank)}</p>
                          <p className="text-[11px] text-term-text3">{shortAddr(h.owner, 4)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 text-right text-term-text">{fmtUsd(pos, { compact: true })}</td>
                    <td className={`px-3 text-right ${pnlUp ? "text-term-up" : "text-term-down"}`}>
                      {pnlUp ? "+" : ""}{fmtUsd(pnl, { compact: true })}
                    </td>
                    <td className="px-3 text-right text-term-text2">{fmtUsd(pos * 18, { compact: true })} MC</td>
                    <td className="hidden max-w-[260px] truncate px-3 text-[12px] text-term-text2 lg:table-cell">
                      {h.rank % 3 === 0 ? pick(THESES, h.rank) : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {tab === "Swaps" && (
          <table className="w-full text-[13px]">
            <thead className="sticky top-0 bg-term-bg text-[11px] text-term-text3">
              <tr>
                <th className="px-3 py-2 text-left font-medium">Type</th>
                <th className="px-3 py-2 text-right font-medium">Price</th>
                <th className="px-3 py-2 text-right font-medium">USD</th>
                <th className="px-3 py-2 text-right font-medium">Trader</th>
                <th className="px-3 py-2 text-right font-medium">Age</th>
              </tr>
            </thead>
            <tbody>
              {trades.map((t, i) => (
                <tr key={i} className="h-10 border-b border-term-border/60 hover:bg-term-surface">
                  <td className={`px-3 font-medium ${t.side === "buy" ? "text-term-up" : "text-term-down"}`}>
                    {t.side === "buy" ? "Buy" : "Sell"}
                  </td>
                  <td className="px-3 text-right text-term-text">{fmtUsd(t.priceUsd)}</td>
                  <td className="px-3 text-right text-term-text">{fmtUsd(t.amountUsd, { compact: true })}</td>
                  <td className="px-3 text-right text-term-text2">{shortAddr(t.owner)}</td>
                  <td className="px-3 text-right text-term-text3">{timeAgo(t.time)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === "Thesis" && (
          <div className="divide-y divide-term-border/60">
            {holders.slice(0, 10).map((h) => (
              <div key={h.rank} className="flex gap-3 px-3 py-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[11px] font-bold text-black" style={{ background: avatarColor(h.rank) }}>
                  {pick(NAMES, h.rank)[0].toUpperCase()}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-[13px]">
                    <span className="font-medium text-term-text">{pick(NAMES, h.rank)}</span>
                    <span className="text-[11px] text-term-text3">{(h.rank % 12) + 1}h</span>
                  </div>
                  <p className="mt-0.5 text-[13px] text-term-text2">{pick(THESES, h.rank)}</p>
                  <p className="mt-1 text-[11px] text-term-text3">♡ {fmtNum((h.rank * 37) % 900)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
