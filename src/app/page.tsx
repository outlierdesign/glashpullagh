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

export default function Home() {
  // In production, this would fetch from Sanity CMS
  // For now, use static fallback data
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
