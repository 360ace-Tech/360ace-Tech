'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { LineSegments2 } from 'three/examples/jsm/lines/LineSegments2.js';
import { LineSegmentsGeometry } from 'three/examples/jsm/lines/LineSegmentsGeometry.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import { coastlineSegments, isLand, vec3ToLatLon } from '@/lib/three/land-data';

const POINT_COUNT = 9000;
const ARC_COUNT = 7;
/** Dispersed points reach radius × (1 + 0.55 + 1.6·seed·something) — budget for camera fit. */
const MAX_DISPERSED_RADIUS = 1.45;
const ROTATION_SPEED = 0.08;

export type GlobeRefs = {
  /** 0 = formed globe, 1 = fully dispersed field */
  progressRef: React.MutableRefObject<number>;
  /** master opacity for the whole globe (dots, outlines, arcs) */
  opacityRef: React.MutableRefObject<number>;
  /** true while the pointer is over the hero — pauses idle rotation */
  hoverRef: React.MutableRefObject<boolean>;
  /** group x offset in world units (0.9 ≈ right of centre at hero) */
  xRef: React.MutableRefObject<number>;
};

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uProgress;
  uniform float uPixelRatio;
  attribute float aSeed;
  attribute float aLand;
  varying float vAlpha;

  void main() {
    float wobble = sin(uTime * 0.55 + aSeed * 6.2831) * 0.012;
    // Dispersion: points fly outward along their radius as scroll progresses.
    vec3 p = position * (1.0 + wobble + uProgress * (0.35 + aSeed * 1.1));
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    // Land dots are markedly thicker than ocean dots; dispersed dots grow
    // slightly so the ambient background field stays legible.
    float base = (mix(1.6, 3.6, aLand) + aSeed * 1.2) * (1.0 + uProgress * 0.9);
    gl_PointSize = base * uPixelRatio * (3.0 / -mv.z);
    float tier = mix(0.16, 0.95, aLand);
    vAlpha = tier * (1.0 - uProgress * (0.2 + aSeed * 0.2));
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float mask = smoothstep(0.5, 0.15, d);
    gl_FragColor = vec4(uColor, vAlpha * mask * uOpacity);
  }
`;

function fibonacciSphere(count: number) {
  const positions = new Float32Array(count * 3);
  const seeds = new Float32Array(count);
  const land = new Float32Array(count);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;
    const x = Math.cos(theta) * r;
    const z = Math.sin(theta) * r;
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
    seeds[i] = Math.random();
    const [lat, lon] = vec3ToLatLon(x, y, z);
    land[i] = isLand(lat, lon) ? 1 : 0;
  }
  return { positions, seeds, land };
}

/** Great-circle arc between two points on the unit sphere, lifted at the midpoint. */
function arcPoints(a: THREE.Vector3, b: THREE.Vector3, segments = 48) {
  const points: THREE.Vector3[] = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const p = new THREE.Vector3().copy(a).lerp(b, t).normalize();
    const lift = 1 + Math.sin(t * Math.PI) * 0.28;
    points.push(p.multiplyScalar(lift));
  }
  return points;
}

export function ParticleGlobe({
  color,
  additive,
  progressRef,
  opacityRef,
  hoverRef,
  xRef,
}: GlobeRefs & { color: string; additive: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const spinSpeed = useRef(ROTATION_SPEED);
  const baseZ = useRef(3.4);
  const { size, camera } = useThree();

  const { positions, seeds, land } = useMemo(() => fibonacciSphere(POINT_COUNT), []);

  // Coastline outlines as thick screen-space lines (LineBasicMaterial's
  // linewidth is ignored by WebGL — LineSegments2 is the supported path).
  const coastline = useMemo(() => {
    const geometry = new LineSegmentsGeometry();
    geometry.setPositions(Array.from(coastlineSegments(1.004)));
    const material = new LineMaterial({
      color: new THREE.Color(color).getHex(),
      linewidth: 1.6,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
    });
    return new LineSegments2(geometry, material);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const arcLines = useMemo(() => {
    const rng = (seed: number) => {
      // deterministic arcs so the scene is stable between mounts
      const x = Math.sin(seed * 999) * 10000;
      return x - Math.floor(x);
    };
    return Array.from({ length: ARC_COUNT }, (_, i) => {
      const a = new THREE.Vector3(rng(i + 1) - 0.5, rng(i + 7) - 0.5, rng(i + 13) - 0.5).normalize();
      const b = new THREE.Vector3(rng(i + 29) - 0.5, rng(i + 41) - 0.5, rng(i + 53) - 0.5).normalize();
      const geometry = new THREE.BufferGeometry().setFromPoints(arcPoints(a, b));
      const material = new THREE.LineBasicMaterial({ transparent: true, opacity: 0.25 });
      return new THREE.Line(geometry, material);
    });
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uOpacity: { value: 1 },
      uPixelRatio: { value: 1 },
      uColor: { value: new THREE.Color(color) },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    uniforms.uColor.value.set(color);
    coastline.material.color.set(color);
    arcLines.forEach((line) => {
      (line.material as THREE.LineBasicMaterial).color.set(color);
    });
  }, [color, uniforms, coastline, arcLines]);

  // Additive blending glows on the dark theme but washes out on light —
  // switch to normal alpha blending there.
  useEffect(() => {
    const material = materialRef.current;
    if (!material) return;
    material.blending = additive ? THREE.AdditiveBlending : THREE.NormalBlending;
    material.needsUpdate = true;
  }, [additive]);

  useEffect(
    () => () => {
      coastline.geometry.dispose();
      coastline.material.dispose();
      arcLines.forEach((line) => {
        line.geometry.dispose();
        (line.material as THREE.LineBasicMaterial).dispose();
      });
    },
    [coastline, arcLines]
  );

  // Fit camera so even the dispersed field never clips the canvas edges.
  useEffect(() => {
    const persp = camera as THREE.PerspectiveCamera;
    const halfFov = (persp.fov * Math.PI) / 360;
    const aspect = size.width / Math.max(1, size.height);
    const margin = 0.92;
    const distForHeight = MAX_DISPERSED_RADIUS / Math.tan(halfFov) / margin;
    const distForWidth = MAX_DISPERSED_RADIUS / (Math.tan(halfFov) * aspect) / margin;
    baseZ.current = Math.max(distForHeight, distForWidth);
    coastline.material.resolution.set(size.width, size.height);
  }, [size, camera, coastline]);

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  useFrame((state, delta) => {
    const group = groupRef.current;
    const material = materialRef.current;
    if (!group || !material) return;
    const progress = progressRef.current;
    const opacity = opacityRef.current;

    material.uniforms.uTime.value = state.clock.elapsedTime;
    material.uniforms.uProgress.value = progress;
    material.uniforms.uOpacity.value = opacity;
    material.uniforms.uPixelRatio.value = state.gl.getPixelRatio();
    coastline.material.opacity = 0.55 * opacity * (1 - progress * 0.85);
    arcLines.forEach((line) => {
      (line.material as THREE.LineBasicMaterial).opacity = 0.25 * opacity * (1 - progress);
    });

    // Idle rotation eases to a stop while hovering, resumes on leave.
    const targetSpeed = hoverRef.current ? 0 : ROTATION_SPEED;
    spinSpeed.current += (targetSpeed - spinSpeed.current) * Math.min(1, delta * 4);
    group.rotation.y += delta * spinSpeed.current;

    // Pointer parallax, lerped for weight.
    group.rotation.x += (pointer.current.y * 0.16 - group.rotation.x) * 0.04;
    group.rotation.z += (pointer.current.x * 0.05 - group.rotation.z) * 0.04;

    // Horizontal drift (hero: right of centre → dispersed: centred).
    group.position.x += (xRef.current - group.position.x) * Math.min(1, delta * 6);

    // Slight dolly-out as the globe disperses, from the fitted base distance.
    state.camera.position.z = baseZ.current + progress * 0.5;
  });

  return (
    <group ref={groupRef} position={[0.9, 0, 0]}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
          <bufferAttribute attach="attributes-aLand" args={[land, 1]} />
        </bufferGeometry>
        <shaderMaterial
          ref={materialRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      <primitive object={coastline} />
      {arcLines.map((line, i) => (
        <primitive key={i} object={line} />
      ))}
    </group>
  );
}
