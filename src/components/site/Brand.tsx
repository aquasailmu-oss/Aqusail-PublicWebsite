/*
 * The AquaSail wave is the logo's own swash (path taken from the logo artwork
 * via docs/motion-reference.html). It is the site's only icon flourish.
 *
 * Gradient and clip definitions are rendered once in the root layout by
 * <BrandDefs/> and referenced by id, so any number of waves can share them.
 */

export function BrandDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient
          id="aq-wave-grad"
          gradientUnits="userSpaceOnUse"
          x1="-0.0111942"
          y1="0"
          x2="1.000413"
          y2="0"
          gradientTransform="matrix(500.943069,-53.360687,83.863433,352.787935,180.321488,332.898763)"
        >
          <stop offset="0" stopColor="#00adef" />
          <stop offset="1" stopColor="#2c3792" />
        </linearGradient>
        <linearGradient id="aq-word-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#00adef" />
          <stop offset="1" stopColor="#2c3792" />
        </linearGradient>
        <clipPath id="aq-wave-clip">
          <path d="M 242.902344 299.539062 C 272.660156 298.445312 315.796875 301.179688 378.214844 311.785156 C 567.207031 343.898438 684.667969 293.851562 684.667969 293.851562 C 588.359375 324.210938 512.148438 310.234375 378.554688 296.121094 C 357.492188 293.898438 338.070312 292.960938 320.289062 292.960938 C 289.578125 292.960938 263.769531 295.753906 242.902344 299.539062 M 177.1875 319.710938 C 177.1875 319.710938 199.214844 307.457031 242.902344 299.539062 C 182.5625 301.753906 177.1875 319.710938 177.1875 319.710938" />
        </clipPath>
      </defs>
    </svg>
  );
}

const WAVE_FILL = (
  <g clipPath="url(#aq-wave-clip)">
    <path fill="url(#aq-wave-grad)" d="M 165 294 L 190 397 L 696 343 L 672 240 Z" />
  </g>
);

export function Wave({ className = "wave" }: { className?: string }) {
  return (
    <svg className={className} viewBox="175 290 512 33" aria-hidden="true" focusable="false">
      {WAVE_FILL}
    </svg>
  );
}

/**
 * STAND-IN WORDMARK. The real mark (sail-shaped A's over the wave) is supplied
 * artwork and must not be redrawn. When the design system's aquasail-logo.svg
 * is available, drop it in public/brand/ and render it here with next/image —
 * this component is the only place the logo is drawn.
 */
export function Logo({ className = "logo" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 520 162"
      role="img"
      aria-label="AquaSail Watersports Ltd"
    >
      <text
        x="260"
        y="74"
        textAnchor="middle"
        textLength="452"
        lengthAdjust="spacingAndGlyphs"
        fill="url(#aq-word-grad)"
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 400,
          fontSize: 84,
          letterSpacing: 6,
        }}
      >
        AQUASAIL
      </text>
      <g transform="translate(4 86) scale(1.0) translate(-175 -290)">{WAVE_FILL}</g>
      <text
        className="logo-sub"
        x="260"
        y="150"
        textAnchor="middle"
        textLength="360"
        lengthAdjust="spacing"
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 500,
          fontSize: 16,
          letterSpacing: 14,
        }}
      >
        WATERSPORTS LTD
      </text>
    </svg>
  );
}

export function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Zm5.8 14.08c-.24.68-1.42 1.3-1.95 1.35-.5.05-.97.23-3.27-.68-2.77-1.09-4.52-3.92-4.66-4.1-.13-.18-1.11-1.48-1.11-2.83 0-1.35.7-2.01.96-2.29.24-.27.53-.34.71-.34h.51c.16 0 .38-.06.6.46.23.54.77 1.87.84 2 .07.14.11.3.02.48-.09.18-.13.29-.27.45-.13.16-.28.35-.4.47-.13.13-.27.28-.12.55.16.27.7 1.15 1.49 1.86 1.03.91 1.89 1.2 2.16 1.33.27.13.43.11.59-.07.16-.18.68-.79.86-1.07.18-.27.36-.23.6-.14.25.09 1.57.74 1.84.88.27.13.45.2.52.31.07.11.07.66-.17 1.34Z" />
    </svg>
  );
}
