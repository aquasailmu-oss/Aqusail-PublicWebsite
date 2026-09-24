# Motion cookbook

Copy-paste recipes for every animation on the AquaSail public website, with the
timings measured from the reference recording rather than estimated.

Read this alongside `docs/motion-reference.html`, which runs the same animations
live. Where the two disagree, this file wins — it was written later.

> **Implementation note (this repo).** The site keeps **Lenis** for smooth
> scroll rather than switching to ScrollSmoother (section 0), because the owner
> asked that existing structure not be changed. The `data-speed` layered
> parallax of section 3.3 is reproduced with ScrollTrigger in
> `src/components/motion/ParallaxComposition.tsx`, reading the same
> `data-speed` attribute. Everything else in this file applies as written.

---

## 0. Correction to the build plan

The build plan (section 8) says to use **Lenis** for smooth scroll and warns that
GSAP's **SplitText** might be a paid plugin. Both are out of date.

GSAP 3.13 (May 2025) made **the entire toolset free, including commercial use** —
SplitText, ScrollSmoother, MorphSVG, everything that used to be Club GSAP. That
changes two decisions:

| Build plan said | Do this instead | Why |
| --- | --- | --- |
| Lenis for smooth scroll | **ScrollSmoother** | Same job, but it is part of GSAP, so it shares ScrollTrigger's ticker instead of being bridged to it. No `lenis.on('scroll', ScrollTrigger.update)` glue, no desync. It also brings `data-speed` and `data-lag`, which do the parallax in this document for free. |
| Hand-roll a line splitter | **SplitText with `mask: "lines"`** | The masked line reveal is now one config option instead of a wrapper-span helper. `autoSplit: true` re-splits on font load and resize, which is the bug the build plan warned you to handle manually. |

Lenis is still a good library. It is simply the wrong choice when you are already
running GSAP for everything else.

```bash
npm i gsap
```

---

## 1. What the recording actually does

I sampled the recording at 12fps and measured every motion burst. Three things
were different from what I specified first time.

### 1.1 The animations are faster than they look

| Burst length | Count | What it is |
| --- | --- | --- |
| 0.3–0.5s | 14 | Single-element reveals, hover states, pill transitions |
| 0.5–0.7s | 9 | Section heading reveals, card stagger entries |
| 1.0–1.8s | 4 | Composite sections — several staggered elements, not one long animation |

**Nothing runs for a second on its own.** The long bursts are three or four
elements at 500ms each, overlapping 120ms apart. A 1.2s fade reads as slow and
expensive; four 500ms fades 120ms apart read as considered. My first spec had the
hero at 1.05s — bring it down to 0.8s and let the stagger do the work.

### 1.2 Parallax is layered, not single

The compositions are two or three images moving at **different** rates inside one
frame — a large landscape at 1.0, an inset image at ~0.85, a rotated polaroid
caption at ~1.15 so it overtakes both. That differential is what produces depth.
One image drifting against a static page just looks like a bug.

### 1.3 A card row drifts horizontally while you scroll vertically

The team section moves a row of polaroid cards right-to-left as the page scrolls
down. It is **not** a pinned horizontal section — the page keeps scrolling
normally and the row translates on the x-axis at the same time. Much cheaper to
build than a pinned scroller and it does not trap the visitor.

---

## 2. Setup

### 2.1 Provider

```tsx
// src/components/motion/SmoothScrollProvider.tsx
"use client";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const smoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1.1,        // seconds to catch up. 1.0–1.3 is the usable range.
      effects: true,      // enables data-speed / data-lag attributes
      normalizeScroll: true,
    });

    // Recalculate once images have loaded, or every trigger sits in the wrong place.
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    return () => { window.removeEventListener("load", onLoad); smoother.kill(); };
  }, []);

  return (
    <div id="smooth-wrapper">
      <div id="smooth-content">{children}</div>
    </div>
  );
}
```

```css
/* Required by ScrollSmoother. Without these the page will not scroll at all. */
#smooth-wrapper { overflow: hidden; position: fixed; height: 100%; width: 100%; top: 0; left: 0; }
#smooth-content { overflow: visible; width: 100%; }
```

> **Anything `position: fixed` must live outside `#smooth-wrapper`** — the sticky
> header, the enquiry modal, the overlay menu. Inside, it will be transformed with
> the content and appear to drift. This is the single most common ScrollSmoother
> bug.

### 2.2 The reduced-motion rule

Do this once, centrally, rather than checking in every component:

```ts
// src/lib/motion.ts
import gsap from "gsap";

export const prefersReduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function initMotionDefaults() {
  gsap.defaults({ ease: "power3.out", duration: 0.6 });
  if (prefersReduced()) {
    gsap.globalTimeline.timeScale(1000);   // everything lands instantly
    gsap.ticker.lagSmoothing(0);
  }
}
```

---

## 3. The recipes

### 3.1 `reveal.lines` — masked heading reveal

The signature move. Each line rises out of its own clipping box.

```tsx
"use client";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(SplitText, ScrollTrigger, useGSAP);

export function RevealLines({ children, delay = 0, className = "" }) {
  const el = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    SplitText.create(el.current!, {
      type: "lines",
      mask: "lines",        // 3.13+: builds the overflow-hidden wrapper for you
      autoSplit: true,      // re-splits on font load and on resize
      onSplit(self) {
        return gsap.from(self.lines, {
          yPercent: 110,
          duration: 0.8,
          stagger: 0.09,
          ease: "power3.out",
          delay,
          scrollTrigger: { trigger: el.current!, start: "top 85%", once: true },
        });
      },
    });
  }, { scope: el });

  return <div ref={el} className={className}>{children}</div>;
}
```

**Tuning:** `duration` 0.8 for the hero, 0.6 for section headings. `stagger` 0.09.
Never `yPercent` above 120 — beyond that the line appears to fall from off-screen
rather than to rise from behind the mask.

**Why `onSplit` and not a plain call:** with `autoSplit`, the split is thrown away
and rebuilt when the font loads or the window resizes. Returning the tween from
`onSplit` lets GSAP re-create it against the new lines. Animate `self.lines`
directly outside the callback and the animation dies on the first resize.

### 3.2 `reveal.stagger` — card grids

```tsx
useGSAP(() => {
  gsap.from(gridRef.current!.children, {
    y: 26, opacity: 0, duration: 0.55, stagger: 0.07,
    scrollTrigger: { trigger: gridRef.current, start: "top 86%", once: true },
  });
}, { scope: gridRef });
```

`once: true` is not optional. A reveal that replays every time you scroll past
reads as a glitch.

### 3.3 `parallax.layers` — the layered composition

This is the one I got wrong first time. With `effects: true` on ScrollSmoother it
is pure markup — no JavaScript at all.

```tsx
<div className="composition">
  {/* base: moves with the page */}
  <Image src={hero} alt="" data-speed="1" className="layer-base" />

  {/* inset: slower, so it appears further away */}
  <Image src={inset} alt="" data-speed="0.85" className="layer-inset" />

  {/* caption card: faster, so it overtakes both and reads as nearest */}
  <figure data-speed="1.15" className="layer-caption">
    <Image src={polaroid} alt="" />
    <figcaption className="script">Sunrise off Blue Bay</figcaption>
  </figure>
</div>
```

```css
.composition { position: relative; }
.layer-inset   { position: absolute; right: 6%;  bottom: -8%; width: 32%; border-radius: var(--radius-lg); }
.layer-caption { position: absolute; left: 4%;   top: -6%;    width: 20%;
                 background: #fff; padding: 8px 8px 30px; border-radius: 3px;
                 transform: rotate(-6deg); box-shadow: 0 14px 34px rgba(18,34,74,.24); }
```

**The numbers that matter.** Keep every layer inside **0.8 – 1.2**. Below 0.8 the
layer visibly lags behind the page and looks broken; above 1.2 it runs off its own
frame before the section leaves the viewport. The gap between the slowest and
fastest layer should be about **0.3**, which is what reads as depth.

`data-lag="0.3"` on the caption adds a little inertia so it settles a beat after
the rest. Use it on one element per page at most.

### 3.4 `drift.horizontal` — the card row that moves sideways

The effect from section 1.3. The page scrolls normally; the row translates.

```tsx
useGSAP(() => {
  gsap.to(trackRef.current, {
    xPercent: -28,            // how far the row travels across the section
    ease: "none",
    scrollTrigger: {
      trigger: sectionRef.current,
      start: "top bottom",
      end: "bottom top",
      scrub: 0.6,             // slight lag reads more expensive than scrub: true
    },
  });
}, { scope: sectionRef });
```

```css
.track { display: flex; gap: 22px; width: max-content; will-change: transform; }
.track > * { flex: 0 0 clamp(190px, 22vw, 260px); }
.track > *:nth-child(odd)  { transform: rotate(-3deg); }
.track > *:nth-child(even) { transform: rotate(2.5deg); margin-top: 26px; }
```

Start the row overflowing to the right so there is something to travel into.
`xPercent: -28` with eight cards is about right; with four cards use `-15` or the
row runs out. **Do not pin the section.** Pinning hijacks the scroll and is what
makes these sites feel like they have taken your mouse away.

### 3.5 `mask.arch` — the arch crop

```css
.arch {
  border-radius: 999px 999px var(--radius-lg) var(--radius-lg)
               / 46% 46% var(--radius-lg) var(--radius-lg);
  overflow: hidden;
}
```

```tsx
gsap.from(archRef.current, {
  scaleY: 0.82, transformOrigin: "bottom center", ease: "none",
  scrollTrigger: { trigger: archRef.current, start: "top bottom", end: "center 62%", scrub: true },
});
```

The image inside needs `height: 100%; object-fit: cover` or it distorts as the
arch grows. One arch per page.

### 3.6 `marquee.loop` — the seamless strip

```tsx
useGSAP(() => {
  const track = trackRef.current!;
  track.innerHTML += track.innerHTML;             // duplicate for a seamless wrap
  const tween = gsap.to(track, { xPercent: -50, duration: 24, ease: "none", repeat: -1 });
  track.parentElement!.addEventListener("mouseenter", () => tween.timeScale(0.25));
  track.parentElement!.addEventListener("mouseleave", () => tween.timeScale(1));
}, { scope: trackRef });
```

`duration: 24` for a full-width strip. Faster than about 18s and it becomes a
distraction rather than a texture.

**Optional, and worth it:** drive the speed from scroll velocity so the strip
surges as the visitor scrolls.

```ts
ScrollTrigger.create({
  onUpdate: (self) => {
    tween.timeScale(1 + Math.min(Math.abs(self.getVelocity()) / 900, 2.5));
    gsap.to(tween, { timeScale: 1, duration: 0.7, overwrite: true });
  },
});
```

### 3.7 `collage.scatter` — the polaroid stack

```tsx
gsap.from(".pola", {
  y: 46, opacity: 0, duration: 0.6, stagger: 0.12,
  scrollTrigger: { trigger: collageRef.current, start: "top 82%", once: true },
});
```

Rotations live in **CSS**, never in the tween. Animating rotation from 0 to its
resting angle makes the cards look like they are being dealt, which is a different
and much cheaper effect than them simply landing.

### 3.8 `pill.hover` and `header.shrink`

Both are plain CSS. Do not reach for GSAP:

```css
.pill { transition: background .4s cubic-bezier(.22,.7,.3,1), color .4s, border-color .4s; }
.pill svg { transition: transform .5s cubic-bezier(.22,.7,.3,1); }
.pill:hover { background: var(--ink); color: var(--sand); border-color: var(--ink); }
.pill:hover svg { transform: translateX(5px); }
```

```ts
ScrollTrigger.create({
  start: 80,
  onToggle: (self) => header.classList.toggle("small", self.isActive),
});
```

### 3.9 `menu.overlay` — the staggered items

```ts
const tl = gsap.timeline({ paused: true })
  .to(overlay, { autoAlpha: 1, duration: 0.45 })
  .from(items, { y: 28, autoAlpha: 0, duration: 0.5, stagger: 0.06 }, 0.1);
```

`autoAlpha` rather than `opacity`: it sets `visibility: hidden` at zero, so the
closed menu is not a full-screen invisible layer swallowing clicks.

---

## 4. The tuning table

Every number on the site, in one place. Give this to Claude Code and it will stop
inventing durations.

| Effect | Duration | Stagger | Ease | Trigger |
| --- | --- | --- | --- | --- |
| Hero lines | 0.8s | 0.09 | `power3.out` | on load |
| Section heading lines | 0.6s | 0.09 | `power3.out` | `top 85%`, once |
| Card grid | 0.55s | 0.07 | `power3.out` | `top 86%`, once |
| Collage | 0.6s | 0.12 | `power3.out` | `top 82%`, once |
| Menu overlay | 0.45s / 0.5s | 0.06 | `power2.out` | click |
| Modal | 0.4s | — | `power2.out` | click |
| Pill hover | 0.4s / 0.5s | — | `cubic-bezier(.22,.7,.3,1)` | hover |
| Header shrink | 0.35s | — | default | 80px |
| Parallax layers | scrubbed | — | `none` | speeds 0.85 / 1.0 / 1.15 |
| Horizontal drift | scrubbed | — | `none` | `xPercent: -28`, scrub 0.6 |
| Arch grow | scrubbed | — | `none` | `scaleY` 0.82 → 1 |
| Marquee | 24s loop | — | `none` | always |

**Two eases, that is all.** `power3.out` for anything that enters, `none` for
anything scrubbed. A page with six different eases reads as six different people
having built it.

---

## 5. Failure modes

Things that will go wrong, in the order you will hit them.

| Symptom | Cause | Fix |
| --- | --- | --- |
| Page will not scroll | ScrollSmoother wrapper CSS missing | Add the `#smooth-wrapper` / `#smooth-content` rules verbatim |
| Sticky header drifts | It is inside `#smooth-wrapper` | Move every `position: fixed` element outside |
| Triggers fire in the wrong place | Images had no dimensions at init | `ScrollTrigger.refresh()` on `window.load`; explicit width/height on every `next/image` |
| Heading reveal dies after resize | Split not rebuilt | `autoSplit: true` plus the `onSplit` return |
| Text flashes then reveals | Animating `to` from an invisible CSS state | Always `gsap.from()` |
| Reveals replay on scroll up | Missing `once` | `once: true` on every entrance trigger |
| Scrub feels laggy | Eased scrub | `ease: "none"` on everything scrubbed |
| Animations run in dev, die in prod | Registered plugins inside a server component | Every GSAP file starts with `"use client"` |
| Layout shift on load | Web fonts reflowing split lines | `next/font` with `display: swap` plus `autoSplit` |
| Janky on an old phone | Animating layout properties | Only `transform` and `opacity`. Never `top`, `left`, `width`, `height` |

---

## 6. Prompt for Claude Code

Paste this in place of the build plan's W-04, or after it as a correction.

```
Read docs/motion-cookbook.md in full, then rebuild src/components/motion/ to
match it. Specifically:

1. Replace Lenis with GSAP ScrollSmoother. GSAP 3.13 made every plugin free,
   including ScrollSmoother and SplitText, so there is no licensing reason to
   avoid them. Build SmoothScrollProvider exactly as section 2.1 shows,
   including the wrapper CSS, and move the sticky header, the enquiry modal and
   the overlay menu OUTSIDE #smooth-wrapper.

2. Rebuild RevealLines on SplitText with mask: "lines" and autoSplit: true,
   returning the tween from onSplit so it survives font loading and resize.

3. Add two components the earlier spec was missing, both observed in the
   reference recording:
   - <ParallaxComposition> — a layered figure using ScrollSmoother data-speed
     attributes, per section 3.3. Layer speeds stay between 0.8 and 1.2 with
     roughly 0.3 between the slowest and fastest.
   - <DriftTrack> — a horizontally drifting card row driven by vertical scroll,
     per section 3.4. It must NOT pin the section.

4. Apply the tuning table in section 4 to every existing animation. The current
   durations are too slow: the reference site's reveals run 400-700ms, not over
   a second.

5. Use exactly two eases across the whole site: power3.out for entrances,
   none for anything scrubbed.

6. Work through the failure-mode table in section 5 and confirm each row does
   not apply to what you built.

Then run npm run shot on /, /activities and /fleet and look at the screenshots.
Report anything in the table you could not rule out.
```

---

## 7. Where to learn more

| Resource | What it is good for |
| --- | --- |
| [GSAP docs](https://gsap.com/docs/v3/) | The reference. ScrollTrigger and ScrollSmoother pages both have live configurators — change a value, watch the result. |
| [GSAP 3.13 release notes](https://gsap.com/blog/3-13/) | What became free, and the new SplitText features used above. |
| [SplitText docs](https://gsap.com/docs/v3/Plugins/SplitText/) | `mask`, `autoSplit`, `onSplit`. Read this before writing any text animation. |
| [ScrollSmoother docs](https://gsap.com/docs/v3/Plugins/ScrollSmoother/) | `data-speed`, `data-lag`, `effects`. The parallax recipe is all here. |
| [GSAP forums](https://gsap.com/community/forums/) | Unusually good. Post a CodePen and you get a working answer, often from the maintainers. |
| [Codrops](https://tympanus.net/codrops/) | Tutorials with full source for exactly this genre of site. See their [infinite scroll gallery with parallax](https://tympanus.net/codrops/2026/07/30/building-an-infinite-gsap-scroll-gallery-with-parallax-and-flip-transitions/) and [SVG mask transitions on scroll](https://tympanus.net/codrops/2026/03/11/svg-mask-transitions-on-scroll-with-gsap-and-scrolltrigger/). |
| [Codrops parallax tag](https://tympanus.net/codrops/tag/parallax/) | A back catalogue of layered-parallax demos to pull technique from. |
| [@gsap/react](https://gsap.com/resources/React/) | `useGSAP` handles cleanup and scoping in React. Use it rather than `useEffect` for every animation in this project. |
| [Awwwards](https://www.awwwards.com/) | Where the reference site's genre lives. Study the scroll behaviour, not the visuals. |

### Reading a site you like

Open it, then in the console:

```js
// Does it use GSAP, and which plugins?
gsap.version; Object.keys(gsap.plugins ?? {});
// Every ScrollTrigger on the page, with its start and end
ScrollTrigger.getAll().map(t => ({ trigger: t.trigger, start: t.start, end: t.end, scrub: t.vars.scrub }));
```

Most sites in this style ship GSAP unminified enough to read. That tells you more
in two minutes than any amount of guessing from a screen recording — including
this one.
