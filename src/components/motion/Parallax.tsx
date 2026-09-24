"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import { gsap, useMotion } from "./gsap";

type Props = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Total drift as a percentage of the inner layer's height. 12–18 per the spec. */
  amount?: number;
  /** Hero media starts at rest and only drifts as the page scrolls away. */
  hero?: boolean;
};

/**
 * parallax.drift — the image layer is taller than its frame and drifts slower
 * than the page. Scrubbed and linear; never used on cards.
 */
export function Parallax({ children, className = "", style, amount = 14, hero }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useMotion(ref, () => {
    const el = ref.current;
    const inner = el?.firstElementChild;
    if (!el || !inner) return;
    const range = hero ? [0, amount] : [-amount / 2, amount / 2];
    gsap.fromTo(
      inner,
      { yPercent: range[0] },
      {
        yPercent: range[1],
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: hero ? "top top" : "top bottom",
          end: "bottom top",
          scrub: true,
        },
      },
    );
  });

  return (
    <div ref={ref} className={`plx ${className}`} style={style}>
      <div className="plx-inner">{children}</div>
    </div>
  );
}
