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
| W-05 Home | done | all seven bands; hero uses a poster image — **no video yet** |
| W-06 Activities | done | URL-backed filter chips, detail with facts card, gallery, related experiences |
| W-07 Experiences | done | arch hero, generated "what's included", build-your-own panel |
| W-08 Fleet | done | alternating rows, specs strip, "what a charter includes" (no prices), sticky mobile enquire |
| W-09 Enquiry pipeline | done | Server Action + `submit_enquiry()`; logs to `.dev-enquiries.jsonl` until Supabase is set |
| W-10 Partners | done | steps, capacity table, partner form; logo marquee omitted until real logos exist |
| W-11 About, gallery, contact, legal | done | legal text is a DRAFT marked for review |
| W-12 Media pipeline | not started | photos are local stand-ins in `public/media/` |
| W-13 SEO | partial | metadata, canonicals, sitemap, robots, JSON-LD; no OG image route or analytics yet |
| W-14 Launch pass | not started | |
| WP-22 Enquiries inbox | n/a | belongs in the operations platform repo |

## Placeholders to replace before launch

- **Logo**: `Logo` in `src/components/site/Brand.tsx` is a stand-in wordmark. Supply `aquasail-logo.svg`.
- **Business details**: phone, WhatsApp, meeting point, BRN, licence numbers in `src/lib/site.ts`.
- **Proof points and licences**: marked `TODO` on the home and About pages.
- **Photography**: Wikimedia Commons and Unsplash stand-ins, credited on `/credits`. Some Commons photos
  are not of AquaSail's own boats (Cataspeed is shown with a monohull motor yacht). Two were cropped to
  remove date stamps (cerfs-lagoon, snorkel-surface).
- **Legal**: privacy and terms pages need review by someone qualified.
