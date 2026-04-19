'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import {
  geoOrthographic,
  geoPath,
  geoGraticule10,
  geoCentroid,
  geoInterpolate,
  geoDistance,
  type GeoProjection,
  type ExtendedFeature,
} from 'd3-geo';
import { feature } from 'topojson-client';
// Bundled locally — no CDN fetch needed, renders immediately
import worldAtlas from 'world-atlas/countries-110m.json';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface Arc {
  src: [number, number];
  dst: [number, number];
  born: number;
  dur: number;
  drawMs: number;
}

interface ThemeColors {
  ocean: [string, string, string]; // radial gradient stops 0, 0.55, 1
  graticule: string;
  landFill: string;
  landStroke: string;
  limb: string;
  arcColor: string;
  ring1: string;
  ring2: string;
  ring3: string;
  spark1: string;
  spark2: string;
  halo1: string;
  halo2: string;
  shadow: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function hexA(hex: string, a: number): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a.toFixed(3)})`;
}

function moveLinePath(
  ctx: CanvasRenderingContext2D,
  points: (readonly [number, number] | null)[],
) {
  let pen = false;
  for (const p of points) {
    if (!p || !Number.isFinite(p[0]) || !Number.isFinite(p[1])) {
      pen = false;
      continue;
    }
    if (!pen) {
      ctx.moveTo(p[0], p[1]);
      pen = true;
    } else {
      ctx.lineTo(p[0], p[1]);
    }
  }
}

// ---------------------------------------------------------------------------
// Theme palettes
// ---------------------------------------------------------------------------
// Dark mode: deep navy/violet ocean — original design colours
const DARK: ThemeColors = {
  ocean: [
    'rgba(30, 44, 96, 0.95)',
    'rgba(18, 24, 64, 0.95)',
    'rgba(8, 10, 32, 0.95)',
  ],
  graticule: 'rgba(138, 123, 255, 0.18)',
  landFill: hexA('#34d3c5', 0.22),
  landStroke: hexA('#34d3c5', 0.95),
  limb: 'rgba(110, 231, 255, 0.85)',
  arcColor: '#6ee7ff',
  ring1: 'rgba(110, 231, 255, 0.55)',
  ring2: 'rgba(176, 123, 255, 0.45)',
  ring3: 'rgba(255, 255, 255, 0.18)',
  spark1: '#6ee7ff',
  spark2: '#b07bff',
  halo1: 'rgba(110,231,255,0.18)',
  halo2: 'rgba(138,123,255,0.18)',
  shadow: 'inset 0 0 24px rgba(110,231,255,0.12), inset 0 0 60px rgba(0,0,0,0.45), 0 0 30px rgba(110,231,255,0.12)',
};

// Light mode: sky-blue ocean, brand-purple land, indigo arcs
const LIGHT: ThemeColors = {
  ocean: [
    'rgba(219, 234, 254, 0.96)',
    'rgba(186, 230, 253, 0.96)',
    'rgba(125, 211, 252, 0.96)',
  ],
  graticule: 'rgba(99, 102, 241, 0.14)',
  landFill: hexA('#4f46e5', 0.20),
  landStroke: hexA('#4338ca', 0.92),
  limb: 'rgba(37, 99, 235, 0.88)',
  arcColor: '#6366f1',
  ring1: 'rgba(99, 102, 241, 0.52)',
  ring2: 'rgba(6, 182, 212, 0.42)',
  ring3: 'rgba(0, 0, 0, 0.10)',
  spark1: '#6366f1',
  spark2: '#06b6d4',
  halo1: 'rgba(99,102,241,0.14)',
  halo2: 'rgba(6,182,212,0.12)',
  shadow: 'inset 0 0 24px rgba(99,102,241,0.10), inset 0 0 60px rgba(186,230,253,0.35), 0 0 20px rgba(37,99,235,0.10)',
};

// ---------------------------------------------------------------------------
// Globe canvas
// ---------------------------------------------------------------------------
const SIZE = 300;
const PROJECTION_SCALE = SIZE * 0.47; // ~141 — globe nearly fills the canvas
const SAMPLES = 48;
const SPIN_SPEED = 0.10;        // deg/frame-unit
const ARC_FREQ_MS = 620;

type State = {
  landFeatures: ExtendedFeature[];
  centroids: [number, number][];
  arcs: Arc[];
  rotLon: number;
  last: number;
  projection: GeoProjection;
  colors: ThemeColors;
};

function GlobeCanvas({ isLight }: { isLight: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Store mutable render state in a ref so it never causes re-renders
  const stRef = useRef<State>({
    landFeatures: [],
    centroids: [],
    arcs: [],
    rotLon: 0,
    last: 0,
    projection: geoOrthographic()
      .scale(PROJECTION_SCALE)
      .translate([SIZE / 2, SIZE / 2])
      .clipAngle(90),
    colors: isLight ? LIGHT : DARK,
  });

  // Theme changes: just swap the colour palette — no remount needed
  useEffect(() => {
    stRef.current.colors = isLight ? LIGHT : DARK;
  }, [isLight]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rawCtx = canvas.getContext('2d');
    if (!rawCtx) return;
    // Assert non-null after the guard above so inner functions can use it freely
    const ctx: CanvasRenderingContext2D = rawCtx;

    const DPR = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = SIZE * DPR;
    canvas.height = SIZE * DPR;
    ctx.scale(DPR, DPR);

    const st = stRef.current;
    const graticule = geoGraticule10();
    // One path generator bound to the canvas context
    const pg = geoPath(st.projection, ctx);
    const sphere = { type: 'Sphere' };
    let rafId = 0;
    let spawnId: ReturnType<typeof setInterval> | null = null;

    // ---- Arc helpers ----
    function spawnArc() {
      const { centroids, arcs } = st;
      if (!centroids.length) return;
      const a = centroids[Math.floor(Math.random() * centroids.length)];
      let b = centroids[Math.floor(Math.random() * centroids.length)];
      for (let i = 0; i < 6 && geoDistance(a, b) < 0.3; i++)
        b = centroids[Math.floor(Math.random() * centroids.length)];
      arcs.push({
        src: a, dst: b,
        born: performance.now(),
        dur: 1200 + Math.random() * 800,
        drawMs: 500 + Math.random() * 400,
      });
    }

    function startSpawning() {
      if (spawnId) clearInterval(spawnId);
      spawnId = setInterval(() => {
        spawnArc();
        if (Math.random() < 0.35) setTimeout(spawnArc, 80 + Math.random() * 160);
        if (Math.random() < 0.15) setTimeout(spawnArc, 240 + Math.random() * 200);
      }, ARC_FREQ_MS);
    }

    // ---- Endpoint dot ----
    function dot(lonlat: [number, number], alpha: number, isSource: boolean) {
      const p = st.projection(lonlat);
      if (!p || !Number.isFinite(p[0])) return;
      const col = isSource ? st.colors.arcColor : '#ffffff';
      ctx.beginPath();
      ctx.arc(p[0], p[1], 1.8, 0, Math.PI * 2);
      ctx.fillStyle = hexA(col, 0.95 * alpha);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(p[0], p[1], 3.8, 0, Math.PI * 2);
      ctx.fillStyle = hexA(col, 0.22 * alpha);
      ctx.fill();
    }

    // ---- Draw arcs ----
    function drawArcs(t: number) {
      const { arcs, colors, projection } = st;
      for (let i = arcs.length - 1; i >= 0; i--) {
        const arc = arcs[i];
        const age = t - arc.born;
        if (age > arc.dur) { arcs.splice(i, 1); continue; }

        const lead = Math.min(1, age / arc.drawMs);
        const fadeTail = Math.max(0, 1 - (age - arc.drawMs) / Math.max(1, arc.dur - arc.drawMs));
        const alpha = lead < 1 ? 1 : fadeTail;

        const interp = geoInterpolate(arc.src, arc.dst);
        const cut = Math.floor(SAMPLES * lead);
        const pts: (readonly [number, number] | null)[] = [];
        for (let s = 0; s <= cut; s++) pts.push(projection(interp(s / SAMPLES)));
        if (pts.length < 2) { dot(arc.src, alpha, true); continue; }

        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        // glow
        ctx.beginPath();
        moveLinePath(ctx, pts);
        ctx.strokeStyle = hexA(colors.arcColor, 0.18 * alpha);
        ctx.lineWidth = 3.5;
        ctx.stroke();
        // crisp
        ctx.beginPath();
        moveLinePath(ctx, pts);
        ctx.strokeStyle = hexA(colors.arcColor, 0.95 * alpha);
        ctx.lineWidth = 1.1;
        ctx.stroke();

        if (lead < 1) {
          const h = pts[pts.length - 1];
          if (h && Number.isFinite(h[0])) {
            ctx.beginPath();
            ctx.arc(h[0], h[1], 2, 0, Math.PI * 2);
            ctx.fillStyle = hexA('#ffffff', 0.95 * alpha);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(h[0], h[1], 4.5, 0, Math.PI * 2);
            ctx.fillStyle = hexA(colors.arcColor, 0.30 * alpha);
            ctx.fill();
          }
        }
        dot(arc.src, alpha, true);
        if (lead >= 1) dot(arc.dst, alpha, false);
      }
    }

    // ---- Main render ----
    function frame(t: number) {
      const dt = Math.min(64, t - st.last);
      st.last = t;
      st.rotLon += SPIN_SPEED * dt * 0.06;
      if (st.rotLon > 360) st.rotLon -= 360;
      st.projection.rotate([st.rotLon, -12, 0]);

      const { colors } = st;
      ctx.clearRect(0, 0, SIZE, SIZE);

      // Ocean
      const g = ctx.createRadialGradient(SIZE * 0.42, SIZE * 0.40, SIZE * 0.05, SIZE / 2, SIZE / 2, SIZE / 2);
      g.addColorStop(0, colors.ocean[0]);
      g.addColorStop(0.55, colors.ocean[1]);
      g.addColorStop(1, colors.ocean[2]);
      ctx.beginPath();
      pg(sphere as Parameters<typeof pg>[0]);
      ctx.fillStyle = g;
      ctx.fill();

      // Graticule
      ctx.beginPath();
      pg(graticule);
      ctx.strokeStyle = colors.graticule;
      ctx.lineWidth = 0.5;
      ctx.stroke();

      // Land — draw each feature with its own beginPath so fill is per-feature
      // (d3-geo canvas path does NOT call beginPath internally, so we do it once
      //  for a batch — but doing per-feature is safer across d3 versions)
      if (st.landFeatures.length) {
        ctx.fillStyle = colors.landFill;
        ctx.strokeStyle = colors.landStroke;
        ctx.lineWidth = 0.65;
        ctx.beginPath();
        for (const f of st.landFeatures) pg(f);
        ctx.fill();
        ctx.stroke();
      }

      // Limb
      ctx.beginPath();
      pg(sphere as Parameters<typeof pg>[0]);
      ctx.strokeStyle = colors.limb;
      ctx.lineWidth = 1.1;
      ctx.stroke();

      drawArcs(t);
      rafId = requestAnimationFrame(frame);
    }

    // ---- Init — use bundled world-atlas, no fetch ----
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const topo = worldAtlas as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fc = feature(topo, topo.objects.countries) as unknown as GeoJSON.FeatureCollection;

    st.landFeatures = fc.features as ExtendedFeature[];
    st.centroids = st.landFeatures
      .map((f) => geoCentroid(f) as [number, number])
      .filter((c) => Number.isFinite(c[0]) && Number.isFinite(c[1]));

    startSpawning();
    spawnArc();
    setTimeout(spawnArc, 130);
    setTimeout(spawnArc, 340);

    st.last = performance.now();
    rafId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafId);
      if (spawnId) clearInterval(spawnId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount; theme handled via stRef

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: SIZE,
        height: SIZE,
        display: 'block',
        borderRadius: '50%',
      }}
      role="img"
      aria-label="Interactive globe showing global connectivity routes"
    />
  );
}

// ---------------------------------------------------------------------------
// Whirl rings
// ---------------------------------------------------------------------------
const WHIRL_INSET = -28; // extends beyond the globe edge
const WHIRL_VB = SIZE + Math.abs(WHIRL_INSET) * 2; // SVG viewBox size

function WhirlRings({ c }: { c: ThemeColors }) {
  const cx = WHIRL_VB / 2;
  const r1 = cx - 6, r2 = cx - 12, r3 = cx - 18;
  return (
    <div
      className="pointer-events-none absolute"
      style={{ inset: WHIRL_INSET }}
      aria-hidden="true"
    >
      <svg
        viewBox={`0 0 ${WHIRL_VB} ${WHIRL_VB}`}
        style={{ width: '100%', height: '100%', overflow: 'visible' }}
      >
        <style>{`
          .wrl-cw  { transform-origin: 50% 50%; transform-box: fill-box; animation: wrlCW 7s linear infinite; }
          .wrl-ccw { transform-origin: 50% 50%; transform-box: fill-box; animation: wrlCCW 11s linear infinite; }
          .wrl-cw2 { transform-origin: 50% 50%; transform-box: fill-box; animation: wrlCW 17s linear infinite; }
          @keyframes wrlCW  { to { transform: rotate(360deg); } }
          @keyframes wrlCCW { to { transform: rotate(-360deg); } }
        `}</style>
        <g className="wrl-cw">
          <circle cx={cx} cy={cx} r={r1} fill="none"
            stroke={c.ring1} strokeWidth="1"
            strokeDasharray="2 10 30 12 6 18 80 250" />
          <circle cx={cx + r1} cy={cx} r="2" fill={c.spark1} />
        </g>
        <g className="wrl-ccw">
          <circle cx={cx} cy={cx} r={r2} fill="none"
            stroke={c.ring2} strokeWidth="1"
            strokeDasharray="50 18 4 14 18 6 200" />
          <circle cx={cx - r2} cy={cx} r="1.6" fill={c.spark2} />
        </g>
        <g className="wrl-cw2">
          <circle cx={cx} cy={cx} r={r3} fill="none"
            stroke={c.ring3} strokeWidth="0.75"
            strokeDasharray="1 9" />
        </g>
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Public export
// ---------------------------------------------------------------------------
export function GlobeScene() {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === 'light';
  const c = isLight ? LIGHT : DARK;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: SIZE, height: SIZE }}
    >
      <WhirlRings c={c} />

      {/* soft halo glow behind the globe */}
      <div
        className="pointer-events-none absolute"
        style={{
          inset: 12,
          borderRadius: '50%',
          background: `radial-gradient(closest-side, ${c.halo1}, transparent 70%),
                       radial-gradient(closest-side, ${c.halo2}, transparent 75%)`,
          filter: 'blur(8px)',
        }}
        aria-hidden="true"
      />

      <div style={{ boxShadow: c.shadow, borderRadius: '50%' }}>
        <GlobeCanvas isLight={isLight} />
      </div>
    </div>
  );
}
