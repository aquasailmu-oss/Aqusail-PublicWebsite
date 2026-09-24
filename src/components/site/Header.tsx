"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { NAV, SITE } from "@/lib/site";
import { gsap } from "@/components/motion/gsap";
import { Logo, Wave } from "./Brand";
import { EnquireButton } from "./Enquiry";
import { useDialog } from "./useDialog";

/**
 * header.shrink — sticky, never hides. Past 80px it tightens and takes a
 * translucent ground so the Enquire pill is always within reach.
 */
export function Header() {
  const [small, setSmall] = useState(false);
  const [menu, setMenu] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const on = () => setSmall(window.scrollY > 80);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  // Close the menu on navigation.
  useEffect(() => setMenu(false), [pathname]);

  return (
    <>
      <header className={`topbar over-dark${small ? " is-small" : ""}`}>
        <div>
          <button
            type="button"
            className="pill"
            aria-haspopup="dialog"
            aria-expanded={menu}
            aria-controls="site-menu"
            onClick={() => setMenu(true)}
          >
            <Wave />
            Menu
          </button>
        </div>
        <Link href="/" className="logo-link" aria-label="AquaSail Watersports — home">
          <Logo />
          <span className="logo-compact" aria-hidden="true">
            <Wave />
            AquaSail
          </span>
        </Link>
        <EnquireButton interest={{ type: "general", label: "General enquiry" }} />
      </header>
      <OverlayMenu open={menu} onClose={() => setMenu(false)} pathname={pathname} />
    </>
  );
}

function OverlayMenu({
  open,
  onClose,
  pathname,
}: {
  open: boolean;
  onClose: () => void;
  pathname: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useDialog(open, ref, onClose);

  useEffect(() => {
    if (!open || !ref.current) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const tween = gsap.from(ref.current.querySelectorAll("[data-mi]"), {
      y: 26,
      opacity: 0,
      duration: 0.5,
      stagger: 0.06,
      ease: "power3.out",
      delay: 0.08,
    });
    return () => void tween.revert();
  }, [open]);

  return (
    <div
      ref={ref}
      id="site-menu"
      className={`ov on-dark${open ? " is-open" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      inert={!open}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      data-lenis-prevent
    >
      <div className="ov-top">
        <button type="button" className="pill" onClick={onClose}>
          Close
        </button>
        <Link href="/" className="logo-link" aria-label="Home" onClick={onClose}>
          <Logo className="logo" />
        </Link>
        <span style={{ width: 90 }} aria-hidden="true" />
      </div>
      <div className="ov-body">
        <nav aria-label="Main">
          <ul>
            {NAV.map((item, i) => (
              <li key={item.href} data-mi>
                <Link
                  href={item.href}
                  aria-current={pathname.startsWith(item.href) ? "page" : undefined}
                  onClick={onClose}
                >
                  <em>{String(i + 1).padStart(2, "0")}</em>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <aside className="ov-aside" data-mi>
          <span className="script">Plan your day</span>
          <p style={{ margin: 0, maxWidth: "36ch" }}>
            Tell us what you would like to do and when. We reply within one working day with
            availability and a quote.
          </p>
          <div>
            <EnquireButton interest={{ type: "general", label: "General enquiry" }} wave>
              Send an enquiry
            </EnquireButton>
          </div>
          <p style={{ margin: 0 }}>
            <span className="label-caps" style={{ color: "var(--foam)" }}>
              Email
            </span>
            <br />
            <span style={{ userSelect: "all", color: "var(--on-dark)" }}>{SITE.email}</span>
          </p>
        </aside>
      </div>
      <div className="ov-foot">
        <span>{SITE.legalName} · Mauritius</span>
        <span>Enquiries, never bookings — reception confirms every trip.</span>
      </div>
    </div>
  );
}
