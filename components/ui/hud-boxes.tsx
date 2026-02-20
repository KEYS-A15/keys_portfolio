"use client";

import { useEffect, useState } from "react";
import { Typewriter } from "@/components/ui/typewriter";

type HudBoxesProps = {
  leftLabel?: string;
  rightLabel?: string;
  leftLine?: string;
  rightLine?: string;
};

export function HudBoxes({
  leftLabel = "Current Status",
  rightLabel = "Previous Role",
  leftLine = "Master's Student @ Arizona State University",
  rightLine = "Ex AI/ML Engineer @ Codetrade",
}: HudBoxesProps) {
  const [stage, setStage] = useState<0 | 1 | 2>(0);

  useEffect(() => {
    const t1 = window.setTimeout(() => setStage(1), 180); // boxes appear
    const t2 = window.setTimeout(() => setStage(2), 520); // text types
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  return (
    <div className="hud-wrap">
      <HudBox
        side="left"
        label={leftLabel}
        show={stage >= 1}
        type={stage >= 2}
        text={leftLine}
        highlights={[
          { value: "Arizona State University", className: "text-[rgb(var(--accent))]" },
          { value: "Master's Student", className: "text-[rgb(var(--muted))]" },
        ]}
      />

      <HudBox
        side="right"
        label={rightLabel}
        show={stage >= 1}
        type={stage >= 2}
        text={rightLine}
        highlights={[
          { value: "Codetrade", className: "text-[rgb(var(--accent))]" },
          { value: "AI/ML Engineer", className: "text-[rgb(var(--muted))]" },
        ]}
        delayMs={90}
      />
    </div>
  );
}

function HudBox({
  side,
  label,
  text,
  show,
  type,
  delayMs = 0,
  highlights = [],
}: {
  side: "left" | "right";
  label: string;
  text: string;
  show: boolean;
  type: boolean;
  delayMs?: number;
  highlights?: { value: string; className: string }[];
}) {
  return (
    <section
      className={[
        "hud-box",
        side === "left" ? "hud-left" : "hud-right",
        show ? "hud-on" : "hud-off",
      ].join(" ")}
      style={{ transitionDelay: `${delayMs}ms` }}
    >
      {/* Vector brackets (SVG) */}
      <svg className="hud-brackets" viewBox="0 0 420 170" fill="none" aria-hidden="true">
        <path className="hud-br" d="M18 40 V18 H40" />
        <path className="hud-br" d="M402 40 V18 H380" />
        <path className="hud-br" d="M18 130 V152 H40" />
        <path className="hud-br" d="M402 130 V152 H380" />
      </svg>

      <div className="hud-topline" />

      <div className="hud-label">{label}</div>

      <div className="hud-body">
        <div className="hud-status">
          <span className="hud-dot" />
          {side === "left" ? "Active" : "Archived"}
        </div>

        <div className="hud-text">
          {type ? (
            <Typewriter lines={[text]} speedMs={22} highlights={highlights} />
          ) : null}
        </div>

        <div className="hud-strip">
          <span>SYS</span>
          <span className="hud-strip-accent">◆</span>
          <span>{side === "left" ? "EDU.RECORD" : "EXP.RECORD"}</span>
        </div>
      </div>
    </section>
  );
}