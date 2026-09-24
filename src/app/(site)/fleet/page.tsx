import type { Metadata } from "next";
import Link from "next/link";
import { ParallaxComposition, RevealGroup, RevealLines } from "@/components/motion";
import { Wave } from "@/components/site/Brand";
import { CtaBand, PageHero, Photo, SectionHead } from "@/components/site/ui";
import { getResources } from "@/lib/data";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Fleet",
  description:
    "Two sailing catamarans, a power catamaran and a speed boat, each available for private charter in Mauritius.",
  alternates: { canonical: "/fleet" },
};

export default async function FleetPage() {
  const resources = await getResources();
  return (
    <>
      <PageHero
        script="Our boats"
        title="The fleet"
        image={{ path: "boats-aerial", alt: "Boats on turquoise water seen from above" }}
        lede="Four boats, maintained by the crew who sail them. Each one runs our scheduled trips and can be chartered privately for your own group."
      />
      <section className="band band-sand">
        <div className="wrap">
          <RevealGroup className="vessels" start="top 90%">
            {resources.map((r, i) => {
              return (
                <article key={r.id} className="vessel">
                  <Link
                    href={`/fleet/${r.slug}`}
                    className="vessel-media"
                    tabIndex={-1}
                    aria-hidden="true"
                  >
                    <Photo path={r.hero_image} alt="" sizes="(max-width: 760px) 100vw, 55vw" />
                  </Link>
                  <div className="vessel-copy">
                    <span className="vessel-num">
                      {String(i + 1).padStart(2, "0")} / {String(resources.length).padStart(2, "0")}
                    </span>
                    <RevealLines as="h2" className="disp disp-md">
                      {r.name}
                    </RevealLines>
                    <p className="sub" style={{ margin: 0 }}>
                      {r.summary}
                    </p>
                    <div className="vessel-stats">
                      <div className="stat">
                        <small>Length</small>
                        <b>{r.length_m} m</b>
                      </div>
                      <div className="stat">
                        <small>Guests</small>
                        <b>{r.capacity}</b>
                      </div>
                      {r.specs.Crew ? (
                        <div className="stat">
                          <small>Crew</small>
                          <b>{r.specs.Crew}</b>
                        </div>
                      ) : null}
                    </div>
                    <Link href={`/fleet/${r.slug}`} className="link-arrow">
                      View {r.name}
                      <Wave />
                    </Link>
                  </div>
                </article>
              );
            })}
          </RevealGroup>
        </div>
      </section>
      {/* parallax.layers — docs/motion-cookbook.md §3.3 */}
      <section className="band band-ink" aria-labelledby="aboard-title">
        <div className="wrap split">
          <div>
            <SectionHead
              id="aboard-title"
              eyebrow="Life on board"
              script="Shade and space"
              title="Built for long, easy days"
              sub="Every boat carries shade, fresh water, life jackets for every guest and a crew who have done this trip hundreds of times. You bring a towel; we bring the rest."
            />
          </div>
          <ParallaxComposition
            base={{ path: "catamaran-hk40", alt: "A white sailing catamaran under sail" }}
            inset={{ path: "cerfs-lagoon", alt: "Turquoise shallows off an island beach" }}
            caption={{
              path: "boats-aerial",
              alt: "Boats on turquoise water from above",
              text: "Anchored",
            }}
          />
        </div>
      </section>
      <CtaBand
        script="Your own boat"
        title="Charter a boat for your group"
        interest={{ type: "general", label: "Private charter" }}
      />
    </>
  );
}
