import VariantOnePage from '@/app/(core)/(variants)/v1/page';
import VariantThreePage from '@/app/(core)/(variants)/v3/page';
import VariantTwoPage from '@/app/(core)/(variants)/v2/page';

const DEFAULT_VARIANT = 'v2' as const;

type VariantKey = 'v1' | 'v2' | 'v3';

const variantMap: Record<VariantKey, () => JSX.Element> = {
  v1: () => <VariantOnePage />,
  v2: () => <VariantTwoPage />,
  v3: () => <VariantThreePage />,
};

export default function RootPage() {
  const envVariant = (process.env.SITE_VARIANT as VariantKey | undefined)?.toLowerCase() as VariantKey | undefined;
  const variant: VariantKey = envVariant && envVariant in variantMap ? envVariant : DEFAULT_VARIANT;

  return variantMap[variant]();
}
