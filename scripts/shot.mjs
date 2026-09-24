#!/usr/bin/env node
/**
 * Screenshot a page of the running dev server so changes can be LOOKED at.
 *
 *   npm run shot -- /                 full page at 1440px
 *   npm run shot -- /fleet 390        full page at 390px
 *   npm run shot -- / 1440 --fold     first screen only
 *   npm run shot -- / 1440 --reduced  with prefers-reduced-motion
 *
 * Scrolls through the page first so once-only reveals have fired, then returns
 * to the top and captures. Writes to .screenshots/.
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const args = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith("--")));
const [path = "/", widthArg = "1440"] = args.filter((a) => !a.startsWith("--"));
const width = Number(widthArg);
const base = process.env.SHOT_BASE ?? "http://localhost:3000";
const height = width < 600 ? 844 : 900;

mkdirSync(".screenshots", { recursive: true });
const name = `${path === "/" ? "home" : path.replace(/^\//, "").replace(/[/?=&#]/g, "_")}-${width}${flags.has("--fold") ? "-fold" : ""}${flags.has("--reduced") ? "-reduced" : ""}`;
const out = `.screenshots/${name}.png`;

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width, height },
  deviceScaleFactor: 1,
  reducedMotion: flags.has("--reduced") ? "reduce" : "no-preference",
});
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));

await page.goto(base + path, { waitUntil: "networkidle", timeout: 90_000 });
await page.evaluate(() => document.fonts.ready);

if (!flags.has("--fold")) {
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < total; y += Math.round(height * 0.6)) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(140);
  }
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(1200);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForLoadState("networkidle");
}
await page.waitForTimeout(1400);
await page.screenshot({ path: out, fullPage: !flags.has("--fold") });
await browser.close();

console.log(out);
if (errors.length) console.log("page errors:\n  " + errors.join("\n  "));
