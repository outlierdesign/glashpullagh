"use client"

import {
  CardHoverReveal,
  CardHoverRevealMain,
  CardHoverRevealContent,
} from "@/components/ui/reveal-on-hover"
import blogPosts from "@/data/blog-posts.json"

interface BlogPost {
  slug: string
  title: string
  date: string
  season: string
  excerpt: string
  image: string
  tags: string[]
}

interface HoverRevealGridProps {
  sectionTitle?: string
  sectionSubtitle?: string
  maxPosts?: number
}

export function HoverRevealGrid({
  sectionTitle = "Bog Diaries",
  sectionSubtitle = "Stories from the bog — following the recovery of Glashapullagh through the seasons.",
  maxPosts = 3,
}: HoverRevealGridProps) {
  const posts: BlogPost[] = [...blogPosts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, maxPosts)

  return (
    <section className="py-20 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <a href="/blog">
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 transition-colors duration-300 hover:opacity-80"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--gold)",
              }}
            >
              {sectionTitle}
            </h2>
          </a>
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
          {posts.map((post) => (
            <a
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block"
            >
              <CardHoverReveal
                className="h-[480px] md:h-[520px] rounded-xl"
              >
                <CardHoverRevealMain>
                  <img
                    width={1280}
                    height={720}
                    alt={post.title}
                    src={post.image}
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
                    <p
                      className="text-xs uppercase tracking-widest"
                      style={{
                        fontFamily: "var(--font-ui)",
                        color: "var(--gold)",
                      }}
                    >
                      {post.season} &middot;{" "}
                      {new Date(post.date).toLocaleDateString("en-IE", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                    <h3
                      className="text-xl font-bold"
                      style={{
                        fontFamily: "var(--font-display)",
                        color: "var(--gold-light)",
                      }}
                    >
                      {post.title}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag, tagIndex) => (
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
                            {tag}
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
                      {post.excerpt}
                    </p>
                  </div>
                </CardHoverRevealContent>
              </CardHoverReveal>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
