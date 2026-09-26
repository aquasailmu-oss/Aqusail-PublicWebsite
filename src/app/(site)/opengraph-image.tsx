import { OG_SIZE, renderOg } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "AquaSail Watersports — boat trips and lagoon days in Mauritius";

export default function Image() {
  return renderOg({ title: "Stay for the whole day", eyebrow: "Come for the lagoon" });
}
