'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ReactNode } from 'react';

export function FadeIn({
  children,
  className,
  delay = 0,
  as = motion.div,
  immediate = false,
  mode = 'inView',
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: typeof motion.div;
  immediate?: boolean;
  mode?: 'inView' | 'mount' | 'mountSoft';
}) {
  const shouldReduce = useReducedMotion();

  if (shouldReduce || immediate) {
    const Comp = as;
    return <Comp className={className}>{children}</Comp>;
  }

  const Comp = as;
  if (mode === 'mount') {
    return (
      <Comp
        className={className}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay }}
      >
        {children}
      </Comp>
    );
  }

  if (mode === 'mountSoft') {
    return (
      <Comp
        className={className}
        initial={{ opacity: 1, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut', delay }}
      >
        {children}
      </Comp>
    );
  }

  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6, ease: 'easeOut', delay }}
    >
      {children}
    </Comp>
  );
}
