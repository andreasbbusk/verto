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
import { BookOpen, Brain, Target, Plus, TrendingUp } from "lucide-react";
import Link from "next/link";

export function DashboardView() {
  const { user } = useAuthStore();

  if (!user) {
    return null; // This shouldn't happen due to ProtectedRoute, but just in case
  }

  const stats = [
    {
      title: "Cards Studied",
      value: user.stats.totalCardsStudied,
      icon: BookOpen,
      description: "Total cards reviewed",
    },
    {
      title: "Current Streak",
      value: user.stats.currentStreak,
      icon: TrendingUp,
      description: "Days in a row",
    },
    {
      title: "Study Sessions",
      value: user.stats.totalStudySessions,
      icon: Brain,
      description: "Total sessions completed",
    },
    {
      title: "Longest Streak",
      value: user.stats.longestStreak,
      icon: Target,
      description: "Personal best",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {user.name}!
              </h1>
              <p className="text-gray-600 mt-1">
                Ready to continue your learning journey?
              </p>
            </div>
            <div className="flex space-x-3">
              <Link href="/sets/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Set
                </Button>
              </Link>
              <Link href="/sets">
                <Button variant="outline">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Browse Sets
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your latest study sessions and progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Start studying to see your activity here</p>
              </div>
            </CardContent>
          </Card>

          {/* Study Goal Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Goal</CardTitle>
              <CardDescription>
                Study {user.preferences.studyGoal} cards per day
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="text-3xl font-bold mb-2">
                  0 / {user.preferences.studyGoal}
                </div>
                <p className="text-muted-foreground mb-4">
                  Cards studied today
                </p>
                <Link href="/sets">
                  <Button className="w-full">Start Studying</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
