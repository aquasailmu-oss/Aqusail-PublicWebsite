"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, useMotion } from "./gsap";

type Props = {
  as?: "div" | "ul" | "ol" | "section";
  className?: string;
  children: ReactNode;
  /** Animate these descendants instead of the direct children. */
  selector?: string;
  start?: string;
};

/**
 * reveal.stagger — children fade up 26px, 70 ms apart, once, when the group
 * reaches 86% of the viewport. Never replays on scroll back.
 */
export function RevealGroup({
  as = "div",
  className,
  children,
  selector,
  start = "top 86%",
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const Tag = as as ElementType;

  useMotion(ref, () => {
    const el = ref.current;
    if (!el) return;
    const items = selector ? el.querySelectorAll(selector) : el.children;
    if (!items.length) return;
    gsap.from(items, {
      y: 26,
      opacity: 0,
      duration: 0.55,
      stagger: 0.07,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start, once: true },
    });
  });

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
