import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

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
        // PTR design tokens
        "ptr-bg": "var(--ptr-bg)",
        "ptr-surface": "var(--ptr-surface)",
        "ptr-border": "var(--ptr-border)",
        "ptr-text": "var(--ptr-text)",
        "ptr-muted": "var(--ptr-muted)",
        "ptr-accent": "var(--ptr-accent)",
        "ptr-success": "var(--ptr-success)",
        "ptr-danger": "var(--ptr-danger)",
        // shadcn/ui semantic tokens (mapped to PTR palette)
        background: "var(--ptr-bg)",
        foreground: "var(--ptr-text)",
        card: {
          DEFAULT: "var(--ptr-surface)",
          foreground: "var(--ptr-text)",
        },
        popover: {
          DEFAULT: "var(--ptr-surface)",
          foreground: "var(--ptr-text)",
        },
        primary: {
          DEFAULT: "var(--ptr-accent)",
          foreground: "var(--ptr-text)",
        },
        secondary: {
          DEFAULT: "var(--ptr-surface)",
          foreground: "var(--ptr-muted)",
        },
        muted: {
          DEFAULT: "var(--ptr-surface)",
          foreground: "var(--ptr-muted)",
        },
        accent: {
          DEFAULT: "var(--ptr-accent)",
          foreground: "var(--ptr-text)",
        },
        destructive: {
          DEFAULT: "var(--ptr-danger)",
          foreground: "var(--ptr-text)",
        },
        border: "var(--ptr-border)",
        input: "var(--ptr-border)",
        ring: "var(--ptr-accent)",
      },
      borderRadius: {
        ptr: "6px",
        lg: "6px",
        md: "6px",
        sm: "4px",
      },
      fontFamily: {
        sans: ["var(--font-inter)", ...fontFamily.sans],
      },
    },
  },
  plugins: [],
};

export default config;
