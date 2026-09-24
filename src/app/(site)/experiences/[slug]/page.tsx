import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArchImage, RevealLines } from "@/components/motion";
import { EnquireButton } from "@/components/site/Enquiry";
import { Gallery } from "@/components/site/Gallery";
import { BreadcrumbJsonLd } from "@/components/site/JsonLd";
import { CtaBand, Photo, Prose, SectionHead } from "@/components/site/ui";
import { getPackage, getPackages } from "@/lib/data";
import { formatDuration } from "@/lib/dates";
import { mediaUrl } from "@/lib/media";

export const revalidate = 300;

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getPackages()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const p = await getPackage((await params).slug);
  if (!p) return {};
  return {
    title: p.seo_title ?? p.name,
    description: p.seo_description ?? p.summary,
    alternates: { canonical: `/experiences/${p.slug}` },
    openGraph: { images: [mediaUrl(p.hero_image).src] },
  };
}

export default async function ExperiencePage({ params }: Params) {
  const p = await getPackage((await params).slug);
  if (!p) notFound();
  const interest = { type: "package" as const, id: p.id, label: p.name };
  // Display only: the sum of the included activities' published durations.
  const activityMinutes = p.included_activities.reduce((n, a) => n + a.duration_minutes, 0);

  return (
    <div className="has-sticky-enquire">
      <BreadcrumbJsonLd
        items={[
          { name: "Experiences", path: "/experiences" },
          { name: p.name, path: `/experiences/${p.slug}` },
        ]}
      />

      {/* Arch hero rather than full-bleed, so the two detail types differ. */}
      <header className="hero hero-plain on-dark">
        <div className="wrap split">
          <div className="hero-content">
            <nav aria-label="Breadcrumb" className="crumbs">
              <span>
                <Link href="/experiences">Experiences</Link> <span aria-hidden="true">/</span>
              </span>
            </nav>
            {p.departs ? (
              <span className="script">
                {p.departs}
                {p.returns ? ` to ${p.returns}` : ""}
              </span>
            ) : null}
            <RevealLines as="h1" className="disp" immediate>
              {p.name}
            </RevealLines>
            <p className="sub" style={{ margin: 0 }}>
              {p.summary}
            </p>
            <div className="hero-actions">
              <EnquireButton interest={interest} wave>
                Enquire
              </EnquireButton>
            </div>
          </div>
          <ArchImage>
            <Photo
              path={p.hero_image}
              alt={p.gallery[0]?.alt ?? p.name}
              sizes="(max-width: 860px) 100vw, 45vw"
              priority
            />
          </ArchImage>
        </div>
      </header>

      <section className="band band-sand">
        <div className="wrap detail">
          <div>
            <SectionHead eyebrow="What's included" title="The day, activity by activity" />
            <ol className="included">
              {p.included_activities.map((a, i) => (
                <li key={a.id}>
                  <Link href={`/activities/${a.slug}`}>
                    <span className="num">{String(i + 1).padStart(2, "0")}</span>
                    <span className="nm">{a.name}</span>
                    <span className="dur">{formatDuration(a.duration_minutes)}</span>
                  </Link>
                </li>
              ))}
            </ol>
            <div style={{ height: 48 }} />
            <Prose text={p.description} />
          </div>
          <aside className="facts" aria-label="Key facts">
            <span className="eyebrow">At a glance</span>
            <dl>
              {p.departs ? (
                <div>
                  <dt>Departs</dt>
                  <dd>{p.departs}</dd>
                </div>
              ) : null}
              {p.returns ? (
                <div>
                  <dt>Returns</dt>
                  <dd>{p.returns}</dd>
                </div>
              ) : null}
              <div>
                <dt>Activity time</dt>
                <dd>{formatDuration(activityMinutes)}</dd>
              </div>
              <div>
                <dt>Activities</dt>
                <dd>{p.included_activities.length}</dd>
              </div>
            </dl>
            <EnquireButton interest={interest} wave>
              Enquire about this day
            </EnquireButton>
            <p className="facts-note">
              No payment online. Reception replies with availability and a quote.
            </p>
          </aside>
        </div>
      </section>

      {p.gallery.length ? (
        <section className="band band-shell band-tight">
          <div className="wrap">
            <SectionHead eyebrow="Gallery" title="On the day" />
            <Gallery items={p.gallery} />
          </div>
        </section>
      ) : null}

      <CtaBand
        script="Make it yours"
        title="Ask about dates, group size or a private boat"
        interest={interest}
      />

      <div className="sticky-enquire">
        <span className="label-caps">{p.name}</span>
        <EnquireButton interest={interest} className="pill pill-solid pill-sm" />
      </div>
    </div>
  );
}
