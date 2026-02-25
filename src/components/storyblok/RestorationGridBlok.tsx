import { storyblokEditable } from "@storyblok/react/rsc";
import { RestorationGrid } from "@/components/RestorationGrid";
import type { RestorationSection } from "@/types";

export function RestorationGridBlok({ blok }: { blok: any }) {
  const data: RestorationSection = {
    heading: blok.heading || "",
    description: blok.description || "",
    actions: (blok.actions || []).map((action: any, index: number) => ({
      number: Number(action.action_number) || index + 1,
      title: action.title || "",
      description: action.description || "",
      technicalDetail: action.technical_detail || "",
      image: action.image?.filename || "/images/placeholder.jpg",
      gridSpan: Number(action.grid_span) || 1,
    })),
  };

  return (
    <div {...storyblokEditable(blok)}>
      <RestorationGrid data={data} />
    </div>
  );
}
