import { getActivity, getActivities } from "@/lib/data";
import { OG_SIZE, renderOg } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "AquaSail Watersports";

export async function generateStaticParams() {
  return (await getActivities()).map((x) => ({ slug: x.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const item = await getActivity((await params).slug);
  return renderOg({ title: item?.name ?? "AquaSail", eyebrow: "Activity", image: item?.hero_image });
}
