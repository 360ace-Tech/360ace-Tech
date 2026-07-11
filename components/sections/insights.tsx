import Link from 'next/link';

import { Reveal } from '@/components/motion/reveal';
import { ClipReveal } from '@/components/motion/clip-reveal';
import { allPosts, type Post } from 'contentlayer/generated';

function getFeaturedPosts() {
  return allPosts
    .filter((post: Post) => !post.draft)
    .sort((a: Post, b: Post) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);
}

function stripMarkdown(text: string): string {
  return text
    // Remove headers (# ## ###)
    .replace(/#{1,6}\s+/g, '')
    // Remove bold/italic (**text** __text__ *text* _text_)
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(\*|_)(.*?)\1/g, '$2')
    // Remove links [text](url)
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
    // Remove inline code `code`
    .replace(/`([^`]+)`/g, '$1')
    // Remove code blocks ```code```
    .replace(/```[\s\S]*?```/g, '')
    // Remove blockquotes
    .replace(/^\s*>\s+/gm, '')
    // Remove list markers
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    // Clean up extra whitespace
    .replace(/\n\s*\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function buildExcerpt(input: string) {
  const cleaned = stripMarkdown(input);
  if (cleaned.length <= 180) return cleaned;
  return `${cleaned.slice(0, 177)}…`;
}

export function InsightsSection() {
  const posts = getFeaturedPosts();

  return (
    <section id="insights" className="relative py-24 lg:py-40">
      <div className="container-edge space-y-14">
        <Reveal>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="space-y-5">
              <p className="chapter-label">04 / Latest thinking</p>
              <h2 className="font-display text-4xl font-semibold tracking-[-0.02em] sm:text-5xl">
                Insights from the engineering floor
              </h2>
            </div>
            <Link
              href="/blog"
              className="underline-sweep self-start pb-1 font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground transition-colors hover:text-foreground md:self-end"
            >
              All articles
            </Link>
          </div>
        </Reveal>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {posts.map((post: Post, index: number) => (
            <Reveal key={post._id} delay={index * 0.08}>
              <Link
                href={`/blog/${post.slug}`}
                className="group block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <article className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card transition-colors duration-300 group-hover:border-primary/40">
                  {post.image?.path ? (
                    <ClipReveal className="aspect-[16/10]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={post.image.path}
                        alt={post.image.alt ?? post.title}
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                        loading="lazy"
                        decoding="async"
                      />
                    </ClipReveal>
                  ) : null}
                  <div className="flex flex-1 flex-col p-6 lg:p-7">
                    <p className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-muted-foreground">
                      {post.formattedDate}
                    </p>
                    <h3 className="mt-4 font-display text-xl font-semibold leading-snug transition-colors duration-300 group-hover:text-primary">
                      {post.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {buildExcerpt(post.summary ?? post.body.raw)}
                    </p>
                    <span className="underline-sweep mt-auto self-start pb-1 pt-6 font-mono text-[0.65rem] uppercase tracking-[0.25em] text-primary">
                      Read article
                    </span>
                  </div>
                </article>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
