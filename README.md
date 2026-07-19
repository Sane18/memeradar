# MemeRadar

**A full-stack Solana trading app** — discover trending tokens, read live on-chain data, and execute real swaps, all from one fast, social-first interface.

MemeRadar pairs a marketing landing page with a full trading terminal. Sign in with Google, get a wallet in seconds, browse the market with real data, and swap tokens routed for the best price across every Solana DEX.

---

## Demo

> https://github.com/user-attachments/assets/76ae9afa-fd01-4d3d-b365-32018a81ed93

---

## What it can do

- **Google sign-in with embedded wallets** — no seed phrases or extensions. A Solana wallet is created for the user on first login.
- **Trending market** — a live list of trending tokens with price, market cap, 24h change, volume, and liquidity.
- **Interactive charts** — candlestick + volume charts with multiple timeframes (1m → 1W) and a price/market-cap toggle.
- **Live on-chain intelligence** — real holder counts, top-10 holder concentration, unique traders, buy/sell flow, and a real-time swaps feed for each token.
- **Instant token search** — a live dropdown that filters trending tokens by name or symbol as you type, or paste any mint address to jump straight to it.
- **One-tap swaps** — buy or sell with USD-denominated amounts, live quotes, price-impact and slippage display, executed on-chain via the best available route.
- **Watchlist** — star tokens to a personal watchlist that persists across sessions.

---

## Tech stack

Each piece was chosen to keep the app fully functional on free tiers while using production-grade infrastructure.

| Tool | Role in the project |
|------|---------------------|
| **Next.js 14 (App Router)** | React framework — server components, API route handlers, and file-based routing. |
| **TypeScript** | End-to-end type safety across UI, hooks, and API layer. |
| **Tailwind CSS** | Utility-first styling with a custom design-token palette. |
| **Privy** | Authentication + embedded Solana wallets (Google / email login, no extension needed). |
| **Jupiter** | Swap aggregation — quotes and swap transactions routed for best price across Solana DEXs. |
| **BirdEye** | Market data — trending tokens, token overview, OHLCV charts, holders, and live trades. |
| **Alchemy** | Solana mainnet RPC — wallet balances and broadcasting swap transactions. |
| **Supabase** | Postgres-backed persistence for the user watchlist. |
| **Vercel** | Hosting and CI/CD (auto-deploy on push). |

---

## Getting started

### Prerequisites

- **Node.js 18+** and npm
- API keys for the services below (all have free tiers; the app still runs on live Jupiter data if the optional keys are left blank)

### 1. Install

```bash
git clone https://github.com/<your-username>/memeradar.git
cd memeradar
npm install
```

### 2. Configure environment

Copy the example file and fill in your keys:

```bash
cp .env.example .env.local
```

| Variable | Required | What it's for | Where to get it |
|----------|----------|---------------|-----------------|
| `NEXT_PUBLIC_PRIVY_APP_ID` | Yes (for login) | Auth + embedded wallets | [dashboard.privy.io](https://dashboard.privy.io) |
| `BIRDEYE_API_KEY` | Recommended | Charts, holders, trades, market data | [birdeye.so/data-api](https://birdeye.so/data-api) |
| `NEXT_PUBLIC_SOLANA_RPC` | Recommended | Balances + sending swap transactions | [dashboard.alchemy.com](https://dashboard.alchemy.com) |
| `NEXT_PUBLIC_SUPABASE_URL` | Optional | Watchlist storage | [supabase.com](https://supabase.com) |
| `SUPABASE_SERVICE_ROLE_KEY` | Optional | Watchlist storage (server-side) | Supabase project settings |
| `NEXT_PUBLIC_SITE_URL` | Optional | Share / OG tags | Your deployed URL |

> `BIRDEYE_API_KEY` and `SUPABASE_SERVICE_ROLE_KEY` are **server-side only** — they are never exposed to the browser.

### 3. Run

```bash
npm run dev     # start the dev server at http://localhost:3000
npm run build   # production build
npm run start   # serve the production build
```

---

## Using the app

1. **Landing page** (`/`) — overview of the product; click **Launch web app** to enter the terminal.
2. **Trading terminal** (`/trade`) — a three-column layout:
   - **Left:** trending tokens. Click any token to load it.
   - **Center:** token stats, the price chart, and tabs for holders and the live swaps feed.
   - **Right:** the buy/sell panel plus an "About" summary of on-chain activity.
3. **Sign in** — click **Sign in with Google** (top right). A Solana wallet is created automatically.
4. **Search** — use the top bar to type a token name/symbol and pick from the live dropdown, or paste a mint address.
5. **Trade** — enter a USD amount (or tap a preset), review the live quote and price impact, and confirm. To complete a real swap, fund your wallet with a little SOL.
6. **Watchlist** — click the star on a token to save it; your list persists across sessions.

---

## Project structure

```
src/
  app/            routes, layouts, and API route handlers
    api/          tokens, chart, holders, trades, quote, swap, balance, watchlist
    trade/        the trading terminal
  components/
    landing/      hero, feature grid, web+mobile section, footer
    trade/        top bar (search), trending list, chart, token info,
                  buy/sell panel, holders & trades, positions
  hooks/          useTokens, useAuth, useWatchlist
  lib/            jupiter, birdeye, solana, supabase, formatting, types
public/           fonts, logo, and imagery
```

---

## Roadmap

- **Copy trading** — follow top wallets and mirror their trades automatically.
- **Real per-trader analytics** — PnL, average entry, and position history per holder, backed by full on-chain trade indexing.
- **Portfolio tracking** — a live view of holdings, cost basis, and realized/unrealized PnL across the connected wallet.
- **Limit orders & price alerts** — set targets and get notified (or auto-execute) when a token hits them.
- **Native mobile app** — bring the terminal to iOS and Android.
- **Multi-chain support** — extend beyond Solana to other high-throughput chains.

---

## License

MIT
