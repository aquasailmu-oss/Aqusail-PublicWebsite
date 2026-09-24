import type { Metadata } from "next";
import Link from "next/link";
import { RevealGroup } from "@/components/motion";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { PageHero, SectionHead } from "@/components/site/ui";
import { getActivities, getResources } from "@/lib/data";
import { formatDuration } from "@/lib/dates";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Tour operators and hotels",
  description:
    "Partner with AquaSail Watersports: agreed rates, confirmed allocations, digital tickets for your guests and monthly statements.",
  alternates: { canonical: "/partners" },
};

export default async function PartnersPage() {
  const [activities, resources] = await Promise.all([getActivities(), getResources()]);
  const boatsFor = (id: string) =>
    resources.filter((r) => r.serves_activity_ids.includes(id)).map((r) => r.name);
  const maxGroup = (id: string) => {
    const caps = resources.filter((r) => r.serves_activity_ids.includes(id)).map((r) => r.capacity);
    return caps.length ? Math.max(...caps) : null;
  };

  return (
    <>
      <PageHero
        script="For partners"
        title="Tour operators and hotels"
        image={{ path: "grandbaie-boats", alt: "Boats at anchor in a turquoise bay" }}
        lede={
          <>
            Send us guests and we look after them from the jetty onwards. Partners get agreed rates,
            confirmed allocations and a named contact. Every guest receives a digital ticket to show
            on arrival, and you receive a monthly statement that matches your own records line by
            line — both come straight from the system our reception uses to run the day.
          </>
        }
      />

      <section className="band band-ink" aria-labelledby="how-title">
        <div className="wrap">
          <SectionHead
            id="how-title"
            eyebrow="How it works"
            title="Three steps, then it runs itself"
          />
          <RevealGroup as="ol" className="steps">
            <li>
              <span className="n">01</span>
              <h3>Enquire and agree rates</h3>
              <p>
                Tell us about your guests and volumes. We agree net rates and allocations with you
                directly.
              </p>
            </li>
            <li>
              <span className="n">02</span>
              <h3>Book by phone or email</h3>
              <p>
                Your team books with reception. Each guest gets a ticket with a reference the crew
                checks at the jetty.
              </p>
            </li>
            <li>
              <span className="n">03</span>
              <h3>Receive a monthly statement</h3>
              <p>
                One statement a month listing every guest, trip and rate, ready to reconcile against
                your bookings.
              </p>
            </li>
          </RevealGroup>
        </div>
      </section>

      <section className="band band-sand" aria-labelledby="cap-title">
        <div className="wrap">
          <SectionHead
            id="cap-title"
            eyebrow="Activities and capacities"
            title="What we can take"
            sub="Rates for partners are agreed in conversation and are never published here."
          />
          <div className="tbl-wrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th scope="col">Activity</th>
                  <th scope="col">Typical duration</th>
                  <th scope="col">Largest group per boat</th>
                  <th scope="col">Vessel</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((a) => (
                  <tr key={a.id}>
                    <td>
                      <Link href={`/activities/${a.slug}`}>{a.name}</Link>
                    </td>
                    <td>{formatDuration(a.duration_minutes)}</td>
                    <td>{maxGroup(a.id) ?? "On request"}</td>
                    <td>{boatsFor(a.id).join(", ") || "Activity platform"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Partner logo marquee omitted until real partner logos exist. */}

      <section className="band band-shell" id="enquire" aria-labelledby="partner-form-title">
        <div className="wrap contact-grid">
          <div className="panel">
            <h2 id="partner-form-title" className="disp disp-sm" style={{ marginBottom: 18 }}>
              Partner enquiry
            </h2>
            <EnquiryForm variant="partner" activityOptions={activities.map((a) => a.name)} />
          </div>
          <div className="stack">
            <span className="script">Talk to us</span>
            <p className="intro-lede">
              Hotels, DMCs and excursion desks: we reply to partner enquiries within one working
              day.
            </p>
            <p className="sub" style={{ margin: 0 }}>
              We will ask about your typical group sizes, the seasons you plan for and how you
              prefer to book, then send you a rate sheet to agree.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
