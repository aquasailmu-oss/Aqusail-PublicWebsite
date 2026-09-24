"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { mediaUrl } from "@/lib/media";
import { gsap, useMotion } from "./gsap";

export type DriftItem = { path: string; alt: string; caption: string; href?: string };

/**
 * drift.horizontal — docs/motion-cookbook.md §3.4. A row of polaroids that
 * travels right-to-left while the page scrolls down normally. It is NOT
 * pinned: the visitor keeps full control of the scroll. The row starts
 * overflowing to the right so there is something to travel into.
 */
export function DriftTrack({ items, travel }: { items: DriftItem[]; travel?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  // Cookbook: −28 with eight cards, −15 with four.
  const xPercent = travel ?? (items.length >= 7 ? -28 : -15);

  useMotion(ref, () => {
    const el = ref.current;
    const track = el?.firstElementChild;
    if (!el || !track) return;
    gsap.to(track, {
      xPercent,
      ease: "none",
      scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.6 },
    });
  });

  return (
    <div ref={ref} className="drift">
      <ul className="drift-track">
        {items.map((it) => {
          const img = mediaUrl(it.path);
          const card = (
            <>
              <div className="drift-img">
                <Image src={img.src} alt={it.alt} fill sizes="(max-width: 700px) 60vw, 260px" />
              </div>
              <span className="drift-cap">{it.caption}</span>
            </>
          );
          return (
            <li key={it.path} className="drift-card">
              {it.href ? <Link href={it.href}>{card}</Link> : card}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
