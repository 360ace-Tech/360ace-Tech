"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ContactAliasPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/#contact');
  }, [router]);
  return (
    <div className="container-edge py-20">
      <p>Redirecting to the contact section… If you are not redirected, <a href="/#contact">click here</a>.</p>
    </div>
  );
}

