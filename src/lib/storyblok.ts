import { storyblokInit, apiPlugin } from "@storyblok/react/rsc";

import { HeroBlok } from "@/components/storyblok/HeroBlok";
import { BentoGridBlok } from "@/components/storyblok/BentoGridBlok";
import { StatsBannerBlok } from "@/components/storyblok/StatsBannerBlok";
import { ParallaxBreakBlok } from "@/components/storyblok/ParallaxBreakBlok";
import { AboutSiteBlok } from "@/components/storyblok/AboutSiteBlok";
import { TopoMapBlok } from "@/components/storyblok/TopoMapBlok";
import { RestorationGridBlok } from "@/components/storyblok/RestorationGridBlok";
import { MonitoringBlok } from "@/components/storyblok/MonitoringBlok";
import { VideoSectionBlok } from "@/components/storyblok/VideoSectionBlok";
import { GalleryBlok } from "@/components/storyblok/GalleryBlok";
import { FooterBlok } from "@/components/storyblok/FooterBlok";
import { PageBlok } from "@/components/storyblok/PageBlok";

const components = {
  page: PageBlok,
  hero: HeroBlok,
  bento_grid: BentoGridBlok,
  stats_banner: StatsBannerBlok,
  parallax_break: ParallaxBreakBlok,
  about_site: AboutSiteBlok,
  topo_map: TopoMapBlok,
  restoration_grid: RestorationGridBlok,
  monitoring: MonitoringBlok,
  video_section: VideoSectionBlok,
  gallery: GalleryBlok,
  footer: FooterBlok,
};

export const getStoryblokApi = storyblokInit({
  accessToken: process.env.NEXT_PUBLIC_STORYBLOK_TOKEN,
  use: [apiPlugin],
  components,
});
