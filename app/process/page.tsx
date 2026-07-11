"use client";

import Link from 'next/link';
import { useEffect } from 'react';
import { isModifiedClick, useAppNavigate } from '@/lib/navigation/home-nav';

export default function ProcessAliasPage() {
  const navigate = useAppNavigate();
  useEffect(() => {
    navigate('/#process');
  }, [navigate]);
  return (
    <div className="container-edge py-20">
      <p>
        Redirecting to the process section… If you are not redirected,
        <Link
          className="underline-offset-4 hover:underline"
          href="/#process"
          onClick={(e) => {
            if (isModifiedClick(e)) return;
            e.preventDefault();
            navigate('/#process');
          }}
        >
          click here
        </Link>.
      </p>
    </div>
  );
}
