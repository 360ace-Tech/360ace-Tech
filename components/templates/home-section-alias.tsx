'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { useEffect } from 'react';
import { isModifiedClick, useAppNavigate } from '@/lib/navigation/home-nav';

export function HomeSectionAlias({ section, label }: { section: string; label: string }) {
  const navigate = useAppNavigate();
  const href = `/#${section}`;

  useEffect(() => {
    navigate(href);
  }, [href, navigate]);

  return (
    <div className="container-edge py-20">
      <p>
        Redirecting to {label}&hellip; If you are not redirected,{' '}
        <Link
          className="underline-offset-4 hover:underline"
          href={href as Route}
          onClick={(event) => {
            if (isModifiedClick(event)) return;
            event.preventDefault();
            navigate(href);
          }}
        >
          click here
        </Link>
        .
      </p>
    </div>
  );
}
