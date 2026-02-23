"use client";

import { useEffect } from "react";

export function CursorFX() {
  useEffect(() => {
    const root = document.documentElement;

    let targetX = 0;
    let targetY = 0;
    let x = 0;
    let y = 0;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const tick = () => {
      // Smooth follow (reduce jitter)
      x += (targetX - x) * 0.18;
      y += (targetY - y) * 0.18;

      root.style.setProperty("--mx", `${x}px`);
      root.style.setProperty("--my", `${y}px`);

      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  // purely sets CSS vars; visuals come from CSS
  return null;
}