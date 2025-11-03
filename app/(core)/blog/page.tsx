import type { Metadata } from 'next';
import Link from 'next/link';

import { FadeIn } from '@/components/motion/fade-in';
import { Badge } from '@/components/ui/badge';
import { allPosts, type Post } from 'contentlayer/generated';

export const metadata: Metadata = {
  title: 'Insights & Articles',
  description:
    'Research, guides, and playbooks from the 360ace.Tech team covering cloud strategy, DevOps, site reliability, and AI-ready platforms.',
};

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

export default function BlogIndexPage() {
  const posts = allPosts.filter((post: Post) => !post.draft).sort((a: Post, b: Post) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <section className="bg-background/20 py-24">
      <div className="container-edge space-y-12">
        <FadeIn immediate>
          <header className="max-w-3xl space-y-4">
            <Badge variant="subtle" className="bg-primary/10 text-primary">
              Thought leadership
            </Badge>
            <h1 className="text-4xl font-semibold sm:text-5xl">Insights &amp; engineering field notes</h1>
            <p className="text-muted-foreground">
              Deep dives on the practices that move the needle: strategy, platform, automation, SRE, data, AI enablement, and delivery rituals.
            </p>
          </header>
        </FadeIn>
        <div className="grid gap-8 lg:grid-cols-3">
          {posts.map((post: Post) => (
            <FadeIn key={post._id} immediate>
              <Link
                href={`/blog/${post.slug}`}
                className="group block rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <article className="h-full rounded-3xl border border-white/10 bg-card/60 p-6 shadow-lg transition-all duration-300 ease-out hover:-translate-y-0.5 group-hover:scale-[1.01] md:group-hover:scale-[1.03] group-hover:shadow-2xl">
                  {post.image?.path && (
                    <span className="block overflow-hidden rounded-2xl -mx-1 -mt-1 mb-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={post.image.path}
                        alt={post.image.alt ?? post.title}
                        className="h-auto w-full transform transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                        decoding="async"
                      />
                    </span>
                  )}
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">{post.formattedDate}</p>
                  <h2 className="mt-3 text-2xl font-semibold transition-colors duration-300 group-hover:text-primary group-focus:text-primary">
                    {post.title}
                  </h2>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {post.summary ?? stripMarkdown(post.body.raw).slice(0, 200)}...
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    {post.tags?.map((tag: string) => (
                      <span key={tag} className="rounded-full bg-white/5 px-3 py-1">
                        {tag}
                      </span>
                    ))}
                  </div>
                </article>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
