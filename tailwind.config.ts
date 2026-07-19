import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // MemeRadar brand — dark UI, blue-green identity.
        chad: {
          bg: "#070B12",
          surface: "#0E141F",
          card: "#131B28",
          border: "#1F2A3A",
          primary: "#2E9BF5", // brand blue (marketing gradient)
          primaryDark: "#1E7FD4",
          gold: "#22D3A8", // teal mid-tone of the gradient
          sol: "#16C784", // app green (Buy / positive)
          purple: "#5B8DEF", // soft blue glow
          up: "#16C784",
          down: "#EA3943",
          muted: "#8A94A6",
        },
        // Trading terminal palette — matched to fomo.family.
        term: {
          bg: "#0D0B1C",
          bg2: "#110F22",
          surface: "#18162B",
          surface2: "#201E33", // elevated buttons / hover state
          border: "#2A2740",
          text: "#FFFFFF",
          text2: "#8A8A8A",
          text3: "#5C5C5C",
          up: "#16C784", // fomo signature green (buy / positive)
          down: "#F6465D", // fomo orange-red (sell / negative)
          accent: "#3B82F6",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: [
          "var(--font-display)",
          "var(--font-sans)",
          "ui-sans-serif",
          "sans-serif",
        ],
      },
      boxShadow: {
        glow: "0 0 40px -10px rgba(46,155,245,0.55)",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "marquee-reverse": {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0)" },
        },
        floaty: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        marquee: "marquee 40s linear infinite",
        "marquee-reverse": "marquee-reverse 40s linear infinite",
        floaty: "floaty 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
