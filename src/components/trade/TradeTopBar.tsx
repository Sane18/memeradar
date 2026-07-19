"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useTokens } from "@/hooks/useTokens";
import { LoginButton } from "@/components/LoginButton";
import { TokenLogo } from "@/components/trade/TokenLogo";
import { brand } from "@/lib/brand";
import { shortAddr, fmtUsd, fmtPct } from "@/lib/format";

export function TradeTopBar() {
  const router = useRouter();
  const { authenticated, solanaAddress } = useAuth();
  const { tokens } = useTokens();

  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const boxRef = useRef<HTMLDivElement>(null);

  const trimmed = q.trim();
  const isMint = trimmed.length >= 32 && !trimmed.includes(" ");

  const results = useMemo(() => {
    const s = trimmed.toLowerCase();
    if (!s || isMint) return [];
    return tokens
      .filter(
        (t) =>
          t.symbol?.toLowerCase().includes(s) || t.name?.toLowerCase().includes(s)
      )
      .slice(0, 8);
  }, [trimmed, isMint, tokens]);

  useEffect(() => setActive(0), [results.length]);

  // close on click outside
  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  function go(mint: string) {
    router.push(`/trade/${mint}`);
    setQ("");
    setOpen(false);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (isMint) return go(trimmed);
    if (results[active]) go(results[active].mint);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  async function paste() {
    try {
      const v = (await navigator.clipboard.readText()).trim();
      setQ(v);
      setOpen(true);
    } catch {
      /* ignore */
    }
  }

  const showDrop = open && trimmed.length > 0;

  return (
    <header className="relative z-30 flex h-[58px] shrink-0 items-center bg-term-bg px-3">
      <Link href="/" className="flex shrink-0 items-center gap-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={brand.logo} alt={brand.name} className="h-8 w-8 object-contain" />
        <span className="hidden text-sm font-semibold tracking-tight text-term-text md:block">
          Meme<span className="text-term-accent">Radar</span>
        </span>
      </Link>

      {/* search — absolutely centered to the full header width */}
      <form
        onSubmit={submit}
        ref={boxRef}
        className="absolute left-1/2 w-full max-w-[420px] -translate-x-1/2 px-2"
      >
        <div className="group flex h-9 items-center gap-2 rounded-lg border border-term-border bg-term-surface px-3 focus-within:border-term-accent focus-within:ring-2 focus-within:ring-[rgba(59,130,246,0.2)]">
          <svg viewBox="0 0 24 24" className="h-4 w-4 text-term-text3" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4-4" strokeLinecap="round" />
          </svg>
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={onKeyDown}
            placeholder="Search tokens or paste a mint…"
            className="w-full bg-transparent text-[13px] text-term-text placeholder:text-term-text3 focus:outline-none"
            suppressHydrationWarning
          />
          <button
            type="button"
            onClick={paste}
            suppressHydrationWarning
            className="rounded border border-term-border px-1.5 py-0.5 text-[10px] text-term-text3 hover:text-term-text"
          >
            Paste
          </button>
          <kbd className="hidden h-5 w-5 place-items-center rounded border border-term-border text-[11px] text-term-text3 sm:grid">
            /
          </kbd>
        </div>

        {/* live results dropdown */}
        {showDrop && (
          <div className="absolute left-2 right-2 top-11 overflow-hidden rounded-lg border border-term-border bg-term-bg2 shadow-xl">
            {isMint ? (
              <button
                type="submit"
                className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-[13px] text-term-text2 hover:bg-term-surface"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 text-term-text3" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="7" />
                  <path d="M21 21l-4-4" strokeLinecap="round" />
                </svg>
                Open mint {shortAddr(trimmed, 6)}
                <kbd className="ml-auto rounded border border-term-border px-1.5 text-[10px] text-term-text3">Enter</kbd>
              </button>
            ) : results.length === 0 ? (
              <div className="px-3 py-3 text-[13px] text-term-text3">No tokens found.</div>
            ) : (
              results.map((t, i) => {
                const up = (t.change24h ?? 0) >= 0;
                return (
                  <button
                    type="button"
                    key={t.mint}
                    onClick={() => go(t.mint)}
                    onMouseEnter={() => setActive(i)}
                    className={`flex w-full items-center gap-2.5 px-3 py-2 text-left transition ${
                      i === active ? "bg-term-surface" : "hover:bg-term-surface"
                    }`}
                  >
                    <TokenLogo uri={t.logoURI} symbol={t.symbol} className="h-6 w-6" />
                    <div className="min-w-0 flex-1 leading-tight">
                      <p className="truncate text-[13px] font-medium text-term-text">{t.symbol}</p>
                      <p className="truncate text-[11px] text-term-text3">{t.name}</p>
                    </div>
                    <div className="text-right leading-tight">
                      <p className="text-[12px] text-term-text">{fmtUsd(t.price)}</p>
                      <p className={`text-[11px] ${up ? "text-term-up" : "text-term-down"}`}>{fmtPct(t.change24h)}</p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        )}
      </form>

      {/* wallet */}
      <div className="ml-auto flex shrink-0 items-center gap-2">
        {authenticated && (
          <span className="hidden h-6 items-center rounded bg-term-surface px-2 text-[11px] font-medium text-term-up sm:inline-flex">
            {shortAddr(solanaAddress)}
          </span>
        )}
        <LoginButton />
      </div>
    </header>
  );
}
