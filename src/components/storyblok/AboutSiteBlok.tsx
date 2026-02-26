import { storyblokEditable } from "@storyblok/react/rsc";
import { AboutSite } from "@/components/AboutSite";
import { pageData } from "@/lib/data";
import type { AboutData } from "@/types";

const defaults = pageData.about;

export function AboutSiteBlok({ blok }: { blok: any }) {
  const data: AboutData = {
    heading: blok.heading || defaults.heading,
    lead: blok.lead || defaults.lead,
    bodyParagraphs: blok.body_paragraphs?.split("\n\n").filter(Boolean) || defaults.bodyParagraphs,
    images: [
      blok.image_1?.filename || defaults.images[0],
      blok.image_2?.filename || defaults.images[1],
    ],
    conditionCards: (blok.condition_cards || []).length > 0
      ? (blok.condition_cards || []).map((card: any) => ({
          title: card.title || "",
          description: card.description || "",
        }))
      : defaults.conditionCards,
  };

  return (
    <div {...storyblokEditable(blok)}>
      <AboutSite data={data} />
    </div>
  );
}
