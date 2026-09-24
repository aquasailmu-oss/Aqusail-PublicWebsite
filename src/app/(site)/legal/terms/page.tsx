import type { Metadata } from "next";
import { PageHero } from "@/components/site/ui";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms",
  description: "Terms of use for the AquaSail Watersports website and how enquiries work.",
  alternates: { canonical: "/legal/terms" },
};

// TODO(legal): booking terms (deposits, cancellation, weather) belong in the
// confirmation sent by reception, and should be written with legal advice.
export default function TermsPage() {
  return (
    <>
      <PageHero script="The small print" title="Terms" />
      <section className="band band-sand">
        <div className="wrap">
          <div className="prose">
            <p>
              <span className="todo">DRAFT — to be reviewed before launch</span>
            </p>
            <h2>This website takes enquiries, not bookings</h2>
            <p>
              Sending an enquiry does not reserve a place and does not create a contract. A booking
              exists only once {SITE.legalName} has confirmed it to you in writing, with a reference
              number, a date and a price.
            </p>
            <h2>Prices</h2>
            <p>
              This website does not show prices. Reception quotes each enquiry directly, and the
              price that applies to your trip is the one in your written confirmation.
            </p>
            <h2>Weather and safety</h2>
            <p>
              The skipper may postpone or shorten any trip for safety. If we cancel, you are offered
              another date or a full refund. <span className="todo">TODO: confirm policy</span>
            </p>
            <h2>Photographs</h2>
            <p>
              Some photographs on this site are licensed from third parties and are credited on the
              photo credits page.
            </p>
            <h2>Contact</h2>
            <p>Questions about these terms: {SITE.email}.</p>
          </div>
        </div>
      </section>
    </>
  );
}
