import { getPackage, getPackages } from "@/lib/data";
import { OG_SIZE, renderOg } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "AquaSail Watersports";

export async function generateStaticParams() {
  return (await getPackages()).map((x) => ({ slug: x.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const item = await getPackage((await params).slug);
  return renderOg({ title: item?.name ?? "AquaSail", eyebrow: "Experience", image: item?.hero_image });
}
