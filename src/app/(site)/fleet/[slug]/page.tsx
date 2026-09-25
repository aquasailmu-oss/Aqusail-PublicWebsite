import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RevealGroup } from "@/components/motion";
import { RelatedCard } from "@/components/site/cards";
import { EnquireButton } from "@/components/site/Enquiry";
import { Gallery } from "@/components/site/Gallery";
import { BreadcrumbJsonLd } from "@/components/site/JsonLd";
import { CtaBand, Interlude, PageHero, Prose, SectionHead } from "@/components/site/ui";
import { getResource, getResources, packagesServedBy } from "@/lib/data";
import { mediaUrl } from "@/lib/media";

export const revalidate = 300;

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getResources()).map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const r = await getResource((await params).slug);
  if (!r) return {};
  return {
    title: r.seo_title ?? r.name,
    description: r.seo_description ?? r.summary,
    alternates: { canonical: `/fleet/${r.slug}` },
    openGraph: { images: [mediaUrl(r.hero_image).src] },
  };
}

export default async function VesselPage({ params }: Params) {
  const r = await getResource((await params).slug);
  if (!r) notFound();
  const related = await packagesServedBy(r);
  const interest = { type: "resource" as const, id: r.id, label: `${r.name} charter` };
  const terms = r.charter_terms;

  return (
    <div className="has-sticky-enquire">
      <BreadcrumbJsonLd
        items={[
          { name: "Fleet", path: "/fleet" },
          { name: r.name, path: `/fleet/${r.slug}` },
        ]}
      />
      <PageHero
        crumbs={[{ href: "/fleet", label: "Fleet" }]}
        script="Private charter"
        title={r.name}
        lede={r.summary}
        image={{ path: r.hero_image, alt: r.gallery[0]?.alt ?? r.name }}
      >
        <dl className="specs" style={{ marginTop: 26 }}>
          {Object.entries(r.specs).map(([k, v]) => (
            <div key={k}>
              <small>{k}</small>
              <b>{v}</b>
            </div>
          ))}
        </dl>
      </PageHero>

      <section className="band">
        <div className="wrap detail">
          <div>
            <span className="eyebrow">About the boat</span>
            <div style={{ height: 18 }} />
            <Prose text={r.description} />
          </div>
          <aside className="facts" aria-label="Charter">
            <span className="eyebrow">Private charter</span>
            <dl>
              <div>
                <dt>Guests</dt>
                <dd>Up to {r.capacity}</dd>
              </div>
              <div>
                <dt>Length</dt>
                <dd>{r.length_m} m</dd>
              </div>
            </dl>
            <EnquireButton interest={interest} wave>
              Enquire about a charter
            </EnquireButton>
            <p className="facts-note">
              Reception replies with availability and a quote for your date and group. Nothing is
              booked until you confirm.
            </p>
          </aside>
        </div>
      </section>

      {terms ? (
        <section className="band" aria-labelledby="charter-title">
          <div className="wrap">
            <SectionHead
              id="charter-title"
              eyebrow="Private charter"
              script="Your own boat"
              title={`What a charter on ${r.name} includes`}
              sub="Tell us your date, group size and what you would like to do, and reception will come back with a quote."
            />
            <RevealGroup className="seasons">
              <article className="season">
                <span className="label-caps">Charter basis</span>
                <p style={{ margin: 0, fontSize: 18 }}>{terms.basis}</p>
                <EnquireButton interest={interest} className="pill pill-solid pill-sm">
                  Ask for a quote
                </EnquireButton>
              </article>
              {terms.includes.length ? (
                <article className="season">
                  <span className="label-caps">Included</span>
                  <ul>
                    {terms.includes.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                </article>
              ) : null}
              {terms.excludes.length ? (
                <article className="season">
                  <span className="label-caps">Not included</span>
                  <ul>
                    {terms.excludes.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                </article>
              ) : null}
            </RevealGroup>
          </div>
        </section>
      ) : null}

      <Interlude line="Your date, your guests, your route." />
      <section className="band band-tight">
        <div className="wrap">
          <SectionHead eyebrow="Gallery" title={`On board ${r.name}`} />
          <Gallery items={r.gallery} />
        </div>
      </section>

      <Interlude line="Or join a shared trip on the same boat." />
      {related.length ? (
        <section className="band">
          <div className="wrap">
            <SectionHead
              eyebrow="Used for these experiences"
              script="Join a shared trip"
              title={`Sail on ${r.name} without chartering`}
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
        script="Your own boat"
        title={`Charter ${r.name} for your group`}
        interest={interest}
      />

      <div className="sticky-enquire">
        <span className="label-caps">{r.name}</span>
        <EnquireButton interest={interest} className="pill pill-solid pill-sm" />
      </div>
    </div>
  );
}
