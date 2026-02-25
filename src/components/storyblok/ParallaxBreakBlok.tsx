import { storyblokEditable } from "@storyblok/react/rsc";
import { ParallaxBreak } from "@/components/ParallaxBreak";
import type { QuoteData } from "@/types";

export function ParallaxBreakBlok({ blok }: { blok: any }) {
  const data: QuoteData = {
    text: blok.text || "",
    backgroundImage: blok.background_image?.filename || "/images/placeholder.jpg",
  };

  return (
    <div {...storyblokEditable(blok)}>
      <ParallaxBreak data={data} id={blok.section_id || "quote"} />
    </div>
  );
}
