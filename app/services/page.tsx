"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ServicesAliasPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/#services');
  }, [router]);
  return (
    <div className="container-edge py-20">
      <p>Redirecting to the services section… If you are not redirected, <a href="/#services">click here</a>.</p>
    </div>
  );
}

