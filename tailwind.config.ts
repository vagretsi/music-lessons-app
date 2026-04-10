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
          DEFAULT: "#0F172A",
          50: "#162033",
          100: "#1D2940",
          200: "#273654",
        },
        gold: {
          DEFAULT: "#7DD3FC",
          light: "#BAE6FD",
          dark: "#38BDF8",
          muted: "#5D8FB2",
        },
        cream: {
          DEFAULT: "#E5EEF9",
          dark: "#C7D3E5",
          light: "#F8FBFF",
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
