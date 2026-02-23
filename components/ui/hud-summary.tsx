"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type Highlight = { value: string; className: string };

type Props = {
  text: string;
  delayMs?: number;
  onDone?: () => void;
  highlights?: Highlight[]; // ✅ add this
};

function renderHighlighted(text: string, highlights: Highlight[]) {
  if (!highlights?.length) return text;

  // Collect all occurrences
  const ranges: { start: number; end: number; className: string }[] = [];
  for (const h of highlights) {
    if (!h.value) continue;
    let idx = 0;
    while (idx < text.length) {
      const found = text.indexOf(h.value, idx);
      if (found === -1) break;
      ranges.push({ start: found, end: found + h.value.length, className: h.className });
      idx = found + h.value.length;
    }
  }
  if (!ranges.length) return text;

  ranges.sort((a, b) => a.start - b.start);

  // Merge overlaps (optional but prevents ugly nesting)
  const merged: typeof ranges = [];
  for (const r of ranges) {
    const last = merged[merged.length - 1];
    if (!last || r.start >= last.end) merged.push(r);
    else if (r.end > last.end) last.end = r.end;
  }

  const out: React.ReactNode[] = [];
  let cursor = 0;

  for (const r of merged) {
    if (r.start > cursor) out.push(text.slice(cursor, r.start));
    out.push(
      <span key={`${r.start}-${r.end}`} className={r.className}>
        {text.slice(r.start, r.end)}
      </span>
    );
    cursor = r.end;
  }
  if (cursor < text.length) out.push(text.slice(cursor));

  return <>{out}</>;
}

export function HudSummary({ text, delayMs = 0, onDone, highlights = [] }: Props) {
  const [stage, setStage] = useState<0 | 1 | 2 | 3>(0);

  // ✅ keep latest onDone without restarting animation
  const onDoneRef = useRef<(() => void) | undefined>(onDone);
  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    const t1 = window.setTimeout(() => setStage(1), delayMs + 80);
    const t2 = window.setTimeout(() => setStage(2), delayMs + 780); // slower + small pause
    const t3 = window.setTimeout(() => setStage(3), delayMs + 1120);
    const t4 = window.setTimeout(() => onDoneRef.current?.(), delayMs + 1320);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      window.clearTimeout(t4);
    };
  }, [delayMs]);

  const content = useMemo(() => renderHighlighted(text, highlights), [text, highlights]);

  return (
    <div className="summaryhud">
      <div className="summaryhud-shell">
        <div className="summaryhud-rect" data-stage={stage}>
          <div className="summaryhud-text" data-on={stage >= 3}>
            {content}
          </div>
        </div>
      </div>
    </div>
  );
}