import { storyblokEditable } from "@storyblok/react/rsc";
import { VideoSection } from "@/components/VideoSection";
import type { VideoData } from "@/types";

export function VideoSectionBlok({ blok }: { blok: any }) {
  const data: VideoData = {
    heading: blok.heading || "",
    description: blok.description || "",
    posterImage: blok.poster_image?.filename || "/images/placeholder.jpg",
    videoUrl: blok.video_url || undefined,
  };

  return (
    <div {...storyblokEditable(blok)}>
      <VideoSection data={data} />
    </div>
  );
}
