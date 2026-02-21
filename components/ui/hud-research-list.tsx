"use client";

import { useEffect, useState } from "react";

export type ResearchData = {
  title: string;
  venue: string;
  year: string;
  link?: string;
};

type Props = {
  papers: ResearchData[];
  visible: boolean;
};

export function HudResearchList({ papers, visible }: Props) {
  const [revealedCount, setRevealedCount] = useState(0);

  useEffect(() => {
    if (!visible) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let j = 0; j < papers.length; j++) {
      timers.push(
        setTimeout(() => {
          setRevealedCount((prev) => prev + 1);
        }, 150 + j * 300)
      );
    }
    return () => timers.forEach(clearTimeout);
  }, [visible, papers.length]);

  return (
    <div className="hud-research-list">
      {papers.map((p, i) => (
        <ResearchRow key={p.title} paper={p} visible={i < revealedCount} index={i} />
      ))}
    </div>
  );
}

function ResearchRow({
  paper,
  visible,
  index,
}: {
  paper: ResearchData;
  visible: boolean;
  index: number;
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => setShow(true), 60);
    return () => clearTimeout(t);
  }, [visible]);

  const content = (
    <div
      className="hud-research-row"
      style={{
        opacity: show ? 1 : 0,
        transform: show ? "translateX(0)" : "translateX(-8px)",
        transition: "opacity 320ms ease, transform 320ms ease",
      }}
    >
      {/* Left accent bar */}
      <div className="hud-research-accent-bar" />

      <div className="hud-research-body">
        <div className="hud-research-top">
          <span className="hud-research-idx">
            [{String(index + 1).padStart(2, "0")}]
          </span>
          <span className="hud-research-title">{paper.title}</span>
          {paper.link && (
            <span className="hud-research-link-icon" aria-hidden="true">
              {"->"}
            </span>
          )}
        </div>
        <div className="hud-research-meta">
          <span className="hud-research-venue">{paper.venue}</span>
          <span className="hud-research-divider">|</span>
          <span className="hud-research-year">{paper.year}</span>
        </div>
      </div>
    </div>
  );

  if (paper.link) {
    return (
      <a
        href={paper.link}
        target="_blank"
        rel="noopener noreferrer"
        className="hud-research-link"
      >
        {content}
      </a>
    );
  }
  return content;
}
