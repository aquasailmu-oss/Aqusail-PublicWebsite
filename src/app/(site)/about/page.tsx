import type { Metadata } from "next";
import { Collage, RevealGroup, RevealLines } from "@/components/motion";
import { AnchorNav } from "@/components/site/AnchorNav";
import { CtaBand, Interlude, PageHero } from "@/components/site/ui";

export const metadata: Metadata = {
  title: "About",
  description:
    "A local watersports crew in Mauritius. Our story, our crew, and how we keep every trip safe.",
  alternates: { canonical: "/about" },
};

const SECTIONS = [
  { id: "story", label: "Our story" },
  { id: "crew", label: "The crew" },
  { id: "safety", label: "Safety and licences" },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        script="Who we are"
        title="About AquaSail"
        image={{ path: "le-morne-aerial", alt: "The southwest coast of Mauritius from the air" }}
        lede="A Mauritian watersports company with its own boats, its own crew and one simple rule: nobody goes out unless we would take our own family."
      />

      <section className="band">
        <div className="wrap with-anchors">
          <AnchorNav items={SECTIONS} />
          <div className="stack" style={{ gap: "clamp(64px, 9vw, 120px)" }}>
            <section
              id="story"
              aria-labelledby="story-title"
              className="split"
              style={{ alignItems: "start" }}
            >
              <div className="prose">
                <span className="eyebrow">Our story</span>
                <RevealLines as="h2" className="disp disp-md" id="story-title">
                  It started with one boat
                </RevealLines>
                <p style={{ marginTop: 20 }}>
                  AquaSail began with a single boat and a skipper who knew the lagoon better than
                  the road home.{" "}
                  {/* TODO(copy): founding year, founder names and the real first boat. */}
                  <span className="todo">TODO: founding year and founders</span>
                </p>
                <p>
                  Today we run two sailing catamarans, a power catamaran and a speed boat, and a
                  crew who between them have spent more hours on this water than anyone would care
                  to count.
                </p>
                <p>
                  We still work the way we started: a small office that knows every booking by name,
                  a crew that checks every ticket at the jetty, and a skipper who decides on the day
                  whether the sea is right.
                </p>
              </div>
              <Collage
                items={[
                  {
                    path: "benitiers-blue-boat",
                    alt: "A blue boat moored in the shallows",
                    caption: "Morning run",
                    x: 0,
                    y: 4,
                    w: 58,
                    r: -5,
                  },
                  {
                    path: "benitiers-speedboat",
                    alt: "A speed boat at anchor in calm lagoon water",
                    caption: "Home water",
                    x: 40,
                    y: 18,
                    w: 56,
                    r: 6,
                  },
                  {
                    path: "biches-sunset-2",
                    alt: "Moored boats at sunset",
                    caption: "Last trip in",
                    x: 12,
                    y: 54,
                    w: 56,
                    r: -2,
                  },
                ]}
              />
            </section>

            <section id="crew" aria-labelledby="crew-title">
              <span className="eyebrow">The crew</span>
              <RevealLines as="h2" className="disp disp-md" id="crew-title">
                The people on the boat
              </RevealLines>
              <p className="sub" style={{ marginTop: 16 }}>
                Skippers, guides and deckhands who grew up on the coast. Every guide is first-aid
                trained and every skipper holds a commercial boat licence.
                {/* TODO(copy): crew names, roles and photos — with written consent. */}
              </p>
              <RevealGroup className="creds" start="top 90%">
                {["Skippers", "Dive and snorkel guides", "Parasail operators", "Reception"].map(
                  (role) => (
                    <div key={role} className="cred">
                      <h3>{role}</h3>
                      <p>
                        <span className="todo">TODO</span> names and one line about each person.
                      </p>
                    </div>
                  ),
                )}
              </RevealGroup>
            </section>

            <Interlude line="Nobody goes out unless we would take our own family." />
            <section id="safety" aria-labelledby="safety-title">
              <span className="eyebrow">Safety and licensing</span>
              <RevealLines as="h2" className="disp disp-md" id="safety-title">
                Checkable, not just promised
              </RevealLines>
              <p className="sub" style={{ marginTop: 16 }}>
                If you are bringing children, this is the part that matters. Every item below can be
                checked with the issuing authority; ask us for a copy of any certificate.
              </p>
              <RevealGroup className="creds" start="top 90%">
                <div className="cred">
                  <h3>Tourism licence</h3>
                  <p>
                    Tourism Authority of Mauritius licence{" "}
                    <span className="todo">TODO: number</span>
                  </p>
                </div>
                <div className="cred">
                  <h3>Boat licences</h3>
                  <p>
                    Every vessel licensed for passenger use{" "}
                    <span className="todo">TODO: licence numbers</span>
                  </p>
                </div>
                <div className="cred">
                  <h3>Insurance</h3>
                  <p>
                    Passenger liability insurance{" "}
                    <span className="todo">TODO: insurer and cover</span>
                  </p>
                </div>
                <div className="cred">
                  <h3>Crew qualifications</h3>
                  <p>
                    Skipper and first-aid certificates{" "}
                    <span className="todo">TODO: certifying bodies</span>
                  </p>
                </div>
                <div className="cred">
                  <h3>Equipment</h3>
                  <p>
                    Life jackets for every guest, checked before each trip. Masks disinfected
                    between uses.
                  </p>
                </div>
                <div className="cred">
                  <h3>Weather</h3>
                  <p>
                    The skipper postpones when conditions are wrong. You are moved or refunded in
                    full.
                  </p>
                </div>
              </RevealGroup>
            </section>
          </div>
        </div>
      </section>

      <CtaBand script="Come and meet us" title="Ask the crew anything before you book" />
    </>
  );
}
