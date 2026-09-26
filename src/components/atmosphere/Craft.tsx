/*
 * STAND-IN SILHOUETTES for the atmosphere's craft. docs/continuous-flow.md §5
 * asks for silhouettes cut from AquaSail's own fleet photography; until those
 * exist these are drawn from the fleet specs (sailing catamaran, power
 * catamaran, speed boat). Replace the paths here and only here. Each is well
 * under the 40KB budget. Bow faces right; mirror with scaleX(-1) to go left.
 */

export type CraftKind = "catamaran" | "powercat" | "speedboat" | "pirogue" | "parasail";

export function CraftSvg({ kind }: { kind: CraftKind }) {
  switch (kind) {
    case "catamaran":
      return (
        <svg viewBox="0 0 200 140" aria-hidden="true" focusable="false">
          <path d="M8 108h178q8 0 10-4l-12 18H22z" />
          <path d="M26 122h150l-6 6H32z" opacity=".55" />
          <path d="M62 108l9-12h68l10 12z" />
          <rect x="98" y="8" width="3" height="88" />
          <path d="M101.5 12v82H152z" opacity=".9" />
          <path d="M97 18L58 104h39z" opacity=".75" />
        </svg>
      );
    case "powercat":
      return (
        <svg viewBox="0 0 220 90" aria-hidden="true" focusable="false">
          <path d="M6 62h194q12 0 16-6l-10 20H16z" />
          <path d="M40 62l10-18h120l12 18z" />
          <path d="M80 44l8-12h52l6 12z" />
          <path d="M56 50h30v6H56zm38 0h30v6H94zm38 0h28v6h-28z" opacity=".4" />
          <rect x="112" y="18" width="2" height="14" />
        </svg>
      );
    case "speedboat":
      return (
        <svg viewBox="0 0 160 70" aria-hidden="true" focusable="false">
          <path d="M10 44h130q12 0 16-6l-8 20H22z" />
          <path d="M80 44l12-16h12l-4 16z" opacity=".7" />
          <path d="M58 44h18v-8H58z" />
          <path d="M2 36h10v24H2z" />
        </svg>
      );
    case "pirogue":
      return (
        <svg viewBox="0 0 160 60" aria-hidden="true" focusable="false">
          <path d="M4 34q76 16 152 0l-10 12q-66 10-132 0z" />
          <path d="M52 34V16h56v18" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M46 16h68l-6-6H52z" />
        </svg>
      );
    case "parasail":
      return (
        <svg viewBox="0 0 140 120" aria-hidden="true" focusable="false">
          <path d="M14 34Q70-8 126 34Q70 18 14 34z" />
          <path
            d="M16 34L66 92M40 26L68 92M100 26L72 92M124 34L74 92"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            opacity=".7"
          />
          <circle cx="70" cy="96" r="4" />
          <path d="M66 100h8l-2 14h-4z" />
        </svg>
      );
  }
}
