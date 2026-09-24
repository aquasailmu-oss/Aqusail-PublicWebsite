"use client";

import { useEffect, useRef, type RefObject } from "react";
import { getLenis } from "@/components/motion/gsap";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Shared behaviour for the overlay menu, the enquiry modal and the lightbox:
 * trap focus while open, close on Escape, stop page scroll, and hand focus back
 * to whatever opened it.
 */
export function useDialog(open: boolean, ref: RefObject<HTMLElement | null>, onClose: () => void) {
  const close = useRef(onClose);
  close.current = onClose;

  useEffect(() => {
    if (!open) return;
    const el = ref.current;
    if (!el) return;
    const opener = document.activeElement as HTMLElement | null;
    const focusables = () =>
      Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (n) => !n.closest("[inert]") && n.getClientRects().length > 0,
      );

    const t = window.setTimeout(() => {
      (el.querySelector<HTMLElement>("[data-autofocus]") ?? focusables()[0])?.focus();
    }, 80);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close.current();
        return;
      }
      if (e.key !== "Tab") return;
      const f = focusables();
      if (!f.length) return;
      const first = f[0]!;
      const last = f[f.length - 1]!;
      if (
        e.shiftKey &&
        (document.activeElement === first || !el.contains(document.activeElement))
      ) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    getLenis()?.stop();
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    return () => {
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      getLenis()?.start();
      document.documentElement.style.overflow = prevOverflow;
      opener?.focus?.({ preventScroll: true });
    };
  }, [open, ref]);
}
