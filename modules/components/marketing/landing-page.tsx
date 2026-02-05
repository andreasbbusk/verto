"use client";

import { AnimatedFeaturesSection } from "@/modules/components/marketing/features/animated-features-section";
import { AnimatedCTA } from "@/modules/components/marketing/hero/animated-cta";
import { AnimatedHeadline } from "@/modules/components/marketing/hero/animated-headline";
import { MarketingHeader } from "@/modules/components/marketing/marketing-header";
import { Button } from "@/modules/components/ui/button";
import type Lenis from "lenis";
import { ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const benefits = [
  {
    title: "Faster Learning",
    description:
      "Use spacing and active recall to build stronger memory with less cramming.",
    evidenceLabel: "Evidence",
    evidenceTitle: "Spacing + retrieval practice strengthen memory",
    evidenceText:
      "Research on distributed practice and the testing effect shows that spacing and active recall improve long-term retention more than massed study.",
    featureLabel: "In Verto",
    featureTitle: "Active recall by design",
    featureText:
      "Study sessions prompt recall first, then give immediate feedback with the answer.",
  },
  {
    title: "Better Retention",
    description:
      "Remember information for months or years, not just until the exam",
    evidenceLabel: "Evidence",
    evidenceTitle: "Delayed tests beat rereading",
    evidenceText:
      "Studies show repeated testing produces stronger delayed retention than repeated study alone.",
    featureLabel: "In Verto",
    featureTitle: "Recall-first flow",
    featureText:
      "Every session prompts recall first, then lets you verify and reinforce with the answer.",
  },
  {
    title: "Study Less",
    description: "Spend your time on the cards that need review most.",
    evidenceLabel: "Evidence",
    evidenceTitle: "Distributed practice is more efficient",
    evidenceText:
      "Meta-analyses find spaced study improves retention per unit of study time compared with cramming.",
    featureLabel: "In Verto",
    featureTitle: "Clear review focus",
    featureText:
      "Study sessions keep attention on the cards you are practicing right now.",
  },
  {
    title: "Stay Motivated",
    description:
      "Track your progress, maintain streaks, and see tangible improvement",
    evidenceLabel: "Evidence",
    evidenceTitle: "Consistency compounds retention",
    evidenceText:
      "Frequent retrieval across days strengthens memories and reduces forgetting.",
    featureLabel: "In Verto",
    featureTitle: "Progress + streaks",
    featureText:
      "Dashboard stats and streak tracking reinforce steady, repeatable study habits.",
  },
  {
    title: "Flexible Learning",
    description:
      "Study on your schedule with sessions that adapt to your available time",
    evidenceLabel: "Evidence",
    evidenceTitle: "Short, spaced sessions still work",
    evidenceText:
      "Spacing benefits appear across many schedules, including shorter sessions spread over time.",
    featureLabel: "In Verto",
    featureTitle: "Quick sessions",
    featureText: "Jump in for a quick session whenever you have time.",
  },
];

const studySteps = [
  {
    title: "Create a focused set",
    description:
      "Group what matters. Keep sets tight, scoped, and easy to revisit later.",
  },
  {
    title: "Add the key cards",
    description:
      "Capture definitions, concepts, and prompts that you want to recall.",
  },
  {
    title: "Start a study session",
    description:
      "Flip through cards quickly and keep the next prompt in focus.",
  },
  {
    title: "Recall before you reveal",
    description:
      "Answer from memory first, then check the back to reinforce it.",
  },
  {
    title: "Come back and repeat",
    description: "Short, consistent sessions build stronger long-term memory.",
  },
];

const statHighlights = [
  {
    label: "Average retention lift",
    value: "2.4x",
  },
  {
    label: "Focus time saved",
    value: "35%",
  },
  {
    label: "Daily streak momentum",
    value: "7 days",
  },
];

export function LandingView() {
  const [activeBenefitIndex, setActiveBenefitIndex] = useState(0);
  const activeBenefit = benefits[activeBenefitIndex];
  const studyTrackRef = useRef<HTMLDivElement>(null);
  const [studyProgress, setStudyProgress] = useState(0);
  const totalSegments = Math.max(1, studySteps.length - 1);
  const progressSegments = studyProgress * totalSegments;
  const activeStudyIndex = Math.min(
    studySteps.length - 1,
    Math.max(0, Math.floor(progressSegments + 0.001)),
  );

  useEffect(() => {
    const clamp = (value: number) => Math.min(1, Math.max(0, value));

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
        Math.abs(current - progress) < 0.001 ? current : progress,
      );
    };

    let lenis: Lenis | null = null;
    let rafId = 0;

    const setupLenis = async () => {
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
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <MarketingHeader />

      {/* Hero Section */}
      <section className="relative min-h-screen px-4 lg:px-6 overflow-hidden pt-24 lg:pt-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(236,203,69,0.08),transparent_60%)]" />

        <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_0.9fr] gap-12 lg:gap-20 items-center py-16 lg:py-22">
          <div className="max-w-xl">
            <div className="space-y-8 lg:space-y-10">
              <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">
                <span className="h-px w-8 bg-foreground/20" />
                Built for deep focus study
              </div>

              <AnimatedHeadline className="font-mono text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-foreground tracking-tight leading-[0.96]">
                Study smarter, build memory that lasts
              </AnimatedHeadline>

              <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-xl leading-relaxed">
                Verto blends focused sets with spaced repetition so you retain
                more in less time. Organize what you need, then review at
                exactly the right moment.
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <AnimatedCTA />
                <Button variant="outline" size="lg" asChild>
                  <Link href="#features">See it in action</Link>
                </Button>
              </div>

              <p className="text-xs font-mono text-muted-foreground">
                No credit card required • Setup in under 2 minutes
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-[24px] border border-foreground/10 bg-card/80 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-muted-foreground">
                  Set preview
                </span>
                <span className="text-xs font-mono text-foreground">
                  28 cards
                </span>
              </div>
              <div className="mt-4 h-px bg-foreground/10" />
              <h3 className="mt-3 text-lg font-mono font-semibold">
                Cognitive Psychology Essentials
              </h3>
              <p className="text-sm text-muted-foreground mt-2">
                Retrieval practice, spacing effect, encoding specificity, and
                more.
              </p>
              <div className="mt-5 grid grid-cols-2 gap-3 text-xs font-mono text-muted-foreground">
                <div className="rounded-lg border border-foreground/10 bg-background/60 px-3 py-2">
                  <div className="text-[10px] uppercase tracking-[0.16em]">
                    Due today
                  </div>
                  <div className="mt-1 text-sm text-foreground">12 cards</div>
                </div>
                <div className="rounded-lg border border-foreground/10 bg-background/60 px-3 py-2">
                  <div className="text-[10px] uppercase tracking-[0.16em]">
                    Time left
                  </div>
                  <div className="mt-1 text-sm text-foreground">8 minutes</div>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-[20px] border border-foreground/10 bg-card/70 px-5 py-4">
              <div className="flex items-center justify-between text-xs font-mono uppercase tracking-[0.18em] text-muted-foreground">
                <span>Proof in numbers</span>
                <span className="text-[10px]">Last 30 days</span>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {statHighlights.map((stat) => (
                  <div key={stat.label}>
                    <div className="text-xl font-mono font-bold text-foreground">
                      {stat.value}
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-1">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features">
        <AnimatedFeaturesSection />
      </section>

      {/* Study Loop Section */}
      <div className="py-28 lg:py-32 px-4 lg:px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <div ref={studyTrackRef} className="relative lg:h-[190vh]">
            <div className="lg:sticky lg:top-[16vh]">
              <div className="mb-28">
                <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">
                  <span className="h-px w-10 bg-foreground/20" />
                  The study loop
                </div>
                <div className="mt-4 h-px w-full bg-foreground/10" />
                <div className="mt-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                  <h2 className="font-mono text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight max-w-2xl">
                    From sets to mastery in five clean steps
                  </h2>
                  <p className="text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed">
                    Keep your learning structured without losing momentum. Each step
                    tightens the feedback loop between what you know and what you
                    need next.
                  </p>
                </div>
              </div>

              <div className="relative pt-10">
                <div className="absolute inset-x-0 top-16 hidden lg:block px-6">
                  <div className="h-px w-full bg-foreground/10" />
                  <div
                    className="h-px bg-foreground"
                    style={{ width: `${studyProgress * 100}%` }}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-10 lg:gap-12">
                  {studySteps.map((step, index) => (
                    <div key={step.title} className="relative">
                      <div
                        className={[
                          "relative z-10 inline-flex items-center justify-center h-12 w-12 rounded-xl border text-xs font-mono transition-colors",
                          index <= activeStudyIndex
                            ? "border-foreground bg-foreground text-background"
                            : "border-foreground/15 bg-background text-foreground",
                        ].join(" ")}
                      >
                        0{index + 1}
                      </div>
                      <h3
                        className={[
                          "mt-6 text-lg font-mono font-semibold transition-colors",
                          index <= activeStudyIndex
                            ? "text-foreground"
                            : "text-foreground/60",
                        ].join(" ")}
                      >
                        {step.title}
                      </h3>
                      <p
                        className={[
                          "mt-3 text-sm leading-relaxed max-w-sm transition-colors",
                          index <= activeStudyIndex
                            ? "text-muted-foreground"
                            : "text-muted-foreground/60",
                        ].join(" ")}
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
      </div>

      {/* Benefits Section / How It Works */}
      <section id="how-it-works" className="py-24 lg:py-28 px-4 lg:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">
              <span className="h-px w-10 bg-foreground/20" />
              Why Verto
            </div>
            <div className="mt-4 h-px w-full bg-foreground/10" />
            <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <h2 className="font-mono text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight max-w-2xl">
                The focus-first way to learn
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
                Active recall and spaced repetition are the two most effective
                study methods. Verto blends both into one continuous workflow.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-10 lg:gap-14 pt-12 items-start">
            <div className="space-y-4 lg:max-w-[520px]">
              {benefits.map((benefit, index) => {
                const isActive = activeBenefitIndex === index;

                return (
                  <button
                    key={benefit.title}
                    type="button"
                    onClick={() => setActiveBenefitIndex(index)}
                    className={[
                      "group relative w-full rounded-2xl border p-4 lg:p-5 text-left transition-all",
                      "bg-card/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
                      isActive
                        ? "border-primary/60 shadow-[0_12px_30px_rgba(8,8,8,0.12)]"
                        : "border-foreground/10",
                    ].join(" ")}
                    aria-pressed={isActive}
                  >
                    <span className="text-xs font-mono text-foreground/70">
                      0{index + 1}
                    </span>
                    <h3 className="mt-3 font-mono text-base font-semibold text-foreground">
                      {benefit.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {benefit.description}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="rounded-3xl border border-foreground/10 bg-card/70 p-6 lg:p-8 shadow-[0_24px_60px_rgba(8,8,8,0.08)]">
              <div className="space-y-5">
                <div className="rounded-3xl border border-foreground/10 bg-card/90 p-6 lg:p-7">
                  <div className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">
                    {activeBenefit.evidenceLabel}
                  </div>
                  <h4 className="mt-4 text-xl font-mono font-semibold text-foreground">
                    {activeBenefit.evidenceTitle}
                  </h4>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    {activeBenefit.evidenceText}
                  </p>
                </div>

                <div className="rounded-3xl border border-primary/40 bg-primary p-6 lg:p-7 text-background">
                  <div className="text-xs font-mono uppercase tracking-[0.2em] text-background/70">
                    {activeBenefit.featureLabel}
                  </div>
                  <h4 className="mt-4 text-xl font-mono font-semibold leading-snug">
                    {activeBenefit.featureTitle}
                  </h4>
                  <p className="mt-3 text-sm text-background/80 leading-relaxed">
                    {activeBenefit.featureText}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 lg:py-28 px-4 lg:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-[24px] border border-foreground/10 bg-card/80 p-8 sm:p-10 lg:p-12 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">
              <div className="w-full">
                <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">
                  <span className="h-px w-10 bg-foreground/20" />
                  Get started
                </div>
                <div className="mt-4 h-px w-full bg-foreground/10" />
                <div className="mt-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                  <h2 className="font-mono text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight max-w-2xl">
                    Build your next study session in minutes
                  </h2>
                  <p className="text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
                    Join students, professionals, and lifelong learners who are
                    using Verto to master new skills and retain knowledge
                    long-term.
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Button size="lg" asChild>
                  <Link href="/signup">
                    Create Free Account
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4 lg:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 border border-foreground flex items-center justify-center">
                <BookOpen className="h-3 w-3 text-foreground" />
              </div>
              <span className="font-mono text-sm">Verto</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 All rights reserved
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
