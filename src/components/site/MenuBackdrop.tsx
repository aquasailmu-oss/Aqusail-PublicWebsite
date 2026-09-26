"use client";

import Image from "next/image";
import { useEffect, useRef, type CSSProperties } from "react";
import { gsap } from "@/components/motion/gsap";
import { mediaUrl } from "@/lib/media";
import menu from "@/lib/menu-images.json";

export type MenuMode = "images" | "thumbs" | "none";
export type MenuImage = { path: string; scrim: number };

const ITEMS = menu.items as Record<string, MenuImage>;
export const menuImageFor = (href: string): MenuImage | undefined => ITEMS[href];

/**
 * Which hover treatment this visitor gets (docs/continuous-flow.md §6):
 * full-bleed photographs on a desktop pointer, thumbnails on touch or small
 * screens, and nothing but the neutral gradient on save-data or reduced motion.
 */
export function menuMode(): MenuMode {
  const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
  if (nav.connection?.saveData || matchMedia("(prefers-reduced-motion: reduce)").matches)
    return "none";
  if (window.innerWidth < 900 || matchMedia("(hover: none)").matches) return "thumbs";
  return "images";
}

/**
 * The image stack behind the overlay menu. Every photograph is rendered once,
 * stacked, and crossfaded — never a swapped src, which flashes empty on first
 * hover. Mounted only after the menu first opens, so the large images load
 * then and not with the page.
 */
export function MenuBackdrop({ hrefs, active }: { hrefs: string[]; active: string | null }) {
  const ref = useRef<HTMLDivElement>(null);
  const kenBurns = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const layers = el.querySelectorAll<HTMLElement>("[data-href]");
    layers.forEach((layer) => {
      const on = layer.dataset.href === active;
      gsap.to(layer, {
        autoAlpha: on ? 1 : 0,
        duration: active === null ? 0.8 : 0.6,
        ease: "power2.out",
        overwrite: "auto",
      });
    });
    const scrim = el.querySelector(".menu-scrim");
    if (scrim) {
      gsap.to(scrim, {
        autoAlpha: active ? 1 : 0,
        duration: active === null ? 0.8 : 0.6,
        ease: "power2.out",
        overwrite: "auto",
      });
    }
    // Ken Burns on the active photograph only, so a held hover stays alive.
    kenBurns.current?.kill();
    const img = active ? el.querySelector(`[data-href="${active}"] img`) : null;
    if (img)
      kenBurns.current = gsap.fromTo(img, { scale: 1 }, { scale: 1.07, duration: 8, ease: "none" });
  }, [active]);

  const k = active ? (ITEMS[active]?.scrim ?? 1) : 1;

  return (
    <div ref={ref} className="menu-backdrop" aria-hidden="true">
      {hrefs.map((href) => {
        const item = ITEMS[href];
        if (!item) return null;
        return (
          <div key={href} className="menu-photo" data-href={href}>
            <Image
              src={mediaUrl(item.path).src}
              alt=""
              fill
              sizes="100vw"
              quality={62}
              loading="eager"
            />
          </div>
        );
      })}
      <div className="menu-scrim" style={{ "--k": k } as CSSProperties} />
    </div>
  );
}

/** Touch and small screens: a thumbnail beside the item when it has focus. */
export function MenuThumb({ href }: { href: string }) {
  const item = ITEMS[href];
  if (!item) return null;
  return (
    <span className="mi-thumb" aria-hidden="true">
      <Image src={mediaUrl(item.path).src} alt="" fill sizes="96px" />
    </span>
  );
}
