"use client";

import Link from 'next/link';
import { useEffect } from 'react';
import { isModifiedClick, useAppNavigate } from '@/lib/navigation/home-nav';

export default function InsightsAliasPage() {
  const navigate = useAppNavigate();
  useEffect(() => {
    navigate('/#insights');
  }, [navigate]);
  return (
    <div className="container-edge py-20">
      <p>
        Redirecting to the insights section… If you are not redirected,
        <Link
          className="underline-offset-4 hover:underline"
          href="/#insights"
          onClick={(e) => {
            if (isModifiedClick(e)) return;
            e.preventDefault();
            navigate('/#insights');
          }}
        >
          click here
        </Link>.
      </p>
    </div>
  );
}
