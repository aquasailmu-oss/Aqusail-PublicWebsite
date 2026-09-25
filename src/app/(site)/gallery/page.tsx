import type { Metadata } from "next";
import { Gallery } from "@/components/site/Gallery";
import { CtaBand, PageHero } from "@/components/site/ui";
import { galleryPhotos } from "@/lib/data";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photographs of the lagoon, the reef, the wildlife and the boats around Mauritius.",
  alternates: { canonical: "/gallery" },
};

export default function GalleryPage() {
  return (
    <>
      <PageHero
        script="Seen from the boat"
        title="Gallery"
        image={{ path: "underwater-waterfall", alt: "The southwest tip of Mauritius from the air" }}
        lede="The lagoon, the reef and the animals that live in it, and the boats that take you there."
      />
      <section className="band">
        <div className="wrap">
          <Gallery items={galleryPhotos} layout="masonry" filters />
        </div>
      </section>
      <CtaBand />
    </>
  );
}
