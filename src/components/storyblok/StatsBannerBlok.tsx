import { storyblokEditable } from "@storyblok/react/rsc";
import { StatsBanner } from "@/components/StatsBanner";
import type { StatItem } from "@/types";

export function StatsBannerBlok({ blok }: { blok: any }) {
  const stats: StatItem[] = (blok.stats || []).map((stat: any) => ({
    target: Number(stat.target) || 0,
    suffix: stat.suffix || "",
    label: stat.label || "",
    description: stat.description || "",
  }));

  return (
    <div {...storyblokEditable(blok)}>
      <StatsBanner stats={stats} />
    </div>
  );
}
