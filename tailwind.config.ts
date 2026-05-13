import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Fraunces", "Georgia", "serif"],
      },
      colors: {
        ink: "#172033",
        paper: "#f7f2e8",
      },
      boxShadow: {
        cinematic: "0 30px 80px -35px rgba(28, 36, 56, 0.45)",
        glow: "0 18px 55px -32px rgba(14, 165, 233, 0.9)",
      },
    },
  },
  plugins: [],
} satisfies Config;
