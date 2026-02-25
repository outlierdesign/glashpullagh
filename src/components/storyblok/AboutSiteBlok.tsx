import { storyblokEditable } from "@storyblok/react/rsc";
import { AboutSite } from "@/components/AboutSite";
import type { AboutData } from "@/types";

export function AboutSiteBlok({ blok }: { blok: any }) {
  const data: AboutData = {
    heading: blok.heading || "",
    lead: blok.lead || "",
    bodyParagraphs: blok.body_paragraphs?.split("\n\n").filter(Boolean) || [],
    images: [
      blok.image_1?.filename || "/images/placeholder.jpg",
      blok.image_2?.filename || "/images/placeholder.jpg",
    ],
    conditionCards: (blok.condition_cards || []).map((card: any) => ({
      title: card.title || "",
      description: card.description || "",
    })),
  };

  return (
    <div {...storyblokEditable(blok)}>
      <AboutSite data={data} />
    </div>
  );
}
