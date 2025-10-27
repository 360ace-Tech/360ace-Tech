'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type { Mesh } from 'three';

function SpinningTorus() {
  const ref = useRef<Mesh | null>(null);
  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x += delta * 0.3;
    ref.current.rotation.y += delta * 0.2;
  });
  return (
    <mesh ref={ref} castShadow receiveShadow>
      <torusKnotGeometry args={[1, 0.35, 128, 32]} />
      <meshStandardMaterial color="#60a5fa" metalness={0.35} roughness={0.2} />
    </mesh>
  );
}

export default function HeroCanvasScene() {
  return (
    <Canvas camera={{ position: [0, 0, 4], fov: 50 }} shadows dpr={[1, 2]}>
      <ambientLight intensity={0.4} />
      <directionalLight position={[2, 3, 4]} intensity={1.2} castShadow />
      <SpinningTorus />
    </Canvas>
  );
}
