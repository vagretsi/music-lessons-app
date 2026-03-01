import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["Playfair Display", "Georgia", "serif"],
        sans: ["Cormorant Garamond", "Garamond", "serif"],
        mono: ["JetBrains Mono", "monospace"],
        display: ["Playfair Display", "serif"],
      },
      colors: {
        ink: {
          DEFAULT: "#0D0B0A",
          50: "#1A1614",
          100: "#231E1B",
          200: "#2E2822",
        },
        gold: {
          DEFAULT: "#C9A84C",
          light: "#E4C97B",
          dark: "#A6872E",
          muted: "#8B7040",
        },
        cream: {
          DEFAULT: "#F5EDD8",
          dark: "#E8D9B8",
          light: "#FAF5EC",
        },
        burgundy: {
          DEFAULT: "#6B2737",
          light: "#8B3748",
          dark: "#4A1B26",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "noise": "url('/noise.png')",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.7s ease-out forwards",
        "shimmer": "shimmer 2s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
