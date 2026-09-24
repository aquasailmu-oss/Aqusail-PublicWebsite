"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { gsap, ScrollTrigger, setLenis } from "./gsap";

/**
 * Lenis smooth scroll, driven by GSAP's ticker so ScrollTrigger stays in step.
 * Fully disabled under prefers-reduced-motion. Also refreshes ScrollTrigger
 * positions whenever an image finishes loading, so triggers below tall images
 * are not measured against a collapsed layout.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 1 });
    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const onLoad = (e: Event) => {
      if (!(e.target instanceof HTMLImageElement)) return;
      clearTimeout(t);
      t = setTimeout(() => ScrollTrigger.refresh(), 200);
    };
    document.addEventListener("load", onLoad, true);
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    return () => {
      clearTimeout(t);
      document.removeEventListener("load", onLoad, true);
    };
  }, []);

  return null;
}
