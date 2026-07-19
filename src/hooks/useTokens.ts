"use client";

import { useEffect, useState } from "react";
import type { Token } from "@/lib/types";

export function useTokens(pollMs = 20000) {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    async function load() {
      try {
        const res = await fetch("/api/tokens");
        const json = await res.json();
        if (alive && json?.tokens) {
          setTokens(json.tokens);
          setLoading(false);
        }
      } catch {
        if (alive) setLoading(false);
      }
    }
    load();
    const id = setInterval(load, pollMs);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [pollMs]);

  return { tokens, loading };
}
