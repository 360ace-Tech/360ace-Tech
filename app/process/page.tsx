"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProcessAliasPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/#process');
  }, [router]);
  return (
    <div className="container-edge py-20">
      <p>Redirecting to the process section… If you are not redirected, <a href="/#process">click here</a>.</p>
    </div>
  );
}

