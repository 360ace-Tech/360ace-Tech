"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function InsightsAliasPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/#insights');
  }, [router]);
  return (
    <div className="container-edge py-20">
      <p>Redirecting to the insights section… If you are not redirected, <a href="/#insights">click here</a>.</p>
    </div>
  );
}

