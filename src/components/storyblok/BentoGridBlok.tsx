import { storyblokEditable } from "@storyblok/react/rsc";
import { BentoGrid } from "@/components/BentoGrid";
import type { StoryItem } from "@/types";

export function BentoGridBlok({ blok }: { blok: any }) {
  const items: StoryItem[] = (blok.items || []).map((item: any) => ({
    label: item.label || "",
    heading: item.heading || "",
    body: item.body || "",
    image: item.image?.filename || "/images/placeholder.jpg",
    gridSize: item.grid_size || "md",
  }));

  return (
    <div {...storyblokEditable(blok)}>
      <BentoGrid items={items} />
    </div>
  );
}
