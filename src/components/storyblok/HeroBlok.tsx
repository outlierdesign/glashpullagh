import { storyblokEditable } from "@storyblok/react/rsc";
import { Hero } from "@/components/Hero";
import type { HeroData } from "@/types";

export function HeroBlok({ blok }: { blok: any }) {
  const data: HeroData = {
    label: blok.label || "",
    headingLines: blok.heading_lines?.split("\n").filter(Boolean) || [],
    subtitle: blok.subtitle || "",
    backgroundImage: blok.background_image?.filename || "/images/placeholder.jpg",
    coordinates: {
      latitude: Number(blok.latitude) || 0,
      longitude: Number(blok.longitude) || 0,
      altitude: Number(blok.altitude) || 0,
      label: blok.location_label || "",
    },
  };

  return (
    <div {...storyblokEditable(blok)}>
      <Hero data={data} />
    </div>
  );
}
