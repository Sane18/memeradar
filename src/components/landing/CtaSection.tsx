"use client";

import Link from "next/link";
import { brand } from "@/lib/brand";
import { useTokens } from "@/hooks/useTokens";
import type { Token } from "@/lib/types";

const RINGS = [
  { size: 440, count: 4, dur: 46, rev: false },
  { size: 760, count: 6, dur: 70, rev: true },
];

function Avatar({ t }: { t?: Token }) {
  if (!t) return null;
  return t.logoURI ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={t.logoURI}
      alt={t.symbol}
      className="h-11 w-11 rounded-full border border-white/15 bg-chad-bg object-cover shadow-lg"
      onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
    />
  ) : (
    <span className="grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-chad-card text-xs font-bold text-white">
      {t.symbol?.[0]}
    </span>
  );
}

function Orbit({ tokens }: { tokens: Token[] }) {
  if (!tokens.length) return null;
  let k = 0;
  return (
    <div className="pointer-events-none absolute inset-0 grid place-items-center overflow-hidden">
      {RINGS.map((ring, ri) => (
        <div
          key={ri}
          className="absolute rounded-full border border-dashed border-white/10"
          style={{
            width: ring.size,
            height: ring.size,
            animation: `${ring.rev ? "orbit-spin-rev" : "orbit-spin"} ${ring.dur}s linear infinite`,
          }}
        >
          {Array.from({ length: ring.count }).map((_, i) => {
            const t = tokens[k++ % tokens.length];
            const R = ring.size / 2;
            const theta = (2 * Math.PI * i) / ring.count;
            // Exact point on the circle; translate(-50%,-50%) centers the
            // avatar on it WITHOUT being affected by the ring's rotation.
            const x = R + R * Math.cos(theta);
            const y = R + R * Math.sin(theta);
            return (
              <div
                key={i}
                className="absolute"
                style={{ left: x, top: y, transform: "translate(-50%, -50%)" }}
              >
                <Avatar t={t} />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export function CtaSection() {
  const { tokens } = useTokens();

  return (
    <section className="relative flex min-h-[760px] items-center justify-center overflow-hidden">
      {/* deep cosmic gradient */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(120%_120%_at_50%_30%,#141a3a_0%,#0a0e22_45%,#070b12_100%)]" />
      <div className="pointer-events-none absolute inset-0 starfield opacity-40" />

      {/* rotating token orbit */}
      <Orbit tokens={tokens} />

      <div className="relative z-10 mx-auto max-w-2xl px-4 text-center">
        <h2 className="text-5xl font-bold tracking-tight text-white md:text-6xl">
          a trading app
          <br />
          for the rest of us
        </h2>
        <p className="mx-auto mt-5 max-w-md text-lg text-chad-muted">
          Join thousands of traders making their name on {brand.name}.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/trade"
            className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-bold text-black transition hover:bg-white/90"
          >
            Start trading
          </Link>
          <a
            href={brand.appStore.ios}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-8 py-4 text-sm font-bold text-white backdrop-blur transition hover:bg-white/10"
          >
            Download app
          </a>
        </div>
      </div>
    </section>
  );
}
