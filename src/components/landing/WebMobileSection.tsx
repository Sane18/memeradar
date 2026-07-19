"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const UP = "#16C784";
const DOWN = "#EF4444";
const MUTED = "#8A94A6";
const SURFACE = "#141922";
const ACCENT = "#3B82F6";

/** Pure-SVG mock of a 3-column trading terminal. No external screenshots. */
function TerminalMock() {
  const candles = [
    [40, 60, 24], [30, 52, 16], [44, 64, 30], [52, 74, 40], [46, 58, 34],
    [58, 84, 46], [70, 96, 58], [64, 88, 52], [78, 104, 64], [90, 118, 76],
    [84, 110, 70], [100, 130, 86], [112, 140, 96], [104, 132, 90], [120, 150, 104],
  ];
  const list: [string, string][] = [
    ["#EC4899", "+214%"], ["#3B82F6", "+88%"], ["#F59E0B", "+351%"], ["#A855F7", "+42%"],
    ["#16C784", "+127%"], ["#06B6D4", "-27%"], ["#EF4444", "+63%"],
  ];
  const cells = ["$0.041", "$42.8M", "+3.7%", "$5.3M"];
  return (
    <svg viewBox="0 0 900 420" className="w-full" xmlns="http://www.w3.org/2000/svg">
      <rect width="900" height="420" fill="#0a0d13" />
      <rect x="0" y="0" width="210" height="420" fill="#0c1017" />
      {list.map((r, i) => (
        <g key={i} transform={`translate(0 ${16 + i * 56})`}>
          <circle cx="30" cy="24" r="12" fill={r[0]} opacity="0.9" />
          <rect x="50" y="15" width="70" height="8" rx="4" fill="#fff" opacity="0.85" />
          <rect x="50" y="30" width="44" height="6" rx="3" fill={MUTED} />
          <text x="190" y="28" textAnchor="end" fill={r[1].startsWith("-") ? DOWN : UP} fontSize="12" fontWeight="600" fontFamily="sans-serif">{r[1]}</text>
        </g>
      ))}

      <g transform="translate(230 20)">
        <circle cx="16" cy="16" r="14" fill={ACCENT} opacity="0.9" />
        <rect x="40" y="8" width="70" height="9" rx="4.5" fill="#fff" opacity="0.9" />
        <rect x="40" y="23" width="46" height="7" rx="3.5" fill={MUTED} />
        {["Price", "Mkt cap", "24H", "Vol"].map((l, i) => (
          <g key={l} transform={`translate(${230 + i * 100} 0)`}>
            <rect x="0" y="0" width="90" height="34" rx="8" fill={SURFACE} />
            <text x="12" y="14" fill={MUTED} fontSize="9" fontFamily="sans-serif">{l}</text>
            <text x="12" y="27" fill="#fff" fontSize="11" fontWeight="600" fontFamily="sans-serif">{cells[i]}</text>
          </g>
        ))}
      </g>

      <g transform="translate(230 80)">
        <rect x="0" y="0" width="430" height="320" rx="10" fill="#0c1017" />
        {[80, 140, 200, 260].map((y) => (
          <line key={y} x1="0" y1={y} x2="430" y2={y} stroke="#ffffff" strokeOpacity="0.05" />
        ))}
        {candles.map((c, i) => {
          const x = 24 + i * 27;
          const col = i % 4 !== 1 ? UP : DOWN;
          const top = 300 - c[1] * 1.6;
          const bot = 300 - c[2] * 1.6;
          return (
            <g key={i}>
              <line x1={x} y1={300 - c[1] * 1.6 - 8} x2={x} y2={300 - c[2] * 1.6 + 8} stroke={col} strokeWidth="2" />
              <rect x={x - 7} y={top} width="14" height={Math.max(6, bot - top)} rx="2" fill={col} />
            </g>
          );
        })}
        <line x1="0" y1="150" x2="430" y2="90" stroke={ACCENT} strokeWidth="2" strokeDasharray="4 4" opacity="0.6" />
      </g>

      <g transform="translate(690 20)">
        <rect x="0" y="0" width="190" height="380" rx="12" fill="#0c1017" />
        <rect x="14" y="16" width="80" height="30" rx="8" fill={UP} />
        <text x="54" y="36" textAnchor="middle" fill="#04120b" fontSize="12" fontWeight="700" fontFamily="sans-serif">Buy</text>
        <rect x="98" y="16" width="78" height="30" rx="8" fill={SURFACE} />
        <text x="137" y="36" textAnchor="middle" fill={DOWN} fontSize="12" fontWeight="700" fontFamily="sans-serif">Sell</text>
        <rect x="14" y="58" width="162" height="46" rx="10" fill={SURFACE} />
        <text x="28" y="88" fill="#fff" fontSize="22" fontWeight="700" fontFamily="sans-serif">$100</text>
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={14 + i * 41} y="116" width="36" height="26" rx="7" fill={SURFACE} />
        ))}
        <rect x="14" y="156" width="162" height="40" rx="11" fill={ACCENT} />
        <text x="95" y="181" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="700" fontFamily="sans-serif">Confirm trade</text>
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(0 ${216 + i * 30})`}>
            <rect x="14" y="0" width="90" height="8" rx="4" fill={MUTED} opacity="0.5" />
            <rect x="130" y="0" width="46" height="8" rx="4" fill="#fff" opacity="0.7" />
          </g>
        ))}
      </g>
    </svg>
  );
}

/** Compact phone screen: CSS frame + tiny SVG chart, no video. */
function PhoneMock() {
  return (
    <div className="rounded-[1.8rem] border border-white/10 bg-black p-1.5 shadow-2xl">
      <div className="relative aspect-[9/19.5] overflow-hidden rounded-[1.4rem] bg-[#0a0d13]">
        <div className="absolute left-1/2 top-2 z-10 h-3.5 w-12 -translate-x-1/2 rounded-full bg-black" />
        <svg viewBox="0 0 200 420" className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="parea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={UP} stopOpacity="0.4" />
              <stop offset="1" stopColor={UP} stopOpacity="0" />
            </linearGradient>
          </defs>
          <text x="18" y="52" fill={MUTED} fontSize="11" fontFamily="sans-serif">SOL</text>
          <text x="18" y="84" fill="#fff" fontSize="28" fontWeight="700" fontFamily="sans-serif">$73.90</text>
          <text x="18" y="104" fill={UP} fontSize="12" fontFamily="sans-serif">+3.69%</text>
          <path d="M18 210 L54 196 L90 202 L126 168 L160 140 L182 118 L182 240 L18 240 Z" fill="url(#parea)" />
          <path d="M18 210 L54 196 L90 202 L126 168 L160 140 L182 118" fill="none" stroke={UP} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="16" y="286" width="80" height="40" rx="10" fill={UP} />
          <text x="56" y="311" textAnchor="middle" fill="#04120b" fontSize="13" fontWeight="700" fontFamily="sans-serif">Buy</text>
          <rect x="104" y="286" width="80" height="40" rx="10" fill={SURFACE} />
          <text x="144" y="311" textAnchor="middle" fill={DOWN} fontSize="13" fontWeight="700" fontFamily="sans-serif">Sell</text>
          <rect x="16" y="340" width="168" height="34" rx="9" fill={SURFACE} />
          <text x="30" y="362" fill="#fff" fontSize="15" fontWeight="600" fontFamily="sans-serif">$100</text>
        </svg>
      </div>
    </div>
  );
}

export function WebMobileSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => e.isIntersecting && setInView(true), { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="relative overflow-hidden bg-chad-bg">
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[600px] w-[1000px] -translate-x-1/2 rounded-full bg-chad-primary/10 blur-[140px]" />
      <div className="mx-auto max-w-7xl px-4 py-24 text-center md:py-32">
        <span className="inline-block rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold tracking-[0.2em] text-chad-sol">
          NOW ON WEB &amp; MOBILE
        </span>
        <h2 className="mx-auto mt-6 max-w-3xl text-5xl font-bold tracking-tight text-white md:text-6xl">
          trade from anywhere.
          <br />
          never lose a beat.
        </h2>
        <p className="mx-auto mt-5 max-w-md text-lg text-chad-muted">
          Open a trade on your phone, close it on your desktop - positions, watchlist, and wallet stay in sync across web and mobile.
        </p>

        <div
          ref={ref}
          className={`relative mx-auto mt-16 max-w-5xl transition-all duration-700 ease-out ${inView ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"}`}
        >
          <div className="absolute -inset-10 -z-10 rounded-[2rem] bg-chad-primary/15 blur-3xl" />
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-chad-surface shadow-2xl">
            <div className="flex items-center gap-1.5 border-b border-white/5 bg-chad-bg/60 px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-chad-down" />
              <span className="h-3 w-3 rounded-full bg-chad-gold" />
              <span className="h-3 w-3 rounded-full bg-chad-up" />
              <span className="mx-auto rounded-md bg-white/5 px-3 py-0.5 text-[11px] text-chad-muted">app.memeradar.xyz/trade</span>
            </div>
            <TerminalMock />
          </div>
          <div className="absolute -bottom-8 right-2 hidden w-[150px] sm:block md:w-[180px]">
            <PhoneMock />
          </div>
        </div>

        <div className="mt-16">
          <Link href="/trade" className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-bold text-black transition hover:bg-white/90">
            Launch web app
          </Link>
        </div>
      </div>
    </section>
  );
}
