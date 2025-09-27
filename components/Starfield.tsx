"use client";

import { useEffect, useRef } from "react";

type Star = { x: number; y: number; z: number; pz: number };

function createStars(count: number, w: number, h: number): Star[] {
  const stars: Star[] = [];
  const maxD = Math.max(w, h);
  for (let i = 0; i < count; i++) {
    stars.push({
      x: (Math.random() - 0.5) * w,
      y: (Math.random() - 0.5) * h,
      z: Math.random() * maxD,
      pz: 0,
    });
  }
  return stars;
}

export default function Starfield({ count = 400 }: { count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (rm.matches) return; // Respect reduced motion

    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    let stars = createStars(count, width, height);

    const handleResize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
      stars = createStars(count, width, height);
    };
    const ro = new ResizeObserver(handleResize);
    ro.observe(canvas);

    const speed = 2.2; // star speed
    const hueA = 210; // nice sky blue hue
    const hueB = 275; // violet hue

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.translate(width / 2, height / 2);
      for (let s of stars) {
        s.z -= speed;
        if (s.z <= 1) {
          s.x = (Math.random() - 0.5) * width;
          s.y = (Math.random() - 0.5) * height;
          s.z = Math.max(width, height);
          s.pz = s.z;
        }
        const sx = (s.x / s.z) * (width / 2);
        const sy = (s.y / s.z) * (height / 2);
        const r = Math.max(0.5, 2 - s.z / (Math.max(width, height) / 2));
        const t = 1 - s.z / Math.max(width, height);
        const hue = hueA + (hueB - hueA) * t;
        ctx.fillStyle = `hsl(${hue}, 90%, ${60 - t * 30}%)`;
        ctx.beginPath();
        ctx.arc(sx, sy, r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [count]);

  return <canvas ref={canvasRef} className="starfield" aria-hidden />;
}

