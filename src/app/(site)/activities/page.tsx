import type { Metadata } from "next";
import { Suspense } from "react";
import { ActivityFilter } from "@/components/site/ActivityFilter";
import { ActivityCard } from "@/components/site/cards";
import { CtaBand, Interlude, PageHero } from "@/components/site/ui";
import { ACTIVITY_TYPE_LABEL, getActivities } from "@/lib/data";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Activities",
  description:
    "Undersea walks, parasailing, snorkelling, glass-bottom boat trips, dolphin watching and more around Mauritius.",
  alternates: { canonical: "/activities" },
};

export default async function ActivitiesPage() {
  const activities = await getActivities();
  const types = (Object.keys(ACTIVITY_TYPE_LABEL) as (keyof typeof ACTIVITY_TYPE_LABEL)[])
    .map((t) => ({
      value: t,
      label: ACTIVITY_TYPE_LABEL[t],
      count: activities.filter((a) => a.activity_type === t).length,
    }))
    .filter((t) => t.count > 0);

  const cards = activities.map((a) => (
    <div key={a.id} data-type={a.activity_type} style={{ display: "contents" }}>
      <ActivityCard a={a} />
    </div>
  ));

  return (
    <>
      <PageHero
        script="Pick your pace"
        title="Activities"
        image={{ path: "parasail-turquoise", alt: "A parasail above turquoise water" }}
        lede="Under the water, on it, or sixty metres above it. Each activity can be booked on its own or as part of a planned day, and every one is run by our own crew."
      />
      <section className="band">
        <div className="wrap">
          <Suspense fallback={<div className="card-grid">{cards}</div>}>
            <ActivityFilter types={types}>{cards}</ActivityFilter>
          </Suspense>
        </div>
      </section>
      <Interlude line="Pick one, or let us put a whole day together." />
      <CtaBand script="Not sure which" title="Tell us who is coming and we will suggest a day" />
    </>
  );
}
