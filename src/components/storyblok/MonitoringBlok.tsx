import { storyblokEditable } from "@storyblok/react/rsc";
import { Monitoring } from "@/components/Monitoring";
import type { MonitoringData } from "@/types";

export function MonitoringBlok({ blok }: { blok: any }) {
  const data: MonitoringData = {
    heading: blok.heading || "",
    bodyParagraphs: blok.body_paragraphs?.split("\n\n").filter(Boolean) || [],
    image: blok.image?.filename || "/images/placeholder.jpg",
  };

  return (
    <div {...storyblokEditable(blok)}>
      <Monitoring data={data} />
    </div>
  );
}
