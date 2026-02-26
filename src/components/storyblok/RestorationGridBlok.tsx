import { storyblokEditable } from "@storyblok/react/rsc";
import { RestorationGrid } from "@/components/RestorationGrid";
import { pageData } from "@/lib/data";
import type { RestorationSection } from "@/types";

const defaults = pageData.restoration;

export function RestorationGridBlok({ blok }: { blok: any }) {
  const data: RestorationSection = {
    heading: blok.heading || defaults.heading,
    description: blok.description || defaults.description,
    actions: (blok.actions || []).length > 0
      ? (blok.actions || []).map((action: any, index: number) => ({
          number: Number(action.action_number) || defaults.actions[index]?.number || index + 1,
          title: action.title || defaults.actions[index]?.title || "",
          description: action.description || defaults.actions[index]?.description || "",
          technicalDetail: action.technical_detail || defaults.actions[index]?.technicalDetail || "",
          image: action.image?.filename || defaults.actions[index]?.image || "/images/placeholder.jpg",
          gridSpan: Number(action.grid_span) || defaults.actions[index]?.gridSpan || 1,
        }))
      : defaults.actions,
  };

  return (
    <div {...storyblokEditable(blok)}>
      <RestorationGrid data={data} />
    </div>
  );
}
