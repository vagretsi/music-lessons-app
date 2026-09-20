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
        serif: ["var(--font-sora)", "sans-serif"],
        sans: ["var(--font-manrope)", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
        display: ["var(--font-sora)", "sans-serif"],
      },
      colors: {
        ink: {
          DEFAULT: "#141614",
          50: "#191C19",
          100: "#202420",
          200: "#303730",
        },
        gold: {
          DEFAULT: "#D3F78A",
          light: "#E3FFAE",
          dark: "#B5DC70",
          muted: "#A2B681",
        },
        cream: {
          DEFAULT: "#F1F2EA",
          dark: "#CCCEC5",
          light: "#FAFBF6",
        },
        burgundy: {
          DEFAULT: "#F59E8B",
          light: "#FECACA",
          dark: "#DD7B69",
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
        "float-slow": "floatSlow 8s ease-in-out infinite",
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
        floatSlow: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
