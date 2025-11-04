"use client";

import Link from 'next/link';
import { useEffect } from 'react';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('GlobalError:', error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="container-edge py-24">
          <div className="max-w-2xl space-y-6">
            <h1 className="text-3xl font-semibold">Something went wrong</h1>
            <p className="text-sm text-muted-foreground">
              An unexpected error occurred. Try again, or go back home. If the problem persists, contact us.
            </p>
            <div className="flex gap-3">
              <button onClick={() => reset()} className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground shadow hover:opacity-90">
                Try again
              </button>
              <Link href="/" className="inline-flex h-10 items-center justify-center rounded-md border border-white/10 px-4 text-sm font-semibold">
                Go home
              </Link>
            </div>
            {error?.digest && (
              <p className="text-xs text-muted-foreground">Error ID: {error.digest}</p>
            )}
          </div>
        </div>
      </body>
    </html>
  );
}
