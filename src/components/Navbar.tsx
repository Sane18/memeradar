"use client";

import Link from "next/link";
import { LoginButton } from "./LoginButton";
import { AppStoreLinks } from "./landing/AppStoreLinks";
import { brand } from "@/lib/brand";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-chad-bg/60 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={brand.logo} alt={brand.name} className="h-9 w-9 object-contain" />
          <span className="text-lg font-extrabold tracking-tight text-white">
            Meme<span className="text-chad-primary">Radar</span>
          </span>
        </Link>

        {/* fomo-style: app-store badges + sign in (no Trade button) */}
        <div className="flex items-center gap-3">
          <AppStoreLinks className="hidden scale-90 md:flex" />
          <LoginButton />
        </div>
      </nav>
    </header>
  );
}
