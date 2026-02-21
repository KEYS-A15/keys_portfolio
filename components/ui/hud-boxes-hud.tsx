"use client";

import { useEffect, useState, useCallback } from "react";

type Highlight = { text: string; className: string };

type SingleBoxConfig = {
  label: string;
  mainText: string;
  highlights: Highlight[];
  subtext: string;
  entries?: never;
};

type MultiBoxConfig = {
  label: string;
  entries: { text: string; highlights: Highlight[] }[];
  subtext: string;
  mainText?: never;
  highlights?: never;
};

type BoxConfig = SingleBoxConfig | MultiBoxConfig;

type Props = {
  left: BoxConfig;
  right: BoxConfig;
};

export function HudBoxesHUD({ left, right }: Props) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 120),   // center +
      setTimeout(() => setStage(2), 520),   // + splits into two, expands horizontally
      setTimeout(() => setStage(3), 1000),  // horizontal + signs expand vertically to corners
      setTimeout(() => setStage(4), 1500),  // dashed frame appears
      setTimeout(() => setStage(5), 2000),  // content types in
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
  const isMulti = !!config.entries;

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

      {/* Stage 2: + splits into left and right, traveling horizontally */}
      {/* Stage 3: each side + splits vertically into top/bottom corners */}
      <span className="hud2-plus hud2-plus-tl" data-stage={stage}>+</span>
      <span className="hud2-plus hud2-plus-tr" data-stage={stage}>+</span>
      <span className="hud2-plus hud2-plus-bl" data-stage={stage}>+</span>
      <span className="hud2-plus hud2-plus-br" data-stage={stage}>+</span>

      {/* Stage 4: dashed border frame */}
      <div
        className="hud2-frame"
        style={{
          opacity: stage >= 4 ? 1 : 0,
          transition: `opacity 400ms ease ${delay}ms`,
        }}
      >
        <div className="hud2-edge hud2-edge-top" />
        <div className="hud2-edge hud2-edge-bottom" />
        <div className="hud2-edge hud2-edge-left" />
        <div className="hud2-edge hud2-edge-right" />
      </div>

      {/* Glass fill */}
      <div
        className="hud2-fill"
        style={{
          opacity: stage >= 4 ? 1 : 0,
          transition: `opacity 500ms ease ${delay + 120}ms`,
        }}
      />

      {/* Stage 5: typewritten content */}
      <div
        className="hud2-content"
        style={{
          opacity: stage >= 5 ? 1 : 0,
          transition: `opacity 180ms ease ${delay}ms`,
        }}
      >
        {isMulti ? (
          <MultiContent
            label={config.label}
            entries={config.entries!}
            subtext={config.subtext}
            active={stage >= 5}
          />
        ) : (
          <SingleContent
            label={config.label}
            mainText={config.mainText!}
            highlights={config.highlights || []}
            subtext={config.subtext}
            active={stage >= 5}
          />
        )}
      </div>
    </div>
  );
}

/* ── Single text content ──────────────────────────────── */
function SingleContent({
  label,
  mainText,
  highlights,
  subtext,
  active,
}: {
  label: string;
  mainText: string;
  highlights: Highlight[];
  subtext: string;
  active: boolean;
}) {
  const [labelDone, setLabelDone] = useState(false);
  const [textDone, setTextDone] = useState(false);

  const onLabelDone = useCallback(() => setLabelDone(true), []);
  const onTextDone = useCallback(() => setTextDone(true), []);

  const labelTw = useTypewriter(label, active, 40, onLabelDone);
  const textTw = useTypewriter(mainText, labelDone, 22, onTextDone);
  const subTw = useTypewriter(subtext, textDone, 28);

  return (
    <>
      <div className="hud2-label">
        {labelTw.out}
        {!labelTw.done && active && <span className="hud2-cursor" />}
      </div>
      <div className="hud2-body">
        <span>
          {renderHighlighted(textTw.out, mainText, highlights)}
          {labelDone && !textTw.done && <span className="hud2-cursor" />}
        </span>
      </div>
      <div className="hud2-subtext">
        {subTw.out}
        {textDone && !subTw.done && <span className="hud2-cursor" />}
      </div>
    </>
  );
}

/* ── Multi-entry pill content ─────────────────────────── */
function MultiContent({
  label,
  entries,
  subtext,
  active,
}: {
  label: string;
  entries: { text: string; highlights: Highlight[] }[];
  subtext: string;
  active: boolean;
}) {
  const [labelDone, setLabelDone] = useState(false);
  const [entriesDone, setEntriesDone] = useState<boolean[]>(
    entries.map(() => false)
  );
  const allEntriesDone = entriesDone.every(Boolean);

  const onLabelDone = useCallback(() => setLabelDone(true), []);

  const labelTw = useTypewriter(label, active, 40, onLabelDone);
  const subTw = useTypewriter(subtext, allEntriesDone, 28);

  const markEntryDone = useCallback(
    (idx: number) => {
      setEntriesDone((prev) => {
        const next = [...prev];
        next[idx] = true;
        return next;
      });
    },
    []
  );

  return (
    <>
      <div className="hud2-label">
        {labelTw.out}
        {!labelTw.done && active && <span className="hud2-cursor" />}
      </div>
      <div className="hud2-pills">
        {entries.map((entry, i) => (
          <PillEntry
            key={i}
            text={entry.text}
            highlights={entry.highlights}
            start={i === 0 ? labelDone : entriesDone[i - 1]}
            onDone={() => markEntryDone(i)}
          />
        ))}
      </div>
      <div className="hud2-subtext">
        {subTw.out}
        {allEntriesDone && !subTw.done && <span className="hud2-cursor" />}
      </div>
    </>
  );
}

/* ── Individual pill entry ────────────────────────────── */
function PillEntry({
  text,
  highlights,
  start,
  onDone,
}: {
  text: string;
  highlights: Highlight[];
  start: boolean;
  onDone: () => void;
}) {
  const tw = useTypewriter(text, start, 22, onDone);

  return (
    <div className="hud2-pill">
      <span>
        {renderHighlighted(tw.out, text, highlights)}
        {start && !tw.done && <span className="hud2-cursor" />}
      </span>
    </div>
  );
}
