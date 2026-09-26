"use client";

import Link from "next/link";
import { useEffect } from "react";
import { SITE } from "@/lib/site";

/**
 * Shown if a page throws while rendering (for example the catalogue cannot be
 * read). The visitor gets a way forward — never a stack trace or error code.
 */
export default function SiteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("page error", error.digest ?? error.message);
  }, [error]);

  return (
    <section className="hero hero-plain not-found">
      <div className="wrap">
        <div className="hero-content">
          <span className="script">Rough water</span>
          <h1 className="disp">This page did not load</h1>
          <p className="sub" style={{ margin: 0 }}>
            Something went wrong on our side. Please try again, or send us an enquiry and reception
            will reply within one working day. You can also email {SITE.email}.
          </p>
          <div className="hero-actions">
            <button type="button" className="pill pill-solid" onClick={reset}>
              Try again
            </button>
            <Link href="/contact" className="pill">
              Contact us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
