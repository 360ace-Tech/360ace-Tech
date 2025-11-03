import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getMDXComponent } from 'next-contentlayer2/hooks';

import { mdxComponents } from '@/components/mdx/mdx-components';
import { FadeIn } from '@/components/motion/fade-in';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { allPosts, type Post } from 'contentlayer/generated';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

// Ensure only statically generated paths are valid.
// This avoids on-demand fallback which is not supported by next-on-pages prerender.
export const dynamicParams = false;

export function generateStaticParams() {
  return allPosts.map((post: Post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = allPosts.find((item: Post) => item.slug === slug);
  if (!post) {
    return {
      title: 'Post not found',
    };
  }

  return {
    title: post.title,
    description: post.summary ?? post.body.raw.slice(0, 160),
    authors: post.author ? [{ name: post.author }] : undefined,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = allPosts.find((item: Post) => item.slug === slug);

  if (!post) {
    notFound();
  }

  const MDXContent = getMDXComponent(post.body.code);

  // Compute Previous/Next based on date (newest first)
  const sorted = allPosts
    .filter((p: Post) => !p.draft)
    .sort((a: Post, b: Post) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const idx = sorted.findIndex((p: Post) => p.slug === slug);
  const prevPost = idx > 0 ? sorted[idx - 1] : undefined; // newer
  const nextPost = idx >= 0 && idx < sorted.length - 1 ? sorted[idx + 1] : undefined; // older

  return (
    <section className="bg-background/20 py-24">
      <div className="container-edge">
        <article className="mx-auto max-w-3xl space-y-10">
          {/* Top back link */}
          <FadeIn immediate>
            <div className="-mt-4">
              <Link href="/blog" className="inline-flex items-center text-sm font-semibold text-primary hover:text-primary/80">
                <span aria-hidden>←</span>
                <span className="ml-2">Back to blog</span>
              </Link>
            </div>
          </FadeIn>
          <FadeIn immediate>
            <header className="space-y-4 text-center">
              <Badge variant="subtle" className="mx-auto bg-primary/10 text-primary">
                {post.formattedDate}
              </Badge>
              <h1 className="text-4xl font-semibold sm:text-5xl">{post.title}</h1>
              {post.summary && <p className="text-muted-foreground">{post.summary}</p>}
            </header>
          </FadeIn>
          <FadeIn immediate>
            <div className="space-y-6 text-base leading-relaxed text-muted-foreground">
              {post.image?.path && (
                <span className="block overflow-hidden rounded-3xl border border-white/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={post.image.path} alt={post.image.alt ?? post.title} className="h-auto w-full" loading="eager" />
                </span>
              )}
              <MDXContent components={mdxComponents} />
            </div>
          </FadeIn>
          {/* Next / Previous navigation */}
          <FadeIn immediate>
            <nav className="mt-6 grid gap-4 sm:grid-cols-2">
              {prevPost ? (
                <Link
                  href={`/blog/${prevPost.slug}`}
                  className="group flex items-start justify-between rounded-2xl border border-white/10 bg-card/60 p-4 hover:bg-card/80"
                  aria-label={`Previous post: ${prevPost.title}`}
                >
                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Previous</span>
                    <span className="mt-1 block font-medium text-foreground group-hover:text-primary">{prevPost.title}</span>
                  </div>
                  <span aria-hidden className="ml-3 text-primary">←</span>
                </Link>
              ) : (
                <span className="hidden sm:block" />
              )}
              {nextPost && (
                <Link
                  href={`/blog/${nextPost.slug}`}
                  className="group flex items-start justify-between rounded-2xl border border-white/10 bg-card/60 p-4 hover:bg-card/80 sm:text-right"
                  aria-label={`Next post: ${nextPost.title}`}
                >
                  <div className="sm:order-2">
                    <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Next</span>
                    <span className="mt-1 block font-medium text-foreground group-hover:text-primary">{nextPost.title}</span>
                  </div>
                  <span aria-hidden className="mr-3 text-primary sm:order-1 sm:mr-0">→</span>
                </Link>
              )}
            </nav>
          </FadeIn>
          {/* Bottom back link */}
          <FadeIn immediate>
            <div className="pt-4">
              <Link href="/blog" className="inline-flex items-center text-sm font-semibold text-primary hover:text-primary/80">
                <span aria-hidden>←</span>
                <span className="ml-2">Back to blog</span>
              </Link>
            </div>
          </FadeIn>
        </article>
      </div>
    </section>
  );
}
