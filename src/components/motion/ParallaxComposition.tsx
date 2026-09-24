"use client";

import Image from "next/image";
import { useRef } from "react";
import { mediaUrl } from "@/lib/media";
import { gsap, useMotion } from "./gsap";

type Layer = { path: string; alt: string };

type Props = {
  base: Layer;
  inset: Layer;
  caption: Layer & { text: string };
  className?: string;
};

/**
 * parallax.layers — docs/motion-cookbook.md §3.3. Three images moving at
 * different rates inside one frame: the base at 1.0, an inset at 0.85 (reads
 * as further away) and a polaroid caption at 1.15 (overtakes both, reads as
 * nearest). The speeds are carried as data-speed, as in the cookbook, but
 * driven by ScrollTrigger because the site scrolls with Lenis rather than
 * ScrollSmoother. The caption settles a beat late (the cookbook's data-lag).
 */
export function ParallaxComposition({ base, inset, caption, className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useMotion(ref, () => {
    const el = ref.current;
    if (!el) return;
    const travel = () => window.innerHeight + el.offsetHeight;
    el.querySelectorAll<HTMLElement>("[data-speed]").forEach((layer) => {
      const speed = Number(layer.dataset.speed);
      if (!speed || speed === 1) return;
      const lag = Number(layer.dataset.lag ?? 0);
      // A layer at speed s moves (1 − s) × scroll relative to its frame.
      gsap.fromTo(
        layer,
        { y: () => ((1 - speed) * -travel()) / 2 },
        {
          y: () => ((1 - speed) * travel()) / 2,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: lag || true,
            invalidateOnRefresh: true,
          },
        },
      );
    });
  });

  const b = mediaUrl(base.path);
  const i = mediaUrl(inset.path);
  const c = mediaUrl(caption.path);

  return (
    <div ref={ref} className={`composition ${className}`}>
      <div className="layer-base" data-speed="1">
        <Image src={b.src} alt={base.alt} fill sizes="(max-width: 860px) 92vw, 50vw" />
      </div>
      <div className="layer-inset" data-speed="0.85">
        <Image src={i.src} alt={inset.alt} fill sizes="(max-width: 860px) 36vw, 18vw" />
      </div>
      <figure className="layer-caption" data-speed="1.15" data-lag="0.3">
        <div className="layer-caption-img">
          <Image src={c.src} alt={caption.alt} fill sizes="(max-width: 860px) 30vw, 14vw" />
        </div>
        <figcaption>{caption.text}</figcaption>
      </figure>
    </div>
  );
}
