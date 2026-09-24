"use client";

import { useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger, useMotion } from "./gsap";

type Props = { children: ReactNode; className?: string; seconds?: number; label?: string };

/**
 * marquee.loop — the content is rendered twice and the track translates by
 * −50%, linear and infinite, so the loop has no jump. Per the motion cookbook
 * (§3.6) it slows to a quarter speed on hover and surges with scroll velocity.
 * It stops entirely while keyboard focus is inside, and does not move at all
 * under reduced motion.
 */
export function Marquee({ children, className = "", seconds = 24, label }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useMotion(ref, () => {
    const el = ref.current;
    const track = el?.firstElementChild;
    if (!el || !track) return;
    const tween = gsap.to(track, { xPercent: -50, duration: seconds, ease: "none", repeat: -1 });
    let base = 1;
    const settle = () =>
      gsap.to(tween, { timeScale: base, duration: 0.7, ease: "none", overwrite: true });
    const slow = () => ((base = 0.25), settle());
    const resume = () => ((base = 1), settle());
    const pause = () => tween.pause();
    const play = () => tween.play();
    el.addEventListener("mouseenter", slow);
    el.addEventListener("mouseleave", resume);
    el.addEventListener("focusin", pause);
    el.addEventListener("focusout", play);
    const surge = ScrollTrigger.create({
      trigger: el,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        tween.timeScale(base * (1 + Math.min(Math.abs(self.getVelocity()) / 900, 2.5)));
        settle();
      },
    });
    return () => {
      surge.kill();
      el.removeEventListener("mouseenter", slow);
      el.removeEventListener("mouseleave", resume);
      el.removeEventListener("focusin", pause);
      el.removeEventListener("focusout", play);
    };
  });

  return (
    <div
      ref={ref}
      className={`marquee ${className}`}
      aria-label={label}
      role={label ? "region" : undefined}
    >
      <div className="marquee-track">
        <div className="marquee-group">{children}</div>
        <div className="marquee-group" aria-hidden="true" inert>
          {children}
        </div>
      </div>
    </div>
  );
}
