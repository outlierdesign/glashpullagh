import { getStoryblokApi } from "@/lib/storyblok";
import { StoryblokStory } from "@storyblok/react/rsc";
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { BentoGrid } from "@/components/BentoGrid";
import { StatsBanner } from "@/components/StatsBanner";
import { ParallaxBreak } from "@/components/ParallaxBreak";
import { AboutSite } from "@/components/AboutSite";
import { TopoMap } from "@/components/TopoMap";
import { RestorationGrid } from "@/components/RestorationGrid";
import { Monitoring } from "@/components/Monitoring";
import { VideoSection } from "@/components/VideoSection";
import { Gallery } from "@/components/Gallery";
import { Footer } from "@/components/Footer";
import { GrainOverlay } from "@/components/shared/GrainOverlay";
import { ProgressBar } from "@/components/shared/ProgressBar";
import { pageData } from "@/lib/data";

export const revalidate = 60;

async function fetchStoryblokData() {
  try {
    const storyblokApi = getStoryblokApi();
    if (!storyblokApi) return null;

    const { data } = await storyblokApi.get("cdn/stories/home", {
      version: "draft",
    });

    return data?.story || null;
  } catch {
    return null;
  }
}

export default async function Home() {
  const story = await fetchStoryblokData();

  // If Storyblok is connected and has content, render via Storyblok
  if (story) {
    return <StoryblokStory story={story} />;
  }

  // Fallback: render with static data when no CMS is connected
  const data = pageData;

  return (
    <>
      <Navigation />
      <ProgressBar />
      <GrainOverlay />

      <main>
        <Hero data={data.hero} />
        <BentoGrid items={data.story} />
        <StatsBanner stats={data.stats} />
        <ParallaxBreak data={data.quote1} id="quote1" />
        <AboutSite data={data.about} />
        <TopoMap pois={data.mapPOIs} />
        <RestorationGrid data={data.restoration} />
        <Monitoring data={data.monitoring} />
        <VideoSection data={data.video} />
        <ParallaxBreak data={data.quote2} id="quote2" />
        <Gallery images={data.gallery} />
      </main>

      <Footer data={data.footer} />
    </>
  );
}
