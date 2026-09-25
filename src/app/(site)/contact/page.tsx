import type { Metadata } from "next";
import Image from "next/image";
import { CopyText } from "@/components/site/CopyButton";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { PageHero } from "@/components/site/ui";
import { mediaUrl } from "@/lib/media";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Send AquaSail Watersports an enquiry, or reach us by phone, WhatsApp or email.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        script="Say hello"
        title="Contact"
        lede="Send an enquiry and reception replies within one working day with availability and a quote. Nothing is booked or charged until you confirm."
      />
      <section className="band" id="enquire">
        <div className="wrap contact-grid">
          <div className="panel">
            <h2 className="disp disp-sm" style={{ marginBottom: 18 }}>
              Send an enquiry
            </h2>
            {/* Works without JavaScript: a plain form post to the Server Action. */}
            <EnquiryForm />
          </div>
          <aside className="stack" aria-label="Contact details">
            <div className="contact-list">
              <div>
                <small>Phone</small>
                <CopyText text={SITE.phone} label="phone number" />
              </div>
              <div>
                <small>WhatsApp</small>
                <CopyText text={SITE.whatsapp} label="WhatsApp number" />
              </div>
              <div>
                <small>Email</small>
                <CopyText text={SITE.email} label="email address" />
              </div>
              <div>
                <small>Opening hours</small>
                {SITE.hours.map((h) => (
                  <div key={h.days}>
                    {h.days}: {h.time}
                  </div>
                ))}
              </div>
              <div>
                <small>Meeting point</small>
                <span>{SITE.address}</span>
              </div>
            </div>
            <div>
              <span className="eyebrow">How to find us</span>
              <p className="sub" style={{ marginTop: 8 }}>
                {/* TODO(copy): real directions from the coast road and a landmark taxi drivers know. */}
                Taxi drivers know the jetty by name. Ask for the AquaSail boat jetty; the crew meets
                you at the blue sign fifteen minutes before departure.{" "}
                <span className="todo">TODO: confirm directions</span>
              </p>
              <a className="map-link" href={SITE.mapsUrl} target="_blank" rel="noopener noreferrer">
                <Image
                  src={mediaUrl("biches-aerial").src}
                  alt="Aerial view of the coast. Opens Google Maps."
                  fill
                  sizes="(max-width: 920px) 100vw, 40vw"
                />
                <span className="pill pill-sm">Open in Google Maps</span>
              </a>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
