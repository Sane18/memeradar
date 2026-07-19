/**
 * MemeRadar brand config.
 * ───────────────────────────────────────────────
 * Single source of truth for app branding. Swap the logo in /public/logo
 * and update colors here AND in tailwind.config.ts if you rebrand again.
 */
export const brand = {
  name: "MemeRadar",
  tagline: "Every memecoin. One radar.",
  subtitle:
    "Sign in with Google, get a Solana wallet in seconds, and track, chart, and swap the hottest tokens — all in one place.",
  logo: "/logo/dark.png",
  logoLight: "/logo/light.png",
  colors: {
    primary: "#2E9BF5",
    gold: "#22D3A8",
    sol: "#16C784",
    purple: "#5B8DEF",
  },
  social: {
    twitter: "#",
    site: "https://memeradar.vercel.app",
  },
  appStore: {
    ios: "#",
    android: "#",
  },
} as const;
