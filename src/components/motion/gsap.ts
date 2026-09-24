"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import type Lenis from "lenis";
import type { RefObject } from "react";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

export { gsap, ScrollTrigger, SplitText };

/* The one Lenis instance, so dialogs can stop page scroll while open. */
let lenis: Lenis | null = null;
export const setLenis = (l: Lenis | null) => void (lenis = l);
export const getLenis = () => lenis;

/**
 * Run motion only when the visitor has not asked for reduced motion. Under
 * reduced motion nothing runs at all, so the DOM keeps its visible resting
 * state. Everything created inside is reverted on unmount.
 */
export function useMotion(
  scope: RefObject<HTMLElement | null>,
  setup: () => void | (() => void),
  dependencies: unknown[] = [],
) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => setup());
      return () => mm.revert();
    },
    { scope, dependencies },
  );
}
