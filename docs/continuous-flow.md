# Continuous atmosphere — prompts

Replaces the band-edge rhythm described in the build plan (section 8) and in
`docs/motion-reference.html` section 05. Read section 1 before pasting anything:
it explains what is actually wrong in the screenshot, because the fix is not the
one it looks like.

> **Implementation notes (this repo)** — where the build departs from the
> letter of this document, and why:
>
> - **Gradient pacing is transform-driven.** Section 2 suggests tweening three
>   CSS custom properties. The build instead renders each page's whole journey
>   as one gradient three viewports tall inside the fixed layer and translates
>   it with scroll progress. The effect is the same continuous ramp, but it
>   honours this document's own rule that only `transform` and `opacity`
>   animate (repainting a full-screen gradient every frame does not). The
>   stops live in `src/lib/atmosphere.ts`.
> - **No ScrollSmoother.** The site scrolls with Lenis (owner decision), so
>   there is no `#smooth-wrapper`; the atmosphere is simply fixed behind
>   `<main>`. `data-speed` on haze layers is driven by ScrollTrigger.
> - **Contrast adjustments.** Where a journey stop in section 4 would put body
>   text below 4.5:1, the stop was darkened just enough to pass. Each change is
>   commented in `src/lib/atmosphere.ts`.
> - **Boat silhouettes are stand-ins** drawn as small SVGs, flagged for
>   replacement with cut-outs from AquaSail's own fleet photography.

---

## 1. The diagnosis

I measured the two colours either side of the seam in your screenshot:

| | Value | |
| --- | --- | --- |
| Above the seam | `#0D142E` | |
| Below the seam | `#121B3A` | |
| **Contrast ratio** | **1.08 : 1** | |

That is the problem, and it is worth understanding before changing anything.

A hard band edge works when the two fields are **strongly** different — the
reference site puts deep teal directly against cream, about 8:1, and the eye
reads that as a deliberate change of chapter. At 1.08:1 the eye cannot read it as
a chapter break, because the two fields are visibly the same colour. All it sees
is a straight horizontal line across a flat field, which looks like a rendering
artefact or a badly exported image.

So there were two valid fixes:

1. **Commit to the edge** — push the two fields far apart (navy against sand) so
   the seam reads as intentional.
2. **Remove the edge** — one continuous atmosphere down the whole page, with
   depth and movement providing the structure that colour blocks used to.

You have asked for the second, which is the more ambitious and the better fit for
a watersports brand: a page that reads as a single descent from sky to deep water
is a stronger idea than a page divided into chapters. The rest of this document
builds that.

**One thing it must not cost you.** Colour bands were doing real work: they told
the visitor where one idea ended and the next began. Remove them and you need
that structure back from somewhere, or the page becomes an undifferentiated
scroll where nothing feels like an arrival. The replacement is **rhythm of
density** — passages that are busy (an image composition, a card grid) separated
by passages that are nearly empty (a single line of type on open water). The
prompts below enforce that with a spacing rule, because it is the part that gets
forgotten.

---

## 2. The architecture change

Today, every section paints its own background. That is what creates seams. The
change is to lift the background out of the sections entirely.

```
<body>
  <div class="atmosphere">        position: fixed; inset: 0; z-index: 0
    <div class="atmos-gradient">    one gradient, colours tweened by scroll
    <div class="atmos-haze">        cloud / light layers, data-speed 0.6–0.9
    <div class="atmos-craft">       boats and drifting elements
    <canvas class="atmos-fx">       optional: caustics, bubbles
  </div>

  <main>                            z-index: 1, background: transparent
    <section>  ← no background, no border, no edge
    <section>  ← no background, no border, no edge
  </main>
</body>
```

Sections become transparent frames for content. The page has exactly one
background, and it changes continuously as you descend.

> The gradient colours are driven by **CSS custom properties tweened on scroll**,
> not by a single enormous static gradient. A static gradient stretches and
> compresses unpredictably as page height changes with content, and gives you no
> control over pacing. Tweening the variables lets each section declare the
> atmosphere it wants and lets the transition happen across the whole distance
> between them.

---

## 3. Prompt A — the continuous atmosphere system

Paste this first. It is the foundation; B and C depend on it.

```
Rebuild the page background as one continuous atmosphere. Read
docs/continuous-flow.md sections 1 and 2 first, then docs/motion-cookbook.md for
the motion conventions already in use.

THE PROBLEM
Sections currently paint their own backgrounds, so where two similar dark
navies meet there is a visible horizontal seam at about 1.08:1 contrast. It
reads as a rendering artefact, not as a design decision. Remove every
section-level background and replace them with a single page-level atmosphere.

BUILD

1. <PageAtmosphere> — a client component rendered once per page, fixed to the
   viewport at z-index 0, containing four stacked layers:
     .atmos-gradient   the base colour field
     .atmos-haze       cloud and light layers
     .atmos-craft      boats and drifting elements (Prompt B fills this)
     .atmos-fx         optional canvas for caustics or bubbles
   <main> sits at z-index 1 with background: transparent.
   It must live OUTSIDE #smooth-wrapper, like the header and the modal, or
   ScrollSmoother will transform it with the content.

2. Scroll-driven gradient. Define the field with custom properties:
     --atmos-top, --atmos-mid, --atmos-bot
   .atmos-gradient uses:
     background: linear-gradient(180deg, var(--atmos-top), var(--atmos-mid) 52%, var(--atmos-bot));
   Each <section> declares the atmosphere it wants with data attributes:
     <section data-atmos="0B1733,12224A,1673C0">
   On mount, create one ScrollTrigger per section that tweens the three root
   variables to that section's values, with scrub: 1.2, starting when the
   section's top reaches 80% of the viewport and ending when it reaches 40%.
   GSAP 3.13 can animate to a CSS variable directly, so tween the custom
   properties on document.documentElement.
   The transition must occupy the whole distance between two sections. A
   colour change that completes in 200px is just a soft seam.

3. Kill every seam. Go through the codebase and:
   - remove background, background-color and background-image from every
     section, and remove .band-sand / .band-ink / .band-shell entirely
   - remove every border-top and border-bottom on a section
   - where a block genuinely needs its own ground (a pricing panel, a quote
     band), give it a radius and inset it from the page edges so it reads as an
     object floating on the atmosphere, never as a full-bleed field
   - if a full-bleed ground is unavoidable, it must fade out at both edges:
     mask-image: linear-gradient(transparent, black 14%, black 86%, transparent)
   After this change, grep for "background" under src/app/(site) and report
   every remaining hit with a justification.

4. Rhythm of density, since colour is no longer marking sections. Enforce:
   - a busy passage (image composition, card grid, table) is always followed by
     a quiet one: a single heading or one line of copy on open atmosphere, at
     least 40vh tall with nothing else in it
   - vertical spacing between passages is clamp(120px, 18vh, 260px), roughly
     double what it is now
   - no two consecutive passages have the same layout shape
   Without this the page becomes an undifferentiated scroll where nothing feels
   like an arrival. This is not decoration; it is the structure that the colour
   bands used to provide.

5. Depth cue. Add a very slight vertical vignette to .atmos-gradient —
   an inset box-shadow or a radial overlay at no more than 8% — so the field has
   a centre of light rather than reading as flat paint. Without it a full-page
   gradient looks like a CSS demo.

CONSTRAINTS
- Only transform and opacity are animated. Never background-position, never
  filter on a large element, never box-shadow on anything that moves.
- prefers-reduced-motion: the atmosphere renders its static mid-page state and
  nothing moves. Do not ship a reduced version; ship none.
- The page must be fully readable with JavaScript disabled: set sensible
  default values for the three custom properties in CSS so the gradient renders
  before any tween runs.

Then run npm run shot on / at 1440 and 390, scroll to three depths, and look at
every screenshot. Report the contrast ratio between the top and the bottom of
the page — it should be a continuous ramp with no step anywhere.
```

---

## 4. Per-page atmosphere

Each page gets its own descent. This is the table Claude Code should work from —
it is not decoration for its own sake, it maps to what each page is actually
selling.

| Page | The journey | Gradient (top → bottom) | Haze | Moving craft |
| --- | --- | --- | --- | --- |
| **Home** | Dawn sky down to open lagoon | `#0B1733` → `#12224A` → `#1673C0` | High cirrus, one sun-glint bloom | Catamaran crossing left→right at 35% depth; speedboat right→left at 72% |
| **Activities** | Above the waterline, then below it | `#1673C0` → `#0E7FB8` → `#0A2E52` | Surface foam near the crossing point, then caustic light | A parasail rising through the upper third; bubbles from 60% down |
| **Experiences** | One full day, dawn to dusk | `#1A2445` → `#00ADEF` → `#3A2B4E` | Cloud colour shifts warm past 60% | One catamaran crossing the entire page slowly, top to bottom |
| **Fleet** | Deep water, technical | `#12224A` → `#2C3792` → `#060D22` | Faint depth contours at 5% opacity | Each vessel's silhouette drifts in as its card enters, then out |
| **Partners** | Aerial, calm, map-like | `#FBF8F3` → `#F4EFE6` → `#E4F4FD` | Soft high haze only | **None.** This is a business page — it stays quiet |
| **About** | Shoreline, warm | `#F4EFE6` → `#FBF8F3` → `#E9E1D4` | Sun haze, one palm-frond shadow | **None.** The photography carries it |
| **Gallery** | Neutral | `#060D22` → `#0B1733` | **None** | **None.** Nothing competes with the photographs |
| **Contact** | Sunset lagoon, settling | `#2C3792` → `#1673C0` → `#0B1733` | Low warm cloud | One small boat, very slow, single crossing |

> **Three of the eight pages have no moving elements at all.** That restraint is
> what keeps the device feeling designed rather than like a theme park. If every
> page has boats, boats stop meaning anything and the gallery stops selling
> photographs. Hold this line when it is tempting not to.

---

## 5. Prompt B — clouds and boats

```
Add the atmosphere's moving layers, per the table in docs/continuous-flow.md
section 4. Read it first — three of the eight pages get nothing, and that is
deliberate.

CLOUDS AND HAZE

Build <AtmosHaze layers={...}> rendering two or three layers inside
.atmos-haze. Do NOT use photographic cloud PNGs: at the opacity these run at,
a blurred CSS radial-gradient is indistinguishable and costs nothing.

  .haze-layer {
    position: absolute; inset: -20%;
    background: radial-gradient(60% 40% at 30% 40%, rgba(255,255,255,.10), transparent 60%),
                radial-gradient(45% 30% at 72% 62%, rgba(255,255,255,.07), transparent 65%);
    filter: blur(40px);
  }

- Opacity per layer between 0.05 and 0.14. Never higher: these sit behind text.
- data-speed 0.6, 0.8 and 1.1 on the three layers so they separate as you scroll.
- One slow independent drift each: gsap.to(layer, {xPercent: 6, duration: 40,
  yoyo: true, repeat: -1, ease: 'sine.inOut'}) with a different duration per
  layer so they never sync up.
- filter: blur() is expensive on a large element. Apply it once, never animate
  it, and give each layer will-change: transform.

BOATS

Do NOT use three.js or react-three-fiber for these. A boat crossing the screen
horizontally at a fixed camera angle never reveals that it is a 3D model — you
would ship 400KB and a WebGL context for an effect nobody can distinguish from
a PNG. What actually sells dimensionality is the motion, and all four cues are
2D transforms:

  1. TRAVEL   xPercent from -25 to 125 across the section, scrubbed to scroll,
              ease 'none'
  2. BOB      an independent infinite tween: y ±6px and rotate ±1.5deg,
              duration 2.8s, yoyo, ease 'sine.inOut' — NOT tied to scroll, so
              the boat stays alive when the page is still
  3. PERSPECTIVE  scale 0.86 → 1.06 → 0.9 across the crossing, so it reads as
              passing nearer and then further away
  4. WAKE     a stretched, blurred, low-opacity ellipse behind it whose scaleX
              tracks the travel speed

Assets: one WebP or SVG per vessel silhouette with alpha, under 40KB each,
sourced from your own boat photography. Use the real fleet — Catamaran 1,
Cataspeed, the speedboat — not generic clipart.

Rules:
- Boats sit in .atmos-craft, behind all content and in front of the haze.
- Never more than two moving craft on screen at once.
- Each boat crosses ONCE per page. A looping boat reads as a screensaver.
- On viewports under 900px, render one boat, not two.
- Opacity between 0.5 and 0.85 so they sit in the atmosphere rather than on top
  of it.

OPTIONAL SHOWPIECE — ask me before building this
If you want one genuinely 3D element, the only place it earns its weight is the
home hero: a low-poly catamaran in react-three-fiber that responds to pointer
position. It must be lazy-loaded below the fold boundary, desktop-only, behind
a WebGL capability check with the 2D boat as fallback, and it must not block
Largest Contentful Paint. Do not build it as part of this package — flag it and
I will decide.

Then run npm run shot at three scroll depths on / and /activities and look at
every screenshot. Report the transferred page weight before and after this
change; the atmosphere must add less than 120KB.
```

---

## 6. Prompt C — menu hover backgrounds

The constraint you set — the image must stay fully visible — rules out the usual
solution, which is dimming the whole photograph behind a 60% black scrim. The
technique that satisfies both requirements is a **scrim that covers only the
column the text occupies**, leaving the rest of the image untouched.

```
Add hover-driven backgrounds to the overlay menu.

BEHAVIOUR
Each menu item has an associated photograph. Hovering an item brings that
photograph up as the full-bleed background of the entire overlay. Moving
between items crossfades. The images must stay VIVID — no global dimming, no
heavy black scrim over the photograph.

BUILD

1. Image stack. Render every menu image at once, absolutely positioned and
   covering the overlay, all at opacity 0 except the active one. Never swap a
   src attribute: that causes a flash of empty background on first hover.
   - next/image with fill and sizes="100vw"
   - preload them when the menu OPENS, not on page load — they are large and
     most visitors never open the menu
   - crossfade with gsap.to(img, {autoAlpha: 1, duration: 0.6, ease: 'power2.out'})
     and fade the outgoing one over the same 0.6s, overlapping
   - a slow Ken Burns on the active image only: scale 1.0 → 1.07 over 8s, so a
     held hover stays alive

2. Legibility WITHOUT dimming the photograph. The nav sits in the left column,
   so the scrim covers only the left column:

     .menu-scrim {
       position: absolute; inset: 0; pointer-events: none;
       background: linear-gradient(100deg,
         rgba(6,13,34,.78) 0%,
         rgba(6,13,34,.52) 26%,
         rgba(6,13,34,.18) 42%,
         transparent 56%);
     }

   The right 44% of the photograph is completely untouched — full colour, full
   contrast. Add text-shadow: 0 2px 20px rgba(6,13,34,.6) on the nav items so
   the longest words stay readable where the scrim has thinned out.

3. Per-image override, because some photographs will still fail. A bright
   overexposed lagoon shot will not carry white text even at 78% scrim.
   Give each menu item an optional scrimStrength (default 1, range 0.8–1.4)
   that multiplies the gradient's alpha stops for that image only. Measure,
   then set it — do not guess.

4. MEASURE IT. For each menu image, sample the brightest 5% of pixels in the
   region the nav text occupies and compute contrast against the text colour.
   Write a script at scripts/menu-contrast.mjs that does this with sharp and
   prints a table. Every item must reach 4.5:1. Raise that item's
   scrimStrength until it does, and report the final table. An item that cannot
   reach 4.5:1 at scrimStrength 1.4 needs a different photograph, not a darker
   scrim — say so rather than pushing it to 2.0 and darkening the image to mud.

5. Default and exit states.
   - With nothing hovered, show a neutral brand gradient, NOT an image, so the
     menu opens calm and the first hover is an event.
   - On mouse-out of the whole nav, fade back to that neutral state over 0.8s.
   - Keyboard focus triggers the same change as hover — focus and hover share
     one handler, or the menu is unusable without a mouse.

6. Touch devices have no hover. Under 900px, or where
   (hover: none) matches, do not build a broken hover: instead show each item's
   image as a small rounded thumbnail that slides in beside the item when it
   receives focus, and keep the overlay's plain gradient background.

7. Respect the connection. Skip the images entirely and keep the neutral
   gradient when navigator.connection.saveData is true, or when
   prefers-reduced-motion is set (in which case also drop the Ken Burns).

Then open the menu, hover every item, screenshot each state, and look at all of
them. Report the contrast table from step 4.
```

---

## 7. Budget

The atmosphere is the easiest place on this site to lose the performance work
from W-14. Hold these numbers.

| | Limit |
| --- | --- |
| Atmosphere weight, all layers, per page | **≤ 120KB** |
| Menu images, total, lazy-loaded on open | ≤ 900KB |
| Moving decorative elements on screen at once | **≤ 3** |
| Animated properties | `transform` and `opacity` only |
| `filter: blur()` | Applied once, never animated, never on a scrolling element |
| Home page total transferred, unchanged from W-12 | ≤ 1.5MB |
| Lighthouse performance, unchanged from W-14 | ≥ 90 |
| Cumulative Layout Shift | ≤ 0.1 — a fixed atmosphere must never push content |

Kill switches, all three required:

```ts
const heavy =
  !prefersReduced() &&
  !navigator.connection?.saveData &&
  window.innerWidth >= 900 &&
  (navigator.deviceMemory ?? 8) >= 4;
```

Below that bar the page renders the static gradient and nothing else — which
should still look finished, because the gradient is doing most of the work.

---

## 8. What this changes in the earlier documents

| Document | Was | Now |
| --- | --- | --- |
| Build plan §8, `field.swap` | "Sections alternate sand → ink → shell. The transition is the section edge itself, not a fade." | Deleted. There are no section backgrounds. One page-level atmosphere replaces them. |
| Build plan §5, page rhythm table | Band colour per section | Read as the *content* order, which still holds. The colour column is replaced by the `data-atmos` values in section 4 here. |
| `motion-reference.html` §05 | Alternating full-bleed fields | Superseded. The motion reference's other ten behaviours are unaffected. |
| Motion cookbook §4 tuning table | Still correct | Add: atmosphere gradient `scrub: 1.2`; boat travel scrubbed, `ease: 'none'`; boat bob 2.8s `sine.inOut` yoyo; menu crossfade 0.6s `power2.out`; Ken Burns 8s. |

Everything about the data contract, the enquiry pipeline and the page structure
is unaffected. This changes how the site looks, not how it works.
