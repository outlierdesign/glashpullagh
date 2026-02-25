import { storyblokEditable } from "@storyblok/react/rsc";
import { Gallery } from "@/components/Gallery";
import type { GalleryImage } from "@/types";

export function GalleryBlok({ blok }: { blok: any }) {
  const images: GalleryImage[] = (blok.images || []).map((item: any) => ({
    image: item.image?.filename || "/images/placeholder.jpg",
    alt: item.alt || "",
  }));

  return (
    <div {...storyblokEditable(blok)}>
      <Gallery images={images} />
    </div>
  );
}
