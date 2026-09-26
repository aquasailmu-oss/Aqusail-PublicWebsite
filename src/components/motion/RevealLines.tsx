"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, SplitText, useMotion } from "./gsap";

type Props = {
  as?: "h1" | "h2" | "h3" | "p" | "div" | "span";
  className?: string;
  children: ReactNode;
  /** Play on mount instead of on scroll — for hero headings above the fold. */
  immediate?: boolean;
  delay?: number;
  id?: string;
};

/**
 * reveal.lines — each rendered line rises out of its own overflow-hidden mask,
 * 90 ms apart. The text is server-rendered and visible; the split happens in
 * the browser and re-splits on resize and after fonts load.
 */
export function RevealLines({ as = "h2", className, children, immediate, delay = 0, id }: Props) {
  const ref = useRef<HTMLElement>(null);
  const Tag = as as ElementType;

  useMotion(ref, () => {
    const el = ref.current;
    if (!el) return;
    const split = SplitText.create(el, {
      type: "lines",
      mask: "lines",
      linesClass: "rl-line",
      autoSplit: true,
      // aria-label is only allowed on headings here; a split into lines keeps
      // whole words in reading order, so other tags need no ARIA at all.
      aria: /^h[1-6]$/.test(as) ? "auto" : "none",
      onSplit(self) {
        return gsap.from(self.lines, {
          yPercent: 110,
          // docs/motion-cookbook.md §4: 0.8s hero, 0.6s section headings
          duration: immediate ? 0.8 : 0.6,
          stagger: 0.09,
          ease: "power3.out",
          delay,
          scrollTrigger: immediate ? undefined : { trigger: el, start: "top 85%", once: true },
        });
      },
    });
    return () => split.revert();
  });

  return (
    <Tag ref={ref} className={className} id={id}>
      {children}
    </Tag>
  );
}
