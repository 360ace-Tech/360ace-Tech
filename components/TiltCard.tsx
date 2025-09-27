"use client";

import { CSSProperties, PropsWithChildren, useCallback, useRef } from "react";

export default function TiltCard({ children }: PropsWithChildren) {
  const ref = useRef<HTMLDivElement | null>(null);

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / rect.width; // -0.5 .. 0.5
    const dy = (e.clientY - cy) / rect.height; // -0.5 .. 0.5
    const ry = dx * 16; // deg
    const rx = -dy * 16; // deg
    el.style.setProperty("--rx", `${rx}deg`);
    el.style.setProperty("--ry", `${ry}deg`);
  }, []);

  const onLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", `0deg`);
    el.style.setProperty("--ry", `0deg`);
  }, []);

  return (
    <div className="tilt-card" onMouseMove={onMove} onMouseLeave={onLeave}>
      <div ref={ref} className="tilt-inner" role="group" aria-label="Under construction card">
        {children}
      </div>
    </div>
  );
}

