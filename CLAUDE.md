# AquaSail Watersports — repository conventions

## Public website

The public marketing site for AquaSail Watersports Ltd, Mauritius. It takes
ENQUIRIES, never bookings. There is no login, no basket, no payment, no
availability calendar and no customer account anywhere on it.

NO PRICES are displayed anywhere on the website — not "from" prices, not
charter rates, not in structured data. This is an owner decision that
overrides the build plan (which specified public_from_prices and
"From Rs X"). Reception quotes every enquiry directly.

The source brief is `docs/build-plan.pdf` (work packages W-01 to W-14) and
`docs/motion-reference.html` (the visual and motion specification). Progress
against the plan is tracked in `docs/STATUS.md`.

DESIGN
- docs/motion-reference.html is the visual and motion specification. Read it
  before writing any CSS. It runs every animation the site uses.
- Tokens live in src/styles/tokens.css and are mirrored into tailwind.config.ts.
  Never write a hex value in a component. Component CSS is in src/styles/site.css.
- Fonts: Jost (display, uppercase, .11em tracking), Source Sans 3 (body),
  Sacramento (script accent, above headings only, four words maximum).
- The logo is supplied artwork. Never redraw it, recolour it, rotate it or add
  a shadow. Minimum width 120px, clear space 24px. `Logo` in
  src/components/site/Brand.tsx is a STAND-IN wordmark until aquasail-logo.svg
  is supplied — swap it there and only there.
- Backgrounds: sections paint NOTHING. Each page has one continuous
  atmosphere (src/components/atmosphere, stops in src/lib/atmosphere.ts),
  per docs/continuous-flow.md, which supersedes the band rhythm of
  motion-reference.html §05. Never add a background to a section; a block
  that needs a ground is an inset, rounded panel floating on the atmosphere.
  Structure comes from rhythm of density: follow a busy passage with an
  <Interlude> (one line, at least 40vh).
- Any atmosphere stop must keep body text at 4.5:1 or better; darken the stop
  rather than the text. Besides the atmosphere, one gradient element per
  screen (the enquiry panel), never behind body text.
- Craft (boats) appear only on home, activities, experiences, fleet and
  contact. Partners, about and gallery stay still — deliberately.
- Menu hover photographs live in src/lib/menu-images.json; after changing one
  run `node scripts/menu-contrast.mjs --write`. Every item must reach 4.5:1.

MOTION
- docs/motion-cookbook.md is the source of truth for timings (its §4 tuning
  table) and wins over docs/motion-reference.html where they differ. Two eases
  only: power3.out for entrances, none for anything scrubbed. Smooth scroll
  stays on Lenis (owner decision: no structural change); the cookbook's
  data-speed parallax lives in ParallaxComposition, the sideways row in
  DriftTrack (never pinned). Atmosphere additions: gradient scrub 1.2, boat
  travel scrubbed ease none, boat bob 2.8s sine.inOut yoyo, menu crossfade
  0.6s power2.out, Ken Burns 8s.
- gsap.from(), never gsap.to() from an invisible state. Nothing may rest at
  opacity:0 waiting for an observer — if JS fails the page must still read.
- Reveals fire once. Scrubbed animations use ease:'none'.
- prefers-reduced-motion disables everything, not a reduced version
  (`useMotion` in src/components/motion/gsap.ts does this — use it).

DATA
- Pages under src/app/(site) read through src/lib/data.ts, which queries
  public_* VIEWS ONLY. Never a base table.
- When NEXT_PUBLIC_SUPABASE_URL is unset, data.ts serves src/lib/seed.ts, which
  is shaped exactly like the views. After changing seed.ts run
  `node --experimental-strip-types scripts/gen-seed-sql.mjs`.
- Never query price_rules, and never add a view, column, JSON field, schema.org
  Offer or piece of copy that exposes a price. tests/contract.sql fails if any
  public view carries one; resources.charter_terms has a check constraint too.
- Dates are computed in Indian/Mauritius (src/lib/dates.ts). Never
  new Date().toISOString().slice.
- The only write path from the public internet is submit_enquiry(). anon has
  execute on that function, select on the three public_* views, and nothing
  else.

RULES
- Do not modify anything under src/app/(app) or the operations platform's
  migrations when working on the website. supabase/migrations/0001 is a
  stand-in for the operations catalogue; delete it once theirs exist.
- Every Server Action: Zod-validate, return a discriminated Result, and surface
  human-readable errors. A visitor never sees a Postgres error code.
- Every image uses next/image with explicit dimensions (or fill in a sized
  parent) and a meaningful alt. Stand-in photos are credited on /credits via
  src/lib/media-manifest.json — keep credits in step when photos change.
- Marketing pages are static or ISR. If a page turns dynamic, find out why.
- Anything unknown (phone, licences, founding year) is a visible TODO, never an
  invented figure. Business details live in src/lib/site.ts.

WORKING METHOD
- After any visual change, run `npm run shot -- <path> [width]` with the dev
  server running and LOOK at the PNG in .screenshots/. Do not report that a page
  looks correct without having looked at it.
- `tests/contract.sql` asserts the data contract in Postgres (see
  docs/DATABASE.md). Run it after any migration change.
- One work package per commit, tagged: feat(web): W-05 home page.
- Run npm run build before saying a package is finished.
