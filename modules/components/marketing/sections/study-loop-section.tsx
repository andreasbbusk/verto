"use client";

import type Lenis from "lenis";
import { useEffect, useRef, useState } from "react";

import type { StudyStep } from "@/modules/components/marketing/content";
import { marketingCopy } from "@/modules/components/marketing/content";
import { SectionHeader } from "@/modules/components/marketing/sections/section-header";
import { cn } from "@/modules/lib/utils";

type StudyLoopSectionProps = {
  steps?: StudyStep[];
};

const clamp = (value: number) => Math.min(1, Math.max(0, value));

export function StudyLoopSection({ steps }: StudyLoopSectionProps) {
  const { studyLoop } = marketingCopy;
  const stepList = steps ?? studyLoop.steps;
  const studyTrackRef = useRef<HTMLDivElement>(null);
  const [studyProgress, setStudyProgress] = useState(0);

  const totalSegments = Math.max(1, stepList.length - 1);
  const progressSegments = studyProgress * totalSegments;
  const activeStudyIndex = Math.min(
    stepList.length - 1,
    Math.max(0, Math.floor(progressSegments + 0.001))
  );

  useEffect(() => {
    const handleScroll = () => {
      const section = studyTrackRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;
      const startTrigger = viewportHeight * 0.4;
      const endTrigger = viewportHeight * 0.2;

      if (rect.top > startTrigger) {
        setStudyProgress(0);
        return;
      }

      if (rect.bottom < endTrigger) {
        setStudyProgress(1);
        return;
      }

      const total = rect.height - (startTrigger - endTrigger);
      const progressed = startTrigger - rect.top;
      const progress = clamp(progressed / total);

      setStudyProgress((current) =>
        Math.abs(current - progress) < 0.001 ? current : progress
      );
    };

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let lenis: Lenis | null = null;
    let rafId = 0;
    let scrollListenerAttached = false;

    const setupLenis = async () => {
      if (prefersReducedMotion) {
        window.addEventListener("scroll", handleScroll, { passive: true });
        scrollListenerAttached = true;
        handleScroll();
        return;
      }

      const LenisCtor = (await import("lenis")).default;
      lenis = new LenisCtor({
        duration: 1.05,
        smoothWheel: true,
      });

      lenis.on("scroll", handleScroll);

      const raf = (time: number) => {
        lenis?.raf(time);
        rafId = requestAnimationFrame(raf);
      };

      rafId = requestAnimationFrame(raf);
      handleScroll();
    };

    void setupLenis();
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("resize", handleScroll);
      if (scrollListenerAttached) {
        window.removeEventListener("scroll", handleScroll);
      }
      if (lenis) {
        lenis.off("scroll", handleScroll);
        lenis.destroy();
      }
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  return (
    <section
      id="study-loop"
      className="scroll-mt-32 py-28 lg:py-32 px-4 lg:px-6 bg-background"
    >
      <div className="max-w-7xl mx-auto">
        <div ref={studyTrackRef} className="relative lg:h-[190vh]">
          <div className="lg:sticky lg:top-[16vh]">
            <SectionHeader eyebrow={studyLoop.eyebrow} className="mb-28">
              <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                <h2 className="font-mono text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight max-w-2xl">
                  {studyLoop.title}
                </h2>
                <p className="text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed">
                  {studyLoop.description}
                </p>
              </div>
            </SectionHeader>

            <div className="relative pt-10">
              <div className="absolute inset-x-0 top-16 hidden lg:block px-6">
                <div className="h-px w-full bg-foreground/10" />
                <div
                  className="h-px bg-foreground"
                  style={{ width: `${studyProgress * 100}%` }}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-10 lg:gap-12">
                {stepList.map((step, index) => (
                  <div key={step.title} className="relative">
                    <div
                      className={cn(
                        "relative z-10 inline-flex items-center justify-center h-12 w-12 rounded-xl border text-xs font-mono transition-colors",
                        index <= activeStudyIndex
                          ? "border-foreground bg-foreground text-background"
                          : "border-foreground/15 bg-background text-foreground"
                      )}
                    >
                      0{index + 1}
                    </div>
                    <h3
                      className={cn(
                        "mt-6 text-lg font-mono font-semibold transition-colors",
                        index <= activeStudyIndex
                          ? "text-foreground"
                          : "text-foreground/60"
                      )}
                    >
                      {step.title}
                    </h3>
                    <p
                      className={cn(
                        "mt-3 text-sm leading-relaxed max-w-sm transition-colors",
                        index <= activeStudyIndex
                          ? "text-muted-foreground"
                          : "text-muted-foreground/60"
                      )}
                    >
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
