import { storyblokEditable } from "@storyblok/react/rsc";
import { VideoSection } from "@/components/VideoSection";
import { pageData } from "@/lib/data";
import type { VideoData } from "@/types";

const defaults = pageData.video;

export function VideoSectionBlok({ blok }: { blok: any }) {
  const data: VideoData = {
    heading: blok.heading || defaults.heading,
    description: blok.description || defaults.description,
    posterImage: blok.poster_image?.filename || defaults.posterImage,
    videoUrl: blok.video_url || undefined,
  };

  return (
    <div {...storyblokEditable(blok)}>
      <VideoSection data={data} />
    </div>
  );
}
