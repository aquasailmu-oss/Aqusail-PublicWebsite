import type { MetadataRoute } from "next";
import { getActivities, getPackages, getResources } from "@/lib/data";
import { SITE } from "@/lib/site";

export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [activities, packages, resources] = await Promise.all([
    getActivities(),
    getPackages(),
    getResources(),
  ]);
  const page = (path: string, priority = 0.6) => ({
    url: `${SITE.url}${path}`,
    changeFrequency: "weekly" as const,
    priority,
  });
  return [
    page("/", 1),
    page("/activities", 0.9),
    page("/experiences", 0.9),
    page("/fleet", 0.8),
    page("/partners"),
    page("/about"),
    page("/gallery", 0.5),
    page("/contact", 0.7),
    page("/legal/privacy", 0.2),
    page("/legal/terms", 0.2),
    ...activities.map((a) => page(`/activities/${a.slug}`, 0.8)),
    ...packages.map((p) => page(`/experiences/${p.slug}`, 0.8)),
    ...resources.map((r) => page(`/fleet/${r.slug}`, 0.7)),
  ];
}
