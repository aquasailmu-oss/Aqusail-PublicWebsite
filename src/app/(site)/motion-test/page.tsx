import type { Metadata } from "next";
import {
  ArchImage,
  Collage,
  DriftTrack,
  Marquee,
  Parallax,
  ParallaxComposition,
  RevealGroup,
  RevealLines,
} from "@/components/motion";
import { Wave } from "@/components/site/Brand";
import { EnquireButton } from "@/components/site/Enquiry";
import { PageHero, Photo, SectionHead } from "@/components/site/ui";

export const metadata: Metadata = { title: "Motion test", robots: { index: false } };

/** Every motion component with sample content. Compare against docs/motion-reference.html. */
export default function MotionTest() {
  return (
    <>
      <PageHero
        script="Motion test"
        title="Every behaviour on the site"
        lede="reveal.lines runs on this heading. Scroll for the rest."
      />

      <section className="band band-sand">
        <div className="wrap">
          <SectionHead
            eyebrow="reveal.lines"
            title="Catamaran day charter, rising one line at a time"
          />
          <span className="eyebrow">reveal.stagger</span>
          <RevealGroup className="card-grid">
            {["One", "Two", "Three"].map((n) => (
              <div key={n} className="cred">
                <h3>{n}</h3>
                <p>Fades up 26px, 70 ms apart, once.</p>
              </div>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="band band-ink">
        <div className="wrap split">
          <div className="stack">
            <span className="eyebrow">parallax.drift</span>
            <Parallax style={{ aspectRatio: "16 / 10", borderRadius: 20 }}>
              <Photo path="cerfs-aerial" alt="Island from the air" sizes="50vw" />
            </Parallax>
          </div>
          <div className="stack">
            <span className="eyebrow">mask.arch</span>
            <ArchImage caption="Grows from 82% out of its floor">
              <Photo path="crystal-rock" alt="Crystal Rock" sizes="50vw" />
            </ArchImage>
          </div>
        </div>
      </section>

      <section className="band band-shell">
        <div className="wrap split">
          <div className="stack">
            <span className="eyebrow">collage.scatter</span>
            <Collage
              items={[
                { path: "turtle-surface", alt: "Turtle", caption: "One", x: 0, y: 4, w: 54, r: -7 },
                {
                  path: "parasail-turquoise",
                  alt: "Parasail",
                  caption: "Two",
                  x: 42,
                  y: 10,
                  w: 54,
                  r: 4,
                },
                {
                  path: "biches-sunset",
                  alt: "Sunset",
                  caption: "Three",
                  x: 18,
                  y: 50,
                  w: 54,
                  r: 9,
                },
              ]}
            />
          </div>
          <div className="stack">
            <span className="eyebrow">pill.hover · header.shrink</span>
            <p className="sub">
              Hover the pill: it inverts to ink and the wave slides 5px. Scroll past 80px: the bar
              tightens.
            </p>
            <div>
              <EnquireButton className="pill" wave>
                Enquire
              </EnquireButton>
            </div>
          </div>
        </div>
      </section>

      <section className="band band-shell">
        <div className="wrap split">
          <span className="eyebrow">parallax.layers · 1.0 / 0.85 / 1.15</span>
          <ParallaxComposition
            base={{ path: "hero-le-morne", alt: "Le Morne from the air" }}
            inset={{ path: "turtle-surface", alt: "Turtle" }}
            caption={{
              path: "bluebay-dawn",
              alt: "Blue Bay at dawn",
              text: "Sunrise off Blue Bay",
            }}
          />
        </div>
      </section>

      <section className="band band-ink">
        <div className="wrap">
          <span className="eyebrow">drift.horizontal · not pinned</span>
        </div>
        <DriftTrack
          items={[
            "cerfs-aerial",
            "crystal-rock",
            "turtle-reef",
            "parasail-yacht",
            "dolphins-pod",
            "bluebay-lagoon",
            "snorkel-reef",
            "biches-sunset-2",
          ].map((p, i) => ({
            path: p,
            alt: p.replace(/-/g, " "),
            caption: `Card ${i + 1}`,
          }))}
        />
      </section>

      <section className="band band-sand" style={{ overflow: "hidden" }}>
        <div className="wrap">
          <span className="eyebrow">marquee.loop</span>
        </div>
        <Marquee label="Marquee test">
          {[
            "Catamaran 1",
            "Catamaran 2",
            "Cataspeed",
            "Speed boat",
            "Parasailing",
            "Undersea walk",
          ].map((n) => (
            <span key={n} className="mq-item">
              {n}
              <Wave />
            </span>
          ))}
        </Marquee>
      </section>

      <section className="band band-ink">
        <div className="wrap">
          <span className="eyebrow">field.swap</span>
          <RevealLines className="disp disp-md">
            Sand, ink, shell: the band edges are the transition
          </RevealLines>
        </div>
      </section>
    </>
  );
}
