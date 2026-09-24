import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Parallax, RevealLines } from "@/components/motion";
import { mediaUrl } from "@/lib/media";
import { SITE } from "@/lib/site";
import { Wave, WhatsAppIcon } from "./Brand";
import { EnquireButton } from "./Enquiry";
import type { Interest } from "./EnquiryForm";

/** next/image over a catalogue path, filling a sized parent. */
export function Photo({
  path,
  alt,
  sizes = "100vw",
  priority,
}: {
  path: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
}) {
  const img = mediaUrl(path);
  return <Image src={img.src} alt={alt} fill sizes={sizes} priority={priority} quality={78} />;
}

type HeroProps = {
  script?: string;
  title: string;
  lede?: ReactNode;
  image?: { path: string; alt: string };
  crumbs?: { href: string; label: string }[];
  children?: ReactNode;
  home?: boolean;
};

/** Ink hero with an optional full-bleed image drifting behind it. */
export function PageHero({ script, title, lede, image, crumbs, children, home }: HeroProps) {
  return (
    <header
      className={`hero on-dark ${home ? "hero-home" : "hero-page"} ${image ? "" : "hero-plain"}`}
    >
      {image ? (
        <Parallax className="hero-media" hero amount={12}>
          <Photo path={image.path} alt={image.alt} priority />
        </Parallax>
      ) : null}
      <div className="wrap">
        <div className="hero-content">
          {crumbs ? (
            <nav aria-label="Breadcrumb" className="crumbs">
              {crumbs.map((c) => (
                <span key={c.href}>
                  <Link href={c.href}>{c.label}</Link> <span aria-hidden="true">/</span>
                </span>
              ))}
            </nav>
          ) : null}
          {script ? <span className="script">{script}</span> : null}
          <RevealLines as="h1" className="disp" immediate>
            {title}
          </RevealLines>
          {lede ? <div className="sub">{lede}</div> : null}
          {children}
        </div>
      </div>
    </header>
  );
}

export function SectionHead({
  eyebrow,
  script,
  title,
  sub,
  aside,
  id,
}: {
  eyebrow?: string;
  script?: string;
  title: string;
  sub?: ReactNode;
  aside?: ReactNode;
  id?: string;
}) {
  const head = (
    <div className="hd" style={aside ? { marginBottom: 0 } : undefined}>
      {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
      {script ? <span className="script">{script}</span> : null}
      <RevealLines as="h2" className="disp disp-md" id={id}>
        {title}
      </RevealLines>
      {sub ? (
        <p className="sub" style={{ margin: 0 }}>
          {sub}
        </p>
      ) : null}
    </div>
  );
  if (!aside) return head;
  return (
    <div className="hd-row" style={{ marginBottom: "clamp(32px, 4.5vw, 56px)" }}>
      {head}
      {aside}
    </div>
  );
}

/** Minimal renderer for description fields: blank-line paragraphs and "- " lists. */
export function Prose({ text }: { text: string }) {
  const blocks = text.trim().split(/\n\s*\n/);
  return (
    <div className="prose">
      {blocks.map((b, i) => {
        const lines = b.split("\n");
        const items = lines.filter((l) => l.startsWith("- "));
        if (items.length && items.length >= lines.length - 1) {
          const lead = lines[0]!.startsWith("- ") ? null : lines[0];
          return (
            <div key={i}>
              {lead ? <h3>{lead.replace(/:$/, "")}</h3> : null}
              <ul>
                {items.map((l) => (
                  <li key={l}>{l.slice(2)}</li>
                ))}
              </ul>
            </div>
          );
        }
        return <p key={i}>{b}</p>;
      })}
    </div>
  );
}

export function CtaBand({
  script = "Ready when you are",
  title = "Tell us the day you have in mind",
  interest,
}: {
  script?: string;
  title?: string;
  interest?: Interest;
}) {
  return (
    <section className="band-grad cta-band" aria-labelledby="cta-title">
      <div className="wrap">
        <div>
          <span className="script">{script}</span>
          <RevealLines as="h2" className="disp disp-md" id="cta-title">
            {title}
          </RevealLines>
        </div>
        <EnquireButton
          interest={interest ?? { type: "general", label: "General enquiry" }}
          className="pill pill-white"
        >
          Send an enquiry
        </EnquireButton>
      </div>
    </section>
  );
}

export function ArrowLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="link-arrow">
      {children}
      <Wave />
    </Link>
  );
}

export function WhatsAppFloat() {
  return (
    <a
      className="wa-float"
      href={`https://wa.me/${SITE.whatsappDigits}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Message us on WhatsApp, ${SITE.whatsapp}`}
    >
      <WhatsAppIcon />
    </a>
  );
}
