import type { Metadata } from "next";
import { ParallaxComposition, RevealGroup } from "@/components/motion";
import { PackageCard } from "@/components/site/cards";
import { EnquireButton } from "@/components/site/Enquiry";
import { Interlude, PageHero, SectionHead } from "@/components/site/ui";
import { getPackages } from "@/lib/data";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Experiences",
  description:
    "Planned days on the water around Mauritius: full day catamaran, dolphins and Crystal Rock, Blue Bay marine park and more.",
  alternates: { canonical: "/experiences" },
};

export default async function ExperiencesPage() {
  const packages = await getPackages();
  return (
    <>
      <PageHero
        script="Planned for you"
        title="Experiences"
        image={{ path: "cerfs-aerial-2", alt: "An island and its lagoon from the air" }}
        lede="Whole and half days that put several activities together, timed around the tide and the light. What is included is listed on each one, and lunch is on board where it says so."
      />
      <section className="band">
        <div className="wrap">
          <RevealGroup className="card-grid">
            {packages.map((p) => (
              <PackageCard key={p.id} p={p} />
            ))}
          </RevealGroup>
        </div>
      </section>
      <Interlude line="Every planned day follows the tide, not the clock." />
      {/* parallax.layers — docs/motion-cookbook.md §3.3 */}
      <section className="band" aria-labelledby="day-title">
        <div className="wrap split">
          <ParallaxComposition
            base={{
              path: "cerfs-aerial",
              alt: "An island ringed by white sand and turquoise lagoon",
            }}
            inset={{ path: "snorkel-coral", alt: "A snorkeller above a coral head" }}
            caption={{ path: "biches-sunset", alt: "Boats at sunset", text: "Home by sunset" }}
          />
          <div>
            <SectionHead
              id="day-title"
              eyebrow="How a day runs"
              script="Slow on purpose"
              title="Sail, swim, eat, sail home"
              sub="Every planned day follows the same easy shape. We leave in the calm of the morning, get in the water while it is clearest, eat well, and bring you back before the light goes."
            />
            <ul className="claims">
              <li>
                <span className="num">01</span>
                <div>
                  <h3>Morning on the water</h3>
                  <p>
                    A briefing and coffee on board, then out across the lagoon while it is still
                    flat.
                  </p>
                </div>
              </li>
              <li>
                <span className="num">02</span>
                <div>
                  <h3>In the water by ten</h3>
                  <p>Snorkelling, a swim or the undersea walk, depending on the day you chose.</p>
                </div>
              </li>
              <li>
                <span className="num">03</span>
                <div>
                  <h3>Lunch, then an easy return</h3>
                  <p>
                    Grilled on board or ashore on an island, with time to swim before we head home.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>
      <Interlude line="Nothing is booked until you say yes." />
      <section className="band band-tight" aria-labelledby="byo-title">
        <div className="wrap split">
          <SectionHead
            id="byo-title"
            eyebrow="Build your own"
            script="Something else in mind"
            title="Ask for a different combination"
            sub="Dolphins in the morning and parasailing in the afternoon? A private boat for a birthday? Tell us what you would like and we will work out a day around it."
          />
          <div>
            <EnquireButton interest={{ type: "general", label: "Custom experience" }} wave>
              Describe your day
            </EnquireButton>
          </div>
        </div>
      </section>
    </>
  );
}
