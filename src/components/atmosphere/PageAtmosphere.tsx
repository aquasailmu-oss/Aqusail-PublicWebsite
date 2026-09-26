"use client";

import { useGSAP } from "@gsap/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/components/motion/gsap";
import { atmosphereFor, type Atmosphere } from "@/lib/atmosphere";
import { CraftSvg, type CraftKind } from "./Craft";
import { Haze } from "./Haze";

/**
 * One continuous background per page — docs/continuous-flow.md §2–§5.
 *
 * Sections paint nothing. Behind them sits a fixed layer whose gradient ramp
 * holds the page's whole journey, three viewports tall, and slides up as the
 * visitor scrolls: a continuous descent with no step anywhere, animated by
 * transform alone. Haze and craft sit on top of the ramp, behind all content.
 */
export function AtmosphereShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const atm = atmosphereFor(pathname);
  return (
    <div className="shell" data-tone={atm.tone} data-atmos={atm.key}>
      <PageAtmosphere key={pathname} atm={atm} />
      {children}
    </div>
  );
}

/** The budget's kill switches (§7): below this bar, the gradient only. */
function isHeavy(): boolean {
  const nav = navigator as Navigator & {
    connection?: { saveData?: boolean };
    deviceMemory?: number;
  };
  return (
    !matchMedia("(prefers-reduced-motion: reduce)").matches &&
    !nav.connection?.saveData &&
    window.innerWidth >= 900 &&
    (nav.deviceMemory ?? 8) >= 4
  );
}

type Crossing = {
  kind: CraftKind;
  from: number;
  to: number;
  top: string;
  width: string;
  dir: 1 | -1;
};

const CROSSINGS: Partial<Record<Atmosphere["craft"], Crossing[]>> = {
  // catamaran L→R centred on 35% depth; speed boat R→L centred on 72%
  home: [
    { kind: "catamaran", from: 0.2, to: 0.5, top: "56%", width: "15vw", dir: 1 },
    { kind: "speedboat", from: 0.6, to: 0.84, top: "70%", width: "11vw", dir: -1 },
  ],
  // one catamaran across the whole day, slowly
  experiences: [{ kind: "catamaran", from: 0.02, to: 0.98, top: "62%", width: "12vw", dir: 1 }],
  // one small boat, very slow, single crossing
  contact: [{ kind: "pirogue", from: 0.0, to: 1, top: "74%", width: "9vw", dir: 1 }],
};

function PageAtmosphere({ atm }: { atm: Atmosphere }) {
  const ref = useRef<HTMLDivElement>(null);
  const [heavy, setHeavy] = useState(false);
  useEffect(() => setHeavy(isHeavy()), []);

  const crossings = CROSSINGS[atm.craft] ?? [];

  useGSAP(
    () => {
      const el = ref.current;
      const ramp = el?.querySelector<HTMLElement>(".atmos-ramp");
      if (!el || !ramp) return;
      const mm = gsap.matchMedia();

      mm.add(
        {
          reduce: "(prefers-reduced-motion: reduce)",
          ok: "(prefers-reduced-motion: no-preference)",
        },
        (ctx) => {
          // Reduced motion: the static mid-page state, and nothing moves.
          if (ctx.conditions?.reduce) {
            gsap.set(ramp, { yPercent: -100 / 3 });
            return;
          }
          const page = { start: 0, end: "max", invalidateOnRefresh: true } as const;

          // The ramp: three viewports of journey, one viewport visible.
          gsap.fromTo(
            ramp,
            { yPercent: 0 },
            { yPercent: -200 / 3, ease: "none", scrollTrigger: { ...page, scrub: 1.2 } },
          );
          if (!heavy) return;

          // One page-progress timeline (duration 1 = the whole page) for
          // everything positioned by depth.
          const tl = gsap.timeline({ scrollTrigger: { ...page, scrub: true } });
          tl.set({}, {}, 1);

          el.querySelectorAll<HTMLElement>(".haze-layer, .haze-glint").forEach((layer, i) => {
            const speed = Number(layer.dataset.speed ?? 0.8);
            tl.fromTo(
              layer,
              { yPercent: 0 },
              { yPercent: -8 * speed, ease: "none", duration: 1 },
              0,
            );
            const drift = Number(layer.dataset.drift ?? 0);
            if (drift) {
              gsap.to(layer, {
                xPercent: i % 2 ? -6 : 6,
                duration: drift,
                yoyo: true,
                repeat: -1,
                ease: "sine.inOut",
              });
            }
          });
          // Special layers fade up to their OWN resting opacity (0.05–0.14),
          // never to 1: they sit behind text.
          const fadeIn = (sel: string, at: number, dur: number) => {
            const layer = el.querySelector<HTMLElement>(sel);
            if (!layer) return;
            const rest = Number(getComputedStyle(layer).opacity) || 0.1;
            tl.fromTo(
              layer,
              { autoAlpha: 0 },
              { autoAlpha: rest, ease: "none", duration: dur },
              at,
            );
          };
          fadeIn(".haze-warm", 0.55, 0.25);
          fadeIn(".haze-caustics", 0.45, 0.2);

          // Boats: travel, perspective and fade scrubbed to depth; bob free-running.
          el.querySelectorAll<HTMLElement>(".craft[data-from]").forEach((boat) => {
            const from = Number(boat.dataset.from);
            const to = Number(boat.dataset.to);
            const dir = Number(boat.dataset.dir);
            const span = to - from;
            const w = () => boat.offsetWidth;
            const start = () => (dir > 0 ? -0.25 * innerWidth : 1.25 * innerWidth - w());
            const end = () => (dir > 0 ? 1.25 * innerWidth - w() : -0.25 * innerWidth);
            tl.fromTo(boat, { x: start }, { x: end, ease: "none", duration: span }, from);
            tl.fromTo(
              boat,
              { scale: 0.86 },
              { scale: 1.06, ease: "none", duration: span / 2 },
              from,
            );
            tl.to(boat, { scale: 0.9, ease: "none", duration: span / 2 }, from + span / 2);
            tl.fromTo(
              boat,
              { autoAlpha: 0 },
              { autoAlpha: 1, ease: "none", duration: span * 0.12 },
              from,
            );
            tl.to(boat, { autoAlpha: 0, ease: "none", duration: span * 0.12 }, to - span * 0.12);
            bob(boat);
          });

          // Activities: a parasail rising through the upper third…
          const sail = el.querySelector<HTMLElement>(".craft-parasail");
          if (sail) {
            tl.fromTo(
              sail,
              { y: () => innerHeight * 0.72, x: () => innerWidth * 0.58 },
              {
                y: () => innerHeight * 0.06,
                x: () => innerWidth * 0.66,
                ease: "none",
                duration: 0.33,
              },
              0,
            );
            tl.fromTo(sail, { autoAlpha: 0 }, { autoAlpha: 1, ease: "none", duration: 0.04 }, 0.01);
            tl.to(sail, { autoAlpha: 0, ease: "none", duration: 0.05 }, 0.3);
            bob(sail);
          }
          // …then bubbles from 60% down, rising on their own loop.
          const bubbles = el.querySelector<HTMLElement>(".craft-bubbles");
          if (bubbles) {
            tl.fromTo(
              bubbles,
              { autoAlpha: 0 },
              { autoAlpha: 0.6, ease: "none", duration: 0.08 },
              0.56,
            );
            gsap.fromTo(
              bubbles.firstElementChild,
              { yPercent: 0 },
              { yPercent: -50, duration: 38, ease: "none", repeat: -1 },
            );
          }

          // Wake: stretches with scroll speed.
          const wakes = gsap.utils
            .toArray<HTMLElement>(".craft-wake", el)
            .map((w) => gsap.quickTo(w, "scaleX", { duration: 0.5, ease: "power3.out" }));
          if (wakes.length) {
            ScrollTrigger.create({
              ...page,
              onUpdate: (self) => {
                const s = 0.7 + Math.min(Math.abs(self.getVelocity()) / 1400, 1.3);
                wakes.forEach((q) => q(s));
              },
            });
          }

          // Fleet: each vessel's silhouette drifts in with its row, then out.
          document.querySelectorAll<HTMLElement>("[data-craft]").forEach((row) => {
            const boat = el.querySelector<HTMLElement>(
              `.craft-fleet[data-kind="${row.dataset.craft}"]`,
            );
            if (!boat) return;
            gsap
              .timeline({
                scrollTrigger: {
                  trigger: row,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true,
                },
              })
              .fromTo(
                boat,
                { x: () => innerWidth * 1.05, autoAlpha: 0 },
                { x: () => innerWidth * 0.5, autoAlpha: 1, ease: "none", duration: 0.5 },
              )
              .to(boat, { x: () => -innerWidth * 0.3, autoAlpha: 0, ease: "none", duration: 0.5 });
          });
        },
      );
      return () => mm.revert();
    },
    { scope: ref, dependencies: [heavy] },
  );

  const stops = atm.stops.join(", ");
  const fleetKinds: CraftKind[] = ["catamaran", "powercat", "speedboat"];

  return (
    <div ref={ref} className="atmosphere" aria-hidden="true">
      <div className="atmos-gradient">
        <div
          className="atmos-ramp"
          style={{ backgroundImage: `linear-gradient(180deg, ${stops})` }}
        />
        <div className="atmos-vignette" />
      </div>
      {heavy ? (
        <>
          <div className="atmos-haze">
            <Haze preset={atm.haze} />
          </div>
          <div className="atmos-craft">
            {crossings.map((c, i) => (
              <div
                key={i}
                className="craft"
                data-from={c.from}
                data-to={c.to}
                data-dir={c.dir}
                style={{ top: c.top, width: c.width }}
              >
                <div className="craft-bob" style={c.dir < 0 ? { scale: "-1 1" } : undefined}>
                  <span className="craft-wake" />
                  <CraftSvg kind={c.kind} />
                </div>
              </div>
            ))}
            {atm.craft === "activities" ? (
              <>
                <div className="craft craft-parasail">
                  <div className="craft-bob">
                    <CraftSvg kind="parasail" />
                  </div>
                </div>
                <Bubbles />
              </>
            ) : null}
            {atm.craft === "fleet"
              ? fleetKinds.map((k) => (
                  <div key={k} className="craft craft-fleet" data-kind={k}>
                    <div className="craft-bob">
                      <span className="craft-wake" />
                      <CraftSvg kind={k} />
                    </div>
                  </div>
                ))
              : null}
          </div>
        </>
      ) : null}
    </div>
  );
}

/** bob: independent of scroll so the boat stays alive when the page is still. */
function bob(boat: HTMLElement) {
  const inner = boat.querySelector(".craft-bob");
  if (!inner) return;
  gsap.fromTo(
    inner,
    { y: -6, rotation: -1.5 },
    { y: 6, rotation: 1.5, duration: 2.8, yoyo: true, repeat: -1, ease: "sine.inOut" },
  );
}

/** A column of bubbles, twice the viewport tall so the loop wraps unseen. */
function Bubbles() {
  const dots: { cx: number; cy: number; r: number }[] = [];
  let seed = 7;
  const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  for (let i = 0; i < 26; i++) {
    const d = { cx: rnd() * 100, cy: rnd() * 50, r: 0.18 + rnd() * 0.5 };
    dots.push(d, { ...d, cy: d.cy + 50 });
  }
  return (
    <div className="craft-bubbles">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        {dots.map((d, i) => (
          <ellipse key={i} cx={d.cx} cy={d.cy} rx={d.r} ry={d.r * 0.8} />
        ))}
      </svg>
    </div>
  );
}
