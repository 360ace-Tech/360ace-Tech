import { getPostBySlug } from '../../../content/manifest';
import { notFound } from 'next/navigation';
import BlogClient from './BlogClient';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  // Static paths derived from manifest to ensure bundling includes MDX.
  return [
    { slug: '2024-01-25-ai-ml-big-data' },
    { slug: '2023-03-20-why-k8s' },
  ];
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return notFound();
  return (
    <main style={{ maxWidth: 920, margin: '0 auto', padding: '2rem 1rem' }}>
      <article>
        <header style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.5rem)', margin: 0 }}>{post.title}</h1>
          <div style={{ opacity: 0.7 }}>{new Date(post.date).toLocaleDateString()}</div>
        </header>
        <BlogClient slug={slug} />
      </article>
    </main>
  );
}
