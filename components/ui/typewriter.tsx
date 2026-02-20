"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Highlight = { value: string; className: string };

type TypewriterProps = {
  lines: string[];               // ✅ multiple lines
  speedMs?: number;
  linePauseMs?: number;
  cursor?: boolean;
  highlights?: Highlight[];      // ✅ multiple highlights
  onDone?: () => void;
};

export function Typewriter({
  lines,
  speedMs = 28,
  linePauseMs = 140,
  cursor = true,
  highlights = [],
  onDone,
}: TypewriterProps) {
  const fullText = useMemo(() => lines.join("\n"), [lines]);
  const [out, setOut] = useState("");

  // ✅ Prevent double-run in React Strict Mode (dev)
  const startedRef = useRef(false);

  const ranges = useMemo(() => {
    // Build highlight ranges on fullText (supports multiple occurrences)
    const all: { start: number; end: number; className: string }[] = [];
    for (const h of highlights) {
      if (!h.value) continue;
      let idx = 0;
      while (idx < fullText.length) {
        const found = fullText.indexOf(h.value, idx);
        if (found === -1) break;
        all.push({ start: found, end: found + h.value.length, className: h.className });
        idx = found + h.value.length;
      }
    }
    // sort by start so rendering is stable
    all.sort((a, b) => a.start - b.start);
    return all;
  }, [fullText, highlights]);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    setOut("");
    let i = 0;
    let cancelled = false;

    const tick = () => {
      if (cancelled) return;

      const next = fullText[i];
      i++;
      setOut(fullText.slice(0, i));

      if (i >= fullText.length) {
        onDone?.();
        return;
      }

      // tiny pause after newline for “cursor drops” feel
      if (next === "\n") {
        window.setTimeout(tick, linePauseMs);
      } else {
        window.setTimeout(tick, speedMs);
      }
    };

    const id = window.setTimeout(tick, 350);

    return () => {
      cancelled = true;
      window.clearTimeout(id);
    };
  }, [fullText, speedMs, linePauseMs, onDone]);

const renderHighlighted = () => {
  const typed = out.length;
  if (typed === 0) return null;

  const content = out;
  const split = content.split("\n");
  const lastIdx = split.length - 1;

  const applyHighlightsToLine = (line: string, lineStart: number) => {
    if (!ranges.length) return line;

    // collect highlight segments that intersect this line and are already typed
    const segs: { start: number; end: number; className: string }[] = [];

    for (const r of ranges) {
      if (typed <= r.start) break; // highlight not reached yet

      const startAbs = Math.max(r.start, lineStart);
      const endAbs = Math.min(r.end, lineStart + line.length, typed);

      if (endAbs > startAbs) {
        segs.push({
          start: startAbs - lineStart,
          end: endAbs - lineStart,
          className: r.className,
        });
      }
    }

    if (segs.length === 0) return line;

    // sort segments; later segments can overlap — we’ll render in order
    segs.sort((a, b) => a.start - b.start);

    const parts: React.ReactNode[] = [];
    let pos = 0;

    for (const s of segs) {
      // if overlap, skip backwards parts
      const start = Math.max(s.start, pos);
      const end = Math.max(s.end, start);

      if (start > pos) parts.push(line.slice(pos, start));

      if (end > start) {
        parts.push(
          <span key={`${lineStart}-${start}-${end}-${s.className}`} className={s.className}>
            {line.slice(start, end)}
          </span>
        );
      }

      pos = end;
    }

    if (pos < line.length) parts.push(line.slice(pos));
    return <>{parts}</>;
  };

  return split.map((line, idx) => {
    // compute absolute start index of this line in `content`
    const beforeText = split.slice(0, idx).join("\n");
    const lineStart = beforeText.length + (idx === 0 ? 0 : 1);

    return (
      <div key={idx} className={`terminal-line-${idx}`}>
        <span>{applyHighlightsToLine(line, lineStart)}</span>
        {cursor && idx === lastIdx && <span className="cursor-block" />}
      </div>
    );
  });
};

  return <div className="whitespace-pre-wrap">{renderHighlighted()}</div>;
}
