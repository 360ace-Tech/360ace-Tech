// Explicit mapping of MDX modules for client-side dynamic import.
export const postImports: Record<string, () => Promise<{ default: React.ComponentType<any> }>> = {
  '2024-01-25-ai-ml-big-data': () => import('./blog/2024-01-25-ai-ml-big-data.mdx' as any),
  '2023-03-20-why-k8s': () => import('./blog/2023-03-20-why-k8s.mdx' as any),
};

