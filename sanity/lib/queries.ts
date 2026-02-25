import { groq } from 'next-sanity';

export const SITE_PAGE_QUERY = groq`
  *[_type == "sitePage"][0] {
    _id,
    title,
    slug,
    hero {
      label,
      headingLines,
      subtitle,
      backgroundImage {
        asset->,
        hotspot,
        crop,
      },
      coordinates {
        latitude,
        longitude,
        altitude,
        locationLabel,
      },
    },
    storyItems[] {
      label,
      heading,
      body,
      image {
        asset->,
        hotspot,
        crop,
        alt,
      },
      overlayLabel,
      overlayHeading,
      gridSize,
    },
    stats[] {
      target,
      suffix,
      label,
      description,
    },
    quote1 {
      text,
      backgroundImage {
        asset->,
        hotspot,
        crop,
      },
    },
    about {
      heading,
      lead,
      bodyParagraphs,
      images[] {
        asset->,
        hotspot,
        crop,
        alt,
      },
      conditionCards[] {
        title,
        description,
      },
    },
    mapPOIs[] {
      poiId,
      label,
      title,
      description,
      xCoord,
      yCoord,
      colorType,
    },
    restorationHeading,
    restorationDescription,
    restorationActions[] {
      actionNumber,
      title,
      description,
      technicalDetail,
      image {
        asset->,
        hotspot,
        crop,
        alt,
      },
      gridSpan,
    },
    monitoring {
      heading,
      bodyParagraphs,
      image {
        asset->,
        hotspot,
        crop,
        alt,
      },
    },
    video {
      heading,
      description,
      posterImage {
        asset->,
        hotspot,
        crop,
        alt,
      },
      videoUrl,
    },
    quote2 {
      text,
      backgroundImage {
        asset->,
        hotspot,
        crop,
      },
    },
    galleryImages[] {
      asset->,
      hotspot,
      crop,
      alt,
    },
    footerClosingHeading,
    footerClosingText,
  }
`;
