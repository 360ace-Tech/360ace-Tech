"use client";
import { useEffect, useState } from 'react';
import { postImports } from '../../../content/dynamic';

export default function BlogClient({ slug }: { slug: string }) {
  const [Comp, setComp] = useState<null | React.ComponentType<any>>(null);
  useEffect(() => {
    let mounted = true;
    const loader = postImports[slug];
    if (!loader) return;
    loader().then((mod) => {
      if (mounted) setComp(() => mod.default as any);
    });
    return () => { mounted = false; };
  }, [slug]);
  if (!postImports[slug]) {
    return <div>Post not found.</div>;
  }
  if (!Comp) {
    return <div style={{ opacity: 0.7 }}>Loading article…</div>;
  }
  return <Comp />;
}

