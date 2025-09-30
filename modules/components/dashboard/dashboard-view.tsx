"use client";

import { useAuthStore } from "@/modules/stores/authStore";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/modules/components/ui/card";
import { Button } from "@/modules/components/ui/button";
import { BookOpen, Brain, Target, Plus, TrendingUp, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export function DashboardView() {
  const { user } = useAuthStore();

  if (!user) {
    return null;
  }

  const stats = [
    {
      title: "Cards Studied",
      value: user.stats.totalCardsStudied,
      icon: BookOpen,
      description: "Total cards reviewed",
      color: "bg-brand-purple",
      bgColor: "bg-brand-purple-light"
    },
    {
      title: "Current Streak",
      value: user.stats.currentStreak,
      icon: TrendingUp,
      description: "Days in a row",
      color: "bg-brand-yellow",
      bgColor: "bg-brand-yellow-light"
    },
    {
      title: "Study Sessions",
      value: user.stats.totalStudySessions,
      icon: Brain,
      description: "Total sessions completed",
      color: "bg-brand-gray",
      bgColor: "bg-brand-gray-light"
    },
    {
      title: "Longest Streak",
      value: user.stats.longestStreak,
      icon: Target,
      description: "Personal best",
      color: "bg-brand-teal",
      bgColor: "bg-brand-teal-light"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-soft">
      {/* Header */}
      <div className="border-b border-border/50 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center py-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground tracking-tight">
                Welcome back, {user.name}!
              </h1>
              <p className="text-muted-foreground mt-2 text-lg">
                Ready to continue your learning journey?
              </p>
            </div>
            <div className="flex space-x-4">
              <Link href="/sets">
                <Button size="lg" className="shadow-modern">
                  <Plus className="h-5 w-5 mr-2" />
                  Create Set
                </Button>
              </Link>
              <Link href="/sets">
                <Button variant="outline" size="lg" className="shadow-modern">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Browse Sets
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {stats.map((stat, index) => (
            <Card key={index} className={`${stat.bgColor} border-0 shadow-modern transition-all duration-300 hover:shadow-modern-lg hover:-translate-y-1`}>
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className={`p-3 rounded-2xl ${stat.color}`}>
                    <stat.icon className="h-7 w-7 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-foreground">
                      {stat.value}
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    {stat.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {stat.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Action Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Start Studying Card */}
          <Card className="bg-brand-purple border-0 text-white shadow-modern-lg overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-purple to-purple-700 opacity-90" />
            <CardContent className="relative p-10">
              <div className="flex items-start justify-between mb-8">
                <div className="bg-white/20 p-4 rounded-2xl">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <div className="text-white/80 text-right">
                  <div className="text-sm font-medium">Daily Goal</div>
                  <div className="text-2xl font-bold">0 / {user.preferences.studyGoal}</div>
                </div>
              </div>
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2">Start Studying</h3>
                <p className="text-white/90">
                  Continue your learning journey and build lasting knowledge
                </p>
              </div>
              <Link href="/sets" className="block">
                <Button size="lg" variant="secondary" className="w-full group">
                  Start Learning
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Recent Activity Card */}
          <Card className="bg-brand-gray-light border-0 shadow-modern-lg">
            <CardContent className="p-10">
              <div className="flex items-start justify-between mb-8">
                <div className="bg-brand-gray p-4 rounded-2xl">
                  <Brain className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-foreground mb-2">Recent Activity</h3>
                <p className="text-muted-foreground">
                  Your latest study sessions and progress
                </p>
              </div>
              <div className="text-center py-8 text-muted-foreground">
                <Brain className="h-16 w-16 mx-auto mb-4 opacity-30" />
                <p className="text-lg">Start studying to see your activity here</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-brand-yellow-light border-0 shadow-modern transition-all duration-300 hover:shadow-modern-lg hover:-translate-y-1">
            <CardContent className="p-8 text-center">
              <div className="bg-brand-yellow p-4 rounded-2xl mx-auto mb-6 w-fit">
                <Plus className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Create New Set</h3>
              <p className="text-muted-foreground mb-6">Build your own flashcard collection</p>
              <Link href="/sets">
                <Button variant="outline" className="w-full">
                  Get Started
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-brand-teal-light border-0 shadow-modern transition-all duration-300 hover:shadow-modern-lg hover:-translate-y-1">
            <CardContent className="p-8 text-center">
              <div className="bg-brand-teal p-4 rounded-2xl mx-auto mb-6 w-fit">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Browse Library</h3>
              <p className="text-muted-foreground mb-6">Explore your flashcard sets</p>
              <Link href="/sets">
                <Button variant="outline" className="w-full">
                  Browse Sets
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-modern transition-all duration-300 hover:shadow-modern-lg hover:-translate-y-1">
            <CardContent className="p-8 text-center">
              <div className="bg-primary p-4 rounded-2xl mx-auto mb-6 w-fit">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Track Progress</h3>
              <p className="text-muted-foreground mb-6">Monitor your learning statistics</p>
              <Button variant="outline" className="w-full" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
