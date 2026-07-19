"use client";

import Link from "next/link";
import { brand } from "@/lib/brand";

export function Hero() {
  return (
    <section className="relative flex min-h-[100vh] items-center justify-center bg-chad-bg">
      {/* real Earth photo backdrop (upper-right, on black space) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/earth.jpg"
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-right-top"
        style={{
          maskImage:
            "linear-gradient(to bottom, black 30%, rgba(0,0,0,0.4) 55%, transparent 72%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 30%, rgba(0,0,0,0.4) 55%, transparent 72%)",
        }}
        onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
      />

      {/* legibility: soft center vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(65%_55%_at_50%_52%,rgba(7,11,18,0.55),transparent_75%)]" />

      {/* astronaut — smaller than the Earth, dropped below the text.
          Wrapper handles centering/position; the img alone does the float so
          the two transforms don't fight. */}
      <div className="pointer-events-none absolute left-1/2 top-[58%] z-[5] w-[clamp(200px,24vw,340px)] -translate-x-1/2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/astronaut.png"
          alt=""
          className="w-full animate-[floaty_10s_ease-in-out_infinite] drop-shadow-[0_30px_70px_rgba(0,0,0,0.65)]"
          onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
        />
      </div>

      {/* content */}
      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
        <h1 className="font-display text-6xl font-bold leading-[0.95] tracking-tight text-white drop-shadow-[0_2px_30px_rgba(0,0,0,0.6)] sm:text-7xl md:text-8xl">
          Meme<span className="text-gradient">Radar</span>
        </h1>
        <p className="mt-6 text-2xl font-medium text-white/90 drop-shadow-[0_2px_20px_rgba(0,0,0,0.7)] sm:text-3xl">
          catch every pump before it prints.
        </p>
        <p className="mx-auto mt-4 max-w-xl text-lg text-white/70 drop-shadow-[0_2px_20px_rgba(0,0,0,0.7)]">
          From memecoins to blue chips, trade any Solana token in seconds. Sign
          in with Google — your wallet is ready instantly.
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
