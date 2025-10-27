import type { MetadataRoute } from 'next';
import { allPosts } from 'contentlayer/generated';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://360ace.tech';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    '',
    '/services',
    '/process',
    '/insights',
    '/contact',
    '/compatibility-check',
    '/legal/privacy',
    '/legal/terms',
    '/blog',
  ].map((path) => ({
    url: `${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`,
    lastModified: new Date(),
  }));

  const postPages: MetadataRoute.Sitemap = allPosts
    .filter((p) => !p.draft)
    .map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.date),
    }));

  return [...staticPages, ...postPages];
}
