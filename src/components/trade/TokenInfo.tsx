"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useWatchlist } from "@/hooks/useWatchlist";
import { fmtUsd, fmtNum, fmtPct, shortAddr } from "@/lib/format";
import { TokenLogo } from "./TokenLogo";
import type { Holder, Token } from "@/lib/types";

/** Real top-N holders' share of supply, or undefined if either side is missing. */
function topHolderPercent(holders: Holder[], supply?: number, n = 10) {
  if (!supply) return undefined;
  const sum = holders.slice(0, n).reduce((s, h) => s + h.uiAmount, 0);
  return (sum / supply) * 100;
}

function Icon({ children, href, onClick, active }: { children: React.ReactNode; href?: string; onClick?: () => void; active?: boolean }) {
  const cls = `grid h-5 w-5 place-items-center rounded text-term-text3 transition hover:bg-term-surface hover:text-term-text ${active ? "text-term-accent" : ""}`;
  return href ? (
    <a href={href} target="_blank" rel="noreferrer" className={cls}>{children}</a>
  ) : (
    <button onClick={onClick} className={cls}>{children}</button>
  );
}

export function TokenInfo({ token }: { token?: Token }) {
  const { solanaAddress, authenticated } = useAuth();
  const { isStarred, toggle } = useWatchlist(solanaAddress);
  const [holders, setHolders] = useState<Holder[]>([]);

  useEffect(() => {
    if (!token?.mint) return;
    let alive = true;
    fetch(`/api/holders/${token.mint}`)
      .then((r) => r.json())
      // Only keep real BirdEye holders — mixing synthetic amounts with the
      // token's real supply would print a plausible-looking fake percentage.
      .then((r) => alive && setHolders(r.source === "birdeye" ? r.holders || [] : []));
    return () => {
      alive = false;
    };
  }, [token?.mint]);

  if (!token) {
    return <div className="h-24 animate-pulse border-b border-term-border bg-term-surface" />;
  }
  const up = (token.change24h ?? 0) >= 0;
  const top10 = topHolderPercent(holders, token.circulatingSupply ?? token.totalSupply);

  const stats: { label: string; value: string; color?: string }[] = [
    { label: "Price", value: fmtUsd(token.price) },
    { label: "Market cap", value: fmtUsd(token.marketCap, { compact: true }) },
    { label: "24H change", value: fmtPct(token.change24h), color: up ? "text-term-up" : "text-term-down" },
    { label: "24H Vol", value: fmtUsd(token.volume24h, { compact: true }) },
    { label: "Liquidity", value: fmtUsd(token.liquidity, { compact: true }) },
    { label: "Holders", value: fmtNum(token.holderCount) },
    { label: "Top 10", value: top10 != null ? `${top10.toFixed(1)}%` : "—" },
  ];

  return (
    <div className="flex h-24 items-center gap-3 border-b border-term-border px-4">
      <TokenLogo uri={token.logoURI} symbol={token.symbol} className="h-10 w-10" />

      <div className="shrink-0">
        <div className="flex items-center gap-2">
          <h1 className="text-[20px] font-semibold leading-none text-term-text">{token.symbol}</h1>
          <div className="flex items-center gap-0.5">
            {token.website ? (
              <Icon href={token.website}>
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18" /></svg>
              </Icon>
            ) : null}
            {token.twitter ? (
              <Icon href={token.twitter.startsWith("http") ? token.twitter : `https://x.com/${token.twitter}`}>
                <svg viewBox="0 0 24 24" className="h-3 w-3 fill-current"><path d="M18.9 2H22l-7.6 8.7L23 22h-6.9l-5.4-7-6.2 7H1.4l8.1-9.3L1 2h7l4.9 6.5L18.9 2zm-2.4 18h1.9L7.6 4H5.6l10.9 16z" /></svg>
              </Icon>
            ) : null}
            <Icon onClick={() => authenticated && toggle(token.mint)}>
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill={isStarred(token.mint) ? "#FBBF24" : "none"} stroke="#FBBF24" strokeWidth="2" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
            </Icon>
          </div>
        </div>
        <p className="mt-1 text-[12px] text-term-text2">{token.name}</p>
        <a
          href={`https://solscan.io/token/${token.mint}`}
          target="_blank"
          rel="noreferrer"
          className="text-[11px] text-term-text3 hover:text-term-text2"
        >
          {shortAddr(token.mint, 4)} ↗
        </a>
      </div>

      <div className="no-scrollbar ml-auto flex items-center gap-2.5 overflow-x-auto">
        {stats.map((s) => (
          <div key={s.label} className="min-w-[92px] shrink-0 rounded-lg border border-term-border bg-term-bg2 px-3 py-2">
            <p className="text-[11px] text-term-text3">{s.label}</p>
            <p className={`mt-0.5 text-[13px] font-medium ${s.color ?? "text-term-text"}`}>{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
