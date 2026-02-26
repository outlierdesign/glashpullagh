import { storyblokEditable } from "@storyblok/react/rsc";
import { ParallaxBreak } from "@/components/ParallaxBreak";
import { pageData } from "@/lib/data";
import type { QuoteData } from "@/types";

export function ParallaxBreakBlok({ blok }: { blok: any }) {
  // Determine which quote defaults to use based on section_id
  const isQuote2 = blok.section_id === "quote2";
  const defaults = isQuote2 ? pageData.quote2 : pageData.quote1;
  const data: QuoteData = {
    text: blok.text || defaults.text,
    backgroundImage: blok.background_image?.filename || defaults.backgroundImage,
  };

  return (
    <div {...storyblokEditable(blok)}>
      <ParallaxBreak data={data} id={blok.section_id || "quote"} />
    </div>
  );
}
