"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/modules/stores/authStore";
import { SignInForm } from "@/modules/components/auth/sign-in-form";
import { SignUpForm } from "@/modules/components/auth/sign-up-form";
import { Button } from "@/modules/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/modules/components/ui/card";
import {
  BookOpen,
  Brain,
  Target,
  Users,
  ArrowRight,
  Check,
} from "lucide-react";

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
  const { user, isInitialized } = useAuthStore();
  const router = useRouter();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (isInitialized && user) {
      const redirectPath = sessionStorage.getItem("redirectPath");
      if (redirectPath) {
        sessionStorage.removeItem("redirectPath");
        router.push(redirectPath);
      } else {
        router.push("/dashboard");
      }
    }
  }, [isInitialized, user, router]);

  const handleAuthSuccess = () => {
    const redirectPath = sessionStorage.getItem("redirectPath");
    if (redirectPath) {
      sessionStorage.removeItem("redirectPath");
      router.push(redirectPath);
    } else {
      router.push("/dashboard");
    }
  };

  // Show loading state while initializing
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
            <BookOpen className="h-4 w-4 text-primary-foreground animate-pulse" />
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if user is already logged in (will redirect)
  if (user) {
    return null;
  }

  if (authMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {authMode === "signin" ? (
            <SignInForm
              onSuccess={handleAuthSuccess}
              onSwitchToSignUp={() => setAuthMode("signup")}
            />
          ) : (
            <SignUpForm
              onSuccess={handleAuthSuccess}
              onSwitchToSignIn={() => setAuthMode("signin")}
            />
          )}
          <div className="mt-4 text-center">
            <Button
              variant="link"
              onClick={() => setAuthMode(null)}
              className="text-sm text-muted-foreground"
            >
              ← Back to homepage
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-soft">
      {/* Header */}
      <header className="border-b border-border/50 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-brand-purple rounded-2xl flex items-center justify-center shadow-modern">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight">Flashcards</span>
            </div>
            <div className="space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => setAuthMode("signin")}
                className="hover:bg-brand-purple/10 hover:text-brand-purple"
              >
                Sign In
              </Button>
              <Button 
                onClick={() => setAuthMode("signup")}
                className="bg-brand-purple hover:bg-brand-purple/90 shadow-modern"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-8 tracking-tight">
            Master Any Subject with
            <span className="text-brand-purple block mt-3">Smart Flashcards</span>
          </h1>
          <p className="text-xl sm:text-2xl text-muted-foreground max-w-4xl mx-auto mb-12 leading-relaxed">
            Create, study, and track your progress with our intelligent
            flashcard system. Perfect for students, professionals, and lifelong
            learners.
          </p>
          <div className="space-y-4 sm:space-y-0 sm:space-x-6 sm:flex sm:justify-center">
            <Button
              size="lg"
              onClick={() => setAuthMode("signup")}
              className="w-full sm:w-auto bg-brand-purple hover:bg-brand-purple/90 shadow-modern-lg text-lg px-8 py-4 h-auto"
            >
              Start Learning Free
              <ArrowRight className="ml-3 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setAuthMode("signin")}
              className="w-full sm:w-auto shadow-modern text-lg px-8 py-4 h-auto hover:bg-brand-purple/5 hover:text-brand-purple hover:border-brand-purple"
            >
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6 tracking-tight">
              Everything You Need to Learn Effectively
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Our platform combines proven learning techniques with modern
              technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const colors = ['bg-brand-purple', 'bg-brand-yellow', 'bg-brand-teal', 'bg-brand-gray'];
              const lightColors = ['bg-brand-purple-light', 'bg-brand-yellow-light', 'bg-brand-teal-light', 'bg-brand-gray-light'];
              return (
                <Card key={index} className={`text-center ${lightColors[index]} border-0 shadow-modern transition-all duration-300 hover:shadow-modern-lg hover:-translate-y-1`}>
                  <CardContent className="p-8">
                    <div className={`w-16 h-16 ${colors[index]} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-modern`}>
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-foreground mb-4">{feature.title}</CardTitle>
                    <CardDescription className="text-muted-foreground leading-relaxed">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Why Choose Our Flashcard Platform?
              </h2>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-lg text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Button size="lg" onClick={() => setAuthMode("signup")}>
                  Get Started Today
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-lg shadow-2xl p-8">
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-32 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="h-12 w-12 text-primary" />
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Supercharge Your Learning?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of learners who are already using our platform to
            achieve their goals.
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => setAuthMode("signup")}
          >
            Start Your Free Account
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Flashcards</span>
          </div>
          <p className="text-gray-400">
            © 2024 Flashcards. All rights reserved. Built with ❤️ for learners
            everywhere.
          </p>
        </div>
      </footer>
    </div>
  );
}
