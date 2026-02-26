import { storyblokEditable } from "@storyblok/react/rsc";
import { BentoGrid } from "@/components/BentoGrid";
import { pageData } from "@/lib/data";
import type { StoryItem } from "@/types";

const defaults = pageData.story;

export function BentoGridBlok({ blok }: { blok: any }) {
  const items: StoryItem[] = (blok.items || []).map((item: any, i: number) => ({
    label: item.label || defaults[i]?.label || "",
    heading: item.heading || defaults[i]?.heading || "",
    body: item.body || defaults[i]?.body || "",
    image: item.image?.filename || defaults[i]?.image || "/images/placeholder.jpg",
    gridSize: item.grid_size || defaults[i]?.gridSize || "md",
  }));

  return (
    <div {...storyblokEditable(blok)}>
      <BentoGrid items={items} />
    </div>
  );
}
