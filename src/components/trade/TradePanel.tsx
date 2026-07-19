"use client";

import { useCallback, useEffect, useState } from "react";
import { useSendTransaction } from "@privy-io/react-auth/solana";
import { useAuth } from "@/hooks/useAuth";
import { executeSwap } from "@/lib/swap";
import { getConnection } from "@/lib/solana";
import { SOL_MINT, USDC_MINT } from "@/lib/tokens";
import { fmtUsd } from "@/lib/format";
import type { Token } from "@/lib/types";

const PRESETS = [10, 100, 500, 1000]; // USD amounts (fomo-style)

export function TradePanel({ token }: { token?: Token }) {
  const { authenticated, login, solanaAddress } = useAuth();
  const { sendTransaction: privySendTx } = useSendTransaction();
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState("100");
  const [slippage, setSlippage] = useState(50);
  const [quoteOut, setQuoteOut] = useState<number | null>(null);
  const [impact, setImpact] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [showSettings, setShowSettings] = useState(false);

  const tokenDecimals = token?.decimals ?? 9;
  const isSolToken = token?.mint === SOL_MINT;
  const baseMint = isSolToken ? USDC_MINT : SOL_MINT;
  const baseDecimals = isSolToken ? 6 : 9;
  const baseSymbol = isSolToken ? "USDC" : "SOL";

  const payMint = side === "buy" ? baseMint : token?.mint;
  const recvMint = side === "buy" ? token?.mint : baseMint;
  const payDecimals = side === "buy" ? baseDecimals : tokenDecimals;
  const recvDecimals = side === "buy" ? tokenDecimals : baseDecimals;
  const paySymbol = side === "buy" ? baseSymbol : token?.symbol;
  const recvSymbol = side === "buy" ? token?.symbol : baseSymbol;

  const [solPrice, setSolPrice] = useState(0);
  useEffect(() => {
    fetch(`/api/token/${SOL_MINT}`).then((r) => r.json()).then((d) => setSolPrice(d?.token?.price || 0)).catch(() => {});
  }, []);
  const payPriceUsd = side === "buy" ? (isSolToken ? 1 : solPrice) : token?.price ?? 0;
  const payTokens = payPriceUsd > 0 ? parseFloat(amount || "0") / payPriceUsd : 0;

  const [sol, setSol] = useState<number | null>(null);
  useEffect(() => {
    if (!solanaAddress) return;
    fetch(`/api/balance?address=${solanaAddress}`).then((r) => r.json()).then((d) => setSol(d.sol)).catch(() => {});
  }, [solanaAddress]);
  const availableUsd = sol != null && solPrice ? sol * solPrice : 0;

  useEffect(() => {
    let alive = true;
    const amt = parseFloat(amount);
    if (!token || !amt || amt <= 0 || payPriceUsd <= 0 || !payMint || !recvMint || payMint === recvMint) {
      setQuoteOut(null);
      setImpact(null);
      return;
    }
    const t = setTimeout(async () => {
      try {
        const raw = Math.floor((amt / payPriceUsd) * 10 ** payDecimals);
        const res = await fetch(`/api/quote?inputMint=${payMint}&outputMint=${recvMint}&amount=${raw}&slippageBps=${slippage}`);
        if (!res.ok) {
          if (alive) {
            setQuoteOut(null);
            setImpact(null);
          }
          return;
        }
        const q = await res.json();
        if (alive && q?.outAmount) {
          setQuoteOut(Number(q.outAmount) / 10 ** recvDecimals);
          setImpact(Number(q.priceImpactPct) * 100);
        }
      } catch {
        /* ignore */
      }
    }, 350);
    return () => {
      alive = false;
      clearTimeout(t);
    };
  }, [amount, side, token, slippage, payMint, recvMint, payDecimals, recvDecimals, payPriceUsd]);

  const onTrade = useCallback(async () => {
    if (!authenticated) return login();
    if (!token || !solanaAddress) return;
    const amt = parseFloat(amount);
    if (!amt || amt <= 0 || payPriceUsd <= 0) return;
    if (!payMint || !recvMint || payMint === recvMint) {
      setStatus("⚠️ Can't swap a token for itself.");
      return;
    }
    setLoading(true);
    setStatus("Building transaction…");
    try {
      const raw = Math.floor((amt / payPriceUsd) * 10 ** payDecimals);
      const signAndSend = async (tx: any) => {
        const receipt = await privySendTx({ transaction: tx, connection: getConnection() });
        return (receipt as any)?.signature ?? "";
      };
      setStatus("Confirm in your wallet…");
      const { signature } = await executeSwap({
        inputMint: payMint,
        outputMint: recvMint,
        amount: raw,
        slippageBps: slippage,
        userPublicKey: solanaAddress,
        signAndSend,
      });
      setStatus(`✅ Swap sent: ${signature.slice(0, 8)}…`);
    } catch (e: any) {
      setStatus(`⚠️ ${e?.message || "Swap failed"}`);
    } finally {
      setLoading(false);
    }
  }, [authenticated, login, token, solanaAddress, privySendTx, amount, side, slippage, payMint, recvMint, payDecimals, payPriceUsd]);

  const hasAmount = parseFloat(amount) > 0;
  const ctaActive = authenticated && hasAmount && !loading;

  return (
    <div className="rounded-lg border border-term-border bg-term-bg2 p-3">
      {/* Buy/Sell — fomo style: Buy is a standalone green pill, Sell is plain text */}
      <div className="flex items-center rounded-lg bg-term-bg p-1">
        <button
          onClick={() => setSide("buy")}
          className={`flex-1 rounded-md py-2 text-[13px] font-semibold transition ${
            side === "buy" ? "bg-term-up text-black shadow-sm" : "text-term-text2 hover:text-term-text"
          }`}
        >
          Buy
        </button>
        <button
          onClick={() => setSide("sell")}
          className={`flex-1 rounded-md py-2 text-[13px] font-semibold transition ${
            side === "sell" ? "text-term-down" : "text-term-text2 hover:text-term-text"
          }`}
        >
          Sell
        </button>
      </div>

      {/* amount — outlined input box */}
      <div className="mt-2 flex items-center gap-2 rounded-lg border border-term-border bg-term-bg px-3 py-3 focus-within:border-term-accent">
        <span className="text-[26px] font-semibold leading-none text-term-text2">$</span>
        <input
          type="number"
          value={amount}
          min={0}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0"
          className="w-full bg-transparent text-[26px] font-semibold leading-none text-term-text outline-none"
        />
        <span className="shrink-0 text-right text-[11px] text-term-text3">
          {hasAmount
            ? `≈ ${payTokens.toLocaleString(undefined, { maximumFractionDigits: 3 })} ${paySymbol}`
            : "Enter amount"}
        </span>
      </div>

      {/* presets + settings gear — each has a border outline */}
      <div className="mt-2 grid grid-cols-[repeat(4,1fr)_auto] gap-1.5">
        {PRESETS.map((p) => (
          <button
            key={p}
            onClick={() => setAmount(String(p))}
            className="rounded-lg border border-term-border bg-term-bg py-2 text-[12px] font-medium text-term-text2 transition hover:border-term-text3 hover:text-term-text"
          >
            ${p}
          </button>
        ))}
        <button
          onClick={() => setShowSettings((s) => !s)}
          aria-label="Slippage settings"
          className={`grid place-items-center rounded-lg border px-2.5 transition ${
            showSettings
              ? "border-term-accent bg-term-bg text-term-accent"
              : "border-term-border bg-term-bg text-term-text2 hover:border-term-text3 hover:text-term-text"
          }`}
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* slippage settings — opened from the gear */}
      {showSettings && (
        <div className="mt-2 flex items-center justify-between rounded-lg border border-term-border bg-term-bg px-3 py-2 text-[12px]">
          <span className="text-term-text3">Slippage</span>
          <div className="flex gap-1">
            {[50, 100, 300].map((s) => (
              <button
                key={s}
                onClick={() => setSlippage(s)}
                className={`rounded border px-2 py-0.5 text-[11px] transition ${
                  slippage === s
                    ? "border-term-accent bg-term-bg text-term-accent"
                    : "border-term-border text-term-text3 hover:border-term-text3 hover:text-term-text2"
                }`}
              >
                {s / 100}%
              </button>
            ))}
          </div>
        </div>
      )}

      <p className="mt-2 text-[11px] text-term-text3">
        {authenticated ? `${fmtUsd(availableUsd)} available` : "$0.00 available"}
      </p>

      {quoteOut != null && (
        <div className="mt-2 space-y-1.5 text-[12px]">
          <div className="flex justify-between">
            <span className="text-term-text3">You receive</span>
            <span className="text-term-text">
              {quoteOut.toLocaleString(undefined, { maximumFractionDigits: 6 })} {recvSymbol}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-term-text3">Price impact</span>
            <span className={impact && impact > 1 ? "text-term-down" : "text-term-text2"}>
              {impact != null ? `${impact.toFixed(2)}%` : "—"}
            </span>
          </div>
        </div>
      )}

      <button
        onClick={onTrade}
        disabled={loading}
        className={`mt-3 h-11 w-full rounded-lg border text-[13px] font-semibold transition active:scale-[0.98] disabled:opacity-50 ${
          !ctaActive
            ? "border-term-border bg-term-bg text-term-text2"
            : side === "buy"
            ? "border-term-up bg-term-up text-black hover:brightness-110"
            : "border-term-down bg-term-down text-white hover:brightness-110"
        }`}
      >
        {!authenticated ? "Sign in to trade" : loading ? "Processing…" : `${side === "buy" ? "Buy" : "Sell"} ${token?.symbol ?? ""}`}
      </button>

      {status && <p className="mt-2 break-words text-center text-[11px] text-term-text2">{status}</p>}

      <p className="mt-2 flex items-center justify-center gap-1.5 text-[11px] text-term-accent">
        <svg viewBox="0 0 24 24" className="h-3 w-3 fill-current">
          <path d="M21 11.5 12.5 3H4v8.5L12.5 20 21 11.5zM7 8a1 1 0 110-2 1 1 0 010 2z" />
        </svg>
        Lowest fees: 0.05%
      </p>
    </div>
  );
}
