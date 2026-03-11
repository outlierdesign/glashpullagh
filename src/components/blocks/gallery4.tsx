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
    title: "Drain Blocking",
    description:
      "Workers installing wooden dam structures in drainage channels to raise the water table and rewet degraded peatland.",
    image: "/images/site/dam-workers.jpg",
    category: "Restoration",
  },
  {
    id: 2,
    title: "Sphagnum Recovery",
    description:
      "Monitoring the return of keystone sphagnum moss species — essential for peat formation and carbon sequestration.",
    image: "/images/site/bog-walker.jpg",
    category: "Ecology",
  },
  {
    id: 3,
    title: "Water Table Management",
    description:
      "Raising water levels through strategic dam placement to rewet drained peatland and halt carbon loss.",
    image: "/images/site/peat-pool.jpg",
    category: "Hydrology",
  },
  {
    id: 4,
    title: "Field Monitoring",
    description:
      "Continuous measurement and monitoring across the site to track the progress of peatland restoration.",
    image: "/images/site/monitoring-post.jpg",
    category: "Science",
  },
  {
    id: 5,
    title: "Plank Dam Construction",
    description:
      "Wooden plank dams installed across drainage channels block water flow and encourage natural peat recovery.",
    image: "/images/site/plank-dam.jpg",
    category: "Engineering",
  },
  {
    id: 6,
    title: "Community Engagement",
    description:
      "Local teams and volunteers working together across the landscape to restore and protect this ancient ecosystem.",
    image: "/images/site/carrying-equipment.jpg",
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
