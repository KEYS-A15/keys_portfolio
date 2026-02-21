"use client";

import { useEffect, useState } from "react";

type Props = {
  src: string;
  alt: string;
};

export function HudProfile({ src, alt }: Props) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 200),
      setTimeout(() => setStage(2), 620),
      setTimeout(() => setStage(3), 1050),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="hud-profile-box">
      {/* Corner + signs */}
      <div
        className="hud-profile-corners"
        style={{
          opacity: stage >= 1 ? 1 : 0,
          transition: "opacity 200ms ease",
        }}
      >
        <span className="hud-profile-corner tl">+</span>
        <span className="hud-profile-corner tr">+</span>
        <span className="hud-profile-corner bl">+</span>
        <span className="hud-profile-corner br">+</span>
      </div>

      {/* Dashed frame */}
      <div
        className="hud-profile-frame"
        style={{
          opacity: stage >= 2 ? 1 : 0,
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
          opacity: stage >= 2 ? 1 : 0,
          transition: "opacity 500ms ease 120ms",
        }}
      />

      {/* Profile image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="hud-profile-img"
        src={src}
        alt={alt}
        style={{
          opacity: stage >= 3 ? 0.85 : 0,
          transition: "opacity 600ms ease",
        }}
      />

      {/* Green tint overlay on image */}
      <div
        className="hud-profile-img-overlay"
        style={{
          opacity: stage >= 3 ? 1 : 0,
          transition: "opacity 600ms ease",
        }}
      />

      {/* Scanlines on image */}
      <div
        className="hud-profile-scanlines"
        style={{
          opacity: stage >= 3 ? 1 : 0,
          transition: "opacity 600ms ease",
        }}
      />

      {/* Bottom labels */}
      <span
        className="hud-profile-label"
        style={{
          opacity: stage >= 3 ? 1 : 0,
          transition: "opacity 400ms ease 200ms",
        }}
      >
        ID.Verified
      </span>
      <span
        className="hud-profile-sys"
        style={{
          opacity: stage >= 3 ? 1 : 0,
          transition: "opacity 400ms ease 200ms",
        }}
      >
        {"SYS | IMG.Render"}
      </span>
    </div>
  );
}
