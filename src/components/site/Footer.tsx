import Link from "next/link";
import { getActivities } from "@/lib/data";
import { currentYearInMauritius } from "@/lib/dates";
import { NAV, SITE } from "@/lib/site";
import { Logo } from "./Brand";
import { CopyText } from "./CopyButton";

export async function Footer() {
  const activities = (await getActivities()).slice(0, 6);
  return (
    <footer className="site-footer on-dark">
      <div className="wrap">
        <div className="foot-top">
          <div className="foot-brand">
            <Logo />
            <p style={{ margin: 0 }}>
              Boat trips, underwater walks and days on the lagoon around Mauritius. We take
              enquiries online and confirm every trip in person.
            </p>
          </div>
          <div className="foot-col">
            <h2>Explore</h2>
            <ul>
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link href={n.href}>{n.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="foot-col">
            <h2>Activities</h2>
            <ul>
              {activities.map((a) => (
                <li key={a.id}>
                  <Link href={`/activities/${a.slug}`}>{a.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="foot-col">
            <h2>Contact</h2>
            <small className="label-caps" style={{ display: "block", marginBottom: 4 }}>
              Phone
            </small>
            <CopyText text={SITE.phone} label="phone number" />
            <small className="label-caps" style={{ display: "block", marginBottom: 4 }}>
              WhatsApp
            </small>
            <CopyText text={SITE.whatsapp} label="WhatsApp number" />
            <small className="label-caps" style={{ display: "block", marginBottom: 4 }}>
              Email
            </small>
            <CopyText text={SITE.email} label="email address" />
          </div>
        </div>
        <div className="foot-bottom">
          <span>
            © {currentYearInMauritius()} {SITE.legalName} · {SITE.brn} · {SITE.tourismLicence}
          </span>
          <ul>
            <li>
              <Link href="/legal/privacy">Privacy</Link>
            </li>
            <li>
              <Link href="/legal/terms">Terms</Link>
            </li>
            <li>
              <Link href="/credits">Photo credits</Link>
            </li>
          </ul>
        </div>
        <p className="foot-word" aria-hidden="true">
          AquaSail
        </p>
      </div>
    </footer>
  );
}
