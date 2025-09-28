// Manually curated manifest for MDX posts.
// Add new imports and entries as content grows, or replace with an automated loader.

import type { ReactElement } from 'react';

export type PostEntry = {
  slug: string;
  title: string;
  date: string; // ISO
  description?: string;
  tags?: string[];
  categories?: string[];
  // Client component will dynamically import and render content by slug.
};

export const posts: PostEntry[] = [
  {
    slug: '2024-01-25-ai-ml-big-data',
    title: 'The New Era — AI, ML, Big Data',
    date: '2024-01-25',
    description: 'How Big Data, AI/ML, and the Cloud reshape infrastructure and operations.',
    tags: ['AI', 'ML', 'Cloud'],
    categories: ['AI', 'articles'],
  },
  {
    slug: '2023-03-20-why-k8s',
    title: 'Why Kubernetes?',
    date: '2023-03-20',
    description: 'A concise look at reasons to adopt Kubernetes.',
    tags: ['kubernetes', 'containers', 'devops'],
    categories: ['platform'],
  },
];

export function getAllPostsSorted() {
  return [...posts].sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

export function getPostBySlug(slug: string) {
  return posts.find((p) => p.slug === slug) || null;
}
