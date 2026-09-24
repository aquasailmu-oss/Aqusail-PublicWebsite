import Link from "next/link";
import type { PublicActivity, PublicPackage, PublicResource } from "@/lib/database.types";
import { formatDuration } from "@/lib/dates";
import { ACTIVITY_TYPE_LABEL } from "@/lib/seed";
import { Wave } from "./Brand";
import { EnquireButton } from "./Enquiry";
import { Photo } from "./ui";

/* No card shows a price. Reception quotes every enquiry directly. */

export function ActivityCard({ a }: { a: PublicActivity }) {
  return (
    <article className="acard">
      <div className="acard-media">
        <Photo
          path={a.hero_image}
          alt=""
          sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 380px"
        />
        <span className="acard-tag">{ACTIVITY_TYPE_LABEL[a.activity_type]}</span>
      </div>
      <div className="acard-body">
        <h3>
          <Link href={`/activities/${a.slug}`}>{a.name}</Link>
        </h3>
        <p>{a.summary}</p>
        <div className="acard-foot">
          <ul className="badges" aria-label="Details">
            <li>{formatDuration(a.duration_minutes)}</li>
            <li>{a.min_age ? `Age ${a.min_age}+` : "All ages"}</li>
          </ul>
          <EnquireButton
            className="pill pill-solid pill-sm"
            interest={{ type: "activity", id: a.id, label: a.name }}
          />
        </div>
      </div>
    </article>
  );
}

export function PackageCard({ p }: { p: PublicPackage }) {
  return (
    <article className="pcard">
      <div className="pcard-media">
        <Photo path={p.hero_image} alt="" sizes="(max-width: 700px) 100vw, 50vw" />
      </div>
      <div className="pcard-body">
        {p.departs ? (
          <span className="pcard-time">
            {p.departs}
            {p.returns ? ` – ${p.returns}` : ""}
          </span>
        ) : null}
        <h3>
          <Link href={`/experiences/${p.slug}`}>{p.name}</Link>
        </h3>
        <p>{p.summary}</p>
        <div className="pcard-foot">
          <ul className="badges" aria-label="Included">
            {p.included_activities.map((a) => (
              <li key={a.id}>{a.name}</li>
            ))}
          </ul>
          <EnquireButton
            className="pill pill-solid pill-sm"
            interest={{ type: "package", id: p.id, label: p.name }}
          />
        </div>
      </div>
    </article>
  );
}

export function VesselCard({ r }: { r: PublicResource }) {
  return (
    <Link href={`/fleet/${r.slug}`} className="vcard">
      <div className="vcard-media">
        <Photo path={r.hero_image} alt="" sizes="(max-width: 700px) 100vw, 25vw" />
      </div>
      <h3>
        {r.name}
        <Wave />
      </h3>
      <p>
        {r.length_m} m · up to {r.capacity} guests
      </p>
    </Link>
  );
}

/** Small linked card for "related" rows on detail pages. */
export function RelatedCard({
  href,
  image,
  title,
  text,
}: {
  href: string;
  image: string;
  title: string;
  text: string;
}) {
  return (
    <Link href={href} className="vcard">
      <div className="acard-media" style={{ borderRadius: "var(--radius-xl)" }}>
        <Photo path={image} alt="" sizes="(max-width: 700px) 100vw, 33vw" />
      </div>
      <h3>
        {title}
        <Wave />
      </h3>
      <p style={{ color: "var(--on-dark-soft)", marginTop: -8 }}>{text}</p>
    </Link>
  );
}
