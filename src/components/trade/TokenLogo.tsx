"use client";

import { useState } from "react";

interface Props {
  uri?: string;
  symbol?: string;
  className?: string;
}

export function TokenLogo({ uri, symbol, className = "h-8 w-8" }: Props) {
  const [failed, setFailed] = useState(false);

  if (!uri || failed) {
    return (
      <span className={`inline-grid shrink-0 place-items-center rounded-full bg-term-border text-term-text2 ${className}`}>
        <span style={{ fontSize: "40%" }}>{symbol?.[0] ?? "?"}</span>
      </span>
    );
  }

  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={uri}
      alt=""
      className={`shrink-0 rounded-full ${className}`}
      onError={() => setFailed(true)}
    />
  );
}
