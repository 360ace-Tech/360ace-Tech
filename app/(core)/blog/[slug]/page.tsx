import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getMDXComponent } from 'next-contentlayer2/hooks';

import { mdxComponents } from '@/components/mdx/mdx-components';
import { FadeIn } from '@/components/motion/fade-in';
import { Badge } from '@/components/ui/badge';
import { allPosts } from 'contentlayer/generated';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

// Ensure only statically generated paths are valid.
// This avoids on-demand fallback which is not supported by next-on-pages prerender.
export const dynamicParams = false;

export function generateStaticParams() {
  return allPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = allPosts.find((item) => item.slug === slug);
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
  const post = allPosts.find((item) => item.slug === slug);

  if (!post) {
    notFound();
  }

  const MDXContent = getMDXComponent(post.body.code);

  return (
    <section className="bg-background/20 py-24">
      <div className="container-edge">
        <article className="mx-auto max-w-3xl space-y-10">
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
        </article>
      </div>
    </section>
  );
}
