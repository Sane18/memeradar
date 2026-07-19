"use client";

import { useAuth } from "@/hooks/useAuth";
import { shortAddr } from "@/lib/format";

export function LoginButton({ full = false }: { full?: boolean }) {
  const { authenticated, login, logout, solanaAddress, ready } = useAuth();

  if (authenticated) {
    return (
      <div className="flex items-center gap-2">
        <span className="hidden rounded-full border border-chad-border bg-chad-card px-3 py-1.5 text-sm text-chad-sol sm:inline">
          {shortAddr(solanaAddress)}
        </span>
        <button
          onClick={logout}
          className="rounded-full border border-chad-border px-4 py-1.5 text-sm font-medium text-chad-muted transition hover:text-white"
        >
          Log out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={login}
      disabled={!ready}
      className={`${full ? "w-full justify-center" : ""} inline-flex items-center gap-2 rounded-full bg-chad-primary px-5 py-2.5 text-sm font-bold text-black shadow-glow transition hover:bg-chad-primaryDark disabled:opacity-50`}
    >
      Sign in
    </button>
  );
}
