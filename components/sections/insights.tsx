import Link from 'next/link';

import { FadeIn } from '@/components/motion/fade-in';
import { Badge } from '@/components/ui/badge';
import { allPosts } from 'contentlayer/generated';

function getFeaturedPosts() {
  return allPosts
    .filter((post) => !post.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
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
    <section id="insights" className="py-24 bg-background/10">
      <div className="container-edge space-y-12">
        <FadeIn>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">Latest thinking</p>
              <h2 className="text-3xl font-semibold sm:text-4xl">Insights from the engineering floor</h2>
            </div>
            <Badge variant="subtle" className="self-start bg-primary/10 text-primary">
              Recent Articles
            </Badge>
          </div>
        </FadeIn>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <FadeIn key={post._id} delay={index * 0.05}>
              <article className="h-full rounded-3xl border border-white/10 bg-card/60 p-6 shadow-lg transition hover:-translate-y-1">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                  {post.formattedDate}
                </p>
                <h3 className="mt-3 text-xl font-semibold leading-tight text-foreground">{post.title}</h3>
                <p className="mt-3 flex-grow text-sm leading-relaxed text-muted-foreground">
                  {buildExcerpt(post.summary ?? post.body.raw)}
                </p>
                <Link
                  className="mt-6 inline-flex items-center text-sm font-semibold text-primary hover:text-primary/80"
                  href={`/blog/${post.slug}`}
                >
                  Read insight →
                </Link>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
