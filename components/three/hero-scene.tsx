'use client';

import { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { useTheme } from 'next-themes';
import { ParticleGlobe, type GlobeRefs } from '@/components/three/particle-globe';

/** Reads the live `--primary` token so the globe always matches the theme. */
function usePrimaryColor() {
  const { resolvedTheme } = useTheme();
  const [color, setColor] = useState('#1de9a8');
  useEffect(() => {
    const raw = getComputedStyle(document.documentElement)
      .getPropertyValue('--primary')
      .trim();
    if (raw) {
      const [h, s, l] = raw.split(/\s+/);
      setColor(`hsl(${h}, ${s}, ${l})`);
    }
  }, [resolvedTheme]);
  return { color, dark: resolvedTheme !== 'light' };
}

export default function HeroScene({
  active,
  onReady,
  ...refs
}: GlobeRefs & { active: boolean; onReady: () => void }) {
  const { color, dark } = usePrimaryColor();

  return (
    <Canvas
      dpr={[1, 1.75]}
      frameloop={active ? 'always' : 'never'}
      camera={{ position: [0, 0, 3.4], fov: 45 }}
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      style={{ pointerEvents: 'none' }}
      aria-hidden
    >
      <ParticleGlobe color={color} additive={dark} onReady={onReady} {...refs} />
    </Canvas>
  );
}
