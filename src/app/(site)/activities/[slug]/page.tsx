import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RevealGroup } from "@/components/motion";
import { RelatedCard } from "@/components/site/cards";
import { EnquireButton } from "@/components/site/Enquiry";
import { Gallery } from "@/components/site/Gallery";
import { BreadcrumbJsonLd } from "@/components/site/JsonLd";
import { CtaBand, Interlude, PageHero, Prose, SectionHead } from "@/components/site/ui";
import { ACTIVITY_TYPE_LABEL, getActivities, getActivity, packagesContaining } from "@/lib/data";
import { formatDuration } from "@/lib/dates";
import { mediaUrl } from "@/lib/media";
import { SITE } from "@/lib/site";

export const revalidate = 300;

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getActivities()).map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const a = await getActivity((await params).slug);
  if (!a) return {};
  return {
    title: a.seo_title ?? a.name,
    description: a.seo_description ?? a.summary,
    alternates: { canonical: `/activities/${a.slug}` },
  };
}

export default async function ActivityPage({ params }: Params) {
  const a = await getActivity((await params).slug);
  if (!a) notFound();
  const related = await packagesContaining(a.id);
  const interest = { type: "activity" as const, id: a.id, label: a.name };

  const ld = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: a.name,
    description: a.summary,
    image: `${SITE.url}${mediaUrl(a.hero_image).src}`,
    url: `${SITE.url}/activities/${a.slug}`,
    touristType: a.min_age ? `Ages ${a.min_age} and over` : "All ages",
  };

  return (
    <div className="has-sticky-enquire">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <BreadcrumbJsonLd
        items={[
          { name: "Activities", path: "/activities" },
          { name: a.name, path: `/activities/${a.slug}` },
        ]}
      />
      <PageHero
        crumbs={[{ href: "/activities", label: "Activities" }]}
        script={ACTIVITY_TYPE_LABEL[a.activity_type]}
        title={a.name}
        lede={a.summary}
        image={{ path: a.hero_image, alt: a.gallery[0]?.alt ?? a.name }}
      />

      <section className="band">
        <div className="wrap detail">
          <div>
            <span className="eyebrow">About this activity</span>
            <div style={{ height: 18 }} />
            <Prose text={a.description} />
          </div>
          <aside className="facts" aria-label="Key facts">
            <span className="eyebrow">At a glance</span>
            <dl>
              <div>
                <dt>Duration</dt>
                <dd>{formatDuration(a.duration_minutes)}</dd>
              </div>
              <div>
                <dt>Minimum age</dt>
                <dd>{a.min_age ? `${a.min_age} years` : "All ages"}</dd>
              </div>
              <div>
                <dt>Type</dt>
                <dd>{ACTIVITY_TYPE_LABEL[a.activity_type]}</dd>
              </div>
            </dl>
            {a.restrictions ? <p className="facts-note">{a.restrictions}</p> : null}
            <EnquireButton interest={interest} wave>
              Enquire about this
            </EnquireButton>
            <p className="facts-note">
              No payment online. Reception replies with availability and a quote.
            </p>
          </aside>
        </div>
      </section>

      {a.gallery.length ? (
        <section className="band band-tight">
          <div className="wrap">
            <SectionHead eyebrow="Gallery" title="What to expect" />
            <Gallery items={a.gallery} />
          </div>
        </section>
      ) : null}

      <Interlude line="Most guests pair it with something else on the same day." />
      {related.length ? (
        <section className="band">
          <div className="wrap">
            <SectionHead
              eyebrow="Included in these experiences"
              script="Make a day of it"
              title={`${a.name} is part of`}
            />
            <RevealGroup className="card-grid">
              {related.map((p) => (
                <RelatedCard
                  key={p.id}
                  href={`/experiences/${p.slug}`}
                  image={p.hero_image}
                  title={p.name}
                  text={p.summary}
                />
              ))}
            </RevealGroup>
          </div>
        </section>
      ) : null}

      <CtaBand
        script="Questions first"
        title={`Ask us about the ${a.name.toLowerCase()}`}
        interest={interest}
      />

      <div className="sticky-enquire">
        <span className="label-caps">{a.name}</span>
        <EnquireButton interest={interest} className="pill pill-solid pill-sm" />
      </div>
    </div>
  );
}
