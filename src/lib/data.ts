import "server-only";
import { cache } from "react";
import type { PublicActivity, PublicPackage, PublicResource } from "./database.types";
import * as seed from "./seed";
import { hasSupabase, publicClient } from "./supabase/public";

/*
 * Every read the public site makes goes through this file, and every read is
 * against a public_* VIEW. Never add a query against a base table here, and
 * never add a price: the public site displays none.
 */

async function fromView<T>(view: string, fallback: T[]): Promise<T[]> {
  if (!hasSupabase()) return fallback;
  const { data, error } = await publicClient().from(view).select("*").order("sort_order");
  if (error) throw new Error(`${view}: ${error.message}`);
  return data as T[];
}

export const getActivities = cache(() =>
  fromView<PublicActivity>("public_activities", seed.activities),
);
export const getPackages = cache(() => fromView<PublicPackage>("public_packages", seed.packages));
export const getResources = cache(() =>
  fromView<PublicResource>("public_resources", seed.resources),
);

export async function getActivity(slug: string) {
  return (await getActivities()).find((a) => a.slug === slug) ?? null;
}
export async function getPackage(slug: string) {
  return (await getPackages()).find((p) => p.slug === slug) ?? null;
}
export async function getResource(slug: string) {
  return (await getResources()).find((r) => r.slug === slug) ?? null;
}

export async function packagesContaining(activityId: string) {
  return (await getPackages()).filter((p) =>
    p.included_activities.some((a) => a.id === activityId),
  );
}

export async function packagesServedBy(resource: PublicResource) {
  const ids = new Set(resource.serves_activity_ids);
  return (await getPackages()).filter((p) => p.included_activities.some((a) => ids.has(a.id)));
}

export { galleryPhotos, ACTIVITY_TYPE_LABEL } from "./seed";
