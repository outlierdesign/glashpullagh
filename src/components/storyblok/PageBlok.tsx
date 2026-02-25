import { storyblokEditable, StoryblokServerComponent } from "@storyblok/react/rsc";
import { Navigation } from "@/components/Navigation";
import { GrainOverlay } from "@/components/shared/GrainOverlay";
import { ProgressBar } from "@/components/shared/ProgressBar";

export function PageBlok({ blok }: { blok: any }) {
  return (
    <div {...storyblokEditable(blok)}>
      <Navigation />
      <ProgressBar />
      <GrainOverlay />
      <main>
        {blok.body?.map((nestedBlok: any) => (
          <StoryblokServerComponent blok={nestedBlok} key={nestedBlok._uid} />
        ))}
      </main>
    </div>
  );
}
