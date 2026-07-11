"use client";

import Link from 'next/link';
import { useEffect } from 'react';
import { isModifiedClick, useAppNavigate } from '@/lib/navigation/home-nav';

export default function ServicesAliasPage() {
  const navigate = useAppNavigate();
  useEffect(() => {
    navigate('/#services');
  }, [navigate]);
  return (
    <div className="container-edge py-20">
      <p>
        Redirecting to the services section… If you are not redirected,
        <Link
          className="underline-offset-4 hover:underline"
          href="/#services"
          onClick={(e) => {
            if (isModifiedClick(e)) return;
            e.preventDefault();
            navigate('/#services');
          }}
        >
          click here
        </Link>.
      </p>
    </div>
  );
}
