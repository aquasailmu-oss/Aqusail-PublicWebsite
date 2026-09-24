"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useMotion } from "./gsap";

type Props = { children: ReactNode; className?: string; caption?: string };

/**
 * mask.arch — one per page at most. The arch grows from 78% to full height out
 * of its own floor as it enters. The image inside is counter-scaled so the
 * photograph itself is never squashed.
 */
export function ArchImage({ children, className = "", caption }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useMotion(ref, () => {
    const el = ref.current;
    const inner = el?.firstElementChild;
    if (!el || !inner) return;
    const scrollTrigger = { trigger: el, start: "top bottom", end: "center 62%", scrub: true };
    gsap.fromTo(
      el,
      { scaleY: 0.82, transformOrigin: "bottom center" },
      { scaleY: 1, ease: "none", scrollTrigger },
    );
    gsap.fromTo(
      inner,
      { scaleY: 1 / 0.82, transformOrigin: "bottom center" },
      { scaleY: 1, ease: "none", scrollTrigger },
    );
  });

  return (
    <figure className={className} style={{ margin: 0 }}>
      <div ref={ref} className="arch">
        <div className="arch-inner">{children}</div>
      </div>
      {caption ? <figcaption className="arch-caption">{caption}</figcaption> : null}
    </figure>
  );
}
