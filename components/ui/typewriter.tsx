"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type Highlight = { value: string; className: string };

type TypewriterProps = {
  lines: string[];
  speedMs?: number;
  linePauseMs?: number;
  cursor?: boolean;
  highlights?: Highlight[];
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
  // ✅ IMPORTANT: depend on the *string*, not the array identity
  const fullText = lines.join("\n");

  const [out, setOut] = useState("");

  // ✅ IMPORTANT: don't let a new function identity restart the effect
  const onDoneRef = useRef<(() => void) | undefined>(onDone);
  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  const ranges = useMemo(() => {
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
    all.sort((a, b) => a.start - b.start);
    return all;
  }, [fullText, highlights]);

  useEffect(() => {
    setOut("");
    let i = 0;
    let cancelled = false;
    let timeoutId: number | null = null;

    const tick = () => {
      if (cancelled) return;

      const next = fullText[i];
      i++;
      setOut(fullText.slice(0, i));

      if (i >= fullText.length) {
        onDoneRef.current?.();
        return;
      }

      timeoutId = window.setTimeout(tick, next === "\n" ? linePauseMs : speedMs);
    };

    timeoutId = window.setTimeout(tick, 350);

    return () => {
      cancelled = true;
      if (timeoutId !== null) window.clearTimeout(timeoutId);
    };
  }, [fullText, speedMs, linePauseMs]); // ✅ onDone removed

  const renderHighlighted = () => {
    const typed = out.length;
    if (typed === 0) return null;

    const split = out.split("\n");
    const lastIdx = split.length - 1;

    const applyHighlightsToLine = (line: string, lineStart: number) => {
      if (!ranges.length) return line;

      const segs: { start: number; end: number; className: string }[] = [];
      for (const r of ranges) {
        if (typed <= r.start) break;

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

      segs.sort((a, b) => a.start - b.start);

      const parts: React.ReactNode[] = [];
      let pos = 0;

      for (const s of segs) {
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