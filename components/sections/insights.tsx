import Link from 'next/link';

import { FadeIn } from '@/components/motion/fade-in';
import { InteractiveCard } from '@/components/motion/interactive-card';
import { Badge } from '@/components/ui/badge';
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
    <section id="insights" className="full-page-section bg-background/10">
      <div className="container-edge space-y-12">
        <FadeIn>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="space-y-4">
              <p className="chapter-label">Latest thinking</p>
              <h2 className="text-3xl font-semibold sm:text-4xl">Insights from the engineering floor</h2>
            </div>
            <Badge variant="subtle" className="self-start bg-primary/10 text-primary">
              Recent Articles
            </Badge>
          </div>
        </FadeIn>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post: Post, index: number) => (
            <FadeIn key={post._id} delay={index * 0.05}>
              <Link
                href={`/blog/${post.slug}`}
                className="group block rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <InteractiveCard className="group h-full">
                  <article className={post.image?.path ? 'insight-card h-full' : 'insight-card insight-card--no-image h-full'}>
                    {post.image?.path && (
                      <span className="insight-card__thumb">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={post.image.path}
                          alt={post.image.alt ?? post.title}
                          className="h-full w-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                          decoding="async"
                        />
                      </span>
                    )}
                    <span className="insight-card__info">
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                        {post.formattedDate}
                      </p>
                      <h3 className="mt-3 text-xl font-semibold leading-tight text-foreground transition-colors duration-300 group-hover:text-primary group-focus:text-primary">
                        {post.title}
                      </h3>
                      <span className="insight-card__divider" aria-hidden="true" />
                      <p className="insight-card__excerpt text-sm leading-relaxed text-muted-foreground">
                        {buildExcerpt(post.summary ?? post.body.raw)}
                      </p>
                      <span className="insight-card__details">Read article</span>
                    </span>
                  </article>
                </InteractiveCard>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
