"use client";

import {
  ArrowRight,
  BookOpen,
  Brain,
  Calendar,
  Layers,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { AnimatedSection } from "@/modules/components/ui/animated-section";
import { Button } from "@/modules/components/ui/button";
import { Card } from "@/modules/components/ui/card";
import { useDashboardContext } from "./dashboard-context";

export function DashboardHeader() {
  const {
    state: { user },
  } = useDashboardContext();

  return (
    <AnimatedSection>
      <div className="space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <h1 className="font-mono text-4xl font-bold text-foreground tracking-tight">
              Welcome back, {user.name}
            </h1>
            <p className="text-muted-foreground text-sm">
              Pick up where you left off and keep momentum going.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link href="/sets?create=true" className="w-full sm:w-auto">
              <Button size="sm" className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                New set
              </Button>
            </Link>
            <Link href="/sets" className="w-full sm:w-auto">
              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                <BookOpen className="h-4 w-4 mr-2" />
                Browse sets
              </Button>
            </Link>
          </div>
        </div>
        <div className="h-px w-full bg-border" />
      </div>
    </AnimatedSection>
  );
}

export function DashboardStats() {
  const {
    state: { profileStats, studyGoal },
  } = useDashboardContext();

  const totalCardsStudied = profileStats?.totalCardsStudied ?? 0;
  const totalStudySessions = profileStats?.totalStudySessions ?? 0;

  return (
    <AnimatedSection delay={0.05}>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="gap-4 border-foreground/20 px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-foreground/20 bg-background">
              <BookOpen className="h-4 w-4 text-foreground" />
            </div>
            <div>
              <div className="text-xs font-mono uppercase tracking-wide text-muted-foreground">
                Cards studied
              </div>
              <div className="text-2xl font-mono font-semibold text-foreground">
                {totalCardsStudied}
              </div>
            </div>
          </div>
        </Card>
        <Card className="gap-4 border-foreground/20 px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-foreground/20 bg-background">
              <Brain className="h-4 w-4 text-foreground" />
            </div>
            <div>
              <div className="text-xs font-mono uppercase tracking-wide text-muted-foreground">
                Study sessions
              </div>
              <div className="text-2xl font-mono font-semibold text-foreground">
                {totalStudySessions}
              </div>
            </div>
          </div>
        </Card>
        <Card className="gap-4 border-foreground/20 px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-foreground/20 bg-background">
              <Layers className="h-4 w-4 text-foreground" />
            </div>
            <div>
              <div className="text-xs font-mono uppercase tracking-wide text-muted-foreground">
                Daily goal
              </div>
              <div className="text-2xl font-mono font-semibold text-foreground">
                {studyGoal} cards
              </div>
            </div>
          </div>
        </Card>
      </div>
    </AnimatedSection>
  );
}

export function DashboardHighlights() {
  const {
    state: { recentSet, setsLoading, formattedLastStudied },
  } = useDashboardContext();

  return (
    <AnimatedSection delay={0.1}>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-8 bg-primary border-primary">
          <div className="flex items-start justify-between mb-6">
            <div className="w-10 h-10 border border-background flex items-center justify-center">
              <Calendar className="h-5 w-5 text-background" />
            </div>
            <div className="text-right">
              <div className="font-mono text-xs text-background/60">Last studied</div>
              <div className="font-mono text-sm font-semibold text-background">
                {setsLoading ? "Loading..." : formattedLastStudied}
              </div>
            </div>
          </div>
          <div className="mb-6">
            <h3 className="font-mono text-xl font-bold mb-2 text-background">
              {recentSet ? "Continue your last set" : "Start a new session"}
            </h3>
            <p className="text-sm text-background/80">
              {recentSet
                ? `${recentSet.name} · ${recentSet.cardCount ?? 0} cards`
                : "Pick a set and jump back in when you are ready."}
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link href={recentSet ? `/study/${recentSet.id}` : "/sets"}>
              <Button
                size="sm"
                className="w-full bg-background text-foreground hover:bg-background/90 border-background"
              >
                {recentSet ? "Continue study" : "Choose a set"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            {recentSet && (
              <Link href={`/sets/${recentSet.id}`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-background text-background hover:bg-background/10"
                >
                  View set
                </Button>
              </Link>
            )}
          </div>
        </Card>

        <Card className="p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="w-10 h-10 border border-border flex items-center justify-center">
              <Brain className="h-5 w-5 text-foreground" />
            </div>
          </div>
          <div className="mb-6">
            <h3 className="font-mono text-xl font-bold text-foreground mb-2">
              Recent activity
            </h3>
            <p className="text-sm text-muted-foreground">
              Most recent sets and study status
            </p>
          </div>
          {setsLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              <Brain className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p className="text-sm">Loading your sets...</p>
            </div>
          ) : recentSet ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Most recent set</p>
                  <p className="font-mono text-sm text-foreground">{recentSet.name}</p>
                </div>
                <span className="text-xs font-mono text-muted-foreground">
                  {recentSet.cardCount ?? 0} cards
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Last studied</span>
                <span>{formattedLastStudied}</span>
              </div>
              <Link href={`/study/${recentSet.id}`}>
                <Button size="sm" variant="outline" className="w-full">
                  Resume session
                </Button>
              </Link>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Brain className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p className="text-sm">Create a set to start studying</p>
            </div>
          )}
        </Card>
      </div>
    </AnimatedSection>
  );
}

export function DashboardQuickActions() {
  return (
    <AnimatedSection delay={0.15}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 hover:border-foreground/30 transition-colors">
          <div className="mb-4">
            <div className="w-10 h-10 border border-border flex items-center justify-center mb-4">
              <Plus className="h-5 w-5 text-foreground" />
            </div>
            <h3 className="font-mono text-sm font-semibold text-foreground mb-1">
              Create new set
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              Build a focused collection fast
            </p>
          </div>
          <Link href="/sets?create=true">
            <Button variant="outline" size="sm" className="w-full">
              Get started
            </Button>
          </Link>
        </Card>

        <Card className="p-6 hover:border-foreground/30 transition-colors">
          <div className="mb-4">
            <div className="w-10 h-10 border border-border flex items-center justify-center mb-4">
              <BookOpen className="h-5 w-5 text-foreground" />
            </div>
            <h3 className="font-mono text-sm font-semibold text-foreground mb-1">
              Browse library
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              Explore and edit your sets
            </p>
          </div>
          <Link href="/sets">
            <Button variant="outline" size="sm" className="w-full">
              Browse
            </Button>
          </Link>
        </Card>

        <Card className="p-6">
          <div className="mb-4">
            <div className="w-10 h-10 border border-border flex items-center justify-center mb-4">
              <Calendar className="h-5 w-5 text-foreground" />
            </div>
            <h3 className="font-mono text-sm font-semibold text-foreground mb-1">
              Update your goal
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              Adjust your daily target anytime
            </p>
          </div>
          <Link href="/settings">
            <Button variant="outline" size="sm" className="w-full">
              Open settings
            </Button>
          </Link>
        </Card>
      </div>
    </AnimatedSection>
  );
}
