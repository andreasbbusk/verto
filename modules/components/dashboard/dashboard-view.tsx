"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { DashboardProvider, type DashboardState } from "./dashboard-context";
import {
  DashboardHeader,
  DashboardHighlights,
  DashboardQuickActions,
  DashboardStats,
} from "./dashboard-sections";
import { useSets } from "@/modules/data/client/hooks/queries/useSets.client";
import { profileQuery } from "@/modules/data/shared/profileQueryOptions";
import type { FlashcardSet } from "@/modules/types/types";

const Dashboard = {
  Provider: DashboardProvider,
  Header: DashboardHeader,
  Stats: DashboardStats,
  Highlights: DashboardHighlights,
  QuickActions: DashboardQuickActions,
};

export function DashboardView() {
  const { data: user } = useQuery(profileQuery());
  const { sets, isLoading: setsLoading } = useSets();

  const profileStats = user?.stats;
  const studyGoal = user?.studyGoal ?? 20;

  const recentSet = useMemo(() => {
    if (sets.length === 0) return null;

    const sorted = [...sets].sort((a, b) => {
      const dateA =
        a.stats?.lastStudiedAt || a.updatedAt || a.createdAt || "1970-01-01";
      const dateB =
        b.stats?.lastStudiedAt || b.updatedAt || b.createdAt || "1970-01-01";
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });

    return sorted[0] ?? null;
  }, [sets]);

  const formattedLastStudied = formatLastStudied(recentSet);

  if (!user) {
    return null;
  }

  const dashboardState: DashboardState = {
    user,
    profileStats,
    studyGoal,
    sets,
    setsLoading,
    recentSet,
    formattedLastStudied,
  };

  return (
    <Dashboard.Provider state={dashboardState}>
      <div className="space-y-8">
        <Dashboard.Header />
        <Dashboard.Stats />
        <Dashboard.Highlights />
        <Dashboard.QuickActions />
      </div>
    </Dashboard.Provider>
  );
}

function formatLastStudied(recentSet: FlashcardSet | null) {
  if (!recentSet?.stats?.lastStudiedAt) return "Not yet";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(recentSet.stats.lastStudiedAt));
}
