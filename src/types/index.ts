export interface Coordinates {
  latitude: number;
  longitude: number;
  altitude: number;
  label: string;
}

export interface HeroData {
  label: string;
  headingLines: string[];
  subtitle: string;
  backgroundImage: string;
  coordinates: Coordinates;
}

export interface StoryItem {
  label: string;
  heading: string;
  body: string;
  image: string;
  overlayLabel?: string;
  overlayHeading?: string;
  gridSize: "sm" | "md" | "lg" | "wide";
}

export interface StatItem {
  target: number;
  suffix: string;
  label: string;
  description: string;
}

export interface QuoteData {
  text: string;
  backgroundImage: string;
}

export interface ConditionCard {
  title: string;
  description: string;
}

export interface AboutData {
  heading: string;
  lead: string;
  bodyParagraphs: string[];
  images: string[];
  conditionCards: ConditionCard[];
}

export interface MapPOI {
  id: string;
  label: string;
  title: string;
  description: string;
  x: number;
  y: number;
  color: "gold" | "water";
}

export interface RestorationAction {
  number: number;
  title: string;
  description: string;
  technicalDetail: string;
  image: string;
  gridSpan: number;
}

export interface RestorationSection {
  heading: string;
  description: string;
  actions: RestorationAction[];
}

export interface MonitoringData {
  heading: string;
  bodyParagraphs: string[];
  image: string;
}

export interface VideoData {
  heading: string;
  description: string;
  posterImage: string;
  videoUrl?: string;
}

export interface GalleryImage {
  image: string;
  alt: string;
}

export interface FooterData {
  closingHeading: string;
  closingText: string;
  logoUrl: string;
}

export interface PageData {
  hero: HeroData;
  story: StoryItem[];
  stats: StatItem[];
  quote1: QuoteData;
  about: AboutData;
  mapPOIs: MapPOI[];
  restoration: RestorationSection;
  monitoring: MonitoringData;
  video: VideoData;
  quote2: QuoteData;
  gallery: GalleryImage[];
  footer: FooterData;
}
