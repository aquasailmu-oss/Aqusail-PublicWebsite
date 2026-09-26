#!/usr/bin/env node
/** axe-core WCAG 2.1 AA audit of every sitemap page. Needs the server on :3000. */
import { chromium } from "playwright";
import { AxeBuilder } from "@axe-core/playwright";
const base = process.env.SHOT_BASE ?? "http://localhost:3000";
const xml = await (await fetch(`${base}/sitemap.xml`)).text();
const paths = [...xml.matchAll(/<loc>[^<]*?(\/[^<]*)?<\/loc>/g)].map((m) => new URL(m[0].slice(5, -6)).pathname);
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
let total = 0;
for (const path of [...new Set([...paths, "/credits", "/does-not-exist"])]) {
  const p = await ctx.newPage();
  await p.goto(base + path, { waitUntil: "networkidle" });
  const r = await new AxeBuilder({ page: p }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  for (const v of r.violations) {
    total += v.nodes.length;
    console.log(`${path}  [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length})`);
    for (const n of v.nodes.slice(0, 3)) console.log(`    ${n.target.join(" ")}  ${n.failureSummary?.split("\n")[1]?.trim() ?? ""}`);
  }
  await p.close();
}
console.log(total ? `\n${total} violations` : "\nno violations");
await b.close();
process.exit(total ? 1 : 0);
