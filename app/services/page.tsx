"use client";

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ServicesAliasPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/#services');
  }, [router]);
  return (
    <div className="container-edge py-20">
      <p>
        Redirecting to the services section… If you are not redirected,
        <Link className="underline-offset-4 hover:underline" href="/#services"> click here</Link>.
      </p>
    </div>
  );
}
