"use client";

import { useEffect, useState } from "react";
import { Typewriter } from "@/components/ui/typewriter";

type Props = {
  leftText: string;
  rightText: string;
};

export function HudBoxesHUD({
  leftText = "Master's Student @ Arizona State University",
  rightText = "Ex AI/ML Engineer @ Codetrade",
}: Props) {
  const [stage, setStage] = useState<0 | 1 | 2 | 3>(0);

  useEffect(() => {
    const t1 = window.setTimeout(() => setStage(1), 120);  // + markers
    const t2 = window.setTimeout(() => setStage(2), 260);  // frame draw
    const t3 = window.setTimeout(() => setStage(3), 760);  // type text
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, []);

  return (
    <div className="hud2-wrap">
      <HudFrame
        side="left"
        stage={stage}
        label="CURRENT"
        text={leftText}
        highlights={[
          { value: "Arizona State University", className: "hud2-accent" },
          { value: "Master's Student", className: "hud2-muted" },
        ]}
      />
      <HudFrame
        side="right"
        stage={stage}
        label="PREVIOUS"
        text={rightText}
        delay={90}
        highlights={[
          { value: "Codetrade", className: "hud2-accent" },
          { value: "AI/ML Engineer", className: "hud2-muted" },
        ]}
      />
    </div>
  );
}

function HudFrame({
  side,
  stage,
  label,
  text,
  delay = 0,
  highlights,
}: {
  side: "left" | "right";
  stage: number;
  label: string;
  text: string;
  delay?: number;
  highlights: { value: string; className: string }[];
}) {
  return (
    <div className={`hud2-box ${side === "left" ? "hud2-left" : "hud2-right"}`}>
      {/* subtle hologram fill */}
      <div className={`hud2-fill ${stage >= 2 ? "on" : ""}`} style={{ transitionDelay: `${delay}ms` }} />

      <svg className="hud2-svg" viewBox="0 0 520 220" fill="none" aria-hidden="true">
        {/* corner plus markers */}
        <g className={stage >= 1 ? "hud2-plus on" : "hud2-plus"}>
          <PlusMark x={30} y={30} />
          <PlusMark x={490} y={30} />
          <PlusMark x={30} y={190} />
          <PlusMark x={490} y={190} />
        </g>

        {/* frame outline + ticks */}
        <g className={stage >= 2 ? "hud2-lines on" : "hud2-lines"} style={{ transitionDelay: `${delay}ms` }}>
          <path className="hud2-stroke hud2-draw d0" d="M56 46 H464" />
          <path className="hud2-stroke hud2-draw d0" d="M56 174 H464" />
          <path className="hud2-stroke hud2-draw d1" d="M56 46 V174" />
          <path className="hud2-stroke hud2-draw d1" d="M464 46 V174" />

          {/* small HUD ticks */}
          <path className="hud2-stroke hud2-draw d2" d="M56 70 H80" />
          <path className="hud2-stroke hud2-draw d2" d="M464 150 H440" />

          {/* label bracket */}
          <path className="hud2-stroke hud2-draw d2" d="M90 62 H220" />
          <path className="hud2-stroke hud2-draw d2" d="M90 62 V78" />
        </g>
      </svg>

      {/* label + content */}
      <div className={`hud2-content ${stage >= 2 ? "on" : ""}`} style={{ transitionDelay: `${delay}ms` }}>
        <div className="hud2-label">{label}</div>

        <div className="hud2-body">
          {stage >= 3 ? (
            <Typewriter lines={[text]} speedMs={22} highlights={highlights} />
          ) : null}
        </div>

        <div className="hud2-strip">
          <span>SYS</span>
          <span className="hud2-accent">◆</span>
          <span>{side === "left" ? "EDU.RECORD" : "EXP.RECORD"}</span>
        </div>
      </div>
    </div>
  );
}

function PlusMark({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path className="hud2-stroke hud2-draw d0" d="M-10 0 H10" />
      <path className="hud2-stroke hud2-draw d0" d="M0 -10 V10" />
      <circle className="hud2-dot" cx="0" cy="0" r="1.8" />
    </g>
  );
}