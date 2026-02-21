"use client";

import { useEffect, useState } from "react";

type Props = {
  src: string;
  alt: string;
};

export function HudProfile({ src, alt }: Props) {
  // Matches the 4-stage sequence from HudBoxesHUD:
  // 0 = hidden, 1 = single centered +, 2 = four + expand to corners,
  // 3 = dashed frame + fill, 4 = image + labels appear
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 120),
      setTimeout(() => setStage(2), 520),
      setTimeout(() => setStage(3), 950),
      setTimeout(() => setStage(4), 1450),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const expanded = stage >= 2;

  return (
    <div className="hud-profile-box">
      {/* Stage 1: single centered + */}
      <div
        className="hud2-center-plus"
        style={{
          opacity: stage === 1 ? 1 : 0,
          transition: "opacity 160ms ease",
        }}
      >
        <span className="hud2-plus-char">+</span>
      </div>

      {/* Stage 2+: four corner + signs that expand outward */}
      <div
        className="hud2-corners"
        style={{
          opacity: stage >= 2 ? 1 : 0,
          transition: "opacity 180ms ease",
        }}
      >
        <span className="hud2-corner hud2-tl" data-expand={expanded}>+</span>
        <span className="hud2-corner hud2-tr" data-expand={expanded}>+</span>
        <span className="hud2-corner hud2-bl" data-expand={expanded}>+</span>
        <span className="hud2-corner hud2-br" data-expand={expanded}>+</span>
      </div>

      {/* Stage 3+: dashed frame */}
      <div
        className="hud-profile-frame"
        style={{
          opacity: stage >= 3 ? 1 : 0,
          transition: "opacity 400ms ease",
        }}
      >
        <div className="hud2-edge hud2-edge-top" />
        <div className="hud2-edge hud2-edge-bottom" />
        <div className="hud2-edge hud2-edge-left" />
        <div className="hud2-edge hud2-edge-right" />
      </div>

      {/* Dot grid hologram fill */}
      <div
        className="hud-profile-fill"
        style={{
          opacity: stage >= 3 ? 1 : 0,
          transition: "opacity 500ms ease 120ms",
        }}
      />

      {/* Stage 4: image + overlays + labels */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="hud-profile-img"
        src={src}
        alt={alt}
        style={{
          opacity: stage >= 4 ? 0.9 : 0,
          transition: "opacity 600ms ease",
        }}
      />

      <div
        className="hud-profile-img-overlay"
        style={{
          opacity: stage >= 4 ? 1 : 0,
          transition: "opacity 600ms ease",
        }}
      />

      <div
        className="hud-profile-scanlines"
        style={{
          opacity: stage >= 4 ? 1 : 0,
          transition: "opacity 600ms ease",
        }}
      />

      <span
        className="hud-profile-label"
        style={{
          opacity: stage >= 4 ? 1 : 0,
          transition: "opacity 400ms ease 200ms",
        }}
      >
        ID.Verified
      </span>
      <span
        className="hud-profile-sys"
        style={{
          opacity: stage >= 4 ? 1 : 0,
          transition: "opacity 400ms ease 200ms",
        }}
      >
        {"SYS | IMG.Render"}
      </span>
    </div>
  );
}
