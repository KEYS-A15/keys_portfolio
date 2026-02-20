"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Item = { label: string; href: string };

const DEFAULT_ITEMS: Item[] = [
  { label: "About", href: "/about" },
  { label: "Experiences", href: "/experience" },
  { label: "Projects", href: "/projects" },
  { label: "Research", href: "/research" },
];

export function PromptMenu({
  items = DEFAULT_ITEMS,
}: {
  items?: Item[];
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
  const onKey = (e: KeyboardEvent) => {
    // Don’t steal keystrokes while typing in inputs/textareas
    const tag = (e.target as HTMLElement | null)?.tagName?.toLowerCase();
    if (tag === "input" || tag === "textarea" || (e.target as HTMLElement | null)?.isContentEditable) return;

    if (e.key === "Escape") {
      setOpen(false);
      return;
    }

    // Press M to toggle menu
    if (e.key === "m" || e.key === "M") {
      e.preventDefault();
      setOpen((v) => !v);
    }
  };

  window.addEventListener("keydown", onKey);
  return () => window.removeEventListener("keydown", onKey);
}, []);


  return (
    <div>
      {/* prompt row */}
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={[
          "select-none",
          "text-2xl md:text-3xl font-medium leading-relaxed",
          "text-[rgb(var(--accent))]",
          "transition-transform duration-300 ease-out",
          "focus:outline-none",
          open ? "rotate-90" : "rotate-0",
        ].join(" ")}
        title={open ? "Collapse menu" : "Expand menu"}
      >
        {">"}
      </button>

      {/* inline menu under it */}
      <div
        className={[
          "mt-10",               // pushes menu down like your screenshot
          "pl-2",                // tiny indent from the prompt
          "space-y-12",          // big vertical gaps
          "transition-all duration-300 ease-out",
          open
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-2 pointer-events-none h-0 overflow-hidden",
        ].join(" ")}
      >
        {items.map((it) => (
          <Link
            key={it.href}
            href={it.href}
            className="block text-3xl md:text-4xl font-medium text-[rgb(var(--accent))] hover:opacity-80 transition"
            onClick={() => setOpen(false)}
          >
            {it.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
