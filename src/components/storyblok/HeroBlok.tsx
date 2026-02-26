import { storyblokEditable } from "@storyblok/react/rsc";
import { Hero } from "@/components/Hero";
import { pageData } from "@/lib/data";
import type { HeroData } from "@/types";

const defaults = pageData.hero;

export function HeroBlok({ blok }: { blok: any }) {
  const data: HeroData = {
    label: blok.label || defaults.label,
    headingLines: blok.heading_lines?.split("\n").filter(Boolean) || defaults.headingLines,
    subtitle: blok.subtitle || defaults.subtitle,
    backgroundImage: blok.background_image?.filename || defaults.backgroundImage,
    coordinates: {
      latitude: Number(blok.latitude) || defaults.coordinates.latitude,
      longitude: Number(blok.longitude) || defaults.coordinates.longitude,
      altitude: Number(blok.altitude) || defaults.coordinates.altitude,
      label: blok.location_label || defaults.coordinates.label,
    },
  };

  return (
    <div {...storyblokEditable(blok)}>
      <Hero data={data} />
    </div>
  );
}
