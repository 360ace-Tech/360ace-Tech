import * as React from 'react';

import { cn } from '@/lib/utils';

const badgeVariants = {
  default: 'inline-flex items-center rounded-full border border-white/20 px-3 py-1 text-xs font-medium uppercase tracking-wide',
  subtle: 'inline-flex items-center rounded-md bg-white/10 px-2.5 py-1 text-xs text-foreground',
};

type BadgeVariant = keyof typeof badgeVariants;

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return <span className={cn(badgeVariants[variant], className)} {...props} />;
}
