"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { RevealGroup } from "@/components/motion";
import type { GalleryItem } from "@/lib/database.types";
import { mediaUrl } from "@/lib/media";
import { useDialog } from "./useDialog";

type Props = {
  items: (GalleryItem & { category?: string })[];
  layout?: "strip" | "masonry";
  filters?: boolean;
};

/**
 * Photo grid with a keyboard-navigable lightbox: arrow keys move, Escape
 * closes, focus is trapped and handed back to the thumbnail that opened it.
 */
export function Gallery({ items, layout = "strip", filters }: Props) {
  const [cat, setCat] = useState<string>("All");
  const [index, setIndex] = useState<number | null>(null);
  const cats = [
    "All",
    ...Array.from(new Set(items.map((i) => i.category).filter(Boolean) as string[])),
  ];
  const shown = cat === "All" ? items : items.filter((i) => i.category === cat);
  const ref = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setIndex(null), []);
  useDialog(index !== null, ref, close);

  const step = useCallback(
    (d: number) => setIndex((i) => (i === null ? i : (i + d + shown.length) % shown.length)),
    [shown.length],
  );

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [index, step]);

  const current = index !== null ? shown[index] : undefined;

  return (
    <>
      {filters && cats.length > 2 ? (
        <div className="chips" role="group" aria-label="Filter photos">
          {cats.map((c) => (
            <button
              key={c}
              type="button"
              className="chip"
              aria-pressed={cat === c}
              onClick={() => setCat(c)}
            >
              {c}
            </button>
          ))}
        </div>
      ) : null}
      <RevealGroup key={cat} className={layout === "masonry" ? "masonry" : "gallery-strip"}>
        {shown.map((it, i) => {
          const img = mediaUrl(it.path);
          return (
            <button
              key={it.path + i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Open photo: ${it.alt}`}
              style={
                layout === "masonry" ? { aspectRatio: `${img.width} / ${img.height}` } : undefined
              }
            >
              <Image
                src={img.src}
                alt={it.alt}
                fill
                sizes={
                  layout === "masonry"
                    ? "(max-width: 700px) 100vw, 33vw"
                    : "(max-width: 700px) 100vw, 300px"
                }
              />
            </button>
          );
        })}
      </RevealGroup>

      {index !== null && current ? (
        <div
          ref={ref}
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          data-lenis-prevent
        >
          <div className="lightbox-top">
            <span>
              {index + 1} / {shown.length}
            </span>
            <button type="button" className="pill pill-sm" onClick={close} data-autofocus>
              Close
            </button>
          </div>
          <div className="lightbox-stage">
            <Image src={mediaUrl(current.path).src} alt={current.alt} fill sizes="100vw" />
          </div>
          <div className="lightbox-foot">
            <button
              type="button"
              className="pill pill-sm"
              onClick={() => step(-1)}
              aria-label="Previous photo"
            >
              Prev
            </button>
            <span aria-live="polite" style={{ textAlign: "center" }}>
              {current.alt}
            </span>
            <button
              type="button"
              className="pill pill-sm"
              onClick={() => step(1)}
              aria-label="Next photo"
            >
              Next
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
