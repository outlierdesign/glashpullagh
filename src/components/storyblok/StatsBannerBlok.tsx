import { storyblokEditable } from "@storyblok/react/rsc";
import { StatsBanner } from "@/components/StatsBanner";
import { pageData } from "@/lib/data";
import type { StatItem } from "@/types";

const defaults = pageData.stats;

export function StatsBannerBlok({ blok }: { blok: any }) {
  const stats: StatItem[] = (blok.stats || []).length > 0
    ? (blok.stats || []).map((stat: any, i: number) => ({
        target: Number(stat.target) || defaults[i]?.target || 0,
        suffix: stat.suffix || defaults[i]?.suffix || "",
        label: stat.label || defaults[i]?.label || "",
        description: stat.description || defaults[i]?.description || "",
      }))
    : defaults;

  return (
    <div {...storyblokEditable(blok)}>
      <StatsBanner stats={stats} />
    </div>
  );
}
