import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "var(--nalth-glass-border)",
        input: "var(--nalth-glass-border)",
        ring: "var(--nalth-primary)",
        background: "var(--nalth-bg-primary)",
        foreground: "var(--nalth-text-primary)",
        primary: {
          DEFAULT: "var(--nalth-primary)",
          foreground: "#000000",
        },
        secondary: {
          DEFAULT: "var(--nalth-secondary)",
          foreground: "var(--nalth-text-primary)",
        },
        destructive: {
          DEFAULT: "var(--nalth-danger)",
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "var(--nalth-text-muted)",
          foreground: "var(--nalth-text-secondary)",
        },
        accent: {
          DEFAULT: "var(--nalth-accent)",
          foreground: "#000000",
        },
        popover: {
          DEFAULT: "var(--nalth-bg-card)",
          foreground: "var(--nalth-text-primary)",
        },
        card: {
          DEFAULT: "var(--nalth-bg-card)",
          foreground: "var(--nalth-text-primary)",
        },
      },
      borderRadius: {
        lg: "var(--nalth-radius-lg)",
        md: "var(--nalth-radius-md)",
        sm: "var(--nalth-radius-sm)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [],
} satisfies Config

export default config
