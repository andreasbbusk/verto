"use client";

import { useRef } from "react";
import { BookOpen, Brain, Check, Target } from "lucide-react";
import {
  gsap,
  useIsomorphicLayoutEffect,
} from "@/modules/components/marketing/gsap/gsap-config";
import { FlashcardFlipDemo } from "./flashcard-flip-demo";
import { OrganizationGridDemo } from "./organization-grid-demo";
import { ProgressChartDemo } from "./progress-chart-demo";

export function AnimatedFeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Animate section header
      gsap.from(headerRef.current, {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: headerRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      // Animate each feature section
      const features = gsap.utils.toArray("[data-feature]");
      features.forEach((feature, index) => {
        const isEven = index % 2 === 0;

        // Animate text content
        gsap.from(feature as gsap.DOMTarget, {
          opacity: 0,
          x: isEven ? -60 : 60,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: feature as gsap.DOMTarget,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        });
      });

      // Animate visual demos
      const demos = gsap.utils.toArray("[data-demo]");
      demos.forEach((demo, index) => {
        const isEven = index % 2 === 0;

        gsap.from(demo as gsap.DOMTarget, {
          opacity: 0,
          x: isEven ? 60 : -60,
          scale: 0.95,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: demo as gsap.DOMTarget,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-32 px-6 lg:px-8 bg-card/30">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div ref={headerRef} className="mb-24 text-center">
          <h2 className="font-mono text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight">
            Everything you need to learn effectively
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Research-backed features designed to maximize retention and minimize
            study time
          </p>
        </div>

        {/* Feature 1 - Spaced Repetition */}
        <div className="mb-32 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="order-2 lg:order-1" data-demo>
            <FlashcardFlipDemo />
          </div>
          <div className="order-1 lg:order-2" data-feature="spaced-repetition">
            <h3 className="font-mono text-3xl sm:text-4xl font-bold text-foreground mb-6 tracking-tight">
              Intelligent Spaced Repetition
            </h3>
            <p className="text-base text-muted-foreground leading-relaxed mb-6">
              Review cards at scientifically optimized intervals. Our algorithm
              tracks your performance and schedules reviews right before you're
              about to forget—maximizing long-term retention while minimizing
              wasted study time.
            </p>
            <p className="text-base text-muted-foreground leading-relaxed mb-8">
              Based on decades of cognitive science research, spaced repetition
              has been proven to increase retention by up to 200% compared to
              traditional study methods.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm text-foreground">
                  Adaptive difficulty adjustment based on your performance
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm text-foreground">
                  Optimal review timing to prevent forgetting
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm text-foreground">
                  Focus on cards that need the most attention
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Feature 2 - Progress Tracking */}
        <div className="mb-32 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div data-feature="progress-tracking">
            <h3 className="font-mono text-3xl sm:text-4xl font-bold text-foreground mb-6 tracking-tight">
              Comprehensive Progress Tracking
            </h3>
            <p className="text-base text-muted-foreground leading-relaxed mb-6">
              Monitor your learning with detailed analytics. Track cards
              studied, accuracy rates, and study streaks. Visual insights help
              you understand your progress and stay motivated with daily goals.
            </p>
            <p className="text-base text-muted-foreground leading-relaxed mb-8">
              Studies show that tracking progress significantly increases
              motivation and completion rates. See your improvement over time
              and maintain momentum with streak tracking.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm text-foreground">
                  Daily study streaks to build consistent habits
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm text-foreground">
                  Performance analytics per set and card
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm text-foreground">
                  Customizable study goals to keep you on track
                </span>
              </li>
            </ul>
          </div>
          <div data-demo>
            <ProgressChartDemo />
          </div>
        </div>

        {/* Feature 3 - Easy Organization */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="order-2 lg:order-1" data-demo>
            <OrganizationGridDemo />
          </div>
          <div className="order-1 lg:order-2" data-feature="organization">
            <h3 className="font-mono text-3xl sm:text-4xl font-bold text-foreground mb-6 tracking-tight">
              Powerful Organization
            </h3>
            <p className="text-base text-muted-foreground leading-relaxed mb-6">
              Create unlimited flashcard sets for any subject. Organize your
              study material with drag-and-drop reordering, star important
              cards, and filter by review status to focus on what matters most.
            </p>
            <p className="text-base text-muted-foreground leading-relaxed mb-8">
              Quick edit functionality lets you refine cards during study
              sessions. Import cards from JSON or create them one by one with
              our intuitive interface. Everything syncs instantly.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm text-foreground">
                  Unlimited sets and cards for all your subjects
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm text-foreground">
                  Star cards and filter by due date or starred status
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm text-foreground">
                  Edit cards on the fly during study sessions
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
