import manifest from "./media-manifest.json";

export type MediaEntry = {
  src: string;
  width: number;
  height: number;
  source: string;
  license: string;
  page: string;
  author: string;
  title?: string;
};

const MEDIA = manifest as Record<string, MediaEntry>;

export type ResolvedImage = { src: string; width: number; height: number };

/**
 * Resolve an image path from the catalogue to something next/image can load.
 *   - a key in media-manifest.json → local file in public/media (seed photography)
 *   - an absolute URL → used as is
 *   - anything else → a path in the Supabase Storage bucket 'website-media'
 */
export function mediaUrl(
  path: string,
  opts: { width?: number; quality?: number } = {},
): ResolvedImage {
  const local = MEDIA[path];
  if (local) return { src: local.src, width: local.width, height: local.height };
  if (/^https?:\/\//.test(path)) return { src: path, width: opts.width ?? 2000, height: 1333 };
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const params = new URLSearchParams();
  if (opts.width) params.set("width", String(opts.width));
  if (opts.quality) params.set("quality", String(opts.quality));
  const qs = params.size ? `?${params}` : "";
  return {
    src: `${base}/storage/v1/render/image/public/website-media/${path}${qs}`,
    width: opts.width ?? 2000,
    height: Math.round((opts.width ?? 2000) * 0.66),
  };
}

export function allCredits(): [string, MediaEntry][] {
  return Object.entries(MEDIA);
}
