import { storyblokEditable } from "@storyblok/react/rsc";
import { Monitoring } from "@/components/Monitoring";
import { pageData } from "@/lib/data";
import type { MonitoringData } from "@/types";

const defaults = pageData.monitoring;

export function MonitoringBlok({ blok }: { blok: any }) {
  const data: MonitoringData = {
    heading: blok.heading || defaults.heading,
    bodyParagraphs: blok.body_paragraphs?.split("\n\n").filter(Boolean) || defaults.bodyParagraphs,
    image: blok.image?.filename || defaults.image,
  };

  return (
    <div {...storyblokEditable(blok)}>
      <Monitoring data={data} />
    </div>
  );
}
