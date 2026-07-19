"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "cw_watchlist";

function loadLocal(): Set<string> {
  try {
    return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]"));
  } catch {
    return new Set();
  }
}

function saveLocal(mints: Set<string>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...mints]));
  } catch {}
}

export function useWatchlist(userId?: string) {
  const [mints, setMints] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    setMints(loadLocal());
  }, []);

  // When a userId is available, merge with server watchlist
  useEffect(() => {
    if (!userId) return;
    let alive = true;
    setLoading(true);
    fetch(`/api/watchlist?userId=${encodeURIComponent(userId)}`)
      .then((r) => r.json())
      .then((d) => {
        if (!alive) return;
        setMints((prev) => {
          const merged = new Set([...prev, ...(d.mints ?? [])]);
          saveLocal(merged);
          return merged;
        });
      })
      .catch(() => {})
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [userId]);

  const isStarred = useCallback((mint: string) => mints.has(mint), [mints]);

  const toggle = useCallback(
    async (mint: string) => {
      const wasStarred = mints.has(mint);

      // Optimistic update — always works, even without auth
      setMints((prev) => {
        const next = new Set(prev);
        if (wasStarred) next.delete(mint);
        else next.add(mint);
        saveLocal(next);
        return next;
      });

      // Sync with server only when logged in
      if (!userId) return;

      const revert = () =>
        setMints((prev) => {
          const next = new Set(prev);
          if (wasStarred) next.add(mint);
          else next.delete(mint);
          saveLocal(next);
          return next;
        });

      try {
        const res = await fetch("/api/watchlist", {
          method: wasStarred ? "DELETE" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, mint }),
        });
        const json = await res.json().catch(() => ({}));
        if (!json?.ok) revert();
      } catch {
        revert();
      }
    },
    [userId, mints]
  );

  return { mints, loading, isStarred, toggle };
}
