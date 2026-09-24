"use client";

import Image from "next/image";
import { useRef, type CSSProperties } from "react";
import { mediaUrl } from "@/lib/media";
import { gsap, useMotion } from "./gsap";

export type CollageItem = {
  path: string;
  alt: string;
  caption?: string;
  /** Position and size as percentages of the collage box; rotation in degrees. */
  x: number;
  y: number;
  w: number;
  r: number;
};

/**
 * collage.scatter — a polaroid stack. Rotations live in CSS; the entrance only
 * animates y and opacity, 120 ms apart, and each print drifts a few degrees as
 * the page scrolls. Use once on About and once as a gallery teaser.
 */
export function Collage({ items, className = "" }: { items: CollageItem[]; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useMotion(ref, () => {
    const el = ref.current;
    if (!el) return;
    const prints = gsap.utils.toArray<HTMLElement>(".pola", el);
    gsap.from(prints, {
      y: 46,
      opacity: 0,
      duration: 0.6,
      stagger: 0.12,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 82%", once: true },
    });
    prints.forEach((p, i) => {
      const d = i % 2 ? 3 : -3;
      gsap.fromTo(
        p,
        { "--drift": `${-d}deg` },
        {
          "--drift": `${d}deg`,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    });
  });

  return (
    <div ref={ref} className={`collage ${className}`}>
      {items.map((it) => {
        const img = mediaUrl(it.path);
        return (
          <figure
            key={it.path}
            className="pola"
            style={
              {
                left: `${it.x}%`,
                top: `${it.y}%`,
                "--w": `${it.w}%`,
                "--r": `${it.r}deg`,
              } as CSSProperties
            }
          >
            <div className="pola-img">
              <Image src={img.src} alt={it.alt} fill sizes="(max-width: 860px) 50vw, 25vw" />
            </div>
            {it.caption ? <figcaption>{it.caption}</figcaption> : null}
          </figure>
        );
      })}
    </div>
  );
}
