import { ReactNode } from 'react';

import { VariantShell } from '@/components/variants/variant-shell';

export default function BlogLayout({ children }: { children: ReactNode }) {
  return <VariantShell variant="v2">{children}</VariantShell>;
}
