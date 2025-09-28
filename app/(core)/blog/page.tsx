import type { Metadata } from 'next';
import Link from 'next/link';

import { FadeIn } from '@/components/motion/fade-in';
import { Badge } from '@/components/ui/badge';
import { allPosts } from 'contentlayer/generated';

export const metadata: Metadata = {
  title: 'Insights & Articles',
  description:
    'Research, guides, and playbooks from the 360ace.Tech team covering cloud strategy, DevOps, site reliability, and AI-ready platforms.',
};

export default function BlogIndexPage() {
  const posts = allPosts.filter((post) => !post.draft).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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
          {posts.map((post) => (
            <FadeIn key={post._id} immediate>
              <article className="h-full rounded-3xl border border-white/10 bg-card/60 p-6 shadow-lg">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">{post.formattedDate}</p>
                <h2 className="mt-3 text-2xl font-semibold">{post.title}</h2>
                <p className="mt-3 text-sm text-muted-foreground">{post.summary ?? post.body.raw.slice(0, 200)}...</p>
                <div className="mt-6 flex flex-wrap gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {post.tags?.map((tag) => (
                    <span key={tag} className="rounded-full bg-white/5 px-3 py-1">
                      {tag}
                    </span>
                  ))}
                </div>
                <Link className="mt-6 inline-flex text-sm font-semibold text-primary" href={`/blog/${post.slug}`}>
                  Read article →
                </Link>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
