"use client";

import { useEffect, useState, useCallback } from "react";

type Highlight = { text: string; className: string };

type BoxConfig = {
  label: string;
  mainText: string;
  highlights: Highlight[];
  subtext: string;
};

type Props = {
  left: BoxConfig;
  right: BoxConfig;
};

export function HudBoxesHUD({ left, right }: Props) {
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

  return (
    <div className="hud2-wrap">
      <HudFrame stage={stage} config={left} delay={0} />
      <HudFrame stage={stage} config={right} delay={100} />
    </div>
  );
}

/* ── Inline typewriter hook ────────────────────────────── */
function useTypewriter(
  text: string,
  start: boolean,
  speed = 32,
  onDone?: () => void
) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, start, speed]);

  return { out, done };
}

/* ── Render text with highlighted spans ────────────────── */
function renderHighlighted(
  visibleText: string,
  fullText: string,
  highlights: Highlight[]
) {
  if (!highlights.length) return visibleText;

  const ranges: { start: number; end: number; className: string }[] = [];
  for (const h of highlights) {
    const idx = fullText.indexOf(h.text);
    if (idx !== -1) {
      ranges.push({
        start: idx,
        end: idx + h.text.length,
        className: h.className,
      });
    }
  }
  ranges.sort((a, b) => a.start - b.start);

  const parts: { text: string; className?: string }[] = [];
  let cursor = 0;
  for (const r of ranges) {
    if (r.start > cursor) {
      parts.push({ text: fullText.slice(cursor, r.start) });
    }
    parts.push({
      text: fullText.slice(r.start, r.end),
      className: r.className,
    });
    cursor = r.end;
  }
  if (cursor < fullText.length) {
    parts.push({ text: fullText.slice(cursor) });
  }

  let charsLeft = visibleText.length;
  return (
    <>
      {parts.map((p, i) => {
        if (charsLeft <= 0) return null;
        const show = p.text.slice(0, charsLeft);
        charsLeft -= show.length;
        return p.className ? (
          <span key={i} className={p.className}>
            {show}
          </span>
        ) : (
          <span key={i}>{show}</span>
        );
      })}
    </>
  );
}

/* ── Single HUD Frame ─────────────────────────────────── */
function HudFrame({
  stage,
  config,
  delay = 0,
}: {
  stage: number;
  config: BoxConfig;
  delay?: number;
}) {
  const [labelDone, setLabelDone] = useState(false);
  const [textDone, setTextDone] = useState(false);

  const onLabelDone = useCallback(() => setLabelDone(true), []);
  const onTextDone = useCallback(() => setTextDone(true), []);

  const labelTw = useTypewriter(config.label, stage >= 4, 40, onLabelDone);
  const textTw = useTypewriter(config.mainText, labelDone, 22, onTextDone);
  const subTw = useTypewriter(config.subtext, textDone, 28);

  const expanded = stage >= 2;
  const drawn = stage >= 3;

  return (
    <div className="hud2-box" style={{ animationDelay: `${delay}ms` }}>
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

      {/* Stage 2+: four corner + signs */}
      <div
        className="hud2-corners"
        style={{
          opacity: stage >= 2 ? 1 : 0,
          transition: `opacity 180ms ease ${delay}ms`,
        }}
      >
        <span
          className="hud2-corner hud2-tl"
          data-expand={expanded}
        >
          +
        </span>
        <span
          className="hud2-corner hud2-tr"
          data-expand={expanded}
        >
          +
        </span>
        <span
          className="hud2-corner hud2-bl"
          data-expand={expanded}
        >
          +
        </span>
        <span
          className="hud2-corner hud2-br"
          data-expand={expanded}
        >
          +
        </span>
      </div>

      {/* Stage 3+: dashed border frame */}
      <div
        className="hud2-frame"
        style={{
          opacity: drawn ? 1 : 0,
          transition: `opacity 400ms ease ${delay}ms`,
        }}
      >
        {/* Top dashed line */}
        <div className="hud2-edge hud2-edge-top" />
        {/* Bottom dashed line */}
        <div className="hud2-edge hud2-edge-bottom" />
        {/* Left dashed line */}
        <div className="hud2-edge hud2-edge-left" />
        {/* Right dashed line */}
        <div className="hud2-edge hud2-edge-right" />
      </div>

      {/* Glass fill */}
      <div
        className="hud2-fill"
        style={{
          opacity: drawn ? 1 : 0,
          transition: `opacity 500ms ease ${delay + 120}ms`,
        }}
      />

      {/* Stage 4: typewritten content */}
      <div
        className="hud2-content"
        style={{
          opacity: stage >= 4 ? 1 : 0,
          transition: `opacity 180ms ease ${delay}ms`,
        }}
      >
        {/* Label top-left */}
        <div className="hud2-label">
          {labelTw.out}
          {!labelTw.done && stage >= 4 && <span className="hud2-cursor" />}
        </div>

        {/* Main text */}
        <div className="hud2-body">
          <span>
            {renderHighlighted(
              textTw.out,
              config.mainText,
              config.highlights
            )}
            {labelDone && !textTw.done && <span className="hud2-cursor" />}
          </span>
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
