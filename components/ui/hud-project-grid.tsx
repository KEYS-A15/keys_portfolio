"use client";

import { useEffect, useState, useRef } from "react";

export type ProjectData = {
  name: string;
  description: string;
  tags: string[];
  link?: string;
};

type Props = {
  projects: ProjectData[];
  visible: boolean;
};

export function HudProjectGrid({ projects, visible }: Props) {
  const [revealedCount, setRevealedCount] = useState(0);

  useEffect(() => {
    if (!visible) return;
    let i = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let j = 0; j < projects.length; j++) {
      timers.push(
        setTimeout(() => {
          i++;
          setRevealedCount(i);
        }, 200 + j * 250)
      );
    }
    return () => timers.forEach(clearTimeout);
  }, [visible, projects.length]);

  return (
    <div className="hud-project-grid">
      {projects.map((p, i) => (
        <ProjectCard
          key={p.name}
          project={p}
          visible={i < revealedCount}
          index={i}
        />
      ))}
    </div>
  );
}

function ProjectCard({
  project,
  visible,
  index,
}: {
  project: ProjectData;
  visible: boolean;
  index: number;
}) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (!visible) return;
    const timers = [
      setTimeout(() => setStage(1), 50),
      setTimeout(() => setStage(2), 300),
      setTimeout(() => setStage(3), 600),
      setTimeout(() => setStage(4), 900),
    ];
    return () => timers.forEach(clearTimeout);
  }, [visible]);

  return (
    <div
      className="hud-project-card"
      style={{
        opacity: stage >= 1 ? 1 : 0,
        transition: "opacity 200ms ease",
      }}
    >
      {/* Corner + signs */}
      <div
        className="hud2-corners"
        style={{
          opacity: stage >= 1 ? 1 : 0,
          transition: "opacity 180ms ease",
        }}
      >
        <span className="hud2-corner hud2-tl" data-expand={stage >= 2}>+</span>
        <span className="hud2-corner hud2-tr" data-expand={stage >= 2}>+</span>
        <span className="hud2-corner hud2-bl" data-expand={stage >= 2}>+</span>
        <span className="hud2-corner hud2-br" data-expand={stage >= 2}>+</span>
      </div>

      {/* Dashed frame */}
      <div
        className="hud2-frame"
        style={{
          opacity: stage >= 2 ? 1 : 0,
          transition: "opacity 350ms ease",
        }}
      >
        <div className="hud2-edge hud2-edge-top" />
        <div className="hud2-edge hud2-edge-bottom" />
        <div className="hud2-edge hud2-edge-left" />
        <div className="hud2-edge hud2-edge-right" />
      </div>

      {/* Dot grid fill */}
      <div
        className="hud2-fill"
        style={{
          opacity: stage >= 3 ? 1 : 0,
          transition: "opacity 400ms ease",
        }}
      />

      {/* Content */}
      <div
        className="hud-project-content"
        style={{
          opacity: stage >= 4 ? 1 : 0,
          transition: "opacity 300ms ease",
        }}
      >
        <div className="hud-project-header">
          <span className="hud-project-idx">
            {String(index + 1).padStart(2, "0")}
          </span>
          {project.link ? (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="hud-project-name"
            >
              {project.name}
              <span className="hud-project-link-arrow" aria-hidden="true">
                {" ->"}
              </span>
            </a>
          ) : (
            <span className="hud-project-name">{project.name}</span>
          )}
        </div>

        <p className="hud-project-desc">{project.description}</p>

        <div className="hud-project-tags">
          {project.tags.map((t) => (
            <span key={t} className="hud-project-tag">{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
