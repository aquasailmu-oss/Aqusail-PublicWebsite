/**
 * The site's canonical origin. Empty or malformed values fall through rather
 * than crash the build (`new URL("")` throws): NEXT_PUBLIC_SITE_URL, then
 * Vercel's production domain, then the deployment URL, then localhost.
 */
function resolveSiteUrl(): string {
  const candidates = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.VERCEL_URL,
  ];
  for (const raw of candidates) {
    const v = raw?.trim();
    if (!v) continue;
    try {
      return new URL(/^https?:\/\//.test(v) ? v : `https://${v}`).origin;
    } catch {
      /* try the next candidate */
    }
  }
  return "http://localhost:3000";
}

/**
 * Business details shown on the site. Everything marked TODO must be replaced
 * with the real, checkable value before launch (build plan §11) — do not guess.
 */
export const SITE = {
  name: "AquaSail Watersports",
  legalName: "AquaSail Watersports Ltd",
  url: resolveSiteUrl(),
  email: "aquasail.mu@gmail.com",
  // TODO(launch): real reception phone and WhatsApp numbers.
  phone: "+230 5 000 0000",
  whatsapp: "+230 5 000 0000",
  whatsappDigits: "23050000000",
  // TODO(launch): meeting point, registered address and opening hours.
  address: "Meeting point to be confirmed — Mauritius",
  hours: [
    { days: "Monday – Sunday", time: "08:00 – 17:00" },
    { days: "Public holidays", time: "Weather permitting" },
  ],
  // TODO(launch): company registration and tourism licence numbers.
  brn: "BRN — to be confirmed",
  tourismLicence: "Tourism Authority licence — to be confirmed",
  mapsUrl: "https://maps.google.com/?q=Mauritius",
  geo: { lat: -20.2, lng: 57.5 },
} as const;

export const NAV = [
  { href: "/activities", label: "Activities" },
  { href: "/experiences", label: "Experiences" },
  { href: "/fleet", label: "Fleet" },
  { href: "/partners", label: "Tour operators" },
  { href: "/about", label: "About" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
] as const;
