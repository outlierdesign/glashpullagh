import { storyblokEditable } from "@storyblok/react/rsc";
import { TopoMap } from "@/components/TopoMap";
import type { MapPOI } from "@/types";

export function TopoMapBlok({ blok }: { blok: any }) {
  const pois: MapPOI[] = (blok.points_of_interest || []).map(
    (poi: any, index: number) => ({
      id: poi._uid || `poi-${index}`,
      label: poi.label || String.fromCharCode(65 + index),
      title: poi.title || "",
      description: poi.description || "",
      x: Number(poi.x_position) || 0,
      y: Number(poi.y_position) || 0,
      color: poi.color || "gold",
    })
  );

  return (
    <div {...storyblokEditable(blok)}>
      <TopoMap pois={pois} />
    </div>
  );
}
