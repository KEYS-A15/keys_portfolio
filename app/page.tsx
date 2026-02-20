"use client";

import { useState } from "react";
import { Typewriter } from "@/components/ui/typewriter";
import { HudBoxes } from "@/components/ui/hud-boxes";
import { HudBoxesHUD } from "@/components/ui/hud-boxes-hud";

export default function Home() {
  const [bootDone, setBootDone] = useState(false);

  return (
    <div className="min-h-screen">
      <main>
        <div className="pt-10 pl-8 pr-6 md:pt-12 md:pl-10">
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
                onDone={() => setBootDone(true)}
              />
            </div>
          </div>

          {bootDone && (
            <HudBoxesHUD
              leftText="Master's Student @ Arizona State University"
              rightText="Ex AI/ML Engineer @ Codetrade"
            />
          )}
        </div>
      </main>
    </div>
  );
}