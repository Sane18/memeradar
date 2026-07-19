/* fomo-style feature cards: dark card + eyebrow + heading + a CSS/SVG phone
   mock (no external screenshots), each with its own accent color. */

type Kind = "portfolio" | "trades" | "discover" | "smart" | "launch" | "deposit";

const FEATURES: { eyebrow: string; title: string; kind: Kind; accent: string }[] = [
  { eyebrow: "PORTFOLIO", title: "track every bag in realtime", kind: "portfolio", accent: "#16C784" },
  { eyebrow: "ONE-TAP TRADES", title: "buy & sell trending tokens", kind: "trades", accent: "#3B82F6" },
  { eyebrow: "DISCOVER", title: "surface the next runner", kind: "discover", accent: "#A855F7" },
  { eyebrow: "SMART MONEY", title: "follow what the best are buying", kind: "smart", accent: "#F59E0B" },
  { eyebrow: "LAUNCHPAD", title: "ape new launches first", kind: "launch", accent: "#EC4899" },
  { eyebrow: "FUND IN SECONDS", title: "deposit and start trading", kind: "deposit", accent: "#06B6D4" },
];

const UP = "#16C784";
const DOWN = "#EF4444";
const MUTED = "#8A94A6";
const SURFACE = "#141922";

function Screen({ kind, accent }: { kind: Kind; accent: string }) {
  return (
    <svg viewBox="0 0 200 400" className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`area-${kind}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={accent} stopOpacity="0.45" />
          <stop offset="1" stopColor={accent} stopOpacity="0" />
        </linearGradient>
      </defs>

      {kind === "portfolio" && (
        <>
          <text x="18" y="46" fill={MUTED} fontSize="11" fontFamily="sans-serif">Portfolio value</text>
          <text x="18" y="78" fill="#fff" fontSize="30" fontWeight="700" fontFamily="sans-serif">$12,480</text>
          <text x="18" y="98" fill={UP} fontSize="12" fontFamily="sans-serif">+$2,140 (20.7%)</text>
          <path d="M18 190 L52 176 L86 182 L120 150 L154 120 L182 96 L182 210 L18 210 Z" fill={`url(#area-${kind})`} />
          <path d="M18 190 L52 176 L86 182 L120 150 L154 120 L182 96" fill="none" stroke={accent} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          {[0, 1, 2].map((i) => (
            <g key={i} transform={`translate(0 ${252 + i * 42})`}>
              <rect x="16" y="0" width="168" height="34" rx="8" fill={SURFACE} />
              <circle cx="34" cy="17" r="9" fill={accent} opacity="0.85" />
              <rect x="50" y="10" width="46" height="6" rx="3" fill="#fff" opacity="0.85" />
              <rect x="50" y="21" width="28" height="5" rx="2.5" fill={MUTED} />
              <text x="176" y="21" textAnchor="end" fill={UP} fontSize="11" fontFamily="sans-serif">{`+${12 + i * 7}%`}</text>
            </g>
          ))}
        </>
      )}

      {kind === "trades" && (
        <>
          <g transform="translate(16 34)">
            <circle cx="16" cy="16" r="14" fill={accent} opacity="0.85" />
            <rect x="40" y="8" width="60" height="8" rx="4" fill="#fff" opacity="0.9" />
            <rect x="40" y="22" width="40" height="6" rx="3" fill={MUTED} />
            <text x="168" y="20" textAnchor="end" fill="#fff" fontSize="13" fontWeight="700" fontFamily="sans-serif">$0.041</text>
          </g>
          <g transform="translate(16 84)">
            <rect x="0" y="0" width="82" height="34" rx="9" fill={UP} />
            <text x="41" y="22" textAnchor="middle" fill="#04120b" fontSize="13" fontWeight="700" fontFamily="sans-serif">Buy</text>
            <rect x="88" y="0" width="80" height="34" rx="9" fill={SURFACE} />
            <text x="128" y="22" textAnchor="middle" fill={DOWN} fontSize="13" fontWeight="700" fontFamily="sans-serif">Sell</text>
          </g>
          <rect x="16" y="132" width="168" height="46" rx="10" fill={SURFACE} />
          <text x="30" y="162" fill="#fff" fontSize="22" fontWeight="700" fontFamily="sans-serif">$100</text>
          {[10, 100, 500, 1000].map((v, i) => (
            <g key={v} transform={`translate(${16 + i * 43} 192)`}>
              <rect x="0" y="0" width="38" height="26" rx="8" fill={SURFACE} />
              <text x="19" y="17" textAnchor="middle" fill={MUTED} fontSize="10" fontFamily="sans-serif">{`$${v}`}</text>
            </g>
          ))}
          <rect x="16" y="232" width="168" height="40" rx="11" fill={accent} />
          <text x="100" y="257" textAnchor="middle" fill="#04120b" fontSize="13" fontWeight="700" fontFamily="sans-serif">Confirm trade</text>
          <text x="100" y="300" textAnchor="middle" fill={MUTED} fontSize="10" fontFamily="sans-serif">Lowest fees - 0.05%</text>
        </>
      )}

      {kind === "discover" && (
        <>
          <text x="18" y="46" fill="#fff" fontSize="15" fontWeight="700" fontFamily="sans-serif">Trending</text>
          {[["#EC4899", "214", UP], ["#3B82F6", "88", UP], ["#F59E0B", "351", UP], ["#A855F7", "42", UP], ["#06B6D4", "27", DOWN]].map((r, i) => (
            <g key={i} transform={`translate(0 ${64 + i * 58})`}>
              <rect x="16" y="0" width="168" height="48" rx="10" fill={SURFACE} />
              <circle cx="36" cy="24" r="11" fill={r[0] as string} opacity="0.9" />
              <rect x="54" y="15" width="40" height="7" rx="3.5" fill="#fff" opacity="0.85" />
              <rect x="54" y="28" width="24" height="5" rx="2.5" fill={MUTED} />
              <path d="M112 30 L124 24 L134 27 L146 16" fill="none" stroke={r[2] as string} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <text x="176" y="28" textAnchor="end" fill={r[2] as string} fontSize="11" fontWeight="600" fontFamily="sans-serif">{`${r[2] === UP ? "+" : "-"}${r[1]}%`}</text>
            </g>
          ))}
        </>
      )}

      {kind === "smart" && (
        <>
          <text x="18" y="46" fill="#fff" fontSize="15" fontWeight="700" fontFamily="sans-serif">Top traders</text>
          {[["#F59E0B", "8.9M"], ["#3B82F6", "912K"], ["#16C784", "497K"], ["#A855F7", "301K"], ["#EC4899", "287K"]].map((r, i) => (
            <g key={i} transform={`translate(0 ${64 + i * 58})`}>
              <rect x="16" y="0" width="168" height="48" rx="10" fill={SURFACE} />
              <text x="30" y="29" fill={MUTED} fontSize="12" fontWeight="700" fontFamily="sans-serif">{i + 1}</text>
              <circle cx="56" cy="24" r="13" fill={r[0] as string} opacity="0.9" />
              <rect x="76" y="14" width="50" height="7" rx="3.5" fill="#fff" opacity="0.85" />
              <rect x="76" y="28" width="30" height="5" rx="2.5" fill={MUTED} />
              <text x="176" y="28" textAnchor="end" fill={UP} fontSize="12" fontWeight="700" fontFamily="sans-serif">{`+$${r[1]}`}</text>
            </g>
          ))}
        </>
      )}

      {kind === "launch" && (
        <>
          <text x="18" y="46" fill="#fff" fontSize="15" fontWeight="700" fontFamily="sans-serif">Just launched</text>
          <g transform="translate(60 78)">
            <circle cx="40" cy="40" r="40" fill={accent} opacity="0.15" />
            <path d="M40 14 C54 24 56 44 48 58 L32 58 C24 44 26 24 40 14 Z" fill={accent} />
            <circle cx="40" cy="34" r="7" fill="#0a0d13" />
            <path d="M30 60 L24 74 M50 60 L56 74 M40 62 L40 78" stroke={accent} strokeWidth="3" strokeLinecap="round" />
          </g>
          {[0, 1].map((i) => (
            <g key={i} transform={`translate(0 ${200 + i * 54})`}>
              <rect x="16" y="0" width="168" height="44" rx="10" fill={SURFACE} />
              <circle cx="36" cy="22" r="11" fill={accent} opacity="0.85" />
              <rect x="54" y="13" width="44" height="7" rx="3.5" fill="#fff" opacity="0.85" />
              <rect x="54" y="26" width="26" height="5" rx="2.5" fill={MUTED} />
              <rect x="130" y="10" width="42" height="24" rx="7" fill={accent} />
              <text x="151" y="26" textAnchor="middle" fill="#04120b" fontSize="10" fontWeight="700" fontFamily="sans-serif">Buy</text>
            </g>
          ))}
        </>
      )}

      {kind === "deposit" && (
        <>
          <text x="18" y="46" fill="#fff" fontSize="15" fontWeight="700" fontFamily="sans-serif">Add funds</text>
          <g transform="translate(20 66)">
            <rect x="0" y="0" width="160" height="96" rx="14" fill={accent} opacity="0.9" />
            <rect x="0" y="0" width="160" height="96" rx="14" fill="#000" opacity="0.15" />
            <circle cx="128" cy="26" r="10" fill="#fff" opacity="0.5" />
            <circle cx="140" cy="26" r="10" fill="#fff" opacity="0.35" />
            <rect x="18" y="58" width="80" height="8" rx="4" fill="#fff" opacity="0.85" />
            <rect x="18" y="74" width="44" height="6" rx="3" fill="#fff" opacity="0.6" />
          </g>
          <rect x="20" y="182" width="160" height="42" rx="11" fill={SURFACE} />
          <text x="34" y="209" fill="#fff" fontSize="20" fontWeight="700" fontFamily="sans-serif">$500</text>
          <rect x="20" y="238" width="160" height="44" rx="12" fill={accent} />
          <text x="100" y="265" textAnchor="middle" fill="#04120b" fontSize="13" fontWeight="700" fontFamily="sans-serif">Deposit</text>
          <text x="100" y="306" textAnchor="middle" fill={MUTED} fontSize="10" fontFamily="sans-serif">Instant - secure</text>
        </>
      )}
    </svg>
  );
}

function Phone({ kind, accent }: { kind: Kind; accent: string }) {
  return (
    <div className="relative mx-auto w-[210px] translate-y-10 transition duration-500 group-hover:-translate-y-1">
      <div className="rounded-[2rem] border border-white/10 bg-black p-2 shadow-2xl">
        <div className="relative aspect-[9/18] overflow-hidden rounded-[1.5rem] bg-[#0a0d13]">
          <div className="absolute left-1/2 top-2 z-10 h-4 w-16 -translate-x-1/2 rounded-full bg-black" />
          <Screen kind={kind} accent={accent} />
        </div>
      </div>
    </div>
  );
}

export function FeatureGrid() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 md:py-32">
      <div className="mb-14 text-center">
        <p className="text-sm font-semibold tracking-[0.2em] text-chad-primary">NEVER MISS OUT AGAIN</p>
        <h2 className="mx-auto mt-4 max-w-2xl text-5xl font-bold tracking-tight text-white md:text-6xl">
          everything you need to trade
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f) => (
          <div
            key={f.eyebrow}
            className="group relative flex min-h-[460px] flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0a0d13] transition hover:border-white/15"
          >
            <div className="relative z-10 p-6">
              <p className="text-xs font-semibold tracking-[0.2em]" style={{ color: f.accent }}>{f.eyebrow}</p>
              <h3 className="mt-2 max-w-[15ch] text-2xl font-bold leading-tight text-white">{f.title}</h3>
            </div>
            <div
              className="pointer-events-none absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 translate-y-16 rounded-full blur-3xl"
              style={{ background: f.accent, opacity: 0.18 }}
            />
            <div className="relative mt-auto flex justify-center overflow-hidden">
              <Phone kind={f.kind} accent={f.accent} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
