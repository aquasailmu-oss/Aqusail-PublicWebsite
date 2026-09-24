"use client";

import { useState } from "react";

/** Phone numbers are shown as selectable text; this is a convenience on top. */
export function CopyText({ text, label }: { text: string; label: string }) {
  const [done, setDone] = useState(false);
  return (
    <span className="copyable">
      <span>{text}</span>
      <button
        type="button"
        className="copy-btn"
        aria-label={`Copy ${label}`}
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(text);
            setDone(true);
            setTimeout(() => setDone(false), 1800);
          } catch {
            /* selection still works */
          }
        }}
      >
        {done ? "Copied" : "Copy"}
      </button>
      <span className="sr-only" aria-live="polite">
        {done ? `${label} copied` : ""}
      </span>
    </span>
  );
}
