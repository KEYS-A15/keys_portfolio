"use client";

import { useState, useEffect, useRef } from "react";

type Props = {
  text: string;
  onDone?: () => void;
};

/**
 * A terminal-style section header: "> Projects" with typewriter effect.
 * Reusable across all sections.
 */
export function HudSectionHeader({ text, onDone }: Props) {
  const [out, setOut] = useState("");
  const [done, setDone] = useState(false);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    let i = 0;
    let cancelled = false;
    const full = text;

    const tick = () => {
      if (cancelled) return;
      i++;
      setOut(full.slice(0, i));
      if (i >= full.length) {
        setDone(true);
        onDoneRef.current?.();
        return;
      }
      setTimeout(tick, 36);
    };

    const t = setTimeout(tick, 200);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [text]);

  return (
    <div className="flex items-center gap-3 mb-6">
      <span className="text-[rgb(var(--accent))] text-lg select-none">
        {">"}
      </span>
      <h2 className="text-lg tracking-wide text-[rgb(var(--fg))]">
        {out}
        {!done && <span className="hud2-cursor" />}
      </h2>
      {done && (
        <div className="flex-1 h-px bg-[rgb(var(--accent)/0.15)] ml-2" />
      )}
    </div>
  );
}
