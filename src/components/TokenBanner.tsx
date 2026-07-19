"use client";

import Link from "next/link";
import { useTokens } from "@/hooks/useTokens";
import { fmtUsd, fmtPct } from "@/lib/format";
import type { Token } from "@/lib/types";

function Pill({ t }: { t: Token }) {
  const up = (t.change24h ?? 0) >= 0;
  return (
    <Link
      href={`/trade/${t.mint}`}
      className="group flex items-center gap-2 whitespace-nowrap rounded-full border border-chad-border bg-chad-card/60 px-3 py-1.5 transition hover:border-chad-primary/60 hover:bg-chad-card"
    >
      {t.logoURI ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={t.logoURI}
          alt={t.symbol}
          className="h-5 w-5 rounded-full"
          onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
        />
      ) : (
        <span className="grid h-5 w-5 place-items-center rounded-full bg-chad-border text-[10px]">
          {t.symbol?.[0]}
        </span>
      )}
      <span className="text-sm font-semibold text-white">{t.symbol}</span>
      <span className="text-sm text-chad-muted">{fmtUsd(t.price)}</span>
      <span
        className={`text-xs font-medium ${up ? "text-chad-up" : "text-chad-down"}`}
      >
        {fmtPct(t.change24h)}
      </span>
    </Link>
  );
}

/**
 * Infinite-scrolling token banner. `direction` lets the top and bottom
 * banners scroll opposite ways. Tapping a token opens its trading page.
 */
export function TokenBanner({
  direction = "left",
}: {
  direction?: "left" | "right";
}) {
  const { tokens, loading } = useTokens();
  const list = tokens.length ? tokens : [];

  if (loading && !list.length) {
    return (
      <div className="flex h-12 items-center gap-3 overflow-hidden border-y border-chad-border bg-chad-surface px-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-7 w-32 animate-pulse rounded-full bg-chad-card"
          />
        ))}
      </div>
    );
  }

  const doubled = [...list, ...list];
  const anim = direction === "left" ? "animate-marquee" : "animate-marquee-reverse";

  return (
    <div className="relative overflow-hidden border-y border-chad-border bg-chad-surface/80">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-chad-bg to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-chad-bg to-transparent" />
      <div className={`flex w-max gap-3 py-2 ${anim} hover:[animation-play-state:paused]`}>
        {doubled.map((t, i) => (
          <Pill key={`${t.mint}-${i}`} t={t} />
        ))}
      </div>
    </div>
  );
}
