import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "ptr-bg": "var(--ptr-bg)",
        "ptr-surface": "var(--ptr-surface)",
        "ptr-border": "var(--ptr-border)",
        "ptr-text": "var(--ptr-text)",
        "ptr-muted": "var(--ptr-muted)",
        "ptr-accent": "var(--ptr-accent)",
        "ptr-success": "var(--ptr-success)",
        "ptr-danger": "var(--ptr-danger)",
      },
      borderRadius: {
        ptr: "6px",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
