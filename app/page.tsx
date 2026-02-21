"use client";

import { useState, useCallback } from "react";
import { Typewriter } from "@/components/ui/typewriter";
import { HudBoxesHUD } from "@/components/ui/hud-boxes-hud";
import { HudProfile } from "@/components/ui/hud-profile";
import { HudGlitch } from "@/components/ui/hud-glitch";
import { HudSectionHeader } from "@/components/ui/hud-section-header";
import { HudProjectGrid } from "@/components/ui/hud-project-grid";
import { HudResearchList } from "@/components/ui/hud-research-list";

/* ── Data ─────────────────────────────── */
const PROJECTS = [
  {
    name: "Project Alpha",
    description: "End-to-end ML pipeline for real-time anomaly detection in IoT sensor streams.",
    tags: ["Python", "TensorFlow", "Kafka", "AWS"],
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
    name: "ChatCore",
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
    title: "Attention-Guided Feature Fusion for Multi-Modal Anomaly Detection",
    venue: "IEEE Conference on AI",
    year: "2025",
    link: "#",
  },
  {
    title: "Efficient Knowledge Distillation in Large Language Models",
    venue: "NeurIPS Workshop",
    year: "2024",
    link: "#",
  },
  {
    title: "Federated Learning for Privacy-Preserving Healthcare Analytics",
    venue: "AAAI",
    year: "2024",
    link: "#",
  },
];

export default function Home() {
  const [bootDone, setBootDone] = useState(false);
  const [projectsHeaderDone, setProjectsHeaderDone] = useState(false);
  const [researchHeaderDone, setResearchHeaderDone] = useState(false);

  const onProjectsHeaderDone = useCallback(() => setProjectsHeaderDone(true), []);
  const onResearchHeaderDone = useCallback(() => setResearchHeaderDone(true), []);

  return (
    <div className="min-h-screen relative">
      {/* CRT scanline overlay */}
      <div className="scanlines" aria-hidden="true" />

      <main>
        <div className="pt-10 pl-8 pr-10 md:pt-12 md:pl-10 md:pr-14">
          {/* ── Hero section ─────────────────── */}
          <div className="flex flex-col lg:flex-row lg:gap-10">
            {/* Left column */}
            <div className="flex-1 min-w-0">
              {/* Typewriter line */}
              <div className="flex items-start gap-4 font-medium leading-relaxed whitespace-nowrap">
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
                    onDone={() => setBootDone(true)}
                  />
                </div>
              </div>

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
              <div className="mt-6 lg:mt-0 lg:w-[300px] lg:flex-shrink-0 self-stretch min-h-[260px]">
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
