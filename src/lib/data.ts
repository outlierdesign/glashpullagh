import { PageData } from "@/types";

export const pageData: PageData = {
  hero: {
    label: "Glashapullagh Peatland Restoration",
    headingLines: [
      "Restoring Ireland's Peatlands",
      "One hectare at a time",
    ],
    subtitle:
      "A comprehensive restoration project in West Limerick working to regenerate vital peatland ecosystems",
    backgroundImage: "/images/Glashapullagh Restoration West Limerick1.jpg",
    coordinates: {
      latitude: 52.5244,
      longitude: -8.9521,
      altitude: 127,
      label: "Glashapullagh, West Limerick",
    },
  },

  story: [
    {
      label: "The Challenge",
      heading: "Degraded Peatlands Require Active Restoration",
      body: "Over decades, industrial peat extraction and poor land management have damaged Ireland's precious peatland ecosystems. These vital habitats once covered nearly 17% of the country. Today, only remnants remain, many severely degraded and unable to support their original biodiversity.",
      image: "/images/Glashapullagh Restoration West Limerick2.jpg",
      gridSize: "wide",
    },
    {
      label: "Our Vision",
      heading: "Creating Resilient Ecosystems",
      body: "We envision a landscape where peatlands thrive, supporting rare species and sequestering carbon naturally. Through strategic restoration, we're transforming degraded areas back into functioning habitats that benefit wildlife and climate.",
      image: "/images/Glashapullagh Restoration West Limerick3.jpg",
      gridSize: "lg",
    },
    {
      label: "Community Partnership",
      heading: "Local Engagement Drives Success",
      body: "Restoration begins with the community. We partner with local landowners, volunteers, and conservation organizations to ensure projects are grounded in regional knowledge and supported by those who care most about the land.",
      image: "/images/Glashapullagh Restoration West Limerick4.jpg",
      gridSize: "md",
    },
    {
      label: "Long-term Monitoring",
      heading: "Science Guides Every Step",
      body: "Continuous ecological monitoring ensures our strategies work. We track vegetation recovery, water table changes, and wildlife return to validate our approach and adapt management practices based on real-world results.",
      image: "/images/Glashapullagh Restoration West Limerick5.jpg",
      gridSize: "sm",
    },
  ],

  stats: [
    {
      target: 427,
      suffix: "ha",
      label: "Total Area",
      description: "of peatland under restoration management",
    },
    {
      target: 85,
      suffix: "%",
      label: "Vegetation Recovery",
      description: "of target plant species established in restored areas",
    },
    {
      target: 12000,
      suffix: "+",
      label: "Trees Planted",
      description: "native species to support ecosystem recovery",
    },
    {
      target: 2450,
      suffix: "t",
      label: "Carbon Sequestered",
      description: "annually through restored peatland processes",
    },
  ],

  quote1: {
    text: "Peatlands are among Earth's most valuable ecosystems. Restoring them is an investment in our climate and our natural heritage.",
    backgroundImage: "/images/Glashapullagh Restoration West Limerick6.jpg",
  },

  about: {
    heading: "Understanding Peatland Restoration",
    lead: "Peatlands are unique ecosystems that develop over thousands of years. Restoring them requires patience, science, and commitment to ecological principles.",
    bodyParagraphs: [
      "Peat forms when dead plant material accumulates in waterlogged conditions where decomposition is slowed. Over millennia, this process creates deep layers of partially decomposed organic matter—peat—that can reach depths of 10 meters or more. These soils are extraordinarily rich in carbon.",
      "During the 20th century, peatlands across Ireland were extensively drained and excavated for fuel and horticultural use. This extraction destroyed the very conditions that allowed peatlands to exist, causing rapid carbon loss, ecosystem collapse, and the extinction of specialized peatland plants and animals.",
      "True restoration requires re-establishing waterlogged conditions that allow peat formation to resume. This means blocking drainage channels, removing invasive species, and allowing native peatland plants to recolonize. The process is slow—measurable recovery takes decades—but the ecological and climate benefits are immense.",
      "We combine traditional ecological knowledge with modern monitoring technology to guide restoration. Each site presents unique challenges requiring customized approaches based on soil conditions, hydrology, and existing vegetation.",
    ],
    images: [
      "/images/Glashapullagh Restoration West Limerick7.jpg",
      "/images/Glashapullagh Restoration West Limerick8.jpg",
    ],
    conditionCards: [
      {
        title: "Waterlogging",
        description:
          "Restoration re-establishes high water tables essential for peat formation and specialized plant communities",
      },
      {
        title: "Species Recovery",
        description:
          "Sphagnum mosses, heathers, and specialized insects return when conditions are restored",
      },
      {
        title: "Carbon Cycling",
        description:
          "Restored peatlands switch from carbon sources to carbon sinks, sequestering CO2 annually",
      },
      {
        title: "Biodiversity",
        description:
          "Bird species like golden plover and merlin rely on peatland habitat for breeding and feeding",
      },
    ],
  },

  mapPOIs: [
    {
      id: "poi-1",
      label: "A",
      title: "Restored Bog Pool",
      description:
        "Shallow water bodies that provide habitat for aquatic insects and breeding amphibians",
      x: 25,
      y: 35,
      color: "water",
    },
    {
      id: "poi-2",
      label: "B",
      title: "Sphagnum Moss Restoration Zone",
      description:
        "Areas where peat-forming mosses have been successfully re-established",
      x: 60,
      y: 20,
      color: "gold",
    },
    {
      id: "poi-3",
      label: "C",
      title: "Drain Blocking Infrastructure",
      description:
        "Strategic barriers that restore water levels to pre-drainage conditions",
      x: 45,
      y: 55,
      color: "gold",
    },
    {
      id: "poi-4",
      label: "D",
      title: "Native Tree Nursery",
      description:
        "Where locally-sourced seeds grow into saplings for landscape restoration",
      x: 70,
      y: 70,
      color: "gold",
    },
    {
      id: "poi-5",
      label: "E",
      title: "Monitoring Station",
      description:
        "Continuous sensors track water tables, vegetation, and carbon cycling",
      x: 35,
      y: 65,
      color: "water",
    },
    {
      id: "poi-6",
      label: "F",
      title: "Visitor Access Point",
      description: "Educational trails showcasing restoration techniques and wildlife",
      x: 15,
      y: 50,
      color: "gold",
    },
    {
      id: "poi-7",
      label: "G",
      title: "Degraded Area Under Treatment",
      description:
        "Invasive species removal and hydrological restoration in progress",
      x: 55,
      y: 80,
      color: "water",
    },
    {
      id: "poi-8",
      label: "H",
      title: "Research Transect",
      description:
        "Long-term study areas tracking vegetation and species recovery over decades",
      x: 75,
      y: 45,
      color: "gold",
    },
  ],

  restoration: {
    heading: "Restoration Techniques",
    description:
      "We employ evidence-based methods refined through decades of peatland research across Europe. Each technique targets specific degradation patterns while respecting the unique character of this landscape.",
    actions: [
      {
        number: 1,
        title: "Hydrological Restoration",
        description:
          "Re-establishing natural water tables by blocking or removing drainage systems that were installed decades ago",
        technicalDetail:
          "Installation of peat dams and sluice gates to raise water levels to within 10-30cm of the surface, restoring anaerobic conditions essential for peat preservation",
        image: "/images/Glashapullagh Restoration West Limerick9.jpg",
        gridSpan: 2,
      },
      {
        number: 2,
        title: "Invasive Species Management",
        description:
          "Controlling non-native plants like Rhododendron and Sitka Spruce that outcompete native peatland flora",
        technicalDetail:
          "Selective removal using mechanized cutting and herbicide application to minimize soil disturbance, followed by monitoring for recruitment",
        image: "/images/Glashapullagh Restoration West Limerick10.jpg",
        gridSpan: 1,
      },
      {
        number: 3,
        title: "Native Plant Establishment",
        description:
          "Sowing and transplanting Sphagnum moss, heather, and sedge species to accelerate ecosystem recovery",
        technicalDetail:
          "Sphagnum fragments collected from donor sites and carefully transplanted into prepared microsites with optimized microtopography",
        image: "/images/Glashapullagh Restoration West Limerick11.jpg",
        gridSpan: 1,
      },
      {
        number: 4,
        title: "Habitat Diversification",
        description:
          "Creating varied microtopography to support diverse plant communities and provide refuge for specialist species",
        technicalDetail:
          "Constructing hummocks and hollows that mimic natural bog pools, providing distinct hydrological microhabitats",
        image: "/images/Glashapullagh Restoration West Limerick12.jpg",
        gridSpan: 2,
      },
      {
        number: 5,
        title: "Grazing Management",
        description:
          "Strategic use of livestock grazing to prevent scrub encroachment while maintaining habitat structure",
        technicalDetail:
          "Rotational grazing by hardy breeds like Belted Galloway cattle at carefully calibrated stocking densities",
        image: "/images/Glashapullagh Restoration West Limerick13.jpg",
        gridSpan: 1,
      },
      {
        number: 6,
        title: "Continuous Monitoring",
        description:
          "Long-term ecological monitoring to track restoration success and guide adaptive management",
        technicalDetail:
          "Annual vegetation surveys, hydrological measurements, wildlife monitoring, and carbon cycling assessments",
        image: "/images/Glashapullagh Restoration West Limerick14.jpg",
        gridSpan: 1,
      },
      {
        number: 7,
        title: "Community Stewardship",
        description:
          "Engaging local communities through volunteer work days and educational programs",
        technicalDetail:
          "Monthly volunteer restoration events, school partnerships, and annual public open days sharing restoration progress",
        image: "/images/Glashapullagh Restoration West Limerick15.jpg",
        gridSpan: 2,
      },
    ],
  },

  monitoring: {
    heading: "Science-Driven Management",
    bodyParagraphs: [
      "Restoration success cannot be assumed—it must be measured. We maintain a comprehensive monitoring program that tracks dozens of ecological indicators across the restored landscape.",
      "Hydrological sensors installed throughout the site provide continuous data on water levels, allowing us to fine-tune drain-blocking infrastructure to achieve target water tables. Vegetation surveys conducted each summer track the recovery of native plant communities and the decline of invasive species.",
      "Bird point counts at dawn capture changes in community composition, with particular attention to specialist peatland species. Insect surveys reveal the return of rare dragonflies, butterflies, and bog mosses found nowhere else on Earth.",
      "Annual soil sampling measures carbon accumulation rates, validating our hypothesis that restored peatlands resume their role as carbon sinks. This data feeds back into adaptive management—when monitoring reveals an approach isn't working, we adjust course based on evidence rather than assumption.",
    ],
    image: "/images/Glashapullagh Restoration West Limerick16.jpg",
  },

  video: {
    heading: "Restoration in Action",
    description:
      "Watch our restoration teams at work across the Glashapullagh site, from drain blocking to sphagnum transplantation to wildlife monitoring.",
    posterImage: "/images/Glashapullagh Restoration West Limerick17.jpg",
  },

  quote2: {
    text: "When we restore a peatland, we don't just save a wetland. We're healing a landscape that stores as much carbon as all the forests in Ireland combined.",
    backgroundImage: "/images/Glashapullagh Restoration West Limerick18.jpg",
  },

  gallery: [
    {
      image: "/images/Glashapullagh Restoration West Limerick19.jpg",
      alt: "Restored peatland habitat with sphagnum mosses",
    },
    {
      image: "/images/Glashapullagh Restoration West Limerick20.jpg",
      alt: "Volunteer team working on habitat restoration",
    },
    {
      image: "/images/Glashapullagh Restoration West Limerick21.jpg",
      alt: "Golden plover nesting in restored peatland",
    },
    {
      image: "/images/Glashapullagh Restoration West Limerick22.jpg",
      alt: "Drain blocking infrastructure",
    },
    {
      image: "/images/Glashapullagh Restoration West Limerick23.jpg",
      alt: "Bog pool habitat for aquatic insects",
    },
    {
      image: "/images/Glashapullagh Restoration West Limerick24.jpg",
      alt: "Native plant propagation at nursery",
    },
  ],

  footer: {
    closingHeading: "Join the Restoration Movement",
    closingText:
      "Whether through volunteering, supporting our work, or simply learning more about peatland conservation, every contribution helps restore these irreplaceable ecosystems.",
    logoUrl: "/WAN-Logo.png",
  },
};
