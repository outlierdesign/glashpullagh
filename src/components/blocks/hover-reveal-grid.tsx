"use client"

import {
  CardHoverReveal,
  CardHoverRevealMain,
  CardHoverRevealContent,
} from "@/components/ui/reveal-on-hover"

interface HoverRevealCard {
  image: string
  title: string
  tags: { label: string; color?: string }[]
  description: string
}

interface HoverRevealGridProps {
  sectionTitle?: string
  sectionSubtitle?: string
  cards?: HoverRevealCard[]
}

const defaultCards: HoverRevealCard[] = [
  {
    image:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1280&auto=format&fit=crop",
    title: "Peatland Ecology",
    tags: [
      { label: "Carbon Storage" },
      { label: "Biodiversity" },
      { label: "Water Filtration" },
    ],
    description:
      "Peatlands store twice as much carbon as all the world's forests combined, making their preservation critical to climate stability.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1446329813274-7c9036bd9a1f?q=80&w=1280&auto=format&fit=crop",
    title: "Restoration Methods",
    tags: [
      { label: "Drain Blocking" },
      { label: "Revegetation" },
      { label: "Monitoring" },
    ],
    description:
      "Strategic interventions rewet degraded bog, allowing natural processes to resume peat formation and ecological recovery.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1280&auto=format&fit=crop",
    title: "Community Impact",
    tags: [
      { label: "Education" },
      { label: "Heritage" },
      { label: "Wellbeing" },
    ],
    description:
      "Connecting people with the landscape through walks, workshops, and cultural storytelling preserves both ecology and tradition.",
  },
]

export function HoverRevealGrid({
  sectionTitle = "Discover the Landscape",
  sectionSubtitle = "Hover to explore the interconnected dimensions of peatland restoration at Glashpullagh.",
  cards = defaultCards,
}: HoverRevealGridProps) {
  return (
    <section className="py-20 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--gold)",
            }}
          >
            {sectionTitle}
          </h2>
          <p
            className="max-w-2xl mx-auto text-base md:text-lg"
            style={{
              fontFamily: "var(--font-body)",
              color: "var(--text-secondary)",
            }}
          >
            {sectionSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, index) => (
            <CardHoverReveal
              key={index}
              className="h-[480px] md:h-[520px] rounded-xl"
            >
              <CardHoverRevealMain>
                <img
                  width={1280}
                  height={720}
                  alt={card.title}
                  src={card.image}
                  className="inline-block size-full max-h-full max-w-full object-cover align-middle"
                />
              </CardHoverRevealMain>
              <CardHoverRevealContent
                className="space-y-4 rounded-2xl"
                style={{
                  background: "rgba(10, 11, 8, 0.8)",
                  color: "var(--cream)",
                }}
              >
                <div className="space-y-2">
                  <h3
                    className="text-xl font-bold"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: "var(--gold-light)",
                    }}
                  >
                    {card.title}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {card.tags.map((tag, tagIndex) => (
                      <div
                        key={tagIndex}
                        className="rounded-full px-3 py-1"
                        style={{
                          background: "var(--green-deep)",
                          border: "1px solid var(--green-mid)",
                        }}
                      >
                        <p
                          className="text-xs leading-normal"
                          style={{
                            fontFamily: "var(--font-ui)",
                            color: "var(--green-light)",
                          }}
                        >
                          {tag.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <p
                    className="text-sm leading-relaxed"
                    style={{
                      fontFamily: "var(--font-body)",
                      color: "var(--cream-dim)",
                    }}
                  >
                    {card.description}
                  </p>
                </div>
              </CardHoverRevealContent>
            </CardHoverReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
