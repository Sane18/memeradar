"use client";

import { useTokens } from "@/hooks/useTokens";
import { fmtUsd, fmtPct } from "@/lib/format";

/**
 * Stylized in-browser mock of the MemeRadar mobile app screen.
 * Uses live token data so the hero feels alive.
 */
export function PhoneMockup() {
  const { tokens } = useTokens();
  const list = (tokens.length ? tokens : []).slice(0, 6);

  return (
    <div className="relative mx-auto w-[280px] animate-floaty">
      <div className="absolute -inset-8 -z-10 rounded-[3rem] bg-chad-primary/20 blur-3xl" />
      <div className="rounded-[2.5rem] border border-chad-border bg-chad-bg p-3 shadow-2xl">
        <div className="overflow-hidden rounded-[2rem] bg-gradient-to-b from-chad-surface to-chad-bg">
          {/* notch */}
          <div className="flex justify-center pt-2">
            <div className="h-1.5 w-16 rounded-full bg-chad-border" />
          </div>
          {/* header */}
          <div className="flex items-center justify-between px-4 pb-3 pt-4">
            <div>
              <p className="text-xs text-chad-muted">Portfolio</p>
              <p className="text-2xl font-extrabold text-white">$12,480</p>
              <p className="text-xs font-medium text-chad-up">+18.4% today</p>
            </div>
            <div className="grid h-9 w-9 place-items-center rounded-full bg-chad-primary text-sm font-black text-black">
              C
            </div>
          </div>
          {/* token list */}
          <div className="space-y-1 px-2 pb-4">
            {(list.length ? list : Array.from({ length: 6 })).map((t: any, i) => {
              const up = (t?.change24h ?? (i % 2 ? -3 : 5)) >= 0;
              return (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-chad-card/60"
                >
                  {t?.logoURI ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={t.logoURI} alt="" className="h-8 w-8 rounded-full" />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-chad-border" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">
                      {t?.symbol ?? "—"}
                    </p>
                    <p className="text-[11px] text-chad-muted">
                      {t?.name?.slice(0, 14) ?? ""}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-white">
                      {t?.price ? fmtUsd(t.price) : "—"}
                    </p>
                    <p
                      className={`text-[11px] font-medium ${up ? "text-chad-up" : "text-chad-down"}`}
                    >
                      {t?.change24h != null ? fmtPct(t.change24h) : ""}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          {/* CTA bar */}
          <div className="flex gap-2 px-3 pb-5">
            <div className="flex-1 rounded-xl bg-chad-up/90 py-2.5 text-center text-sm font-bold text-black">
              Buy
            </div>
            <div className="flex-1 rounded-xl bg-chad-card py-2.5 text-center text-sm font-bold text-white">
              Sell
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
