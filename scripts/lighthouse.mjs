#!/usr/bin/env node
/** Lighthouse (mobile) for key pages against the running server. Prints scores and core metrics. */
import lighthouse from "lighthouse";
import { launch } from "chrome-launcher";
import { chromium } from "playwright";
const base = process.env.SHOT_BASE ?? "http://localhost:3000";
const pages = process.argv.slice(2).length ? process.argv.slice(2) : ["/", "/activities", "/fleet/cataspeed", "/contact"];
const chrome = await launch({ chromePath: chromium.executablePath(), chromeFlags: ["--headless=new", "--no-sandbox", "--disable-dev-shm-usage"] });
const runs = Number(process.env.RUNS ?? 1);
const median = (xs) => xs.sort((a, b) => a - b)[Math.floor(xs.length / 2)];
for (const p of pages) {
  if (runs > 1) {
    const perf = [], lcp = [], tbt = [];
    for (let i = 0; i < runs; i++) {
      const r = await lighthouse(base + p, { port: chrome.port, logLevel: "error", onlyCategories: ["performance"] });
      perf.push(Math.round(r.lhr.categories.performance.score * 100));
      lcp.push(r.lhr.audits["largest-contentful-paint"].numericValue);
      tbt.push(r.lhr.audits["total-blocking-time"].numericValue);
    }
    console.log(`${p.padEnd(18)} median of ${runs}: perf ${median(perf)} (${perf.join("/")}) · LCP ${(median(lcp) / 1000).toFixed(1)}s · TBT ${Math.round(median(tbt))}ms`);
    continue;
  }
  const r = await lighthouse(base + p, { port: chrome.port, output: "json", logLevel: "error", onlyCategories: ["performance", "accessibility", "best-practices", "seo"] });
  const c = r.lhr.categories, a = r.lhr.audits;
  if (r.lhr.runtimeError) { console.log(`${p.padEnd(18)} RUN FAILED: ${r.lhr.runtimeError.code} ${r.lhr.runtimeError.message}`); continue; }
  const s = (k) => Math.round(c[k].score * 100);
  console.log(`${p.padEnd(18)} perf ${s("performance")} · a11y ${s("accessibility")} · best ${s("best-practices")} · seo ${s("seo")} | LCP ${a["largest-contentful-paint"].displayValue} · CLS ${a["cumulative-layout-shift"].displayValue} · TBT ${a["total-blocking-time"].displayValue} · weight ${a["total-byte-weight"].displayValue}`);
  for (const [k, v] of Object.entries(a)) {
    if (v.score === null || v.score >= 0.9 || v.scoreDisplayMode !== "binary") continue;
    console.log(`   ✗ ${k}: ${v.title}`);
    for (const it of v.details?.items?.slice(0, 3) ?? []) console.log(`       ${JSON.stringify(it).slice(0, 200)}`);
  }
}
await chrome.kill();
