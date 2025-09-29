"use client";

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function InsightsAliasPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/#insights');
  }, [router]);
  return (
    <div className="container-edge py-20">
      <p>
        Redirecting to the insights section… If you are not redirected,
        <Link className="underline-offset-4 hover:underline" href="/#insights"> click here</Link>.
      </p>
    </div>
  );
}
