"use client";

import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  BookOpen,
  Brain,
  Plus,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/modules/components/ui/button";
import { Card } from "@/modules/components/ui/card";
import { profileQuery } from "@/modules/data/shared/profileQueryOptions";

export function DashboardView() {
  const { data: user } = useQuery(profileQuery());

  if (!user) {
    return null;
  }

  const stats = [
    {
      title: "Cards Studied",
      value: user.totalCardsStudied,
      icon: BookOpen,
      description: "Total cards reviewed",
      color: "bg-brand",
      bgColor: "bg-brand-light",
    },
    {
      title: "Current Streak",
      value: user.currentStreak,
      icon: TrendingUp,
      description: "Days in a row",
      color: "bg-brand-yellow",
      bgColor: "bg-brand-yellow-light",
    },
    {
      title: "Study Sessions",
      value: user.totalStudySessions,
      icon: Brain,
      description: "Total sessions completed",
      color: "bg-brand-gray",
      bgColor: "bg-brand-gray-light",
    },
    {
      title: "Longest Streak",
      value: user.longestStreak,
      icon: Target,
      description: "Personal best",
      color: "bg-brand-teal",
      bgColor: "bg-brand-teal-light",
    },
  ];

  const studyGoal = user.studyGoal ?? 20;

  return (
    <div className="min-h-screen">
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="font-mono text-2xl font-bold text-foreground tracking-tight">
                Welcome back, {user.name}
              </h1>
              <p className="text-muted-foreground mt-1 text-sm">
                Continue your learning
              </p>
            </div>
            <div className="flex gap-2">
              <Link href="/sets">
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  New Set
                </Button>
              </Link>
              <Link href="/sets">
                <Button variant="outline" size="sm">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Browse
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-8 h-8 border border-border flex items-center justify-center">
                  <stat.icon className="h-4 w-4 text-foreground" />
                </div>
                <div className="text-right">
                  <div className="font-mono text-2xl font-bold text-foreground">
                    {stat.value}
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-mono text-xs text-muted-foreground mb-1">
                  {stat.title}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="p-8 bg-primary border-primary">
            <div className="flex items-start justify-between mb-6">
              <div className="w-10 h-10 border border-background flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-background" />
              </div>
              <div className="text-right">
                <div className="font-mono text-xs text-background/60">
                  Daily Goal
                </div>
                <div className="font-mono text-lg font-bold text-background">
                  0 / {studyGoal}
                </div>
              </div>
            </div>
            <div className="mb-6">
              <h3 className="font-mono text-xl font-bold mb-2 text-background">
                Start Studying
              </h3>
              <p className="text-sm text-background/80">
                Continue your learning journey
              </p>
            </div>
            <Link href="/sets" className="block">
              <Button
                size="sm"
                className="w-full bg-background text-foreground hover:bg-background/90 border-background"
              >
                Start Learning
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </Card>

          <Card className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="w-10 h-10 border border-border flex items-center justify-center">
                <Brain className="h-5 w-5 text-foreground" />
              </div>
            </div>
            <div className="mb-6">
              <h3 className="font-mono text-xl font-bold text-foreground mb-2">
                Recent Activity
              </h3>
              <p className="text-sm text-muted-foreground">
                Your latest study sessions
              </p>
            </div>
            <div className="text-center py-8 text-muted-foreground">
              <Brain className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p className="text-sm">Start studying to see activity</p>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 hover:border-foreground/30 transition-colors">
            <div className="mb-4">
              <div className="w-10 h-10 border border-border flex items-center justify-center mb-4">
                <Plus className="h-5 w-5 text-foreground" />
              </div>
              <h3 className="font-mono text-sm font-semibold text-foreground mb-1">
                Create New Set
              </h3>
              <p className="text-xs text-muted-foreground mb-4">
                Build your flashcard collection
              </p>
            </div>
            <Link href="/sets">
              <Button variant="outline" size="sm" className="w-full">
                Get Started
              </Button>
            </Link>
          </Card>

          <Card className="p-6 hover:border-foreground/30 transition-colors">
            <div className="mb-4">
              <div className="w-10 h-10 border border-border flex items-center justify-center mb-4">
                <BookOpen className="h-5 w-5 text-foreground" />
              </div>
              <h3 className="font-mono text-sm font-semibold text-foreground mb-1">
                Browse Library
              </h3>
              <p className="text-xs text-muted-foreground mb-4">
                Explore your sets
              </p>
            </div>
            <Link href="/sets">
              <Button variant="outline" size="sm" className="w-full">
                Browse
              </Button>
            </Link>
          </Card>

          <Card className="p-6 opacity-60">
            <div className="mb-4">
              <div className="w-10 h-10 border border-border flex items-center justify-center mb-4">
                <Target className="h-5 w-5 text-foreground" />
              </div>
              <h3 className="font-mono text-sm font-semibold text-foreground mb-1">
                Track Progress
              </h3>
              <p className="text-xs text-muted-foreground mb-4">
                Monitor your statistics
              </p>
            </div>
            <Button variant="outline" size="sm" className="w-full" disabled>
              Coming Soon
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
