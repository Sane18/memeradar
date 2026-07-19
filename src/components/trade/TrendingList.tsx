"use client";

import { useEffect, useState } from "react";
import { useTokens } from "@/hooks/useTokens";
import { useAuth } from "@/hooks/useAuth";
import { useWatchlist } from "@/hooks/useWatchlist";
import { fmtUsd } from "@/lib/format";
import { TokenLogo } from "./TokenLogo";
import type { Token } from "@/lib/types";

const NAV_TABS = ["Alerts", "Tokens", "Leaderboard", "Feed"] as const;
const FILTER_TABS = ["Watchlist", "Crypto", "Trending", "Most held", "Graduated", "Bonding"] as const;
const LB_PERIODS = ["24H", "7D", "30D", "ALL"] as const;

// Deterministic pseudo-random [0,1)
function s(i: number, salt = 0) {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

const PALETTE = ["#3B82F6", "#10B981", "#8B5CF6", "#F59E0B", "#EC4899", "#EF4444", "#06B6D4", "#F97316"];
function avatarBg(name: string) { return PALETTE[name.charCodeAt(0) % PALETTE.length]; }

function Avt({ name, size = 32 }: { name: string; size?: number }) {
  return (
    <span
      className="inline-grid shrink-0 place-items-center rounded-full font-bold text-white"
      style={{ width: size, height: size, background: avatarBg(name), fontSize: Math.max(8, Math.round(size * 0.38)) }}
    >
      {name[0].toUpperCase()}
    </span>
  );
}

const TRADERS = [
  { name: "tjrtradez",    handle: "@tjrtradez",      pnl: 8984291.18 },
  { name: "mk4",          handle: "@boosted",         pnl:   91172.33 },
  { name: "WallStreetBets", handle: "@wallstreetbets", pnl:  49791.65 },
  { name: "TAVO",         handle: "@con3joblanco",    pnl:  45580.80 },
  { name: "devv",         handle: "@devwyd",          pnl:  30701.20 },
  { name: "ReadTheFlow",  handle: "@readtheflow",     pnl:  28792.87 },
  { name: "PoorGoat",     handle: "@PoorGoat_",       pnl:  27215.89 },
  { name: "Binkieee",     handle: "@Binkieee",        pnl:  27166.90 },
  { name: "Aeon",         handle: "@Cryptoaeon",      pnl:  24132.96 },
  { name: "on",           handle: "@Kingstaccz",      pnl:  21811.68 },
  { name: "FartmanSacks", handle: "@FartmanSacks",    pnl:  20415.43 },
];

const LB_MULT: Record<string, number> = { "24H": 1, "7D": 7, "30D": 30, "ALL": 365 };

// ————————————————————————————————————————
// Sub-views
// ————————————————————————————————————————

function AlertsView({ tokens }: { tokens: Token[] }) {
  const COUNTS  = [20, 40, 20, 20, 20, 20, 20, 40];
  const AMOUNTS = [147100, 48800, 79900, 152600, 86400, 43200, 95000, 67800];
  const MINS    = [29, 48, 53, 58, 60, 61, 62, 63];

  return (
    <>
      <div className="flex h-9 shrink-0 items-center justify-between border-b border-term-border px-3">
        <span className="text-[12px] font-medium text-term-text2">Traders</span>
        <button className="text-term-text3 transition hover:text-term-text2">
          <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M2 7H1v3h2l3.5 2.5V4.5L2 7z" /><path d="M10 6a2.5 2.5 0 0 1 0 4" /><path d="M12.5 4a5 5 0 0 1 0 8" />
          </svg>
        </button>
      </div>
      <div className="flex h-8 shrink-0 items-center gap-1.5 border-b border-term-border px-3">
        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 text-term-text3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M2 4h12M5 8h6M7 12h2" />
        </svg>
        <span className="text-[11px] text-term-text3">Filters</span>
      </div>
      <div className="no-scrollbar flex-1 overflow-y-auto">
        {tokens.slice(0, 8).map((tok, i) => {
          const side = i % 3 === 1 ? "Sell" : "Buy";
          const avatarNames = Array.from({ length: 4 }, (_, j) => TRADERS[(i * 4 + j) % TRADERS.length].name);
          return (
            <div key={tok.mint} className="cursor-pointer border-b border-term-border px-3 py-2.5 transition hover:bg-term-surface">
              <div className="flex items-center gap-2">
                {/* Overlapping trader avatars */}
                <div className="relative shrink-0" style={{ width: 42, height: 24 }}>
                  {avatarNames.map((n, j) => (
                    <span key={j} className="absolute top-0 inline-grid h-6 w-6 place-items-center rounded-full text-[8px] font-bold text-white ring-1 ring-term-bg2"
                      style={{ left: j * 9, background: avatarBg(n), zIndex: 4 - j }}>
                      {n[0]}
                    </span>
                  ))}
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[12px] font-medium text-term-text">{COUNTS[i] ?? 20} traders </span>
                  <span className={`rounded px-1.5 py-px text-[10px] font-semibold ${side === "Buy" ? "bg-[rgba(22,199,132,0.15)] text-term-up" : "bg-[rgba(246,70,93,0.15)] text-term-down"}`}>
                    {side}
                  </span>
                  <span className="text-[12px] font-medium text-term-text"> ${((AMOUNTS[i] ?? 50000) / 1000).toFixed(1)}K</span>
                </div>
                <span className="shrink-0 text-[11px] text-term-text3">{MINS[i] ?? 30}m</span>
              </div>
              <div className="mt-1.5 flex items-center gap-1.5" style={{ paddingLeft: 50 }}>
                <TokenLogo uri={tok.logoURI} symbol={tok.symbol} className="h-4 w-4" />
                <span className="text-[11px] text-term-text2">{tok.symbol} at {fmtUsd(tok.marketCap ?? 1e6, { compact: true })} MC</span>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

function LeaderboardView() {
  const [period, setPeriod] = useState<(typeof LB_PERIODS)[number]>("24H");
  const mult = LB_MULT[period] ?? 1;

  return (
    <>
      <div className="flex h-9 shrink-0 items-center gap-1 border-b border-term-border px-3">
        {LB_PERIODS.map((p) => (
          <button key={p} onClick={() => setPeriod(p)}
            className={`rounded px-2.5 py-1 text-[11px] font-medium transition ${p === period ? "bg-term-surface text-term-text" : "text-term-text3 hover:text-term-text2"}`}>
            {p}
          </button>
        ))}
      </div>
      {/* Your rank row */}
      <div className="flex shrink-0 items-center gap-2.5 border-b border-term-border px-3 py-2">
        <Avt name="You" size={32} />
        <div className="flex-1 leading-tight">
          <p className="text-[11px] text-term-text3">Your rank</p>
          <p className="text-[13px] font-semibold text-term-text"># –</p>
        </div>
        <div className="text-right leading-tight">
          <p className="text-[11px] text-term-text3">PnL</p>
          <p className="text-[13px] text-term-text3">––</p>
        </div>
      </div>
      <div className="no-scrollbar flex-1 overflow-y-auto">
        {TRADERS.map((t, i) => {
          const rank = i + 1;
          const pnl = t.pnl * (mult + s(i, period.charCodeAt(0)) * 0.25);
          return (
            <div key={t.name} className="flex cursor-pointer items-center gap-2 px-3 py-2 transition hover:bg-term-surface">
              <span className="w-6 shrink-0 text-center text-[13px]">
                {rank <= 3 ? (
                  <span className={`text-[11px] font-bold ${rank === 1 ? "text-yellow-400" : rank === 2 ? "text-slate-300" : "text-orange-400"}`}>
                    #{rank}
                  </span>
                ) : (
                  <span className="text-[11px] text-term-text3">{rank}.</span>
                )}
              </span>
              <Avt name={t.name} size={30} />
              <div className="min-w-0 flex-1 leading-tight">
                <p className="truncate text-[12px] font-semibold text-term-text">{t.name}</p>
                <p className="text-[11px] text-term-text3">{t.handle}</p>
              </div>
              <p className="shrink-0 text-[12px] font-semibold text-term-up">
                +${pnl.toLocaleString("en-US", { maximumFractionDigits: 2 })}
              </p>
            </div>
          );
        })}
      </div>
    </>
  );
}

function FeedView({ tokens }: { tokens: Token[] }) {
  return (
    <>
      <div className="flex h-9 shrink-0 items-center gap-1.5 border-b border-term-border px-3">
        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 text-term-text3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M2 4h12M5 8h6M7 12h2" />
        </svg>
        <span className="text-[11px] text-term-text3">Filter</span>
      </div>
      <div className="no-scrollbar flex-1 overflow-y-auto">
        {/* Pinned recap post */}
        <div className="border-b border-term-border p-3">
          <div className="flex items-center gap-2">
            <span className="inline-grid h-7 w-7 shrink-0 place-items-center rounded-full bg-term-accent text-[11px] font-bold text-white">F</span>
            <span className="text-[12px] font-semibold text-term-text">fomo</span>
            <svg viewBox="0 0 16 16" className="h-3 w-3 text-term-accent" fill="currentColor">
              <path d="M8 1l1.8 3.6 4 .6-2.9 2.8.7 4L8 10.3l-3.6 1.7.7-4L2.1 5.2l4-.6z" />
            </svg>
            <span className="ml-auto text-[11px] text-term-text3">12h</span>
            <span className="flex items-center gap-1 text-[11px] text-term-text3">
              <svg viewBox="0 0 16 16" className="h-3 w-3" fill="currentColor"><path d="M9.5 1.5a1 1 0 0 1 1.414 0l3.586 3.586a1 1 0 0 1 0 1.414L13 8l-1-1-5 5-1-1 1.5-1.5-3-3L2 9 1 8l2.5-2.5C2.5 4.5 3 3 4.5 1.5zm1 2L9 5l2 2 1.5-1.5zM2 12l2-2 2 2-2 2z" /></svg>
              Pinned
            </span>
          </div>
          <div className="mt-2 rounded-lg bg-term-surface p-2.5">
            <p className="text-[11px] font-semibold text-term-text">Recap: June 28th, 2026</p>
            <p className="mt-1 line-clamp-3 text-[11px] leading-relaxed text-term-text2">
              • As Bitcoin continues its attempts to form a bottom after days of consolidation around the major $60,000 support level, $HYPE and $SOL remain in the spotlight as top performers among high-cap toke...
            </p>
            <button className="mt-1 text-[11px] text-term-text3 transition hover:text-term-text2">Show more</button>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-term-text3">
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M8 14c-3.5-2.5-6-5-6-8a6 6 0 0 1 12 0c0 3-2.5 5.5-6 8z" />
            </svg>
            41
          </div>
        </div>

        {/* Activity feed from tokens */}
        {tokens.slice(0, 7).map((tok, i) => {
          const trader   = TRADERS[i % TRADERS.length];
          const isTrade  = i % 3 === 1;
          const isThesis = i % 5 === 4;
          const isGain   = !isTrade && !isThesis;
          const side     = i % 2 === 0 ? "Buy" : "Sell";
          const gainAmt  = Math.floor(1200 + s(i, 2) * 18000);
          const gainPct  = Math.floor(80 + s(i, 3) * 550);
          const timeStr  = i === 0 ? "now" : `${Math.floor(10 + s(i, 5) * 120)}s`;

          return (
            <div key={tok.mint} className="border-b border-term-border p-3">
              <div className="flex items-center gap-2">
                <Avt name={trader.name} size={28} />
                <div className="flex flex-1 flex-wrap items-center gap-1.5">
                  <span className="text-[12px] font-semibold text-term-text">{trader.name}</span>
                  {isTrade && (
                    <span className={`rounded px-1.5 py-px text-[10px] font-semibold ${side === "Buy" ? "bg-[rgba(22,199,132,0.15)] text-term-up" : "bg-[rgba(246,70,93,0.15)] text-term-down"}`}>
                      {side}
                    </span>
                  )}
                  {isThesis && (
                    <span className="rounded bg-[rgba(139,92,246,0.2)] px-1.5 py-px text-[10px] font-semibold text-purple-400">Thesis</span>
                  )}
                  {isGain && (
                    <span className="text-[11px] text-term-text3">
                      is up <span className="font-medium text-term-up">+${gainAmt.toLocaleString()}</span>
                    </span>
                  )}
                </div>
                <span className="shrink-0 text-[11px] text-term-text3">{timeStr}</span>
              </div>

              {isTrade && (
                <div className="mt-1.5 flex items-center gap-1.5 pl-9">
                  <TokenLogo uri={tok.logoURI} symbol={tok.symbol} className="h-4 w-4" />
                  <span className="text-[11px] text-term-text2">
                    {tok.symbol} ${(1.2 + s(i, 4) * 20).toFixed(1)}K at {fmtUsd(tok.marketCap ?? 1e6, { compact: true })} MC
                  </span>
                </div>
              )}

              {isGain && (
                <div className="ml-9 mt-1.5 rounded-lg border border-term-border bg-term-surface p-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <TokenLogo uri={tok.logoURI} symbol={tok.symbol} className="h-5 w-5" />
                      <span className="text-[12px] font-semibold text-term-text">{tok.symbol}</span>
                    </div>
                    <span className="text-[12px] font-semibold text-term-up">+${gainAmt.toLocaleString()}.00</span>
                  </div>
                  <p className="mt-1 text-[11px] text-term-text3">
                    {fmtUsd(tok.marketCap ?? 1e6, { compact: true })} MC
                    <span className="ml-2 text-term-up">▲ {gainPct}% since buy</span>
                  </p>
                </div>
              )}

              {isThesis && (
                <>
                  <div className="mt-1.5 flex items-center gap-1.5 pl-9">
                    <TokenLogo uri={tok.logoURI} symbol={tok.symbol} className="h-4 w-4" />
                    <span className="text-[11px] font-medium text-term-text">{tok.symbol}</span>
                    <span className="text-[11px] text-term-text2">${(gainAmt * 8 / 1000).toFixed(1)}K</span>
                    <span className="text-[11px] text-term-down">(-${Math.floor(gainAmt * 0.15).toLocaleString()})</span>
                  </div>
                  <p className="mt-1 pl-9 text-[11px] text-term-text3">aping a starter, will add if it holds this level.</p>
                  <div className="mt-2 flex items-center gap-1 pl-9 text-[11px] text-term-text3">
                    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M8 14c-3.5-2.5-6-5-6-8a6 6 0 0 1 12 0c0 3-2.5 5.5-6 8z" />
                    </svg>
                    0
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

// ————————————————————————————————————————
// Main component
// ————————————————————————————————————————

export function TrendingList({
  selected,
  onSelect,
}: {
  selected?: string;
  onSelect: (t: Token) => void;
}) {
  const { tokens, loading } = useTokens();
  const { solanaAddress, authenticated } = useAuth();
  const { mints } = useWatchlist(solanaAddress);
  const [navTab, setNavTab] = useState<(typeof NAV_TABS)[number]>("Tokens");
  const [tab, setTab] = useState<(typeof FILTER_TABS)[number]>("Trending");
  const [watchTokens, setWatchTokens] = useState<Token[]>([]);

  useEffect(() => {
    if (tab !== "Watchlist") return;
    let alive = true;
    Promise.all(
      Array.from(mints).map(async (mint) => {
        const found = tokens.find((t) => t.mint === mint);
        if (found) return found;
        try {
          return (await fetch(`/api/token/${mint}`).then((x) => x.json()))?.token as Token;
        } catch {
          return null;
        }
      })
    ).then((res) => alive && setWatchTokens(res.filter(Boolean) as Token[]));
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, mints, tokens]);

  const list = (() => {
    if (tab === "Watchlist") return watchTokens;
    const base = [...tokens];
    switch (tab) {
      case "Crypto":     return base.sort((a, b) => (b.marketCap ?? 0) - (a.marketCap ?? 0));
      // BirdEye's token_trending is already rank-sorted (real, weighted) — don't
      // re-sort it by raw % change, that just surfaces noisy micro-cap outliers.
      case "Trending":   return base;
      case "Most held":  return base.sort((a, b) => (b.liquidity ?? 0) - (a.liquidity ?? 0));
      case "Graduated":  return base.filter((t) => (t.marketCap ?? 0) >= 69000).sort((a, b) => (b.marketCap ?? 0) - (a.marketCap ?? 0));
      case "Bonding":    return base.filter((t) => (t.marketCap ?? 0) < 69000).sort((a, b) => (b.marketCap ?? 0) - (a.marketCap ?? 0));
      default:           return base;
    }
  })();

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-term-border bg-term-bg2">
      {/* Level 1: nav tabs */}
      <div className="flex h-9 shrink-0 items-stretch border-b border-term-border">
        {NAV_TABS.map((t) => (
          <button
            key={t}
            onClick={() => setNavTab(t)}
            className={`px-2.5 text-[12px] transition ${navTab === t ? "font-semibold text-term-text" : "font-medium text-term-text3 hover:text-term-text2"}`}
          >
            {t === "Alerts" ? (
              <span className="flex items-center gap-1">
                <svg viewBox="0 0 14 14" className="h-3 w-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 1a4 4 0 0 1 4 4c0 3 1.5 4 1.5 4h-11S3 8 3 5a4 4 0 0 1 4-4z" />
                  <path d="M5.5 9S5.5 11 7 11s1.5-2 1.5-2" />
                </svg>
                {t}
              </span>
            ) : t}
          </button>
        ))}
        <button className="ml-auto flex items-center px-2.5 text-term-text3 transition hover:text-term-text2">
          <svg viewBox="0 0 14 14" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 2L4 7l5 5" /><path d="M5 2L0 7l5 5" />
          </svg>
        </button>
      </div>

      {/* Level 2: filter pills — only for Tokens */}
      {navTab === "Tokens" && (
        <div className="flex h-9 shrink-0 items-center gap-1 border-b border-term-border px-2">
          {FILTER_TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full px-2 py-[2px] text-[10px] font-medium transition ${tab === t ? "bg-term-text text-term-bg" : "text-term-text3 hover:text-term-text2"}`}
            >
              {t}
            </button>
          ))}
        </div>
      )}

      {/* Content area */}
      {navTab !== "Tokens" ? (
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {navTab === "Alerts"      && <AlertsView tokens={tokens} />}
          {navTab === "Leaderboard" && <LeaderboardView />}
          {navTab === "Feed"        && <FeedView tokens={tokens} />}
        </div>
      ) : (
        <div className="no-scrollbar flex-1 overflow-y-auto py-1">
          {tab === "Watchlist" && !authenticated ? (
            <p className="px-3 py-8 text-center text-[13px] text-term-text3">Sign in to save tokens.</p>
          ) : tab === "Watchlist" && list.length === 0 ? (
            <p className="px-3 py-8 text-center text-[13px] text-term-text3">No saved tokens yet.</p>
          ) : tab === "Bonding" && list.length === 0 ? (
            <p className="px-3 py-8 text-center text-[13px] text-term-text3">No bonding tokens in current list.</p>
          ) : loading && !tokens.length ? (
            Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="mx-2 mb-1 h-[56px] animate-pulse rounded bg-term-surface" />
            ))
          ) : (
            list.map((t) => {
              const hasChange = t.change24h != null;
              const up = (t.change24h ?? 0) >= 0;
              const active = t.mint === selected;
              return (
                <button
                  key={t.mint}
                  onClick={() => onSelect(t)}
                  className={`flex h-[56px] w-full items-center gap-2.5 px-3 text-left transition ${active ? "bg-term-surface" : "hover:bg-term-surface"}`}
                >
                  <TokenLogo uri={t.logoURI} symbol={t.symbol} className="h-8 w-8" />
                  <div className="min-w-0 flex-1 leading-tight">
                    <p className="truncate text-[13px] font-semibold text-term-text">{t.symbol}</p>
                    <p className="truncate text-[11px] text-term-text3">{fmtUsd(t.price)}</p>
                  </div>
                  <div className="shrink-0 text-right leading-tight">
                    <p className="text-[13px] font-semibold text-term-text">
                      {t.marketCap ? `${fmtUsd(t.marketCap, { compact: true })} MC` : "—"}
                    </p>
                    <p className={`text-[11px] ${!hasChange ? "text-term-text3" : up ? "text-term-up" : "text-term-down"}`}>
                      {hasChange ? `${up ? "▲" : "▼"} ${Math.abs(t.change24h!).toFixed(2)}%` : "—"}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      )}

      {/* Bottom bar */}
      <div className="flex h-9 shrink-0 items-stretch border-t border-term-border">
        <button className="flex flex-1 items-center justify-center gap-1.5 text-[11px] text-term-text3 transition hover:text-term-text2">
          <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1.5" y="1.5" width="13" height="13" rx="1.5" /><line x1="1.5" y1="8" x2="14.5" y2="8" />
          </svg>
          Split bottom
        </button>
        <span className="w-px bg-term-border" />
        <button className="flex flex-1 items-center justify-center gap-1.5 text-[11px] text-term-text3 transition hover:text-term-text2">
          <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1.5" y="1.5" width="13" height="13" rx="1.5" /><line x1="8" y1="1.5" x2="8" y2="14.5" />
          </svg>
          Split right
        </button>
      </div>
    </div>
  );
}
