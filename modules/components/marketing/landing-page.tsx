"use client";

import { Button } from "@/modules/components/ui/button";
import { Card } from "@/modules/components/ui/card";
import { ArrowRight, BookOpen, Check } from "lucide-react";
import Link from "next/link";
import { AnimatedHeadline } from "@/modules/components/marketing/hero/animated-headline";
import { AnimatedGradientOrbs } from "@/modules/components/marketing/hero/animated-gradient-orbs";
import { AnimatedCTA } from "@/modules/components/marketing/hero/animated-cta";
import { AnimatedFeaturesSection } from "@/modules/components/marketing/features/animated-features-section";
import { MarketingHeader } from "@/modules/components/marketing/marketing-header";

const benefits = [
  {
    title: "Faster Learning",
    description:
      "Spaced repetition helps you learn material 2-3x faster than traditional methods",
  },
  {
    title: "Better Retention",
    description:
      "Remember information for months or years, not just until the exam",
  },
  {
    title: "Study Less",
    description:
      "Spend less time reviewing and more time learning new material",
  },
  {
    title: "Stay Motivated",
    description:
      "Track your progress, maintain streaks, and see tangible improvement",
  },
  {
    title: "Flexible Learning",
    description:
      "Study on your schedule with sessions that adapt to your available time",
  },
];

export function LandingView() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <MarketingHeader />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 lg:px-8 overflow-hidden">
        <AnimatedGradientOrbs />

        <div className="relative z-10 max-w-5xl mx-auto text-center py-20">
          <AnimatedHeadline className="font-mono text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-foreground mb-8 tracking-tighter leading-[0.95]">
            Study smarter not harder
          </AnimatedHeadline>

          <p
            className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed opacity-0 animate-fade-in-up"
            style={{ animationDelay: "1s", animationFillMode: "forwards" }}
          >
            Verto uses scientifically-proven spaced repetition to help you
            remember more in less time. Build lasting knowledge that sticks.
          </p>

          <AnimatedCTA />
        </div>
      </section>

      {/* Features Section */}
      <section id="features">
        <AnimatedFeaturesSection />
      </section>

      {/* Benefits Section / How It Works */}
      <section
        id="how-it-works"
        className="py-24 px-6 lg:px-8 border-t border-border"
      >
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 text-center">
            <h2 className="font-mono text-3xl sm:text-4xl font-bold text-foreground mb-4 tracking-tight">
              Why use Verto?
            </h2>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto">
              Active recall through flashcards is one of the most effective
              learning methods according to cognitive research
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <Card
                key={index}
                className="p-6 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-6 h-6 border border-primary flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="font-mono text-base font-semibold text-foreground">
                    {benefit.title}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed pl-9">
                  {benefit.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 lg:px-8 border-t border-border">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-mono text-3xl sm:text-4xl font-bold text-foreground mb-4 tracking-tight">
            Start learning more effectively today
          </h2>
          <p className="text-base text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join students, professionals, and lifelong learners who are using
            Verto to master new skills and retain knowledge long-term.
          </p>
          <Button size="lg" asChild>
            <Link href="/signup">
              Create Free Account
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
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
