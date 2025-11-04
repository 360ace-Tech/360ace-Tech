"use client";

import { ReactNode } from 'react';

export function PageTransition({ children }: { children: ReactNode }) {
  // Temporarily disable page transitions to fix blank page issue
  return <div>{children}</div>;
}
