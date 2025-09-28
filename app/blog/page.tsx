import Link from 'next/link';
import { getAllPostsSorted } from '../../content/manifest';

export const metadata = {
  title: 'Blog — 360ace.Tech',
  description: 'Insights on Cloud, DevOps, SRE, and Infrastructure.',
};

export default function BlogIndexPage() {
  const posts = getAllPostsSorted();
  return (
    <main style={{ maxWidth: 920, margin: '0 auto', padding: '2rem 1rem' }}>
      <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', marginBottom: 8 }}>Blog</h1>
      <p style={{ opacity: 0.8, marginBottom: 24 }}>Articles on infrastructure, platform engineering, AI/ML ops, and more.</p>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {posts.map((p) => (
          <li key={p.slug} style={{ padding: '1rem 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <Link href={`/blog/${p.slug}`} style={{ textDecoration: 'none' }}>
              <h3 style={{ margin: 0 }}>{p.title}</h3>
            </Link>
            <div style={{ opacity: 0.7, fontSize: 14 }}>{new Date(p.date).toLocaleDateString()}</div>
            {p.description && <p style={{ marginTop: 8 }}>{p.description}</p>}
            {p.tags?.length ? (
              <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {p.tags?.map((t) => (
                  <span key={t} style={{ fontSize: 12, opacity: 0.8, border: '1px solid rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: 999 }}>{t}</span>
                ))}
              </div>
            ) : null}
          </li>
        ))}
      </ul>
    </main>
  );
}
