'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ReactNode } from 'react';

export function FadeIn({
  children,
  className,
  delay = 0,
  as = motion.div,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: typeof motion.div;
}) {
  const shouldReduce = useReducedMotion();

  if (shouldReduce) {
    const Comp = as;
    return <Comp className={className}>{children}</Comp>;
  }

  const Comp = as;
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: 'easeOut', delay }}
    >
      {children}
    </Comp>
  );
}
