import type { Config } from "tailwindcss";

/** Klaviyo interim primary palette (2025 brand guidelines) */
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        klaviyo: {
          poppy: "#F96353",
          cotton: "#FFFCF9",
          charcoal: "#232121",
          stone: "#DBD4CC",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
