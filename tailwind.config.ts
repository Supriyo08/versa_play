import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    // Accent color variants used dynamically in community/spotlight
    "bg-vp-lime/20", "bg-vp-blue/20", "bg-vp-orange/20", "bg-vp-purple/20", "bg-vp-green/20",
    "text-vp-lime", "text-vp-blue", "text-vp-orange", "text-vp-purple", "text-vp-green",
    "from-vp-lime/20", "from-vp-blue/20", "from-vp-orange/20", "from-vp-purple/20", "from-vp-green/20",
    "to-vp-lime/5", "to-vp-blue/5", "to-vp-orange/5", "to-vp-purple/5", "to-vp-green/5",
    "border-vp-lime/20", "border-vp-blue/20", "border-vp-orange/20", "border-vp-purple/20", "border-vp-green/20",
    // Opacity variants
    "bg-vp-lime/5", "bg-vp-blue/5", "bg-vp-lime/10", "bg-vp-blue/10", "bg-vp-green/10",
    "bg-vp-orange/10", "bg-vp-purple/10", "bg-vp-red/10", "bg-vp-lime/15", "bg-vp-blue/15",
    "bg-vp-green/15", "bg-vp-orange/15", "bg-vp-purple/15", "bg-vp-red/15",
    "bg-vp-red/20", "bg-vp-lime/25", "bg-vp-blue/25", "bg-vp-orange/25",
    "border-vp-lime/30", "border-vp-blue/30", "border-vp-orange/30", "border-vp-purple/30", "border-vp-red/30",
  ],
  theme: {
    extend: {
      colors: {
        "vp-dark": "#0a0a0f",
        "vp-card": "#14141f",
        "vp-card-hover": "#1a1a2e",
        "vp-border": "#1e1e30",
        "vp-lime": "#c8ff00",
        "vp-lime-dark": "#a8d900",
        "vp-blue": "#4a7cff",
        "vp-green": "#22c55e",
        "vp-red": "#ef4444",
        "vp-orange": "#f59e0b",
        "vp-purple": "#a855f7",
        "vp-text": "#e4e4e7",
        "vp-text-dim": "#71717a",
        "vp-text-muted": "#52525b",
        "vp-sidebar": "#0f0f1a",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
