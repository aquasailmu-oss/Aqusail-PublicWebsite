import type { Config } from "tailwindcss";

// Every colour resolves to the CSS custom property in src/styles/tokens.css,
// so plain CSS and Tailwind utilities can never drift apart.
const token = (name: string) => `var(--${name})`;

export default {
  content: ["./src/**/*.{ts,tsx}"],
  // site.css carries its own base layer, matched to docs/motion-reference.html.
  corePlugins: { preflight: false },
  theme: {
    extend: {
      colors: {
        "brand-cyan": token("brand-cyan"),
        "brand-blue": token("brand-blue"),
        "brand-mid": token("brand-mid"),
        "accent-ink": token("accent-ink"),
        ink: token("ink"),
        "ink-deep": token("ink-deep"),
        "ink-muted": token("ink-muted"),
        sand: token("sand"),
        "sand-deep": token("sand-deep"),
        shell: token("shell"),
        foam: token("foam"),
        page: token("page"),
        card: token("card"),
        text: token("text"),
        "text-soft": token("text-soft"),
        success: token("status-success"),
        warning: token("status-warning"),
        danger: token("status-danger"),
        info: token("status-info"),
      },
      fontFamily: {
        display: ["var(--font-display)"],
        sans: ["var(--font-sans)"],
        script: ["var(--font-script)"],
      },
      spacing: {
        "s-1": token("space-1"),
        "s-2": token("space-2"),
        "s-3": token("space-3"),
        "s-4": token("space-4"),
        "s-5": token("space-5"),
        "s-6": token("space-6"),
        "s-7": token("space-7"),
        "s-8": token("space-8"),
      },
      borderRadius: {
        sm: token("radius-sm"),
        md: token("radius-md"),
        lg: token("radius-lg"),
        xl: token("radius-xl"),
        pill: token("radius-pill"),
      },
      maxWidth: { site: token("maxw") },
    },
  },
  plugins: [],
} satisfies Config;
