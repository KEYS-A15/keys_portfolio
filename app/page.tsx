"use client";

import { useState, useCallback } from "react";
import { Typewriter } from "@/components/ui/typewriter";
import { HudBoxesHUD } from "@/components/ui/hud-boxes-hud";
import { HudSummary } from "@/components/ui/hud-summary";
import { HudProfile } from "@/components/ui/hud-profile";
import { HudGlitch } from "@/components/ui/hud-glitch";
import { HudSectionHeader } from "@/components/ui/hud-section-header";
import { HudProjectGrid } from "@/components/ui/hud-project-grid";
import { HudResearchList } from "@/components/ui/hud-research-list";
import { CursorFX } from "@/components/ui/cursor-fx";
import { MatrixCursorFX } from "@/components/ui/matrix-cursor-fx";


/* ── Data ─────────────────────────────── */
const PROJECTS = [
  {
    name: "Edge Voice Command",
    description: "End-to-end ML voice pipeline for real-time voice command classification for edge devices.",
    tags: ["Python", "ONNX", "Docker", "TensorRT", "Raspberry Pi"],
    link: "#",
  },
  {
    name: "NeuralSearch",
    description: "Semantic search engine powered by transformer embeddings and approximate nearest neighbors.",
    tags: ["PyTorch", "FAISS", "FastAPI", "React"],
    link: "#",
  },
  {
    name: "VisionLab",
    description: "Computer vision toolkit for medical image segmentation with attention mechanisms.",
    tags: ["Python", "OpenCV", "U-Net", "CUDA"],
    link: "#",
  },
  {
    name: "DataForge",
    description: "Automated data preprocessing and feature engineering framework for tabular datasets.",
    tags: ["Pandas", "Scikit-learn", "Airflow"],
    link: "#",
  },
  {
    name: "ADOC-Chat",
    description: "Fine-tuned LLM chatbot with RAG pipeline for domain-specific knowledge retrieval.",
    tags: ["LangChain", "Pinecone", "OpenAI", "Next.js"],
    link: "#",
  },
  {
    name: "EdgeDeploy",
    description: "Model optimization and deployment pipeline for resource-constrained edge devices.",
    tags: ["ONNX", "TensorRT", "Docker", "Raspberry Pi"],
    link: "#",
  },
];

const PAPERS = [
  {
    title: "Transformer-Based Approach for local neighborhood mutation in TCR sequences for cancer-adaptive immunotherapy",
    venue: "Thesis Proposal @ Arizona State University",
    year: "2026",
    link: "#",
  },
  {
    title: "Reinforcement Learning with Planning for Cloud Resource Management",
    venue: "Thesis Proposal @ Arizona State University",
    year: "2026",
    link: "#",
  },
  {
    title: "Federated Learning for Privacy-Preserving Healthcare Analytics",
    venue: "Thesis Proposal @ Arizona State University",
    year: "2026",
    link: "#",
  },
];

export default function Home() {
  const [greetingDone, setGreetingDone] = useState(false);
  const [bootDone, setBootDone] = useState(false);
  const [hudDone, setHudDone] = useState(false);
  const [projectsHeaderDone, setProjectsHeaderDone] = useState(false);
  const [researchHeaderDone, setResearchHeaderDone] = useState(false);
  const onSummaryDone = useCallback(() => setBootDone(true), []);
  const onProjectsHeaderDone = useCallback(() => setProjectsHeaderDone(true), []);
  const onResearchHeaderDone = useCallback(() => setResearchHeaderDone(true), []);

  return (
    <div className="min-h-screen relative">
      <MatrixCursorFX radius={100} speed={0.4} density={2} opacity={0.05}/>
      {/* CRT scanline overlay */}
      <div className="scanlines" aria-hidden="true" />

      <main>
        <div className="pt-10 pl-8 pr-10 md:pt-12 md:pl-10 md:pr-14">
          {/* ── Hero section ─────────────────── */}
          <div className="flex flex-col md:flex-row md:gap-8 lg:gap-10">
            {/* Left column */}
            <div className="flex-1 min-w-0">
              {/* Typewriter line */}
              <div className="flex items-start gap-4 font-medium leading-relaxed">
                <span className="text-[rgb(var(--accent))] text-2xl md:text-3xl select-none leading-relaxed">
                  {">"}
                </span>

                <div>
                  <Typewriter
                    lines={["Hi there ! You've reached Shrey Gajjar"]}
                    speedMs={28}
                    linePauseMs={160}
                    highlights={[
                      { value: "Shrey Gajjar", className: "text-[rgb(var(--accent))]" },
                    ]}
                    onDone={() => setGreetingDone(true)}
                  />
                </div>
              </div>

              {/* Professional summary (no typewriter; reveal after HUD opens) */}
              {greetingDone && (
                <div className="mt-3 pl-10 pr-2 max-w-6xl">
                  <HudSummary
                    text={
                      "An MS CS candidate at Arizona State University, specializing in AI systems, planning and RL. " +
                      "My work focuses on applied AI across domains such as distributed systems, fintech and healthcare. " +
                      "With over 2 years of experience as AI/ML engineer, I have built end-to-end ML pipelines and robust AI implementations with novel solutions and scalable architecture."
                    }
                    highlights={[
                      { value: "MS CS", className: "hud2-accent" },
                      { value: "Arizona State University", className: "hud2-accent" },
                      { value: "AI systems", className: "hud2-accent" },
                      { value: "planning", className: "hud2-accent" },
                      { value: "RL", className: "hud2-accent" },
                    ]}
                    onDone={onSummaryDone}
                  />
                </div>
              )}

              {/* HUD info boxes */}
              {bootDone && (
                <div className="mt-6 pl-10">
                  <HudGlitch intervalMin={4000} intervalMax={9000}>
                    <HudBoxesHUD
                      left={{
                        label: "Current Position",
                        mainText: "Masters of Science in Computer Science @ Arizona State University",
                        highlights: [
                          { text: "Arizona State University", className: "hud2-accent" },
                        ],
                        subtext: "SYS | EDU.Record",
                      }}
                      right={{
                        label: "Previous Positions",
                        entries: [
                          {
                            text: "AI/ML Engineer @ Codetrade.io",
                            highlights: [
                              { text: "Codetrade.io", className: "hud2-accent" },
                            ],
                          },
                          {
                            text: "Data Science Intern @ Vertocity",
                            highlights: [
                              { text: "Vertocity", className: "hud2-accent" },
                            ],
                          },
                        ],
                        subtext: "SYS | EXP.Record",
                      }}
                    />
                  </HudGlitch>
                </div>
              )}
            </div>

            {/* Right column: profile image box */}
            {bootDone && (
              <div className="mt-6 md:mt-0 md:w-[200px] lg:w-[300px] md:flex-shrink-0 self-stretch min-h-[220px] md:min-h-[260px]">
                <HudGlitch intervalMin={5000} intervalMax={12000} className="h-full">
                  <HudProfile
                    src="/images/profile.jpg"
                    alt="Shrey Gajjar - profile photo"
                  />
                </HudGlitch>
              </div>
            )}
          </div>

          {/* ── Projects section ──────────────── */}
          {bootDone && (
            <section className="mt-16">
              <HudSectionHeader text="Projects" onDone={onProjectsHeaderDone} />
              <HudGlitch intervalMin={6000} intervalMax={14000}>
                <HudProjectGrid projects={PROJECTS} visible={projectsHeaderDone} />
              </HudGlitch>
            </section>
          )}

          {/* ── Research section ──────────────── */}
          {bootDone && projectsHeaderDone && (
            <section className="mt-16 pb-20">
              <HudSectionHeader text="Research" onDone={onResearchHeaderDone} />
              <HudGlitch intervalMin={7000} intervalMax={16000}>
                <HudResearchList papers={PAPERS} visible={researchHeaderDone} />
              </HudGlitch>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
