"use client";

import { SignInForm } from "@/modules/components/auth/sign-in-form";
import { SignUpForm } from "@/modules/components/auth/sign-up-form";
import { Button } from "@/modules/components/ui/button";
import {
  Card
} from "@/modules/components/ui/card";
import {
  ArrowRight,
  BookOpen,
  Brain,
  Check,
  Target,
  Users,
} from "lucide-react";
import { useState } from "react";

const features = [
  {
    icon: Brain,
    title: "Smart Learning",
    description:
      "Spaced repetition algorithm helps you remember more effectively",
  },
  {
    icon: Target,
    title: "Track Progress",
    description: "Monitor your learning progress with detailed analytics",
  },
  {
    icon: BookOpen,
    title: "Organize Sets",
    description: "Create and manage your flashcard sets with ease",
  },
  {
    icon: Users,
    title: "Study Together",
    description: "Share sets and learn with friends and classmates",
  },
];

const benefits = [
  "Create unlimited flashcard sets",
  "Track your study progress",
  "Spaced repetition learning",
  "Mobile responsive design",
  "Study anywhere, anytime",
];

type AuthMode = "signin" | "signup" | null;

export function LandingView() {
  const [authMode, setAuthMode] = useState<AuthMode>(null);

  if (authMode) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {authMode === "signin" ? (
            <SignInForm onSwitchToSignUp={() => setAuthMode("signup")} />
          ) : (
            <SignUpForm onSwitchToSignIn={() => setAuthMode("signin")} />
          )}
          <div className="mt-6 text-center">
            <Button
              variant="ghost"
              onClick={() => setAuthMode(null)}
              size="sm"
              className="text-sm"
            >
              ← Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 border border-foreground flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-foreground" />
              </div>
              <span className="font-mono text-lg tracking-tight">
                Flashcards
              </span>
            </div>
            <div className="space-x-2">
              <Button
                variant="ghost"
                onClick={() => setAuthMode("signin")}
                size="sm"
              >
                Sign In
              </Button>
              <Button
                onClick={() => setAuthMode("signup")}
                size="sm"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-32 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-mono text-6xl sm:text-7xl lg:text-8xl font-bold text-foreground mb-6 tracking-tighter leading-none">
            Master anything with flashcards.
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mb-8 leading-relaxed">
            Create, study, and track your progress with our intelligent
            flashcard system.
          </p>
          <div className="flex gap-3">
            <Button
              size="lg"
              onClick={() => setAuthMode("signup")}
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setAuthMode("signin")}
            >
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 lg:px-8 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <h2 className="font-mono text-3xl sm:text-4xl font-bold text-foreground mb-4 tracking-tight">
              Everything you need
            </h2>
            <p className="text-base text-muted-foreground max-w-2xl">
              Proven learning techniques combined with modern technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 hover:border-foreground/30 transition-colors">
                <div className="flex gap-4">
                  <div className="w-10 h-10 border border-border flex items-center justify-center shrink-0">
                    <feature.icon className="h-5 w-5 text-foreground" />
                  </div>
                  <div>
                    <h3 className="font-mono text-base font-semibold text-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 px-6 lg:px-8 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="font-mono text-3xl sm:text-4xl font-bold text-foreground mb-8 tracking-tight">
                Why flashcards?
              </h2>
              <div className="space-y-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-5 h-5 border border-foreground flex items-center justify-center">
                      <Check className="h-3 w-3 text-foreground" />
                    </div>
                    <span className="text-sm text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <Card className="p-8">
              <div className="space-y-4">
                <div className="h-3 bg-muted w-3/4"></div>
                <div className="h-3 bg-muted w-1/2"></div>
                <div className="h-32 border border-border flex items-center justify-center">
                  <BookOpen className="h-12 w-12 text-muted-foreground" />
                </div>
                <div className="h-3 bg-muted w-2/3"></div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 lg:px-8 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-mono text-4xl sm:text-5xl font-bold text-foreground mb-4 tracking-tight">
            Ready to start learning?
          </h2>
          <p className="text-base text-muted-foreground mb-6">
            Join learners who are using flashcards to achieve their goals.
          </p>
          <Button
            size="lg"
            onClick={() => setAuthMode("signup")}
          >
            Get Started
            <ArrowRight className="ml-2 h-4 w-4" />
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
              <span className="font-mono text-sm">Flashcards</span>
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
