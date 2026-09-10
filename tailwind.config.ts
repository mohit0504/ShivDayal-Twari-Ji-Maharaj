import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#271817",
        cream: "#FCF7EC",
        saffron: "#B85E2A",
        wine: "#4E1016",
        gold: "#B38A42",
      },
      fontFamily: {
        display: ["Cormorant Garamond", "Noto Serif Devanagari", "serif"],
        sans: ["Manrope", "Noto Sans Devanagari", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
