"use client"

import { useEffect, useState } from "react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"

interface GalleryItem {
  id: number
  title: string
  description: string
  image: string
  category: string
}

interface Gallery4Props {
  title?: string
  subtitle?: string
  items?: GalleryItem[]
}

const defaultItems: GalleryItem[] = [
  {
    id: 1,
    title: "Blanket Bog Restoration",
    description:
      "Active restoration of degraded blanket bog through drain blocking and revegetation across the Glashpullagh uplands.",
    image:
      "https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=1280&auto=format&fit=crop",
    category: "Restoration",
  },
  {
    id: 2,
    title: "Sphagnum Moss Recovery",
    description:
      "Monitoring the return of keystone sphagnum moss species — essential for peat formation and carbon sequestration.",
    image:
      "https://images.unsplash.com/photo-1518173946687-a2cfb21de55f?q=80&w=1280&auto=format&fit=crop",
    category: "Ecology",
  },
  {
    id: 3,
    title: "Water Table Management",
    description:
      "Raising water levels through strategic dam placement to rewet drained peatland and halt carbon loss.",
    image:
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1280&auto=format&fit=crop",
    category: "Hydrology",
  },
  {
    id: 4,
    title: "Carbon Flux Monitoring",
    description:
      "Continuous measurement of greenhouse gas emissions to quantify the climate benefits of peatland restoration.",
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1280&auto=format&fit=crop",
    category: "Science",
  },
  {
    id: 5,
    title: "Biodiversity Surveys",
    description:
      "Documenting the return of native plant and animal species as the ecosystem recovers its natural function.",
    image:
      "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=1280&auto=format&fit=crop",
    category: "Wildlife",
  },
  {
    id: 6,
    title: "Community Engagement",
    description:
      "Local workshops and educational walks connecting people with the landscape and its restoration journey.",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1280&auto=format&fit=crop",
    category: "Community",
  },
]

export function Gallery4({
  title = "Restoration in Focus",
  subtitle = "Explore the ongoing work to restore and protect the Glashpullagh peatlands — from ecological surveys to community action.",
  items = defaultItems,
}: Gallery4Props) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!api) return

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap())

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

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
            {title}
          </h2>
          <p
            className="max-w-2xl mx-auto text-base md:text-lg"
            style={{
              fontFamily: "var(--font-body)",
              color: "var(--text-secondary)",
            }}
          >
            {subtitle}
          </p>
        </div>

        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {items.map((item) => (
              <CarouselItem
                key={item.id}
                className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3"
              >
                <Card
                  className="overflow-hidden border-0 bg-transparent group cursor-pointer"
                  style={{ background: "var(--bg-card)" }}
                >
                  <CardContent className="p-0">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-t-xl">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div
                        className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium"
                        style={{
                          background: "rgba(196,144,61,0.85)",
                          color: "var(--bg-deep)",
                          fontFamily: "var(--font-ui)",
                        }}
                      >
                        {item.category}
                      </div>
                    </div>
                    <div className="p-5">
                      <h3
                        className="text-lg font-semibold mb-2"
                        style={{
                          fontFamily: "var(--font-display)",
                          color: "var(--cream)",
                        }}
                      >
                        {item.title}
                      </h3>
                      <p
                        className="text-sm leading-relaxed"
                        style={{
                          fontFamily: "var(--font-body)",
                          color: "var(--text-secondary)",
                        }}
                      >
                        {item.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex items-center justify-center gap-4 mt-8">
            <CarouselPrevious
              className="static translate-y-0 border-0"
              style={{
                background: "var(--bg-elevated)",
                color: "var(--gold)",
              }}
            />
            <div className="flex gap-1.5">
              {Array.from({ length: count }).map((_, i) => (
                <button
                  key={i}
                  className="w-2 h-2 rounded-full transition-all duration-300"
                  style={{
                    background:
                      i === current ? "var(--gold)" : "var(--bg-surface-light)",
                    width: i === current ? "1.5rem" : "0.5rem",
                  }}
                  onClick={() => api?.scrollTo(i)}
                />
              ))}
            </div>
            <CarouselNext
              className="static translate-y-0 border-0"
              style={{
                background: "var(--bg-elevated)",
                color: "var(--gold)",
              }}
            />
          </div>
        </Carousel>
      </div>
    </section>
  )
}
