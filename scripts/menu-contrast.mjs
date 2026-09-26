#!/usr/bin/env node
/**
 * Measure the overlay menu's hover photographs for text contrast
 * (docs/continuous-flow.md §6 step 4).
 *
 *   node scripts/menu-contrast.mjs          print the table
 *   node scripts/menu-contrast.mjs --write  also store each item's scrim in
 *                                           src/lib/menu-images.json
 *
 * For each photograph: render it at 1440×900 as object-fit: cover does,
 * composite the .menu-scrim gradient (100deg, stops .78/.52/.18/0 × strength)
 * pixel by pixel, sample the region the nav text occupies, take the brightest
 * 5% of those pixels, and compute contrast against the nav text colour.
 * The lowest scrimStrength in 0.8–1.4 that reaches 4.5:1 is chosen. A photo
 * that cannot reach 4.5:1 at 1.4 needs replacing, not a darker scrim.
 * The nav's text-shadow is ignored, so the figures are conservative.
 */
import { readFileSync, writeFileSync } from "node:fs";
import sharp from "sharp";

const W = 1440;
const H = 900;
const TEXT = [0xf4, 0xef, 0xe6];
const SCRIM = [6, 13, 34];
const STOPS = [
  [0, 0.78],
  [0.26, 0.52],
  [0.42, 0.18],
  [0.56, 0],
];
// Nav link text boxes in the open menu at 1440×900 (measured with Playwright),
// each widened by the 14px hover shift.
const RECTS = [
  { x: 130, y: 193, w: 336, h: 73 },
  { x: 130, y: 267, w: 407, h: 73 },
  { x: 130, y: 342, w: 200, h: 73 },
  { x: 130, y: 416, w: 519, h: 73 },
  { x: 130, y: 491, w: 228, h: 73 },
  { x: 130, y: 565, w: 282, h: 73 },
  { x: 130, y: 640, w: 306, h: 73 },
];

const lin = (c) => ((c /= 255) <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const lum = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const LT = lum(TEXT);
const ratio = (l) => (Math.max(LT, l) + 0.05) / (Math.min(LT, l) + 0.05) * (l > LT ? -1 : 1);

// CSS linear-gradient(100deg) geometry: position t along the gradient line.
const a = (100 * Math.PI) / 180;
const dx = Math.sin(a);
const dy = -Math.cos(a);
const len = Math.abs(W * dx) + Math.abs(H * dy);
function alphaAt(x, y) {
  const t = ((x - W / 2) * dx + (y - H / 2) * dy) / len + 0.5;
  for (let i = 1; i < STOPS.length; i++) {
    const [t1, a1] = STOPS[i];
    const [t0, a0] = STOPS[i - 1];
    if (t <= t1) return t <= t0 ? a0 : a0 + ((t - t0) / (t1 - t0)) * (a1 - a0);
  }
  return 0;
}

async function measure(file, k) {
  const { data, info } = await sharp(file)
    .resize(W, H, { fit: "cover", position: "centre" })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const lums = [];
  for (const r of RECTS) {
    for (let y = r.y; y < r.y + r.h; y++) {
      for (let x = r.x; x < r.x + r.w; x++) {
        const i = (y * info.width + x) * 3;
        const al = Math.min(1, alphaAt(x, y) * k);
        const px = [0, 1, 2].map((c) => al * SCRIM[c] + (1 - al) * data[i + c]);
        lums.push(lum(px));
      }
    }
  }
  lums.sort((p, q) => p - q);
  return lums[Math.floor(lums.length * 0.95)]; // brightest 5%
}

const cfgPath = "src/lib/menu-images.json";
const cfg = JSON.parse(readFileSync(cfgPath, "utf8"));
const manifest = JSON.parse(readFileSync("src/lib/media-manifest.json", "utf8"));
const rows = [];
for (const [href, item] of Object.entries(cfg.items)) {
  const file = `public${manifest[item.path].src}`;
  const at1 = ratio(await measure(file, 1));
  let chosen = null;
  let achieved = null;
  for (let k = 0.8; k <= 1.4001; k += 0.05) {
    const r = ratio(await measure(file, k));
    if (r >= 4.5) {
      chosen = Math.round(k * 100) / 100;
      achieved = r;
      break;
    }
  }
  if (chosen === null) achieved = ratio(await measure(file, 1.4));
  rows.push({ href, photo: item.path, at1, chosen, achieved });
  if (chosen !== null) item.scrim = chosen;
}

const f = (r) => (r < 0 ? "text darker" : `${r.toFixed(2)}:1`);
console.log("item          photo                  at 1.0      scrimStrength  result");
for (const r of rows) {
  console.log(
    `${r.href.padEnd(13)} ${r.photo.padEnd(22)} ${f(r.at1).padEnd(11)} ${String(r.chosen ?? "—").padEnd(14)} ${
      r.chosen === null ? `FAILS at 1.4 (${f(r.achieved)}) — needs a different photograph` : `${f(r.achieved)} ✓`
    }`,
  );
}
if (process.argv.includes("--write")) {
  writeFileSync(cfgPath, JSON.stringify(cfg, null, 2) + "\n");
  console.log(`\nwrote scrim values to ${cfgPath}`);
}
