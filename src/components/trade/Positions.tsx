"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { fmtUsd, shortAddr } from "@/lib/format";
import type { Token } from "@/lib/types";

export function Positions({ token }: { token?: Token }) {
  const { authenticated, solanaAddress, login } = useAuth();
  const [sol, setSol] = useState<number | null>(null);
  const [solPrice, setSolPrice] = useState<number | null>(null);
  const [tab, setTab] = useState<"open" | "closed">("open");

  useEffect(() => {
    if (!solanaAddress) return;
    fetch(`/api/balance?address=${solanaAddress}`).then((r) => r.json()).then((d) => setSol(d.sol)).catch(() => setSol(0));
    fetch(`/api/token/So11111111111111111111111111111111111111112`).then((r) => r.json()).then((d) => setSolPrice(d?.token?.price ?? null)).catch(() => {});
  }, [solanaAddress]);

  return (
    <div className="rounded-lg border border-term-border bg-term-bg2 p-4">
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-semibold text-term-text">Your positions</p>
        <div className="flex overflow-hidden rounded-lg border border-term-border">
          {(["open", "closed"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1 text-[11px] capitalize transition ${
                tab === t ? "bg-term-surface text-term-text" : "bg-term-bg text-term-text3 hover:text-term-text2"
              }`}
            >
              {t}
              {t === "open" && <span className="ml-1 inline-block h-1.5 w-1.5 rounded-full bg-term-up align-middle" />}
            </button>
          ))}
        </div>
      </div>

      {!authenticated ? (
        <div className="py-6 text-center">
          <p className="text-[13px] text-term-text3">Sign in to see your positions.</p>
          <button onClick={login} className="mt-3 h-9 w-full rounded-lg bg-term-accent text-[13px] font-semibold text-white">
            Sign in with Google
          </button>
        </div>
      ) : (
        <>
          <div className="mt-3 flex items-center justify-between rounded-lg bg-term-surface px-3 py-2">
            <div>
              <p className="text-[11px] text-term-text3">SOL balance</p>
              <p className="text-[13px] font-medium text-term-text">{sol != null ? `${sol.toFixed(4)} ◎` : "…"}</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] text-term-text3">{shortAddr(solanaAddress)}</p>
              <p className="text-[13px] text-term-text2">
                {sol != null && solPrice != null ? fmtUsd(sol * solPrice) : ""}
              </p>
            </div>
          </div>
          <div className="py-8 text-center">
            <div className="mx-auto mb-2 grid h-12 w-12 place-items-center rounded-full bg-term-surface text-term-text3">
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 13h4l3 7 4-14 3 7h4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="text-[13px] text-term-text3">
              No {tab} positions in {token?.symbol ?? "this token"} yet.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
