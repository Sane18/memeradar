export function fmtUsd(n?: number, opts: { compact?: boolean } = {}): string {
  if (n === undefined || n === null || Number.isNaN(n)) return "—";
  if (opts.compact) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 2,
    }).format(n);
  }
  const digits = n < 1 ? (n < 0.0001 ? 8 : 6) : 2;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: digits,
  }).format(n);
}

export function fmtNum(n?: number, compact = true): string {
  if (n === undefined || n === null || Number.isNaN(n)) return "—";
  return new Intl.NumberFormat("en-US", {
    notation: compact ? "compact" : "standard",
    maximumFractionDigits: 2,
  }).format(n);
}

export function fmtPct(n?: number): string {
  if (n === undefined || n === null || Number.isNaN(n)) return "—";
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(2)}%`;
}

export function shortAddr(a?: string, n = 4): string {
  if (!a) return "—";
  return `${a.slice(0, n)}…${a.slice(-n)}`;
}

export function timeAgo(unixSeconds: number): string {
  const diff = Math.max(0, Date.now() / 1000 - unixSeconds);
  if (diff < 60) return `${Math.floor(diff)}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}
