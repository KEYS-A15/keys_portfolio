"use client";

import { useEffect, useState, useRef } from "react";

type Props = {
  children: React.ReactNode;
  /** Minimum ms between glitches (default 3000) */
  intervalMin?: number;
  /** Maximum ms between glitches (default 8000) */
  intervalMax?: number;
  /** How long each glitch burst lasts in ms (default 200) */
  duration?: number;
  /** CSS class on the outer wrapper */
  className?: string;
};

/**
 * Wraps any HUD element and periodically applies a subtle
 * glitch effect (horizontal slice shifts + color channel split).
 * Fully reusable across all HUD components.
 */
export function HudGlitch({
  children,
  intervalMin = 3000,
  intervalMax = 8000,
  duration = 180,
  className = "",
}: Props) {
  const [glitching, setGlitching] = useState(false);
  const [slices, setSlices] = useState<GlitchSlice[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const scheduleGlitch = () => {
      const delay =
        intervalMin + Math.random() * (intervalMax - intervalMin);
      timeout = setTimeout(() => {
        // Generate 2-4 random horizontal slices
        const count = 2 + Math.floor(Math.random() * 3);
        const newSlices: GlitchSlice[] = [];
        for (let i = 0; i < count; i++) {
          newSlices.push({
            top: Math.random() * 100,
            height: 2 + Math.random() * 8,
            offsetX: (Math.random() - 0.5) * 12,
            channelShift: (Math.random() - 0.5) * 4,
          });
        }
        setSlices(newSlices);
        setGlitching(true);

        // End the glitch burst
        setTimeout(() => {
          setGlitching(false);
          setSlices([]);
          scheduleGlitch();
        }, duration);
      }, delay);
    };

    scheduleGlitch();
    return () => clearTimeout(timeout);
  }, [intervalMin, intervalMax, duration]);

  return (
    <div
      ref={containerRef}
      className={`hud-glitch-wrap ${className}`}
      data-glitching={glitching}
    >
      {/* Main content */}
      <div className="hud-glitch-content">{children}</div>

      {/* Glitch slice overlays */}
      {glitching &&
        slices.map((s, i) => (
          <div
            key={i}
            className="hud-glitch-slice"
            style={{
              top: `${s.top}%`,
              height: `${s.height}%`,
              transform: `translateX(${s.offsetX}px)`,
            }}
          >
            {/* Red channel shift */}
            <div
              className="hud-glitch-channel hud-glitch-red"
              style={{ transform: `translateX(${s.channelShift}px)` }}
            />
            {/* Cyan channel shift */}
            <div
              className="hud-glitch-channel hud-glitch-cyan"
              style={{ transform: `translateX(${-s.channelShift}px)` }}
            />
          </div>
        ))}
    </div>
  );
}

type GlitchSlice = {
  top: number;
  height: number;
  offsetX: number;
  channelShift: number;
};
