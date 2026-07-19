"use client";

import Link from "next/link";
import { useTokens } from "@/hooks/useTokens";
import { fmtUsd, fmtPct } from "@/lib/format";

export function GlobalTicker() {
  const { tokens } = useTokens();
  const list = tokens.slice(0, 10);

  return (
    <footer className="flex h-7 shrink-0 items-center justify-between gap-4 border-t border-term-border bg-term-bg text-[11px] tabular-nums">
      <div className="flex min-w-0 flex-1 overflow-hidden">
        <div
          className="flex items-center gap-6 whitespace-nowrap"
          style={{ animation: "ticker-scroll 40s linear infinite", width: "max-content" }}
        >
          {[...list, ...list].map((t, i) => {
            const up = (t.change24h ?? 0) >= 0;
            return (
              <Link key={i} href={`/trade/${t.mint}`} className="flex shrink-0 items-center gap-1.5">
                <span className="font-medium text-term-text">{t.symbol}</span>
                <span className="text-term-text2">{fmtUsd(t.price)}</span>
                <span className={up ? "text-term-up" : "text-term-down"}>{fmtPct(t.change24h)}</span>
              </Link>
            );
          })}
        </div>
      </div>
      <div className="hidden shrink-0 items-center gap-4 text-term-text3 sm:flex">
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-term-up" /> Stable
        </span>
        <a href="#" className="hover:text-term-text">Privacy</a>
        <a href="#" className="hover:text-term-text">Terms</a>
        <a href="#" className="hover:text-term-text">Help</a>
      </div>
    </footer>
  );
}
