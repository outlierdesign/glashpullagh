import { storyblokEditable } from "@storyblok/react/rsc";
import { InteractiveViewer } from "@/components/InteractiveViewer";
import type { InteractiveViewerData } from "@/components/InteractiveViewer";

export function InteractiveViewerBlok({ blok }: { blok: any }) {
  const data: InteractiveViewerData = {
    heading: blok.heading || "",
    description: blok.description || "",
    embedUrl: blok.embed_url || "",
    aspectRatio: blok.aspect_ratio || "16/9",
  };

  return (
    <div {...storyblokEditable(blok)}>
      <InteractiveViewer data={data} />
    </div>
  );
}
