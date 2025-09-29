"use client";

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProcessAliasPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/#process');
  }, [router]);
  return (
    <div className="container-edge py-20">
      <p>
        Redirecting to the process section… If you are not redirected,
        <Link className="underline-offset-4 hover:underline" href="/#process"> click here</Link>.
      </p>
    </div>
  );
}
