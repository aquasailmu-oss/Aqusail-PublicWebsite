# Build status against the plan

**Owner decision (24 Sep 2026): no prices are displayed on the website.** This
overrides the plan's `public_from_prices` view, "From Rs X" labels and seasonal
charter price cards. Charter pages show what a charter includes instead.

| Package | State | Notes |
|---|---|---|
| W-01 Setup, tokens, screenshot loop | done | Next 15, TS strict, Tailwind 3 (preflight off), tokens, fonts, `npm run shot` |
| W-02 Public data contract | done | migrations 0001–0003 without any price view; `tests/contract.sql` passes in Postgres 16 |
| W-03 Layout shell | done | fixed header (shrinks, never hides), overlay menu with focus trap, footer, Lenis |
| W-04 Motion library | done | RevealLines (SplitText), RevealGroup, Parallax, ArchImage, Collage, Marquee; `/motion-test` |
| Motion cookbook | done | tuning table applied; marquee hover slowdown + scroll-velocity surge; new `ParallaxComposition` (experiences, fleet) and `DriftTrack` (home); both on `/motion-test`. Lenis kept instead of ScrollSmoother |
| Continuous atmosphere | done | docs/continuous-flow.md A–C: section bands removed; one scroll-driven gradient per page with haze and craft per the §4 table; interludes for rhythm; menu hover photographs with measured scrims (all ≥ 4.5:1). Adds ~9KB per page; menu photos 626KB on open |
| W-05 Home | done | all seven bands; hero uses a poster image — **no video yet** |
| W-06 Activities | done | URL-backed filter chips, detail with facts card, gallery, related experiences |
| W-07 Experiences | done | arch hero, generated "what's included", build-your-own panel |
| W-08 Fleet | done | alternating rows, specs strip, "what a charter includes" (no prices), sticky mobile enquire |
| W-09 Enquiry pipeline | done | Server Action + `submit_enquiry()`; logs to `.dev-enquiries.jsonl` until Supabase is set |
| W-10 Partners | done | steps, capacity table, partner form; logo marquee omitted until real logos exist |
| W-11 About, gallery, contact, legal | done | legal text is a DRAFT marked for review |
| W-12 Media pipeline | not started | photos are local stand-ins in `public/media/` |
| W-13 SEO | done except analytics | metadata, canonicals, sitemap, robots, JSON-LD, generated share images (home + every activity, experience and boat; Jost, no prices). Analytics not added — needs an owner choice of provider (privacy notice already promises cookieless, no form data) |
| W-14 Launch pass | partial | done: security headers + CSP, error page, axe WCAG 2.1 AA clean on all 28 pages (`npm run audit:a11y`), Lighthouse a11y/best-practices/SEO 100. Performance: warm-cache LCP ≈1.4s on a simulated slow-4G phone, unchanged by the atmosphere; Lighthouse perf medians 79–89 in this codespace (noisy, 2 cores) — re-measure on the Vercel preview with `SHOT_BASE=<url> npm run audit:lighthouse`. Remaining: real content (placeholders below), analytics, run the enquiry path against real Supabase |
| WP-22 Enquiries inbox | n/a | belongs in the operations platform repo |

## Placeholders to replace before launch

- **Logo**: `Logo` in `src/components/site/Brand.tsx` is a stand-in wordmark. Supply `aquasail-logo.svg`.
- **Business details**: phone, WhatsApp, meeting point, BRN, licence numbers in `src/lib/site.ts`.
- **Proof points and licences**: marked `TODO` on the home and About pages.
- **Photography**: Wikimedia Commons and Unsplash stand-ins, credited on `/credits`. Some Commons photos
  are not of AquaSail's own boats (Cataspeed is shown with a monohull motor yacht). Two were cropped to
  remove date stamps (cerfs-lagoon, snorkel-surface).
- **Legal**: privacy and terms pages need review by someone qualified.
- **Self-hosting only**: in this codespace a long-running `next start` once left single image variants
  stuck mid-encode (requests hung; a restart cleared it; not reproducible on demand). Vercel resizes
  images with its own service, so this does not apply there. If the site is ever self-hosted, watch
  `/_next/image` latency.
- **Boat silhouettes** in the atmosphere are drawn stand-ins (`src/components/atmosphere/Craft.tsx`);
  replace with cut-outs from AquaSail's own fleet photography.
- **Experiences midday colour**: the doc's `#00ADEF` failed text contrast (2.2:1) and was darkened to
  `#035D88`. Decide with the owner whether to keep it.
