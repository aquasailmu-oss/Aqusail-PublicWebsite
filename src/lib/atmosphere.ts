/**
 * The page atmosphere: one continuous background per page, descending from the
 * first stop to the last as the visitor scrolls. docs/continuous-flow.md §4.
 *
 * Stops were checked against the text that sits on them (WCAG AA, 4.5:1 for
 * body copy). Where the table in the doc failed, the stop is darkened toward
 * ink-deep just enough to pass — hue kept, noted inline.
 */

export type Tone = "dark" | "light";

export type HazePreset =
  | "cirrus" // home: high cirrus and one sun-glint bloom
  | "foam" // activities: surface foam, then caustic light below the crossing
  | "day" // experiences: cloud that warms past 60%
  | "contours" // fleet: faint depth contours
  | "high" // partners: soft high haze only
  | "shore" // about: sun haze and one palm-frond shadow
  | "lowwarm" // contact: low warm cloud
  | "none";

export type CraftPreset =
  | "home" // catamaran L→R at 35% depth, speed boat R→L at 72%
  | "activities" // parasail rising through the upper third, bubbles from 60%
  | "experiences" // one catamaran across the whole page, slowly
  | "fleet" // each vessel's silhouette drifts in with its row
  | "contact" // one small boat, very slow, single crossing
  | "none";

export type Atmosphere = {
  key: string;
  tone: Tone;
  stops: string[];
  haze: HazePreset;
  craft: CraftPreset;
};

const HOME: Atmosphere = {
  key: "home",
  tone: "dark",
  // doc: #0B1733 → #12224A → #1673C0. #1673C0 carries body text at 4.3:1,
  // so the lagoon end is darkened 24% → #125B9A (6.1:1).
  stops: ["#0B1733", "#12224A", "#125B9A"],
  haze: "cirrus",
  craft: "home",
};

const ACTIVITIES: Atmosphere = {
  key: "activities",
  tone: "dark",
  // doc: #1673C0 → #0E7FB8 → #0A2E52. The two surface blues fail with text
  // (4.3 and 3.9:1): darkened 24% → #125B9A and 29% → #0C5E8C.
  stops: ["#125B9A", "#0C5E8C", "#0A2E52"],
  haze: "foam",
  craft: "activities",
};

const EXPERIENCES: Atmosphere = {
  key: "experiences",
  tone: "dark",
  // doc: #1A2445 → #00ADEF → #3A2B4E. Midday cyan carries text at 2.2:1 and
  // needs 50% toward ink to pass → #035D88 (6.3:1). The biggest departure
  // from the doc; raise it with the owner before brightening it again.
  stops: ["#1A2445", "#035D88", "#3A2B4E"],
  haze: "day",
  craft: "experiences",
};

const FLEET: Atmosphere = {
  key: "fleet",
  tone: "dark",
  stops: ["#12224A", "#2C3792", "#060D22"],
  haze: "contours",
  craft: "fleet",
};

const PARTNERS: Atmosphere = {
  key: "partners",
  tone: "light",
  stops: ["#FBF8F3", "#F4EFE6", "#E4F4FD"],
  haze: "high",
  craft: "none",
};

const ABOUT: Atmosphere = {
  key: "about",
  tone: "light",
  stops: ["#F4EFE6", "#FBF8F3", "#E9E1D4"],
  haze: "shore",
  craft: "none",
};

const GALLERY: Atmosphere = {
  key: "gallery",
  tone: "dark",
  stops: ["#060D22", "#0B1733"],
  haze: "none",
  craft: "none",
};

const CONTACT: Atmosphere = {
  key: "contact",
  tone: "dark",
  // doc: #2C3792 → #1673C0 → #0B1733; #1673C0 darkened 24% as on home.
  stops: ["#2C3792", "#125B9A", "#0B1733"],
  haze: "lowwarm",
  craft: "contact",
};

/** Detail pages share their section's descent but stay quiet: no craft. */
const quiet = (a: Atmosphere): Atmosphere => ({ ...a, key: `${a.key}-detail`, craft: "none" });

export function atmosphereFor(pathname: string): Atmosphere {
  const seg = pathname.split("/").filter(Boolean);
  const [root, child] = seg;
  switch (root) {
    case undefined:
      return HOME;
    case "activities":
      return child ? quiet(ACTIVITIES) : ACTIVITIES;
    case "experiences":
      return child ? quiet(EXPERIENCES) : EXPERIENCES;
    case "fleet":
      return child ? quiet(FLEET) : FLEET;
    case "partners":
      return PARTNERS;
    case "about":
      return ABOUT;
    case "gallery":
      return GALLERY;
    case "contact":
      return CONTACT;
    case "motion-test":
      return HOME;
    default:
      // legal, credits, 404: the neutral dark field, nothing moving
      return GALLERY;
  }
}
