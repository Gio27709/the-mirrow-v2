import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Metallic Accent Palette
        "accent-metallic": "var(--accent-metallic)",
        "accent-metallic-hover": "var(--accent-metallic-hover)",
        "accent-metallic-dim": "var(--accent-metallic-dim)",

        // Theme-aware colors (using CSS variables)
        "bg-primary": "var(--bg-primary)",
        "bg-secondary": "var(--bg-secondary)",
        "bg-tertiary": "var(--bg-tertiary)",
        "bg-elevated": "var(--bg-elevated)",

        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "text-muted": "var(--text-muted)",

        "border-subtle": "var(--border-subtle)",
        "border-medium": "var(--border-medium)",

        "glass-bg": "var(--glass-bg)",
        "glass-border": "var(--glass-border)",

        // Legacy support (mapped to new system)
        "pure-black": "#000000",
        "dark-gray": "var(--bg-secondary)",
        "dark-gray-light": "var(--bg-tertiary)",
        "dark-gray-lighter": "var(--bg-elevated)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      spacing: {
        "sidebar": "var(--sidebar-width)",
        "sidebar-collapsed": "var(--sidebar-collapsed-width)",
        "bottom-nav": "var(--bottom-nav-height)",
      },
      boxShadow: {
        "nighty": "0 4px 20px var(--shadow-color)",
        "metallic-glow": "0 0 20px var(--accent-metallic-glow)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "shimmer": "shimmer 2s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
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
