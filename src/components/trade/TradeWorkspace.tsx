"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TrendingList } from "./TrendingList";
import { TokenInfo } from "./TokenInfo";
import { PriceChart } from "./PriceChart";
import { HoldersAndTrades } from "./HoldersAndTrades";
import { TradePanel } from "./TradePanel";
import { AboutPanel } from "./AboutPanel";
import { Positions } from "./Positions";
import { TOKEN_BY_MINT } from "@/lib/tokens";
import type { Token } from "@/lib/types";

export function TradeWorkspace({
  initialMint,
  initialToken,
}: {
  initialMint: string;
  initialToken?: Token;
}) {
  const router = useRouter();
  const [mint, setMint] = useState(initialMint);
  const [token, setToken] = useState<Token | undefined>(
    initialToken ?? TOKEN_BY_MINT[initialMint]
  );

  useEffect(() => {
    let alive = true;
    async function load() {
      try {
        const r = await fetch(`/api/token/${mint}`).then((x) => x.json());
        if (alive && r?.token) setToken(r.token);
      } catch {
        // silently retry on next interval
      }
    }
    load();
    const id = setInterval(load, 15000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [mint]);

  function select(t: Token) {
    setMint(t.mint);
    setToken(t);
    // keep URL shareable without a full navigation
    window.history.replaceState(null, "", `/trade/${t.mint}`);
  }

  return (
    <div className="grid h-full grid-cols-1 tabular-nums lg:grid-cols-[300px_1fr]">
      {/* LEFT — trending island (its own independent scroll, unchanged) */}
      <aside className="hidden bg-term-bg p-2 lg:block">
        <TrendingList selected={mint} onSelect={select} />
      </aside>

      {/* MIDDLE + RIGHT — one shared, visibly-scrollable region */}
      <div className="min-h-0 overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px]">
          {/* info + chart + holders/trades */}
          <section className="flex flex-col">
            <TokenInfo token={token} />
            <div className="h-[420px] shrink-0 border-b border-term-border">
              <PriceChart mint={mint} />
            </div>
            <HoldersAndTrades mint={mint} price={token?.price} />
          </section>

          {/* trade panel + about + positions */}
          <aside className="space-y-2 bg-term-bg p-2">
            <TradePanel token={token} />
            <AboutPanel token={token} />
            <Positions token={token} />
          </aside>
        </div>
      </div>
    </div>
  );
}
