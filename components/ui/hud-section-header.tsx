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
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    let i = 0;
    let cancelled = false;
    const full = text;

    const tick = () => {
      if (cancelled) return;
      i++;
      setOut(full.slice(0, i));
      if (i >= full.length) {
        setDone(true);
        onDone?.();
        return;
      }
      setTimeout(tick, 36);
    };

    setTimeout(tick, 200);
    return () => { cancelled = true; };
  }, [text, onDone]);

  return (
    <div className="flex items-center gap-3 mb-6">
      <span className="text-[rgb(var(--accent))] text-lg select-none">
        {">"}
      </span>
      <h2 className="text-lg tracking-wide text-[rgb(var(--fg))]">
        {out}
        {!done && <span className="cursor-block" style={{ height: "0.85em", width: "0.6ch" }} />}
      </h2>
      {done && (
        <div className="flex-1 h-px bg-[rgb(var(--accent)/0.15)] ml-2" />
      )}
    </div>
  );
}
