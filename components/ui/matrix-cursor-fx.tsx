"use client";

import { useEffect, useRef } from "react";

type MatrixCursorFXProps = {
  radius?: number;      // visible circle radius
  density?: number;     // 0.6..1.5 (more = more chars)
  speed?: number;       // 0.6..2.0 (more = faster)
  fontSize?: number;    // 12..18
  opacity?: number;     // 0.06..0.18 background trail
};

export function MatrixCursorFX({
  radius = 180,
  density = 0.5,
  speed = 1.0,
  fontSize = 12,
  opacity = 0.09,
}: MatrixCursorFXProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const root = document.documentElement;

    let w = 0, h = 0;
    let cols = 0;
    let drops: number[] = [];
    let raf = 0;

    // cursor tracking (smoothed)
    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let x = tx, y = ty;

    const charset = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const getAccent = () => {
      // Your CSS has --accent as "r g b" (space-separated)
      const v = getComputedStyle(root).getPropertyValue("--accent").trim();
      return v || "120 180 90";
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = Math.floor(window.innerWidth);
      h = Math.floor(window.innerHeight);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      cols = Math.max(10, Math.floor((w / fontSize) * density));
      drops = new Array(cols).fill(1).map(() => Math.random() * (h / fontSize));
    };

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      root.style.setProperty("--mx", `${tx}px`);
      root.style.setProperty("--my", `${ty}px`);
    };

    const tick = () => {
      // Smooth cursor for nicer reveal
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;

      const accent = getAccent();

      // trail fade (like Matrix)
      ctx.fillStyle = `rgba(0,0,0,${opacity})`;
      ctx.fillRect(0, 0, w, h);

      // draw chars
      ctx.font = `${fontSize}px var(--font-mono, ui-monospace)`;
      ctx.textBaseline = "top";

      for (let i = 0; i < cols; i++) {
        const char = charset[(Math.random() * charset.length) | 0];
        const cx = i * fontSize;
        const cy = drops[i] * fontSize;

        // subtle depth variation
        const bright = 0.25 + Math.random() * 0.55;
        ctx.fillStyle = `rgb(${accent} / ${bright})`;
        ctx.fillText(char, cx, cy);

        // advance drop
        drops[i] += (0.65 + Math.random() * 0.9) * speed;

        // reset sometimes
        if (cy > h && Math.random() > 0.975) {
          drops[i] = 0;
        }
      }

      // radial reveal mask around cursor (so matrix shows only near it)
      ctx.save();
      ctx.globalCompositeOperation = "destination-in";
      const g = ctx.createRadialGradient(x, y, radius * 0.25, x, y, radius);
      g.addColorStop(0, "rgba(255,255,255,1)");
      g.addColorStop(0.55, "rgba(255,255,255,0.85)");
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      ctx.restore();

      raf = requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });

    // kick off
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, [radius, density, speed, fontSize, opacity]);

  return (
    <canvas
      ref={canvasRef}
      className="matrix-cursor-fx"
      aria-hidden="true"
    />
  );
}