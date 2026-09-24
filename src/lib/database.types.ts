/**
 * Row shapes of the public_* views — the whole of what the anon role can read.
 * The public site shows NO prices: no view carries one, and none may be added.
 * Hand-written to match supabase/migrations/0003_public_views.sql. Once a
 * Supabase project exists, replace with `supabase gen types typescript`.
 */

export type GalleryItem = { path: string; alt: string };

export type ActivityType = "underwater" | "air" | "boat" | "wildlife";

export type PublicActivity = {
  id: string;
  slug: string;
  name: string;
  activity_type: ActivityType;
  summary: string;
  description: string;
  duration_minutes: number;
  min_age: number | null;
  restrictions: string | null;
  hero_image: string;
  gallery: GalleryItem[];
  sort_order: number;
  seo_title: string | null;
  seo_description: string | null;
};

export type IncludedActivity = {
  id: string;
  slug: string;
  name: string;
  duration_minutes: number;
};

export type PublicPackage = {
  id: string;
  slug: string;
  name: string;
  summary: string;
  description: string;
  departs: string | null; // "09:00"
  returns: string | null; // "15:30"
  hero_image: string;
  gallery: GalleryItem[];
  included_activities: IncludedActivity[];
  sort_order: number;
  seo_title: string | null;
  seo_description: string | null;
};

/** What a private charter covers. Deliberately carries no price. */
export type CharterTerms = {
  basis: string; // "Half day, up to 30 guests"
  includes: string[];
  excludes: string[];
};

export type PublicResource = {
  id: string;
  slug: string;
  name: string;
  summary: string;
  description: string;
  capacity: number;
  length_m: number;
  specs: Record<string, string>;
  hero_image: string;
  gallery: GalleryItem[];
  charter_terms: CharterTerms | null;
  serves_activity_ids: string[];
  sort_order: number;
  seo_title: string | null;
  seo_description: string | null;
};

export type InterestType = "activity" | "package" | "resource" | "operator" | "general";
