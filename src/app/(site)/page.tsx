import {
  ArchImage,
  Collage,
  DriftTrack,
  Marquee,
  RevealGroup,
  RevealLines,
} from "@/components/motion";
import { Wave } from "@/components/site/Brand";
import { ActivityCard, PackageCard, VesselCard } from "@/components/site/cards";
import { EnquireButton } from "@/components/site/Enquiry";
import { ArrowLink, CtaBand, PageHero, Photo, SectionHead } from "@/components/site/ui";
import { getActivities, getPackages, getResources } from "@/lib/data";
import { SITE } from "@/lib/site";

export const revalidate = 300;

export default async function HomePage() {
  const [activities, packages, resources] = await Promise.all([
    getActivities(),
    getPackages(),
    getResources(),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: SITE.legalName,
    url: SITE.url,
    email: SITE.email,
    telephone: SITE.phone,
    image: `${SITE.url}/media/hero-le-morne.jpg`,
    address: { "@type": "PostalAddress", addressCountry: "MU", streetAddress: SITE.address },
    geo: { "@type": "GeoCoordinates", latitude: SITE.geo.lat, longitude: SITE.geo.lng },
    openingHours: "Mo-Su 08:00-17:00",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1 · HERO — ink */}
      <PageHero
        home
        script="Come for the lagoon"
        title="Stay for the whole day"
        image={{
          path: "hero-le-morne",
          alt: "Le Morne and the southwest lagoon of Mauritius from the air",
        }}
        lede="Catamaran days, undersea walks, parasailing and dolphin trips around Mauritius, run by a local crew who check every booking before you step on board."
      >
        <div className="hero-actions">
          <EnquireButton interest={{ type: "general", label: "General enquiry" }} wave>
            Plan your day
          </EnquireButton>
        </div>
        <div className="hero-meta">
          <span>
            <b>{activities.length}</b> activities
          </span>
          <span>
            <b>{resources.length}</b> boats
          </span>
          <span>
            Replies within <b>one working day</b>
          </span>
        </div>
      </PageHero>

      {/* 2 · INTRO — sand */}
      <section className="band band-sand" aria-labelledby="intro-title">
        <div className="wrap split">
          <div className="stack">
            <span className="eyebrow">AquaSail Watersports · Mauritius</span>
            <span className="script">Hello from the water</span>
            <RevealLines as="h2" className="disp disp-md" id="intro-title">
              A local crew on the clearest water we know
            </RevealLines>
            <p className="intro-lede">
              We run boats, not brochures. Every trip leaves with a skipper who knows the reef and a
              crew who will still be there when you come back up.
            </p>
            <p className="sub" style={{ margin: 0 }}>
              Choose a single activity, one of our planned days, or charter a boat for your own
              group. Send us an enquiry with the day you have in mind and reception will come back
              to you with availability and a quote. Nothing is booked until you say yes.
            </p>
            <div className="proofs">
              <div className="proof">
                <b>
                  <span className="todo">TODO</span>
                </b>
                <small>Years on the water</small>
              </div>
              <div className="proof">
                <b>
                  <span className="todo">TODO</span>
                </b>
                <small>Guests a year</small>
              </div>
              <div className="proof">
                <b>
                  <span className="todo">TODO</span>
                </b>
                <small>Licences held</small>
              </div>
            </div>
          </div>
          <ArchImage caption="Île aux Bénitiers, with Le Morne behind">
            <Photo
              path="benitiers-le-morne"
              alt="Turquoise lagoon water with Le Morne mountain on the horizon"
              sizes="(max-width: 860px) 100vw, 45vw"
            />
          </ArchImage>
        </div>
      </section>

      {/* 3 · ACTIVITIES — shell */}
      <section className="band band-shell" aria-labelledby="act-title">
        <div className="wrap">
          <SectionHead
            id="act-title"
            eyebrow="Activities"
            script="Pick your pace"
            title="Under, on and above the lagoon"
            sub="From a quiet hour behind glass to ten minutes at sixty metres. Every activity is run by our own crew."
            aside={<ArrowLink href="/activities">All activities</ArrowLink>}
          />
          <RevealGroup className="card-grid">
            {activities.slice(0, 6).map((a) => (
              <ActivityCard key={a.id} a={a} />
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* 4 · EXPERIENCES — ink */}
      <section className="band band-ink" aria-labelledby="exp-title">
        <div className="wrap">
          <SectionHead
            id="exp-title"
            eyebrow="Experiences"
            script="Planned for you"
            title="Whole days, already worked out"
            sub="Our favourite combinations, timed around the tides and the light. Lunch and equipment included where it says so."
            aside={<ArrowLink href="/experiences">All experiences</ArrowLink>}
          />
          <RevealGroup className="card-grid">
            {packages.slice(0, 3).map((p) => (
              <PackageCard key={p.id} p={p} />
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* 5 · FLEET — sand */}
      <section
        className="band band-sand"
        aria-labelledby="fleet-title"
        style={{ overflow: "hidden" }}
      >
        <Marquee label="Our boats">
          {resources.map((r) => (
            <span key={r.id} className="mq-item">
              {r.name}
              <Wave />
            </span>
          ))}
        </Marquee>
        <div className="wrap" style={{ marginTop: "clamp(40px, 6vw, 80px)" }}>
          <SectionHead
            id="fleet-title"
            eyebrow="Fleet"
            title="Four boats, one crew"
            sub="Sail slowly on a catamaran, cover the coast on Cataspeed, or take the speed boat for a small group. Every boat can be chartered privately."
            aside={<ArrowLink href="/fleet">The fleet</ArrowLink>}
          />
          <RevealGroup className="fleet-cards">
            {resources.map((r) => (
              <VesselCard key={r.id} r={r} />
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* 5b · FROM THE BOAT — ink. drift.horizontal, docs/motion-cookbook.md §3.4 */}
      <section
        className="band band-ink"
        aria-labelledby="drift-title"
        style={{ paddingBottom: "clamp(40px, 6vw, 80px)" }}
      >
        <div className="wrap">
          <SectionHead
            id="drift-title"
            eyebrow="From the boat"
            script="Seen this week"
            title="The lagoon, as our guests see it"
            aside={<ArrowLink href="/gallery">The gallery</ArrowLink>}
          />
        </div>
        <DriftTrack
          items={[
            {
              path: "turtle-surface",
              alt: "A green turtle just below the surface",
              caption: "Turtle morning",
              href: "/activities/turtle-snorkel",
            },
            {
              path: "crystal-rock",
              alt: "Crystal Rock in the lagoon",
              caption: "Crystal Rock",
              href: "/experiences/dolphins-and-crystal-rock",
            },
            {
              path: "parasail-turquoise",
              alt: "A parasail over turquoise water",
              caption: "Sixty metres up",
              href: "/activities/parasailing",
            },
            {
              path: "dolphins-pod",
              alt: "Spinner dolphins under the surface",
              caption: "Spinners at seven",
              href: "/activities/dolphin-watching",
            },
            {
              path: "cerfs-aerial",
              alt: "An island ringed by white sand",
              caption: "Lunch stop",
              href: "/experiences/full-day-catamaran",
            },
            {
              path: "diver-fish",
              alt: "A diver among yellow fish",
              caption: "Three metres down",
              href: "/activities/undersea-walk",
            },
            {
              path: "biches-sunset",
              alt: "Boats against an orange sunset",
              caption: "Last light",
              href: "/activities/sunset-cruise",
            },
            {
              path: "coral-garden",
              alt: "Pink and orange soft corals",
              caption: "Coral garden",
              href: "/activities/glass-bottom-boat",
            },
          ]}
        />
      </section>

      {/* 6 · WHY US — shell */}
      <section className="band band-shell" aria-labelledby="why-title">
        <div className="wrap split" style={{ alignItems: "center" }}>
          <Collage
            items={[
              {
                path: "crystal-rock",
                alt: "Crystal Rock in the lagoon",
                caption: "Crystal Rock",
                x: 2,
                y: 6,
                w: 52,
                r: -6,
              },
              {
                path: "turtle-surface",
                alt: "A green turtle under the surface",
                caption: "Turtle morning",
                x: 44,
                y: 0,
                w: 50,
                r: 5,
              },
              {
                path: "catamaran-hk40",
                alt: "A catamaran under sail",
                caption: "Catamaran 1",
                x: 22,
                y: 46,
                w: 54,
                r: 2,
              },
            ]}
          />
          <div>
            <SectionHead
              id="why-title"
              eyebrow="Why AquaSail"
              script="Why guests come back"
              title="The boring parts, done properly"
            />
            <ul className="claims">
              <li>
                <span className="num">01</span>
                <div>
                  <h3>Safety first, every trip</h3>
                  <p>
                    Life jackets for everyone, a briefing before every activity, and a skipper who
                    will postpone rather than go out in the wrong weather.
                  </p>
                </div>
              </li>
              <li>
                <span className="num">02</span>
                <div>
                  <h3>Our own crew</h3>
                  <p>
                    The people who answer your enquiry work with the people who drive the boat. You
                    are not passed between agents.
                  </p>
                </div>
              </li>
              <li>
                <span className="num">03</span>
                <div>
                  <h3>Every booking ticketed and checked</h3>
                  <p>
                    Once you confirm, you receive a ticket with your reference, and the crew checks
                    it at the jetty. No lists on scraps of paper, no double bookings.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 7 · ENQUIRY BAND — the one gradient on the page */}
      <CtaBand />
    </>
  );
}
