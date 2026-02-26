import { storyblokEditable } from "@storyblok/react/rsc";
import { Gallery } from "@/components/Gallery";
import { pageData } from "@/lib/data";
import type { GalleryImage } from "@/types";

const defaults = pageData.gallery;

export function GalleryBlok({ blok }: { blok: any }) {
  const images: GalleryImage[] = (blok.images || []).map((item: any, i: number) => ({
    image: item.image?.filename || defaults[i]?.image || "/images/placeholder.jpg",
    alt: item.alt || defaults[i]?.alt || "",
  }));

  return (
    <div {...storyblokEditable(blok)}>
      <Gallery images={images} />
    </div>
  );
}
