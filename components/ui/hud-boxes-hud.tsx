"use client";

import { useEffect, useState, useCallback } from "react";

type Props = {
  leftText: string;
  rightText: string;
};

/**
 * Animation stages (per box):
 * 0 - nothing
 * 1 - single centered + appears
 * 2 - + splits into 4 corner plus signs
 * 3 - frame lines draw between corner plus signs
 * 4 - content appears: label typewritten, then main text, then subtext
 */

export function HudBoxesHUD({ leftText, rightText }: Props) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 100),   // single + appears
      setTimeout(() => setStage(2), 500),   // splits to 4 corners
      setTimeout(() => setStage(3), 900),   // frame draws
      setTimeout(() => setStage(4), 1400),  // content typewriter starts
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="hud2-wrap">
      <HudFrame
        stage={stage}
        label="CURRENT"
        text={leftText}
        subtext="SYS EDU.RECORD"
        delay={0}
      />
      <HudFrame
        stage={stage}
        label="PREVIOUS"
        text={rightText}
        subtext="SYS EXP.RECORD"
        delay={80}
      />
    </div>
  );
}

/* ── Inline typewriter hook ────────────────────────────── */
function useTypewriter(text: string, start: boolean, speed = 32, onDone?: () => void) {
  const [out, setOut] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!start) return;
    setOut("");
    setDone(false);
    let i = 0;
    let cancelled = false;

    const tick = () => {
      if (cancelled) return;
      i++;
      setOut(text.slice(0, i));
      if (i >= text.length) {
        setDone(true);
        onDone?.();
        return;
      }
      setTimeout(tick, speed);
    };

    const id = setTimeout(tick, speed);
    return () => {
      cancelled = true;
      clearTimeout(id);
    };
  }, [text, start, speed, onDone]);

  return { out, done };
}

/* ── Single HUD Frame ─────────────────────────────────── */
function HudFrame({
  stage,
  label,
  text,
  subtext,
  delay = 0,
}: {
  stage: number;
  label: string;
  text: string;
  subtext: string;
  delay?: number;
}) {
  const [labelDone, setLabelDone] = useState(false);
  const [textDone, setTextDone] = useState(false);

  const onLabelDone = useCallback(() => setLabelDone(true), []);
  const onTextDone = useCallback(() => setTextDone(true), []);

  const labelTw = useTypewriter(label, stage >= 4, 45, onLabelDone);
  const textTw = useTypewriter(text, labelDone, 24, onTextDone);
  const subTw = useTypewriter(subtext, textDone, 30);

  return (
    <div className="hud2-box" style={{ animationDelay: `${delay}ms` }}>
      {/* Stage 1: single centered + */}
      <div
        className="hud2-center-plus"
        style={{
          opacity: stage === 1 ? 1 : 0,
          transition: "opacity 180ms ease",
        }}
      >
        <span className="hud2-plus-char">+</span>
      </div>

      {/* Stage 2+: four corner plus signs */}
      <div
        className="hud2-corners"
        style={{
          opacity: stage >= 2 ? 1 : 0,
          transition: `opacity 200ms ease ${delay}ms`,
        }}
      >
        <span className="hud2-corner hud2-tl" data-expand={stage >= 2 ? "true" : "false"}>+</span>
        <span className="hud2-corner hud2-tr" data-expand={stage >= 2 ? "true" : "false"}>+</span>
        <span className="hud2-corner hud2-bl" data-expand={stage >= 2 ? "true" : "false"}>+</span>
        <span className="hud2-corner hud2-br" data-expand={stage >= 2 ? "true" : "false"}>+</span>
      </div>

      {/* Stage 3+: frame lines */}
      <svg
        className="hud2-frame-svg"
        viewBox="0 0 400 160"
        preserveAspectRatio="none"
        fill="none"
        aria-hidden="true"
      >
        {/* top */}
        <line x1="24" y1="16" x2="376" y2="16"
          className={`hud2-line ${stage >= 3 ? "drawn" : ""}`}
          style={{ transitionDelay: `${delay}ms` }} />
        {/* bottom */}
        <line x1="24" y1="144" x2="376" y2="144"
          className={`hud2-line ${stage >= 3 ? "drawn" : ""}`}
          style={{ transitionDelay: `${delay}ms` }} />
        {/* left */}
        <line x1="24" y1="16" x2="24" y2="144"
          className={`hud2-line hud2-line-v ${stage >= 3 ? "drawn" : ""}`}
          style={{ transitionDelay: `${delay + 80}ms` }} />
        {/* right */}
        <line x1="376" y1="16" x2="376" y2="144"
          className={`hud2-line hud2-line-v ${stage >= 3 ? "drawn" : ""}`}
          style={{ transitionDelay: `${delay + 80}ms` }} />
      </svg>

      {/* Stage 3+: subtle fill */}
      <div
        className="hud2-fill"
        style={{
          opacity: stage >= 3 ? 1 : 0,
          transition: `opacity 400ms ease ${delay + 100}ms`,
        }}
      />

      {/* Stage 4: typewritten content */}
      <div
        className="hud2-content"
        style={{
          opacity: stage >= 4 ? 1 : 0,
          transition: `opacity 200ms ease ${delay}ms`,
        }}
      >
        {/* Label top-left */}
        <div className="hud2-label">
          {labelTw.out}
          {!labelTw.done && stage >= 4 && <span className="hud2-cursor" />}
        </div>

        {/* Main text centered */}
        <div className="hud2-body">
          {textTw.out}
          {labelDone && !textTw.done && <span className="hud2-cursor" />}
        </div>

        {/* Subtext bottom-right */}
        <div className="hud2-subtext">
          {subTw.out}
          {textDone && !subTw.done && <span className="hud2-cursor" />}
        </div>
      </div>
    </div>
  );
}
