"use client";

import { useState } from "react";
import { Typewriter } from "@/components/ui/typewriter";
import { HudBoxesHUD } from "@/components/ui/hud-boxes-hud";
import { HudProfile } from "@/components/ui/hud-profile";
import { HudGlitch } from "@/components/ui/hud-glitch";

export default function Home() {
  const [bootDone, setBootDone] = useState(false);

  return (
    <div className="min-h-screen relative">
      {/* CRT scanline overlay */}
      <div className="scanlines" aria-hidden="true" />

      <main>
        <div className="pt-10 pl-8 pr-10 md:pt-12 md:pl-10 md:pr-14">
          {/* Two-column layout: left = text+boxes, right = profile image */}
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
        </div>
      </main>
    </div>
  );
}
