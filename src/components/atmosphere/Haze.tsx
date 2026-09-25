import type { HazePreset } from "@/lib/atmosphere";

/*
 * Haze, per docs/continuous-flow.md §5: soft radial gradients, no cloud PNGs,
 * opacity 0.05–0.14 per layer. The gradients already fall off softly, so no
 * filter: blur() is needed at all — cheaper than the doc's "blur once".
 * data-speed drives the scroll separation (0.6 / 0.8 / 1.1); data-drift the
 * slow independent sideways drift. Special layers (glint, caustics, contours,
 * palm) are static art the scroll timeline fades in and out.
 */

const cloud = (a: string, b: string) => `${a}, ${b}`;

type Layer = { speed: number; drift: number; opacity: number; bg: string; className?: string };

const WHITE = (a: number) => `rgba(255,255,255,${a})`;
const WARM = (a: number) => `rgba(255,178,128,${a})`;

const LAYERS: Record<Exclude<HazePreset, "none">, Layer[]> = {
  cirrus: [
    {
      speed: 0.6,
      drift: 44,
      opacity: 0.12,
      bg: cloud(
        `radial-gradient(60% 6% at 28% 18%, ${WHITE(0.9)}, transparent 70%)`,
        `radial-gradient(40% 4% at 64% 26%, ${WHITE(0.8)}, transparent 70%)`,
      ),
    },
    {
      speed: 0.8,
      drift: 57,
      opacity: 0.09,
      bg: cloud(
        `radial-gradient(55% 5% at 70% 44%, ${WHITE(0.9)}, transparent 70%)`,
        `radial-gradient(35% 4% at 22% 58%, ${WHITE(0.7)}, transparent 70%)`,
      ),
    },
    {
      speed: 1.1,
      drift: 71,
      opacity: 0.06,
      bg: cloud(
        `radial-gradient(60% 40% at 30% 40%, ${WHITE(0.9)}, transparent 60%)`,
        `radial-gradient(45% 30% at 72% 62%, ${WHITE(0.7)}, transparent 65%)`,
      ),
    },
  ],
  foam: [
    {
      speed: 0.6,
      drift: 42,
      opacity: 0.12,
      bg: cloud(
        `radial-gradient(70% 5% at 40% 30%, ${WHITE(1)}, transparent 70%)`,
        `radial-gradient(50% 4% at 76% 34%, ${WHITE(0.8)}, transparent 70%)`,
      ),
    },
    {
      speed: 0.8,
      drift: 55,
      opacity: 0.08,
      bg: cloud(
        `radial-gradient(60% 40% at 30% 40%, ${WHITE(0.9)}, transparent 60%)`,
        `radial-gradient(45% 30% at 72% 62%, ${WHITE(0.7)}, transparent 65%)`,
      ),
    },
  ],
  day: [
    {
      speed: 0.6,
      drift: 46,
      opacity: 0.12,
      bg: cloud(
        `radial-gradient(50% 18% at 24% 26%, ${WHITE(0.9)}, transparent 70%)`,
        `radial-gradient(40% 14% at 74% 40%, ${WHITE(0.8)}, transparent 70%)`,
      ),
    },
    {
      speed: 0.8,
      drift: 61,
      opacity: 0.08,
      bg: cloud(
        `radial-gradient(60% 40% at 30% 40%, ${WHITE(0.9)}, transparent 60%)`,
        `radial-gradient(45% 30% at 72% 62%, ${WHITE(0.7)}, transparent 65%)`,
      ),
    },
    // warms past 60% of the page — faded in by the scroll timeline
    {
      speed: 1.1,
      drift: 73,
      opacity: 0.14,
      bg: cloud(
        `radial-gradient(60% 22% at 34% 58%, ${WARM(0.9)}, transparent 70%)`,
        `radial-gradient(45% 18% at 76% 70%, ${WARM(0.8)}, transparent 70%)`,
      ),
      className: "haze-warm",
    },
  ],
  contours: [
    {
      speed: 0.8,
      drift: 60,
      opacity: 0.08,
      bg: cloud(
        `radial-gradient(60% 40% at 30% 40%, ${WHITE(0.7)}, transparent 60%)`,
        `radial-gradient(45% 30% at 72% 62%, ${WHITE(0.5)}, transparent 65%)`,
      ),
    },
  ],
  high: [
    {
      speed: 0.6,
      drift: 48,
      opacity: 0.14,
      bg: cloud(
        `radial-gradient(70% 22% at 30% 8%, rgba(155,217,247,.9), transparent 70%)`,
        `radial-gradient(50% 18% at 78% 14%, rgba(155,217,247,.7), transparent 70%)`,
      ),
    },
    {
      speed: 0.8,
      drift: 63,
      opacity: 0.08,
      bg: `radial-gradient(60% 30% at 60% 70%, rgba(155,217,247,.8), transparent 70%)`,
    },
  ],
  shore: [
    {
      speed: 0.6,
      drift: 50,
      opacity: 0.14,
      bg: `radial-gradient(40% 36% at 84% 10%, rgba(255,214,150,.95), transparent 70%)`,
    },
    {
      speed: 0.8,
      drift: 66,
      opacity: 0.08,
      bg: `radial-gradient(60% 30% at 30% 64%, rgba(255,226,180,.9), transparent 70%)`,
    },
  ],
  lowwarm: [
    {
      speed: 0.6,
      drift: 45,
      opacity: 0.12,
      bg: cloud(
        `radial-gradient(70% 16% at 30% 82%, ${WARM(0.9)}, transparent 70%)`,
        `radial-gradient(50% 12% at 78% 76%, ${WARM(0.8)}, transparent 70%)`,
      ),
    },
    {
      speed: 0.8,
      drift: 59,
      opacity: 0.07,
      bg: cloud(
        `radial-gradient(60% 40% at 30% 40%, ${WHITE(0.9)}, transparent 60%)`,
        `radial-gradient(45% 30% at 72% 62%, ${WHITE(0.7)}, transparent 65%)`,
      ),
    },
  ],
};

export function Haze({ preset }: { preset: HazePreset }) {
  if (preset === "none") return null;
  return (
    <>
      {LAYERS[preset].map((l, i) => (
        <div
          key={i}
          className={`haze-layer ${l.className ?? ""}`}
          data-speed={l.speed}
          data-drift={l.drift}
          style={{ opacity: l.opacity, backgroundImage: l.bg }}
        />
      ))}
      {preset === "cirrus" ? <div className="haze-glint" data-speed="0.6" /> : null}
      {preset === "foam" ? <Caustics /> : null}
      {preset === "contours" ? <Contours /> : null}
      {preset === "shore" ? <PalmShadow /> : null}
    </>
  );
}

function Caustics() {
  return (
    <svg className="haze-art haze-caustics" aria-hidden="true" focusable="false">
      <defs>
        <pattern id="atmos-caustic" width="240" height="170" patternUnits="userSpaceOnUse">
          <path
            d="M0 40q30-22 60 0t60 0 60 0 60 0M0 120q40-24 80 0t80 0 80 0M30 0q-18 42 8 84t-8 86M150 0q22 40-6 86t10 84"
            fill="none"
            stroke="#fff"
            strokeWidth="1.6"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#atmos-caustic)" />
    </svg>
  );
}

function Contours() {
  return (
    <svg className="haze-art haze-contours" aria-hidden="true" focusable="false">
      <defs>
        <pattern id="atmos-contour" width="420" height="44" patternUnits="userSpaceOnUse">
          <path d="M0 22q52-16 105 0t105 0 105 0 105 0" fill="none" stroke="#fff" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#atmos-contour)" />
    </svg>
  );
}

/** One palm frond, drawn as leaflets along a curved stem. */
function PalmShadow() {
  const leaves: string[] = [];
  for (let i = 1; i <= 18; i++) {
    const t = i / 19;
    const x = 20 + t * 300;
    const y = 30 + Math.sin(t * Math.PI * 0.9) * 70;
    const len = 90 - t * 55;
    leaves.push(
      `M${x} ${y}q${len * 0.3} ${len * 0.5} ${len * 0.15} ${len}q-${len * 0.2} -${len * 0.5} -${len * 0.15} -${len}z`,
    );
    leaves.push(
      `M${x} ${y}q-${len * 0.5} -${len * 0.2} -${len * 0.9} -${len * 0.35}q${len * 0.45} ${len * 0.1} ${len * 0.9} ${len * 0.35}z`,
    );
  }
  return (
    <svg className="haze-art haze-palm" viewBox="0 0 360 220" aria-hidden="true" focusable="false">
      <path d="M0 18q160 20 330 110" fill="none" stroke="currentColor" strokeWidth="3" />
      <path d={leaves.join("")} fill="currentColor" />
    </svg>
  );
}
