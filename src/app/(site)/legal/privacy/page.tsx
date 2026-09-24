import type { Metadata } from "next";
import { PageHero } from "@/components/site/ui";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy notice",
  description:
    "What the AquaSail enquiry form collects, why, how long we keep it and how to ask for it to be deleted.",
  alternates: { canonical: "/legal/privacy" },
};

// TODO(legal): have this notice reviewed by someone qualified in the Mauritius
// Data Protection Act 2017 before the form collects real enquiries.
export default function PrivacyPage() {
  return (
    <>
      <PageHero script="Plain and short" title="Privacy notice" />
      <section className="band band-sand">
        <div className="wrap">
          <div className="prose">
            <p>
              <span className="todo">DRAFT — to be reviewed before launch</span>
            </p>
            <h2>Who we are</h2>
            <p>
              {SITE.legalName}, Mauritius ({SITE.brn}). You can reach us about anything in this
              notice at {SITE.email}.
            </p>
            <h2>What we collect</h2>
            <p>When you send an enquiry we collect what you type into the form:</p>
            <ul>
              <li>your name and email address</li>
              <li>optionally, your phone or WhatsApp number and country</li>
              <li>your preferred date, party size and message</li>
              <li>
                which activity, experience or boat you asked about, and the page you asked from
              </li>
            </ul>
            <p>
              We also store a one-way hash of your IP address. We use it only to stop automated spam
              by limiting the number of enquiries from one connection, and it cannot be turned back
              into your address. We do not use advertising cookies. Our analytics count page views
              without identifying you and never include anything you type into the form.
            </p>
            <h2>Why we collect it</h2>
            <p>
              Only to reply to your enquiry and, if you decide to book, to arrange the trip. We do
              not send marketing emails unless you ask us to.
            </p>
            <h2>Who we share it with</h2>
            <p>
              Nobody outside AquaSail, except the services that run this website and our booking
              system: our hosting provider, our database provider and our email provider, each of
              which processes it on our behalf.{" "}
              <span className="todo">TODO: name providers and where data is stored</span>
            </p>
            <h2>How long we keep it</h2>
            <p>
              Enquiries that do not become bookings are deleted after{" "}
              <span className="todo">TODO: retention period</span>. If you book, your details are
              kept with the booking for as long as the law requires us to keep business records.
            </p>
            <h2>Your rights</h2>
            <p>
              You can ask to see the information we hold about you, to correct it, or to have it
              deleted. Email {SITE.email} with the reference number from your enquiry and we will
              reply within one month.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
